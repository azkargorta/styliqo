import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const categories = ["tops", "bottoms", "outerwear", "footwear", "accessories"] as const;
const seasons = ["spring", "summer", "autumn", "winter"] as const;
const occasions = ["daily", "office", "event", "travel", "sport"] as const;

const seasonsSchema = z
  .array(z.enum(seasons))
  .min(1, "Selecciona al menos una temporada.");

const occasionsSchema = z
  .array(z.enum(occasions))
  .min(1, "Selecciona al menos una ocasión.");

const bodySchema = z.object({
  name: z.string().min(2),
  category: z.enum(categories),
  color: z.string().min(1),
  brand: z.string().optional(),
  notes: z.string().optional(),
  seasons: seasonsSchema,
  occasions: occasionsSchema,
  isFavorite: z.boolean().optional(),
});

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase no está configurado." },
      { status: 500 },
    );
  }

  const { data: userData, error: userErr } = await supabase.auth.getUser();

  if (userErr || !userData.user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = bodySchema.parse(await request.json());

  const { data, error } = await supabase.from("garments").insert({
    user_id: userData.user.id,
    name: body.name,
    category: body.category,
    color: body.color,
    brand: body.brand ?? null,
    notes: body.notes ?? null,
    seasons: body.seasons,
    occasions: body.occasions,
    is_favorite: body.isFavorite ?? false,
  }).select("*").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, data });
}

