import express, { Request, Response, Router } from "express";
import Stripe from "stripe";
import { markSubscribed } from "../services/usage.js";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" }) : null;

const router = Router();

router.post("/checkout", async (req, res, next) => {
  try {
    const userId = (req.body?.userId || req.header("x-user-id") || "demo-user") as string;

    if (!stripe || !process.env.STRIPE_PRICE_MONTHLY) {
      return res.json({ url: "https://buy.stripe.com/test_checkout_mock" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: req.body?.successUrl || "https://easy-read-toolbox.app/success",
      cancel_url: req.body?.cancelUrl || "https://easy-read-toolbox.app/cancel",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_MONTHLY,
          quantity: 1,
        },
      ],
      metadata: { userId },
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
});

export async function billingWebhookHandler(req: Request, res: Response) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    res.json({ received: true, mock: true });
    return;
  }

  const sig = req.headers["stripe-signature"] as string | undefined;
  if (!sig) {
    res.status(400).send("Missing Stripe signature");
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook error", err);
    res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = (session.metadata?.userId as string) || "demo-user";
    markSubscribed(userId);
  }

  res.json({ received: true });
}

const webhookRouter = Router();
webhookRouter.post("/webhook", express.raw({ type: "application/json" }), billingWebhookHandler);

export { router as billingRouter, webhookRouter as billingWebhookRouter };
