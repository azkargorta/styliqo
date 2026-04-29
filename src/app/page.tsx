import Link from "next/link";
import { ArrowRight, CalendarDays, Heart, ShieldCheck, Sparkles, Shirt } from "lucide-react";
import { SectionCard } from "@/components/section-card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background styliqo-bg px-4 py-6 text-stone-900 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] bg-stone-950 p-8 text-white shadow-xl shadow-stone-300/60 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-stone-300">
                Styliqo
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight lg:text-6xl">
                Tu armario virtual para guardar ropa, montar looks y planificar qué ponerte.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
                Organiza prendas, crea conjuntos, agenda combinaciones en tu calendario
                y desbloquea el asistente personal premium cuando quieras escalar la experiencia.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand800"
                >
                  Ver resumen
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/premium"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Abrir asistente personal
                </Link>
              </div>
            </div>

            <div className="grid gap-4 rounded-[1.75rem] bg-white/8 p-4">
              {[
                { label: "Prendas organizadas", value: "128" },
                { label: "Conjuntos guardados", value: "36" },
                { label: "Looks planificados", value: "12 este mes" },
                { label: "Asistente personal", value: "30 sugerencias al mes" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/6 p-5">
                  <p className="text-sm text-stone-300">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            eyebrow="Producto"
            title="Módulos que ya quedan preparados"
            description="La base incluye rutas y estructura para evolucionar rápidamente hacia una versión conectada a Supabase y Stripe."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Armario", icon: Shirt, text: "Catálogo de ropa con fotos, atributos y favoritos." },
                { label: "Conjuntos", icon: Sparkles, text: "Combinaciones manuales y sugeridas." },
                { label: "Planificador", icon: CalendarDays, text: "Planificación diaria de looks." },
                { label: "Lista de deseos", icon: Heart, text: "Prendas deseadas con prioridad y precio objetivo." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-3xl bg-stone-100 p-5">
                    <Icon className="h-5 w-5 text-stone-700" />
                    <h2 className="mt-4 text-lg font-semibold text-stone-900">{item.label}</h2>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Monetización"
            title="Premium diseñado para crecer"
            description="La versión premium se apoya en control de acceso por servidor, checkout de Stripe y un asistente personal desacoplado del proveedor."
          >
            <div className="space-y-4">
              {[
                "Checkout preparado para Stripe Checkout y Customer Portal.",
                "Registro de suscripción, consumo del asistente y límites por usuario.",
                "Fallbacks seguros si todavía no se han definido las variables de entorno.",
                "Capa del asistente lista para cambiar de proveedor sin rehacer la interfaz.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-3xl bg-stone-100 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-stone-700" />
                  <p className="text-sm leading-6 text-stone-700">{item}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </section>
      </div>
    </main>
  );
}
