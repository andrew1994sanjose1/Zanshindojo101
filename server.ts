import express from "express";
import path from "path";
import Stripe from "stripe";

// Lazy init Stripe
let stripe: Stripe | null = null;
const getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

async function startServer() {
  const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", shadow: "zenith" });
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const s = getStripe();
    if (!s) {
      return res.status(500).json({ error: "Stripe is not configured" });
    }

    const { priceId, successUrl, cancelUrl } = req.body;

    const session = await s.checkout.sessions.create({
      line_items: [
        {
          price: priceId || 'price_1P2vXgLqyN0Z0y1e1e1e1e1e', // Placeholder if not provided
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${req.headers.origin}/dashboard?payment=success`,
      cancel_url: cancelUrl || `${req.headers.origin}/dashboard?payment=cancel`,
    });

    res.json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
}

startServer();
