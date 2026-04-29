import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { SectionCard } from "@/components/section-card";
import { garments, outfits } from "@/lib/mock-data";

export default function OutfitsPage() {
  return (
    <AppShell
      title="Conjuntos"
      description="Constructor de looks manuales y base preparada para guardar sugerencias del asistente personal como conjuntos editables."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <SectionCard
          eyebrow="Demo"
          title="Crear conjuntos"
          description="En esta iteración, puedes cargar conjuntos demo desde el servidor para probar el planificador. El editor visual completo lo implementamos después."
        >
          <div className="rounded-3xl bg-stone-100 p-5 text-sm text-stone-700">
            Para probar asignaciones en el planificador, puedes crear conjuntos demo con este endpoint:
            <div className="mt-3 rounded-2xl bg-white p-4 font-mono text-xs text-stone-800">
              POST /api/outfits/seed-demo
            </div>
            <p className="mt-3 text-sm text-stone-600">
              Después, recarga esta página y el planificador para verlos en el selector.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Biblioteca"
          title="Conjuntos guardados"
          description="Cada conjunto agrupa prendas, contexto de uso y notas para poder planificarse después en el calendario."
        >
          {outfits.length ? (
            <div className="space-y-4">
              {outfits.map((outfit) => (
                <article key={outfit.id} className="rounded-3xl bg-white p-5 shadow-sm shadow-stone-200/50">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold text-stone-900">{outfit.name}</h2>
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium uppercase text-stone-600">
                      {outfit.occasion}
                    </span>
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium uppercase text-stone-600">
                      {outfit.season}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {outfit.garmentIds.map((garmentId) => {
                      const garment = garments.find((item) => item.id === garmentId);

                      return garment ? (
                        <span
                          key={garment.id}
                          className="rounded-full border border-stone-200 px-3 py-1 text-sm text-stone-700"
                        >
                          {garment.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-stone-600">{outfit.notes}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aún no has creado conjuntos"
              description="Selecciona prendas del armario y guarda tu primera combinación para poder reutilizarla en el planificador."
            />
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
