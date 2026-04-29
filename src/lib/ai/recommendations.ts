import { generateAiRecommendations, garments } from "@/lib/mock-data";
import { AiRecommendationInput } from "@/types/domain";

export async function getPremiumRecommendations(input: AiRecommendationInput) {
  const recommendations = generateAiRecommendations(input);

  return recommendations.map((recommendation) => ({
    ...recommendation,
    garments: recommendation.garmentIds
      .map((garmentId) => garments.find((garment) => garment.id === garmentId))
      .filter(Boolean),
  }));
}
