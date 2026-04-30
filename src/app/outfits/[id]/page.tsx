import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { SectionCard } from "@/components/section-card";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type GarmentLite = {
  id: string;
  name: string;
  category: string;
  color: string;
  brand: string | null;
};

const occasionLabels: Record<string, string> = {
  daily: "Diario",
  office: "Oficina",
  event: "Evento",
  travel: "Viaje",
  sport: "Deporte",
};

const seasonLabels: Record<string, string> = {
  spring: "Primavera",
  summer: "Verano",
  autumn: "Otoño",
  winter: "Invierno",
};

const categoryLabels: Record<string, string> = {
  tops: "Tops",
  bottoms: "Pantalones",
  outerwear: "Abrigos",
  footwear: "Calzado",
  accessories: "Accesorios",
};

export default async function OutfitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = getSupabaseServerClient();
  if (!supabase) redirect("/sign-in");

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/sign-in");

  const { data: outfit, error } = await supabase
    .from("outfits")
    .select(
      "id,name,occasion,season,notes,created_at,outfit_items(garment_id,sort_order,garments(id,name,category,color,brand))",
    )
    .eq("id", id)
    .single();

  if (error || !outfit) {
    return (
      <AppShell title="Conjunto" description="Detalle de un conjunto guardado.">
        <EmptyState
          title="No se encontró el conjunto"
          description="Puede que se haya borrado o que no tengas permisos para verlo."
        />
      </AppShell>
    );
  }

  const items = (outfit.outfit_items ?? [])
    .slice()
    .sort((a: any, b: any) => Number(a.sort_order) - Number(b.sort_order))
    .map((it: any) => {
      const g = it.garments as GarmentLite | GarmentLite[] | null | undefined;
      const garment = Array.isArray(g) ? g[0] : g;
      return garment ? { garment, sortOrder: Number(it.sort_order) } : null;
    })
    .filter(Boolean) as { garment: GarmentLite; sortOrder: number }[];

  return (
    <AppShell
      title={outfit.name as string}
      description={`${occasionLabels[String(outfit.occasion)] ?? outfit.occasion} · ${
        seasonLabels[String(outfit.season)] ?? outfit.season
      }`}
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <SectionCard
          eyebrow="Detalle"
          title="Prendas del conjunto"
          description="Este conjunto se puede asignar directamente desde el planificador."
        >
          {items.length ? (
            <div className="space-y-3">
              {items.map(({ garment }) => (
                <div
                  key={garment.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-3xl bg-white p-4 shadow-sm shadow-stone-200/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-stone-950">{garment.name}</p>
                    <p className="mt-1 text-sm text-stone-600">
                      {categoryLabels[garment.category] ?? garment.category}
                      {garment.brand ? ` · ${garment.brand}` : ""}
                    </p>
                  </div>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                    {garment.color}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Este conjunto no tiene prendas"
              description="Edita el conjunto para añadir al menos una prenda."
            />
          )}
        </SectionCard>

        <SectionCard
          eyebrow="Notas"
          title="Contexto"
          description="Úsalo para recordar por qué te funciona este look."
        >
          <div className="rounded-3xl bg-stone-100 p-5 text-sm leading-6 text-stone-700">
            {outfit.notes ? (outfit.notes as string) : "Sin notas todavía."}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}

