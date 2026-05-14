import Stripe from "stripe";

declare global {
  var __stripe: Stripe | undefined;
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!globalThis.__stripe) {
    globalThis.__stripe = new Stripe(key);
  }
  return globalThis.__stripe;
}
