import Link from "next/link";
import { SectionCard } from "@/components/section-card";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-stone-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <SectionCard
          eyebrow="Precios"
          title="Planes para lanzar Styliqo"
          description="Página comercial inicial para diferenciar claramente el valor del plan gratuito y el premium."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-stone-200 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
                Gratuito
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-stone-900">0 EUR</h2>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700">
                <li>Armario ilimitado en fase inicial</li>
                <li>Conjuntos manuales y planificador básico</li>
                <li>Lista de deseos</li>
                <li>Sin asistente personal</li>
              </ul>
            </article>

            <article className="rounded-[2rem] bg-stone-900 p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-300">
                Premium
              </p>
              <h2 className="mt-4 text-3xl font-semibold">9,99 EUR / mes</h2>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-200">
                <li>Conjuntos generados con tu asistente personal</li>
                <li>Historial de recomendaciones y guardado rápido</li>
                <li>Límites mensuales configurables</li>
                <li>Preparado para Stripe Checkout</li>
              </ul>
              <Link
                href="/premium"
                className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-200"
              >
                Ir al asistente personal
              </Link>
            </article>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
