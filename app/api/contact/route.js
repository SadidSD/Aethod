import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod/v4";

// ─── Configuration ──────────────────────────────────────────────────────────
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SADID_EMAIL = process.env.SADID_EMAIL || "sadidbinhasan3@gmail.com";
const MAIL_FROM = process.env.MAIL_FROM || "Aeethod <contact@aeethod.com>";

// ─── Input Validation Schema (Zod) ─────────────────────────────────────────
const contactSchema = z.object({
  email: z.email().max(254),
  message: z.string().trim().min(1, "Please enter a message before sending.").max(5000, "Message is too long (max 5000 characters)."),
  _honey: z.string().optional(), // honeypot field — must be empty
});

// ─── Rate Limiter (in-memory, per IP) ───────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 5; // max submissions per window
const rateLimitMap = new Map(); // Map<ip, { count, resetAt }>

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

// Clean up stale entries periodically (prevent memory leak)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

// ─── Duplicate Prevention ───────────────────────────────────────────────────
const DUPLICATE_WINDOW_MS = 60 * 1000; // 60 seconds
const recentSubmissions = new Map(); // Map<hash, timestamp>

function isDuplicate(email, message) {
  const hash = `${email.toLowerCase()}::${message}`;
  const now = Date.now();
  const lastSubmit = recentSubmissions.get(hash);

  if (lastSubmit && now - lastSubmit < DUPLICATE_WINDOW_MS) {
    return true;
  }

  recentSubmissions.set(hash, now);
  return false;
}

// Clean up stale duplicate entries
setInterval(() => {
  const now = Date.now();
  for (const [hash, ts] of recentSubmissions) {
    if (now - ts > DUPLICATE_WINDOW_MS) recentSubmissions.delete(hash);
  }
}, 60 * 1000);

// ─── Email HTML Template ────────────────────────────────────────────────────
function buildEmailHtml(email, message, timestamp) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background:#2563eb;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;letter-spacing:0.5px;">Aeethod — Quick Mail</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:20px;">
                    <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">From</p>
                    <p style="margin:0;font-size:15px;color:#111827;"><a href="mailto:${email}" style="color:#2563eb;text-decoration:none;">${email}</a></p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:20px;border-top:1px solid #f3f4f6;padding-top:20px;">
                    <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
                    <p style="margin:0;font-size:15px;color:#111827;line-height:1.6;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #f3f4f6;padding-top:20px;">
                    <p style="margin:0 0 4px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Received</p>
                    <p style="margin:0;font-size:13px;color:#6b7280;">${timestamp}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">Sent from <a href="https://aeethod.com" style="color:#2563eb;text-decoration:none;">aeethod.com</a> Quick Mail</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── API Route Handler ──────────────────────────────────────────────────────
export async function POST(request) {
  try {
    // Check API key is configured
    if (!RESEND_API_KEY) {
      console.error("Contact API: RESEND_API_KEY is not configured");
      return NextResponse.json(
        { success: false, error: "Email service is not configured. Please contact us directly." },
        { status: 503 }
      );
    }

    // Rate limit by IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many messages. Please try again later." },
        { status: 429 }
      );
    }

    // Parse and validate input
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      const errorMessage =
        firstError.path.includes("email")
          ? "Please provide a valid email address."
          : firstError.message;

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    const { email, message, _honey } = result.data;

    // Honeypot check — bots fill hidden fields, humans don't
    if (_honey) {
      // Silently return success to not alert the bot
      return NextResponse.json(
        { success: true, message: "Your message has been sent successfully!" },
        { status: 200 }
      );
    }

    // Duplicate prevention
    if (isDuplicate(email, message)) {
      return NextResponse.json(
        { success: false, error: "This message was already sent. Please wait before sending again." },
        { status: 409 }
      );
    }

    // Build timestamp
    const timestamp = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
      timeZone: "Asia/Dhaka",
    });

    // Send email via Resend
    const resend = new Resend(RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: MAIL_FROM,
      to: [SADID_EMAIL],
      reply_to: email.trim(),
      subject: "New Aeethod Contact — Quick Mail",
      html: buildEmailHtml(email.trim(), message, timestamp),
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to send message. Please try again or contact directly." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Your message has been sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again or contact directly." },
      { status: 500 }
    );
  }
}
