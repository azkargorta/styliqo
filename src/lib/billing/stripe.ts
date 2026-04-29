import Stripe from "stripe";
import { env, hasStripeEnv } from "@/lib/env";

export function getStripeServerClient() {
  if (!hasStripeEnv()) {
    return null;
  }

  return new Stripe(env.stripeSecretKey!);
}
