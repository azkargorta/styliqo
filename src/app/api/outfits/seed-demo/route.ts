import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase no está configurado." }, { status: 500 });

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const userId = userData.user.id;

  const { count: outfitsCount, error: outfitsCountErr } = await supabase
    .from("outfits")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (outfitsCountErr) return NextResponse.json({ error: outfitsCountErr.message }, { status: 500 });
  if ((outfitsCount ?? 0) > 0) {
    return NextResponse.json(
      { error: "Ya tienes conjuntos. No se ha aplicado el seed." },
      { status: 400 },
    );
  }

  const { data: garments, error: garmentsErr } = await supabase
    .from("garments")
    .select("id,category,color")
    .eq("user_id", userId);

  if (garmentsErr) return NextResponse.json({ error: garmentsErr.message }, { status: 500 });
  if (!garments?.length) {
    return NextResponse.json(
      { error: "Primero carga prendas en el armario (puedes usar el armario demo)." },
      { status: 400 },
    );
  }

  const pick = (category: string) => garments.find((g) => g.category === category)?.id ?? garments[0].id;

  const seedOutfits = [
    {
      name: "Oficina: pulcro y cómodo",
      occasion: "office",
      season: "spring",
      notes: "Base neutra con una capa estructurada.",
      garmentIds: [pick("tops"), pick("bottoms"), pick("outerwear"), pick("footwear")],
    },
    {
      name: "Diario: smart casual",
      occasion: "daily",
      season: "autumn",
      notes: "Fácil de repetir y variar con accesorios.",
      garmentIds: [pick("tops"), pick("bottoms"), pick("footwear")],
    },
  ];

  const createdOutfits: { id: string; garmentIds: string[] }[] = [];

  for (const outfit of seedOutfits) {
    const { data: created, error: createErr } = await supabase
      .from("outfits")
      .insert({
        user_id: userId,
        name: outfit.name,
        occasion: outfit.occasion,
        season: outfit.season,
        notes: outfit.notes,
      })
      .select("id")
      .single();

    if (createErr || !created?.id) {
      return NextResponse.json(
        { error: createErr?.message || "No se pudo crear el conjunto demo." },
        { status: 400 },
      );
    }

    const items = outfit.garmentIds.map((garmentId, idx) => ({
      outfit_id: created.id,
      garment_id: garmentId,
      sort_order: idx,
    }));

    const { error: itemsErr } = await supabase.from("outfit_items").insert(items);
    if (itemsErr) {
      return NextResponse.json({ error: itemsErr.message }, { status: 400 });
    }

    createdOutfits.push({ id: created.id, garmentIds: outfit.garmentIds });
  }

  return NextResponse.json({ ok: true, inserted: createdOutfits.length });
}

