/**
 * Supabase Browser Client
 *
 * Creates a singleton Supabase client for browser-side usage.
 * Uses ONLY the publishable (anon) key — safe to expose to the browser.
 *
 * NOTE: This client respects RLS policies. All analytics tables have
 * RLS enabled with NO anon access, so this client cannot read or write
 * analytics data directly. Analytics ingestion and reads go through
 * Next.js API routes using the server client (service role key).
 */

import { createClient } from "@supabase/supabase-js";

let supabaseClient = null;

/**
 * Returns a singleton Supabase client for browser-side usage.
 * @returns {import("@supabase/supabase-js").SupabaseClient}
 */
export function getSupabaseBrowserClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables: " +
        "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set."
    );
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      // No auth flow needed — Aeethod uses its own session system
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return supabaseClient;
}
