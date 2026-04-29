import Link from "next/link";
import { SectionCard } from "@/components/section-card";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-12">
      <div className="w-full max-w-md">
        <SectionCard
          eyebrow="Acceso"
          title="Entra en Styliqo"
          description="Pantalla inicial lista para conectarse a Supabase Auth con email/password y proveedores sociales en la siguiente iteración."
        >
          <form className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Email</span>
              <input
                type="email"
                placeholder="tu@email.com"
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-stone-700">Contraseña</span>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-400"
              />
            </label>
            <button
              type="button"
              className="w-full rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Continuar
            </button>
          </form>
          <p className="mt-5 text-sm text-stone-600">
            ¿Aún no tienes cuenta?{" "}
            <Link href="/" className="font-semibold text-stone-900">
              Volver a la portada
            </Link>
          </p>
        </SectionCard>
      </div>
    </main>
  );
}
