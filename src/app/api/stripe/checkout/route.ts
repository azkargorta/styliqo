import { NextResponse } from "next/server";
import { env, hasStripeEnv } from "@/lib/env";
import { getStripeServerClient } from "@/lib/billing/stripe";

export async function POST() {
  if (!hasStripeEnv()) {
    return NextResponse.json(
      {
        error:
          "Faltan STRIPE_SECRET_KEY o STRIPE_PREMIUM_PRICE_ID. Configura las variables de entorno para activar checkout.",
      },
      { status: 400 },
    );
  }

  const stripe = getStripeServerClient();

  if (!stripe) {
    return NextResponse.json(
      {
        error: "No se pudo inicializar Stripe.",
      },
      { status: 500 },
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: env.stripePriceId!,
        quantity: 1,
      },
    ],
    success_url: `${env.appUrl}/premium?checkout=success`,
    cancel_url: `${env.appUrl}/premium?checkout=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
