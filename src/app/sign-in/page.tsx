"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SectionCard } from "@/components/section-card";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type Mode = "signin" | "signup";

export default function SignInPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit() {
    if (!supabase) {
      setMessage(
        "Supabase no está configurado en el navegador. Revisa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en `.env.local` y reinicia `npm run dev`.",
      );
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        // Si tu proyecto requiere confirmación de email, el usuario no iniciará sesión automáticamente.
        setMessage(
          "Cuenta creada. Si tu proyecto requiere confirmación por email, revisa tu bandeja de entrada antes de entrar.",
        );
      }

      const { data: userCheck } = await supabase.auth.getUser();

      // Si el usuario no está logueado (p.ej. necesita confirmación), paramos aquí.
      if (!userCheck.user) {
        return;
      }

      // Bootstrap de perfil (crea fila en `profiles` si no existe).
      const bootstrapRes = await fetch("/api/profiles/bootstrap", { method: "POST" });
      const bootstrapJson = await bootstrapRes.json().catch(() => ({}));

      if (!bootstrapRes.ok) {
        throw new Error(bootstrapJson?.error || "No se pudo crear perfil.");
      }

      router.push("/wardrobe");
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-12">
      <div className="w-full max-w-md">
        <SectionCard
          eyebrow="Acceso"
          title="Entra en Styliqo"
          description="Usa tu cuenta de Supabase para que el armario y el asistente personal trabajen con tus datos reales."
        >
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={[
                "flex-1 rounded-2xl px-4 py-2 text-sm font-semibold transition",
                mode === "signin"
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-900 border border-stone-200",
              ].join(" ")}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={[
                "flex-1 rounded-2xl px-4 py-2 text-sm font-semibold transition",
                mode === "signup"
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-900 border border-stone-200",
              ].join(" ")}
            >
              Crear cuenta
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="tu@email.com"
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-400"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-stone-700">Contraseña</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-400"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => void onSubmit()}
            disabled={loading || email.trim().length === 0 || password.length === 0}
            className="mt-4 w-full rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Un momento..." : mode === "signin" ? "Entrar" : "Crear cuenta"}
          </button>

          {message ? (
            <p className="mt-4 rounded-3xl border border-stone-200 bg-white p-4 text-sm text-stone-700">
              {message}
            </p>
          ) : null}

          <p className="mt-5 text-sm text-stone-600">
            ¿Quieres volver?{" "}
            <Link href="/" className="font-semibold text-stone-900">
              Portada
            </Link>
          </p>
        </SectionCard>
      </div>
    </main>
  );
}
