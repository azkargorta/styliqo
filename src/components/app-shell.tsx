import Link from "next/link";
import { SidebarNav } from "@/components/sidebar-nav";

export function AppShell({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description: string;
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background styliqo-bg">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <div className="lg:sticky lg:top-5 lg:self-start">
          <SidebarNav />
        </div>

        <main className="rounded-[1.75rem] border border-border bg-surfaceMuted p-6 shadow-sm shadow-stone-200/40 lg:p-8">
          <header className="mb-8 flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                Espacio
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                {description}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-stone-600">
              Prioridad: completar armario y generar conjuntos con tu asistente personal.
            </div>
          </header>
          {children}
          <footer className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <p>Styliqo · armario virtual personal</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/onboarding">Primeros pasos</Link>
              <Link href="/pricing">Precios</Link>
              <Link href="/legal/privacy">Privacidad</Link>
              <Link href="/legal/terms">Términos</Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
