/**
 * Supabase Server Client
 *
 * Creates a Supabase client for server-side usage (API routes, server components).
 * Uses the SERVICE ROLE key which bypasses Row Level Security.
 *
 * SECURITY:
 * - This file must NEVER be imported from client components.
 * - The service role key has full database access — treat it like a database password.
 * - A new client is created per call to avoid cross-request state leaks.
 *
 * Usage:
 *   import { getSupabaseServerClient } from "@/lib/supabase/server";
 *   const supabase = getSupabaseServerClient();
 *   const { data, error } = await supabase.from("visitors").select("*");
 */

import { createClient } from "@supabase/supabase-js";

/**
 * Creates a new Supabase client with service role privileges.
 * Each call creates a fresh instance — do NOT cache across requests.
 *
 * @returns {import("@supabase/supabase-js").SupabaseClient}
 * @throws {Error} If required environment variables are missing
 */
export function getSupabaseServerClient() {
  // Guard against accidental browser-side usage
  if (typeof window !== "undefined") {
    throw new Error(
      "getSupabaseServerClient() must only be called on the server. " +
        "Use getSupabaseBrowserClient() from lib/supabase/client.js for browser usage."
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL"
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "Missing environment variable: SUPABASE_SERVICE_ROLE_KEY. " +
        "Get it from Supabase Dashboard → Settings → API → service_role key."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      // No auth flow — Aeethod uses its own session system
      persistSession: false,
      autoRefreshToken: false,
    },
    // Tag requests for Supabase logs
    global: {
      headers: {
        "x-application-name": "aeethod-studio",
      },
    },
  });
}
