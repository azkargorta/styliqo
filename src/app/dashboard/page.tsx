import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { garments, outfits, plannerEntries, profile, wishlistItems } from "@/lib/mock-data";

export default function DashboardPage() {
  const remainingCredits = profile.monthlyAiCredits - profile.usedAiCredits;

  return (
    <AppShell
      title="Dashboard"
      description="Resumen operativo de tu armario, actividad de outfits, planificación semanal y capacidad premium."
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Prendas", value: garments.length.toString() },
              { label: "Outfits", value: outfits.length.toString() },
              { label: "Eventos planificados", value: plannerEntries.length.toString() },
              { label: "Creditos IA", value: `${remainingCredits} restantes` },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-stone-200 bg-white p-5">
                <p className="text-sm text-stone-500">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-stone-900">{item.value}</p>
              </div>
            ))}
          </section>

          <SectionCard
            eyebrow="Siguiente semana"
            title="Planificación inmediata"
            description="Tus próximos looks reservados y las acciones más habituales para mantener el armario vivo."
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="space-y-3">
                {plannerEntries.map((entry) => (
                  <div key={entry.id} className="rounded-3xl bg-stone-100 p-4">
                    <p className="text-sm font-medium text-stone-900">{entry.title}</p>
                    <p className="mt-1 text-sm text-stone-600">
                      {entry.date} · {entry.weather}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {[
                  { href: "/wardrobe", label: "Añadir prenda" },
                  { href: "/outfits", label: "Crear outfit" },
                  { href: "/planner", label: "Planificar semana" },
                  { href: "/premium", label: "Generar con IA" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center justify-center rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6">
          <SectionCard
            eyebrow="Guardado"
            title="Wishlist activa"
            description="Prioriza futuras compras para detectar huecos en tu armario."
          >
            <div className="space-y-3">
              {wishlistItems.map((item) => (
                <div key={item.id} className="rounded-3xl bg-stone-100 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-stone-900">{item.name}</p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-600">
                      {item.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-stone-600">
                    {item.store} · objetivo {item.targetPrice} EUR
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Premium"
            title="Estado de la suscripción"
            description="La lógica premium ya está separada para poder conectar Stripe y límites de uso reales."
          >
            <div className="rounded-3xl bg-stone-900 p-5 text-white">
              <p className="text-sm text-stone-300">Plan actual</p>
              <p className="mt-2 text-2xl font-semibold capitalize">{profile.tier}</p>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                Puedes usar recomendaciones IA, histórico de generación y futuras funciones
                avanzadas sin cambiar la estructura principal de la app.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
