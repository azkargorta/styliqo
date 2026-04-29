import {
  AiRecommendation,
  AiRecommendationInput,
  Garment,
  Outfit,
  PlannerEntry,
  Profile,
  WishlistItem,
} from "@/types/domain";

export const profile: Profile = {
  id: "user-demo",
  fullName: "Azkargorta Unai",
  email: "demo@styliqo.app",
  tier: "premium",
  monthlyAiCredits: 30,
  usedAiCredits: 8,
};

export const garments: Garment[] = [
  {
    id: "g-1",
    name: "Camisa Oxford blanca",
    category: "tops",
    color: "Blanco",
    season: ["spring", "autumn"],
    occasion: ["office", "daily"],
    brand: "COS",
    imageUrl:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
    favorite: true,
  },
  {
    id: "g-2",
    name: "Vaquero recto azul",
    category: "bottoms",
    color: "Azul",
    season: ["spring", "autumn", "winter"],
    occasion: ["daily", "travel"],
    brand: "Levi's",
    imageUrl:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "g-3",
    name: "Blazer beige estructurado",
    category: "outerwear",
    color: "Beige",
    season: ["spring", "autumn"],
    occasion: ["office", "event"],
    brand: "Massimo Dutti",
    imageUrl:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
    favorite: true,
  },
  {
    id: "g-4",
    name: "Zapatillas minimal blancas",
    category: "footwear",
    color: "Blanco",
    season: ["spring", "summer", "autumn"],
    occasion: ["daily", "travel"],
    brand: "Common Projects",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "g-5",
    name: "Pantalon sastre negro",
    category: "bottoms",
    color: "Negro",
    season: ["autumn", "winter"],
    occasion: ["office", "event"],
    brand: "Arket",
    imageUrl:
      "https://images.unsplash.com/photo-1506629905607-61d0f75bfa59?auto=format&fit=crop&w=900&q=80",
  },
];

export const outfits: Outfit[] = [
  {
    id: "o-1",
    name: "Oficina minimal",
    occasion: "office",
    season: "spring",
    garmentIds: ["g-1", "g-3", "g-5", "g-4"],
    notes: "Ideal para reuniones y días templados.",
  },
  {
    id: "o-2",
    name: "Weekend limpio",
    occasion: "daily",
    season: "autumn",
    garmentIds: ["g-1", "g-2", "g-4"],
    notes: "Cómodo pero con estructura.",
  },
];

export const plannerEntries: PlannerEntry[] = [
  {
    id: "p-1",
    date: "2026-04-30",
    title: "Reunión con cliente",
    outfitId: "o-1",
    weather: "18C, nublado",
  },
  {
    id: "p-2",
    date: "2026-05-01",
    title: "Cena informal",
    outfitId: "o-2",
    weather: "16C, despejado",
  },
];

export const wishlistItems: WishlistItem[] = [
  {
    id: "w-1",
    name: "Gabardina ligera arena",
    store: "Zara",
    targetPrice: 79,
    url: "https://www.zara.com/",
    priority: "high",
  },
  {
    id: "w-2",
    name: "Mocasines negros",
    store: "Camper",
    targetPrice: 120,
    url: "https://www.camper.com/",
    priority: "medium",
  },
];

export function generateAiRecommendations(
  input: AiRecommendationInput,
): AiRecommendation[] {
  const officeCore = outfits.find((outfit) => outfit.occasion === "office");
  const casualCore = outfits.find((outfit) => outfit.occasion === "daily");

  return [
    {
      title: `${input.occasion === "office" ? "Smart office" : "Look equilibrado"} para ${input.weather}`,
      rationale:
        "Combina una base neutra con una capa estructurada para mantener versatilidad y coherencia cromática.",
      garmentIds:
        input.occasion === "office"
          ? officeCore?.garmentIds ?? ["g-1", "g-3", "g-5", "g-4"]
          : casualCore?.garmentIds ?? ["g-1", "g-2", "g-4"],
      premiumOnly: true,
    },
    {
      title: `Combinación ${input.mood.toLowerCase()} para ${input.season}`,
      rationale:
        "Usa prendas favoritas del armario para elevar afinidad y aumentar la reutilización de piezas clave.",
      garmentIds: ["g-1", "g-2", "g-4"],
      premiumOnly: true,
    },
  ];
}
