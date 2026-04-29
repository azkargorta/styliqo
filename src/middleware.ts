import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env, hasSupabaseEnv } from "@/lib/env";

export async function middleware(request: NextRequest) {
  // Si Supabase no está configurado, no intentamos auth.
  if (!hasSupabaseEnv()) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        // Actualizamos cookies en la respuesta
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        // Aplicamos headers anti-cache recomendados por Supabase SSR
        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      },
    },
  });

  // Muy importante: fuerza refresh/validación temprana para que la sesión se escriba en cookies.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Ejecutar en todas las rutas excepto static assets
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

