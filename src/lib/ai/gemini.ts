import { z } from "zod";
import { env } from "@/lib/env";
import { type AiRecommendation, type AiRecommendationInput, type Garment } from "@/types/domain";

const recommendationsResponseSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string().min(2),
      rationale: z.string().min(2),
      garmentIds: z.array(z.string().min(1)).min(1),
      premiumOnly: z.boolean(),
    }),
  ),
});

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;
    const slice = text.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(slice);
    } catch {
      return null;
    }
  }
}

export async function generateRecommendationsWithGemini(
  input: AiRecommendationInput,
  garmentsList: Garment[],
): Promise<AiRecommendation[]> {
  if (!env.geminiApiKey) {
    throw new Error("Falta GEMINI_API_KEY en variables de entorno.");
  }

  // Nota: pedimos IDs, pero el modelo puede devolver strings inesperadas.
  // Por eso validamos contra esquema y aplicamos un fallback si no cuadra.
  const prompt = [
    "Eres un asistente de moda y organización personal de armario.",
    "Tu tarea: generar 2-4 sugerencias de conjuntos (outfits) basadas en la información del usuario.",
    "",
    "Datos de entrada:",
    `- ocasión: ${input.occasion}`,
    `- temporada: ${input.season}`,
    `- clima: ${input.weather}`,
    `- mood: ${input.mood}`,
    "",
    "Armario disponible (usa solo garmentIds existentes):",
    garmentsList
      .slice(0, 60)
      .map(
        (g) =>
          `- ${g.id}: ${g.name} | ${g.category} | color=${g.color} | marca=${g.brand} | seasons=${g.season.join(",")} | ocasiones=${g.occasion.join(",")}`,
      )
      .join("\n"),
    "",
    "Entrega SOLO JSON válido con el siguiente esquema:",
    "{",
    '  "recommendations": [',
    "    {",
    '      "title": string,',
    '      "rationale": string,',
    '      "garmentIds": string[] (mínimo 1),',
    '      "premiumOnly": true',
    "    }",
    "  ]",
    "}",
    "",
    "Reglas:",
    "- garmentIds deben ser IDs exactos de la lista del armario.",
    "- Elige conjuntos coherentes (colores, categoría complementaria).",
    "- premiumOnly debe ser true.",
    "- No incluyas texto fuera del JSON.",
  ].join("\n");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    env.geminiModel,
  )}:generateContent?key=${encodeURIComponent(env.geminiApiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Gemini error ${res.status}: ${errText || "sin detalle"}`);
  }

  const payload = await res.json();
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = typeof text === "string" ? safeJsonParse(text) : payload;
  const validated = recommendationsResponseSchema.parse(parsed);

  const existingIds = new Set(garmentsList.map((g) => g.id));

  return validated.recommendations.map((r) => ({
    title: r.title,
    rationale: r.rationale,
    premiumOnly: r.premiumOnly,
    garmentIds: r.garmentIds.filter((id) => existingIds.has(id)),
  }));
}

