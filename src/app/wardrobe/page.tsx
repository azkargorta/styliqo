import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { SectionCard } from "@/components/section-card";
import { GarmentForm } from "@/components/garment-form";
import { Collapsible } from "@/components/collapsible";
import { WardrobeGallery } from "@/components/wardrobe/wardrobe-gallery";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Garment, Occasion, Season } from "@/types/domain";
import { redirect } from "next/navigation";

const seasonSet = new Set<Season>(["spring", "summer", "autumn", "winter"]);
const occasionSet = new Set<Occasion>(["daily", "office", "event", "travel", "sport"]);
const categorySet = new Set<Garment["category"]>(["tops", "bottoms", "outerwear", "footwear", "accessories"]);

const placeholderImageUrl =
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=80";

function mapGarmentRow(row: Record<string, unknown>): Garment | null {
  const category = row.category as Garment["category"];
  if (!categorySet.has(category)) return null;

  const season = Array.isArray(row.seasons)
    ? (row.seasons as string[]).filter((s) => seasonSet.has(s as Season)) as Season[]
    : [];
  const occasion = Array.isArray(row.occasions)
    ? (row.occasions as string[]).filter((o) => occasionSet.has(o as Occasion)) as Occasion[]
    : [];

  return {
    id: row.id as string,
    name: row.name as string,
    category,
    color: row.color as string,
    season,
    occasion,
    brand: (row.brand as string | null | undefined) ?? "",
    imageUrl: placeholderImageUrl,
    notes: (row.notes as string | null | undefined) ?? undefined,
    favorite: Boolean(row.is_favorite),
  };
}

export default async function WardrobePage() {
  const supabase = getSupabaseServerClient();
  if (!supabase) redirect("/sign-in");

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/sign-in");

  const { data: garmentRows, error } = await supabase
    .from("garments")
    .select("id,name,category,color,brand,notes,seasons,occasions,is_favorite")
    .order("created_at", { ascending: false });

  if (error) {
    // Si hay fallo de RLS o de esquema, mostramos fallback de "no prendas"
    // en vez de romper toda la página.
  }

  const garmentsList = (garmentRows ?? []).map(mapGarmentRow).filter(Boolean) as Garment[];

  return (
    <AppShell
      title="Armario"
      description="Inventario visual de prendas con atributos listos para filtrado, etiquetado y posterior persistencia en Supabase."
    >
      <div className="grid gap-6">
        <SectionCard
          eyebrow="Armario"
          title="Añadir prenda"
          description="Guarda una prenda en tu base de datos. Con al menos 1 prenda, el asistente personal podrá generar conjuntos basados en tu armario."
        >
          <Collapsible
            title="Formulario de alta"
            description="Sube lo mínimo (nombre, categoría, color) y completa el resto cuando quieras."
            defaultOpen={false}
            actionLabelClosed="Abrir formulario"
            actionLabelOpen="Cerrar"
          >
            <GarmentForm />
          </Collapsible>
        </SectionCard>

        <SectionCard
          eyebrow="Carga"
          title="Alta rápida de prendas"
          description="Flujo recomendado para la siguiente iteración: subir foto, autocompletar etiquetas y confirmar categoría, color, temporada y ocasiones."
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              "Imagen optimizada antes de subir al storage.",
              "Metadatos normalizados por categoria y temporada.",
              "Notas y marca opcionales para no friccionar el alta.",
              "Favoritos y uso frecuente para alimentar recomendaciones.",
            ].map((item) => (
              <div key={item} className="rounded-3xl bg-stone-100 p-4 text-sm leading-6 text-stone-700">
                {item}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Inventario"
          title="Prendas guardadas"
          description="Marca tus favoritas, sepáralas por estación y filtra para encontrar lo que necesitas rápido."
        >
          {garmentsList.length ? (
            <WardrobeGallery garments={garmentsList} />
          ) : (
            <EmptyState
              title="Todavía no tienes prendas"
              description="Empieza subiendo una foto y etiquetando tus piezas principales para construir el armario."
            />
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
