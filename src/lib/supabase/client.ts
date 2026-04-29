import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { env, hasSupabaseEnv } from "@/lib/env";

export function getSupabaseBrowserClient() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  return createBrowserClient(env.supabaseUrl!, env.supabaseAnonKey!);
}

export function getSupabaseServerClient() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  return createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    auth: {
      persistSession: false,
    },
  });
}
