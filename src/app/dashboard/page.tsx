import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { garments, outfits, plannerEntries, profile, wishlistItems } from "@/lib/mock-data";
import {
  ArrowRight,
  CalendarDays,
  Heart,
  Shirt,
  Sparkles,
  Wand2,
} from "lucide-react";

export default function DashboardPage() {
  const remainingCredits = profile.monthlyAiCredits - profile.usedAiCredits;
  const creditPct = Math.max(
    0,
    Math.min(100, Math.round((remainingCredits / profile.monthlyAiCredits) * 100)),
  );

  return (
    <AppShell
      title="Resumen"
      description="Un vistazo rápido a tu armario, tu planificador y el asistente personal."
    >
      <div className="grid gap-6">
        <section className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-[1.75rem] border border-border bg-stone-950 p-7 text-white shadow-xl shadow-stone-300/50">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-300">
              Hoy en Styliqo
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Planifica tu semana y crea conjuntos con tu asistente personal.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300">
              Mantén tu armario al día, asigna conjuntos al calendario y usa el asistente
              cuando quieras acelerar decisiones.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/premium"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand800"
              >
                Abrir asistente personal
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/planner"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Ir al planificador
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-sm shadow-stone-200/40">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
              Créditos del asistente
            </p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-semibold text-stone-950">
                  {remainingCredits}
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  de {profile.monthlyAiCredits} este mes
                </p>
              </div>
              <div className="rounded-2xl bg-stone-100 px-4 py-3 text-sm text-stone-700">
                Plan <span className="font-semibold capitalize">{profile.tier}</span>
              </div>
            </div>
            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${creditPct}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-stone-500">
              Consejo: guarda los conjuntos que te gusten para reutilizarlos en el planificador.
            </p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Armario",
              value: garments.length.toString(),
              helper: "prendas",
              href: "/wardrobe",
              icon: Shirt,
            },
            {
              label: "Conjuntos",
              value: outfits.length.toString(),
              helper: "guardados",
              href: "/outfits",
              icon: Sparkles,
            },
            {
              label: "Planificador",
              value: plannerEntries.length.toString(),
              helper: "eventos",
              href: "/planner",
              icon: CalendarDays,
            },
            {
              label: "Lista de deseos",
              value: wishlistItems.length.toString(),
              helper: "items",
              href: "/wishlist",
              icon: Heart,
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                href={card.href}
                className="group rounded-[1.75rem] border border-border bg-surface p-6 shadow-sm shadow-stone-200/40 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                      {card.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-stone-950">
                      {card.value}
                    </p>
                    <p className="mt-1 text-sm text-stone-600">{card.helper}</p>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand/10 ring-1 ring-brand/15 transition group-hover:bg-brand/15">
                    <Icon className="h-5 w-5 text-brand" />
                  </div>
                </div>
                <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-900">
                  Abrir
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </p>
              </Link>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <SectionCard
            eyebrow="Planificador"
            title="Próximos días"
            description="Asigna conjuntos a fechas concretas para no repetir decisiones."
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="space-y-3">
                {plannerEntries.length ? (
                  plannerEntries.slice(0, 6).map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-3xl border border-border bg-surfaceMuted p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-stone-950">
                          {entry.title}
                        </p>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600">
                          {entry.date}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-stone-600">{entry.weather}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-border bg-surfaceMuted p-6 text-sm text-stone-600">
                    Aún no tienes eventos. Ve al planificador y añade tu primer día con un conjunto.
                  </div>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Link
                  href="/planner"
                  className="inline-flex items-center justify-center rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Planificar ahora
                </Link>
                <Link
                  href="/premium"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-surfaceMuted"
                >
                  <Wand2 className="h-4 w-4 text-brand" />
                  Generar conjunto
                </Link>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Lista de deseos"
            title="En foco"
            description="Ideas para futuras compras y huecos del armario."
          >
            <div className="space-y-3">
              {wishlistItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-border bg-surfaceMuted p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-stone-950">{item.name}</p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-600">
                      {item.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-stone-600">
                    {item.store} · objetivo {item.targetPrice} EUR
                  </p>
                </div>
              ))}
              <Link
                href="/wishlist"
                className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900"
              >
                Ver lista completa <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </SectionCard>
        </section>
      </div>
    </AppShell>
  );
}
