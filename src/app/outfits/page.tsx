import { AppShell } from "@/components/app-shell";
import { OutfitBuilder } from "@/components/outfits/outfit-builder";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type GarmentLite = {
  id: string;
  name: string;
  category: string;
  color: string;
  brand: string | null;
};

type OutfitRow = {
  id: string;
  name: string;
  occasion: string;
  season: string;
  notes: string | null;
  outfit_items?: {
    garment_id: string;
    sort_order: number;
    garments?: GarmentLite | GarmentLite[] | null;
  }[];
};

export default async function OutfitsPage() {
  const supabase = getSupabaseServerClient();
  if (!supabase) redirect("/sign-in");

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/sign-in");

  const { data: garmentRows } = await supabase
    .from("garments")
    .select("id,name,category,color,brand")
    .order("created_at", { ascending: false });

  const { data: outfits } = await supabase
    .from("outfits")
    .select(
      "id,name,occasion,season,notes,created_at,outfit_items(garment_id,sort_order,garments(id,name,category,color,brand))",
    )
    .order("created_at", { ascending: false });

  const garments = (garmentRows ?? []) as GarmentLite[];

  return (
    <AppShell
      title="Conjuntos"
      description="Crea, edita y guarda combinaciones de prendas para reutilizarlas en tu planificador."
    >
      <OutfitBuilder garments={garments} outfits={((outfits ?? []) as unknown as OutfitRow[]) ?? []} />
    </AppShell>
  );
}
