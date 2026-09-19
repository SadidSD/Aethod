import { NextResponse } from "next/server";

const RECIPIENT_EMAIL = "sadidbinhasan3@gmail.com";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, message } = body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(String(email).trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Validate message content
    const trimmedMessage = typeof message === "string" ? message.trim() : "";
    if (!trimmedMessage) {
      return NextResponse.json(
        { success: false, error: "Please enter a message before sending." },
        { status: 400 }
      );
    }

    // Determine request origin for FormSubmit compatibility
    const origin =
      request.headers.get("origin") ||
      request.headers.get("referer") ||
      "https://aeethod.com";

    // Forward to FormSubmit service
    const formSubmitUrl = `https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`;
    const response = await fetch(formSubmitUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: origin,
        Referer: origin,
      },
      body: JSON.stringify({
        email: email.trim(),
        message: trimmedMessage,
        _subject: `New Quick Mail from Aeethod (${email.trim()})`,
        _replyto: email.trim(),
        _template: "table",
        _captcha: "false",
      }),
    });

    const data = await response.json().catch(() => ({}));

    // FormSubmit returns success: "true" when successfully processed
    if (response.ok && (data.success === "true" || data.success === true)) {
      return NextResponse.json(
        { success: true, message: "Your message has been sent successfully!" },
        { status: 200 }
      );
    }

    // On initial activation phase, FormSubmit responds with activation guidance
    if (data.message && data.message.toLowerCase().includes("activation")) {
      return NextResponse.json(
        {
          success: true,
          activationPending: true,
          message:
            "Your message was sent! (Form activation is pending on first setup).",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: response.ok,
        message: data.message || "Message sent successfully!",
      },
      { status: response.ok ? 200 : 400 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message. Please try again or contact directly.",
      },
      { status: 500 }
    );
  }
}
