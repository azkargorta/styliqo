export type GarmentCategory =
  | "tops"
  | "bottoms"
  | "outerwear"
  | "footwear"
  | "accessories";

export type Season = "spring" | "summer" | "autumn" | "winter";
export type Occasion = "daily" | "office" | "event" | "travel" | "sport";
export type SubscriptionTier = "free" | "premium";

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  tier: SubscriptionTier;
  monthlyAiCredits: number;
  usedAiCredits: number;
}

export interface Garment {
  id: string;
  name: string;
  category: GarmentCategory;
  color: string;
  season: Season[];
  occasion: Occasion[];
  brand: string;
  imageUrl: string;
  notes?: string;
  favorite?: boolean;
}

export interface Outfit {
  id: string;
  name: string;
  occasion: Occasion;
  season: Season;
  garmentIds: string[];
  notes?: string;
}

export interface PlannerEntry {
  id: string;
  date: string;
  title: string;
  outfitId: string;
  weather: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  store: string;
  targetPrice: number;
  url: string;
  priority: "low" | "medium" | "high";
}

export interface AiRecommendationInput {
  occasion: Occasion;
  season: Season;
  weather: string;
  mood: string;
}

export interface AiRecommendation {
  title: string;
  rationale: string;
  garmentIds: string[];
  premiumOnly: boolean;
}
