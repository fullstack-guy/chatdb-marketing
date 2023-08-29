import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getAuth } from "@clerk/nextjs/server";
import { inferAsyncReturnType } from "@trpc/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export async function createContext(opts: CreateNextContextOptions) {
  const auth = getAuth(opts.req);
  const clerkToken = await auth.getToken({ template: "supabase" });
  console.log("clerk token", clerkToken);

  const userSupabase = createClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${clerkToken}`,
        },
      },
    }
  );

  const systemSupabase = createClient(supabaseUrl, supabaseAnonKey);
  return {
    user: auth,
    userSupabase,
    systemSupabase,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
