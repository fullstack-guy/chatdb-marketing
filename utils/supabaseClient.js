import { createClient } from "@supabase/supabase-js";

export const supabaseClient = (supabaseAccessToken = null) => {
  const headers = supabaseAccessToken
    ? { Authorization: `Bearer ${supabaseAccessToken}` }
    : {};

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers } }
  );

  return supabase;
};
