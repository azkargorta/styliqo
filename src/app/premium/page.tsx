import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { profile } from "@/lib/mock-data";
import { getPremiumRecommendations } from "@/lib/ai/recommendations";

export default async function PremiumPage() {
  const recommendations = await getPremiumRecommendations({
    occasion: "office",
    season: "spring",
    weather: "18C y nubes ligeras",
    mood: "seguro",
  });

  const remainingCredits = profile.monthlyAiCredits - profile.usedAiCredits;

  return (
    <AppShell
      title="Premium e IA"
      description="Panel de monetización, control de consumo y sugerencias premium preparado para conectarse a Stripe y a un proveedor IA real."
    >
      <div className="grid gap-6">
        <section className="grid gap-4 lg:grid-cols-3">
          {[
            { label: "Plan activo", value: "Premium" },
            { label: "Creditos restantes", value: remainingCredits.toString() },
            { label: "Límite mensual", value: profile.monthlyAiCredits.toString() },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-stone-200 bg-white p-5">
              <p className="text-sm text-stone-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-stone-900">{item.value}</p>
            </div>
          ))}
        </section>

        <SectionCard
          eyebrow="Checkout"
          title="Plan premium pensado para Stripe"
          description="La ruta de checkout ya queda preparada para recibir el price id de Stripe y gestionar upgrades sin bloquear el desarrollo del resto del producto."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-stone-900 p-5 text-white">
              <p className="text-sm text-stone-300">Incluye</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-200">
                <li>Generación de looks con IA</li>
                <li>Historial de recomendaciones</li>
                <li>Límites mensuales configurables</li>
                <li>Preparado para portal de cliente y facturación</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-stone-100 p-5">
              <p className="text-sm font-medium text-stone-900">Siguiente paso técnico</p>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Añadir la configuración real de `STRIPE_SECRET_KEY` y `STRIPE_PREMIUM_PRICE_ID`
                para activar el checkout server-side sin modificar la interfaz.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="IA"
          title="Sugerencias generadas"
          description="La capa de IA devuelve looks explicados y convertibles a outfits guardables. Hoy usa un proveedor local de ejemplo para no depender de claves durante el bootstrap."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {recommendations.map((recommendation) => (
              <article key={recommendation.title} className="rounded-3xl bg-white p-5 shadow-sm shadow-stone-200/50">
                <h2 className="text-lg font-semibold text-stone-900">{recommendation.title}</h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {recommendation.rationale}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {recommendation.garments.map((garment) =>
                    garment ? (
                      <span
                        key={garment.id}
                        className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700"
                      >
                        {garment.name}
                      </span>
                    ) : null,
                  )}
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
