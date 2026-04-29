import { NextResponse } from "next/server";
import { z } from "zod";
import { getPremiumRecommendations } from "@/lib/ai/recommendations";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Garment, Occasion, Season } from "@/types/domain";

const bodySchema = z.object({
  occasion: z.enum(["daily", "office", "event", "travel", "sport"]),
  season: z.enum(["spring", "summer", "autumn", "winter"]),
  weather: z.string().min(2),
  mood: z.string().min(2),
});

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

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase no está configurado." }, { status: 500 });
    }

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const body = bodySchema.parse(await request.json());

    const { data: garmentRows, error: garmentErr } = await supabase
      .from("garments")
      .select("id,name,category,color,brand,notes,seasons,occasions,is_favorite");

    if (garmentErr) {
      return NextResponse.json({ error: garmentErr.message }, { status: 500 });
    }

    const garmentsList = (garmentRows ?? []).map(mapGarmentRow).filter(Boolean) as Garment[];

    if (garmentsList.length === 0) {
      return NextResponse.json(
        {
          error:
            "Necesitas añadir al menos 1 prenda en `Armario` antes de generar con IA.",
        },
        { status: 400 },
      );
    }

    const recommendations = await getPremiumRecommendations(body, { garmentsList });

    return NextResponse.json({
      data: recommendations,
      meta: {
        premiumRequired: true,
      },
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Error generando recomendaciones",
      },
      { status: 500 },
    );
  }
}
