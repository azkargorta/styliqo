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
          eyebrow="Builder"
          title="Composición manual"
          description="La siguiente iteración puede reemplazar este preview por drag and drop o selección contextual por categoría."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {garments.map((garment) => (
              <div key={garment.id} className="rounded-3xl bg-stone-100 p-4">
                <p className="text-sm font-medium text-stone-900">{garment.name}</p>
                <p className="mt-1 text-sm text-stone-600">
                  {garment.category} · {garment.color}
                </p>
              </div>
            ))}
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
