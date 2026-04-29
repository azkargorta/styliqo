import { NextResponse } from "next/server";
import { z } from "zod";
import { getPremiumRecommendations } from "@/lib/ai/recommendations";

const bodySchema = z.object({
  occasion: z.enum(["daily", "office", "event", "travel", "sport"]),
  season: z.enum(["spring", "summer", "autumn", "winter"]),
  weather: z.string().min(2),
  mood: z.string().min(2),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const recommendations = await getPremiumRecommendations(body);

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
