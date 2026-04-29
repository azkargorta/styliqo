import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env, hasSupabaseEnv } from "@/lib/env";

export function getSupabaseServerClient() {
  if (!hasSupabaseEnv()) return null;

  const cookieStorePromise = cookies();

  return createServerClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    cookies: {
      async getAll() {
        const cookieStore = await cookieStorePromise;
        return cookieStore.getAll();
      },
    },
  });
}

