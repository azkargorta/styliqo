import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseBrowserClient() {
  // En cliente, Next solo expone variables con prefijo NEXT_PUBLIC_.
  // Leerlas directamente aquí evita problemas de inlining/treeshake.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anon) return null;
  return createBrowserClient(url, anon);
}

