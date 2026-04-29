import Link from "next/link";
import { Sparkles, CalendarDays, Heart, Layers3, Shirt, CreditCard } from "lucide-react";
import { profile } from "@/lib/mock-data";
import clsx from "clsx";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: Layers3 },
  { href: "/wardrobe", label: "Armario", icon: Shirt },
  { href: "/outfits", label: "Outfits", icon: Sparkles },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/premium", label: "Premium", icon: CreditCard },
];

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
    <div className="min-h-screen bg-stone-100">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/50">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-sm font-semibold text-white">
              SQ
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-900">Styliqo</p>
              <p className="text-sm text-stone-500">Armario virtual personal</p>
            </div>
          </Link>

          <div className="mt-8 rounded-3xl bg-stone-900 p-4 text-white">
            <p className="text-sm text-stone-300">Cuenta activa</p>
            <p className="mt-1 text-lg font-semibold">{profile.fullName}</p>
            <p className="mt-3 text-sm text-stone-300">
              Plan {profile.tier === "premium" ? "Premium" : "Free"} ·{" "}
              {profile.monthlyAiCredits - profile.usedAiCredits} creditos IA restantes
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-950",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="rounded-[2rem] border border-stone-200 bg-stone-50 p-6 shadow-sm shadow-stone-200/50 lg:p-8">
          <header className="mb-8 flex flex-col gap-4 border-b border-stone-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-stone-500">
                Styliqo workspace
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                {description}
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600">
              Siguiente objetivo: completar onboarding, conectar Supabase y activar pagos.
            </div>
          </header>
          {children}
          <footer className="mt-10 flex flex-col gap-3 border-t border-stone-200 pt-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <p>Base de producto preparada para conectar datos, pagos y automatizaciones.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/onboarding">Onboarding</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/legal/privacy">Privacidad</Link>
              <Link href="/legal/terms">Términos</Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
