function readEnv(name: string) {
  return process.env[name]?.trim() || undefined;
}

export const env = {
  appUrl: readEnv("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000",
  supabaseUrl: readEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: readEnv("SUPABASE_SERVICE_ROLE_KEY"),
  stripeSecretKey: readEnv("STRIPE_SECRET_KEY"),
  stripePriceId: readEnv("STRIPE_PREMIUM_PRICE_ID"),
  geminiApiKey: readEnv("GEMINI_API_KEY"),
  geminiModel: readEnv("GEMINI_MODEL") ?? "gemini-1.5-flash",
};

export function hasSupabaseEnv() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function hasStripeEnv() {
  return Boolean(env.stripeSecretKey && env.stripePriceId);
}

export function hasAiEnv() {
  return Boolean(env.geminiApiKey);
}
