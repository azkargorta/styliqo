import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const occasions = ["daily", "office", "event", "travel", "sport"] as const;
const seasons = ["spring", "summer", "autumn", "winter"] as const;

const outfitSchema = z.object({
  name: z.string().min(2),
  occasion: z.enum(occasions),
  season: z.enum(seasons),
  notes: z.string().optional(),
  garmentIds: z.array(z.string().uuid()).min(1),
});

export async function GET() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase no está configurado." }, { status: 500 });

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { data, error } = await supabase
    .from("outfits")
    .select(
      "id,name,occasion,season,notes,created_at,outfit_items(garment_id,sort_order,garments(id,name,category,color,brand))",
    )
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase no está configurado." }, { status: 500 });

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = outfitSchema.parse(await request.json());

  const { data: outfit, error: createErr } = await supabase
    .from("outfits")
    .insert({
      user_id: userData.user.id,
      name: body.name,
      occasion: body.occasion,
      season: body.season,
      notes: body.notes ?? null,
    })
    .select("id")
    .single();

  if (createErr || !outfit?.id) {
    return NextResponse.json({ error: createErr?.message || "No se pudo crear el conjunto." }, { status: 400 });
  }

  const items = body.garmentIds.map((garmentId, idx) => ({
    outfit_id: outfit.id,
    garment_id: garmentId,
    sort_order: idx,
  }));

  const { error: itemsErr } = await supabase.from("outfit_items").insert(items);
  if (itemsErr) {
    return NextResponse.json({ error: itemsErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, id: outfit.id });
}

