import { generateAiRecommendations, garments as mockGarments } from "@/lib/mock-data";
import { type AiRecommendation, type AiRecommendationInput, type Garment } from "@/types/domain";
import { hasAiEnv } from "@/lib/env";
import { generateRecommendationsWithGemini } from "@/lib/ai/gemini";

type RecommendationResponse = (AiRecommendation & { garments?: Garment[] })[];

function isGarment(value: Garment | undefined): value is Garment {
  return Boolean(value);
}

export async function getPremiumRecommendations(
  input: AiRecommendationInput,
  opts?: { garmentsList?: Garment[] },
): Promise<RecommendationResponse> {
  const garmentsList = opts?.garmentsList ?? mockGarments;

  // Fallback local si todavía no hay configuración.
  if (!hasAiEnv()) {
    const recommendations = generateAiRecommendations(input);
    return recommendations.map((recommendation) => ({
      ...recommendation,
      garments: recommendation.garmentIds
        .map((garmentId) => garmentsList.find((garment) => garment.id === garmentId))
        .filter(isGarment),
    }));
  }

  const geminiRecommendations = await generateRecommendationsWithGemini(input, garmentsList);

  return geminiRecommendations.map((recommendation) => ({
    ...recommendation,
    garments: recommendation.garmentIds
      .map((garmentId) => garmentsList.find((garment) => garment.id === garmentId))
      .filter(isGarment),
  }));
}
