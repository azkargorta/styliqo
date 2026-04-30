import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const occasions = ["daily", "office", "event", "travel", "sport"] as const;
const seasons = ["spring", "summer", "autumn", "winter"] as const;

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  occasion: z.enum(occasions).optional(),
  season: z.enum(seasons).optional(),
  notes: z.string().optional(),
  garmentIds: z.array(z.string().uuid()).min(1).optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase no está configurado." }, { status: 500 });

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await context.params;
  const body = patchSchema.parse(await request.json());

  const updates: Record<string, unknown> = {};
  if (body.name) updates.name = body.name;
  if (body.occasion) updates.occasion = body.occasion;
  if (body.season) updates.season = body.season;
  if (typeof body.notes !== "undefined") updates.notes = body.notes ?? null;

  if (Object.keys(updates).length) {
    const { error } = await supabase
      .from("outfits")
      .update(updates)
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (body.garmentIds) {
    const { error: delErr } = await supabase.from("outfit_items").delete().eq("outfit_id", id);
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 400 });

    const items = body.garmentIds.map((garmentId, idx) => ({
      outfit_id: id,
      garment_id: garmentId,
      sort_order: idx,
    }));

    const { error: itemsErr } = await supabase.from("outfit_items").insert(items);
    if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase no está configurado." }, { status: 500 });

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { id } = await context.params;

  const { error } = await supabase.from("outfits").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}

