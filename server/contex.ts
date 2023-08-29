import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getAuth } from "@clerk/nextjs/server";
import { inferAsyncReturnType } from "@trpc/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function createContext(opts: CreateNextContextOptions) {
  const auth = getAuth(opts.req);
  const token = await auth.getToken({ template: "supabase" });

  const supabase = createClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
  return {
    token,
    req: opts.req,
    supabase,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
