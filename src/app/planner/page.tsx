import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { outfits, plannerEntries } from "@/lib/mock-data";

export default function PlannerPage() {
  return (
    <AppShell
      title="Planner"
      description="Calendario operativo para decidir qué ponerse por día, reutilizando outfits guardados y contexto meteorológico."
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          eyebrow="Semana"
          title="Eventos programados"
          description="Cada entrada puede asociarse a un outfit, estado del clima, notas y un recordatorio futuro."
        >
          <div className="space-y-3">
            {plannerEntries.map((entry) => {
              const linkedOutfit = outfits.find((outfit) => outfit.id === entry.outfitId);

              return (
                <div key={entry.id} className="rounded-3xl bg-white p-5 shadow-sm shadow-stone-200/50">
                  <p className="text-sm font-medium text-stone-500">{entry.date}</p>
                  <h2 className="mt-2 text-lg font-semibold text-stone-900">{entry.title}</h2>
                  <p className="mt-2 text-sm text-stone-600">
                    Outfit: {linkedOutfit?.name ?? "Sin asignar"} · {entry.weather}
                  </p>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Roadmap"
          title="Capacidades listas para la siguiente iteración"
          description="El módulo ya queda preparado para evolucionar a calendario completo y sugerencia automática de outfit."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Arrastrar outfits a una fecha concreta.",
              "Recomendación automática según clima y ocasión.",
              "Vista mensual y semanal responsive.",
              "Replanificación rápida si una prenda está en lavandería o no disponible.",
            ].map((item) => (
              <div key={item} className="rounded-3xl bg-stone-100 p-4 text-sm leading-6 text-stone-700">
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
