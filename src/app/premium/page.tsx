import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { profile } from "@/lib/mock-data";
import { AiGenerator } from "@/components/ai-generator";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PremiumPage() {
  const supabase = getSupabaseServerClient();
  if (!supabase) redirect("/sign-in");

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/sign-in");

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
          <AiGenerator />
        </SectionCard>
      </div>
    </AppShell>
  );
}
