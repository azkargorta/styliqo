import { garments, outfits, plannerEntries, profile, wishlistItems } from "@/lib/mock-data";
import { getSupabaseServerClient } from "@/lib/supabase/client";

export async function getDashboardSnapshot() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return {
      profile,
      garments,
      outfits,
      plannerEntries,
      wishlistItems,
      source: "mock",
    };
  }

  const [{ data: profileData }, { data: garmentData }, { data: outfitData }, { data: plannerData }, { data: wishlistData }] =
    await Promise.all([
      supabase.from("profiles").select("*").single(),
      supabase.from("garments").select("*"),
      supabase.from("outfits").select("*"),
      supabase.from("planner_entries").select("*"),
      supabase.from("wishlist_items").select("*"),
    ]);

  return {
    profile: profileData ?? profile,
    garments: garmentData ?? garments,
    outfits: outfitData ?? outfits,
    plannerEntries: plannerData ?? plannerEntries,
    wishlistItems: wishlistData ?? wishlistItems,
    source: "supabase",
  };
}
