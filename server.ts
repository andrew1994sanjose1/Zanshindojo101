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

    // Middleware para mabasa ang JSON body
    app.use(express.json());

    // PayMongo Checkout Session Route
   app.post('/api/create-checkout-session', async (req, res) => {
  try {
    // I-paste mo dito yung kinuha mo sa COPY button kanina
    const SECRET_KEY = 'sk_test_PYGoLvTtaMmAQtvf1htbPEua'; 
    
    // Manual creation ng Authorization Header
    const authString = Buffer.from(`${SECRET_KEY}:`).toString('base64');

    const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        data: {
          attributes: {
            line_items: [
              {
                amount: 150000,
                currency: 'PHP',
                name: 'Zanshin Dojo Monthly Fee',
                quantity: 1
              }
            ],
            payment_method_types: ['card', 'gcash', 'maya'],
            description: 'Karate School Membership',
            success_url: 'https://zanshindojo101.onrender.com/MemberDashboard?payment=success',
            cancel_url: 'https://zanshindojo101.onrender.com/MemberDashboard?payment=cancelled'
          }
        }
      })
    });

    const data = await response.json();
    console.log("SERVER_LOG_STATUS:", response.status);

    if (!response.ok) {
      console.log("PAYMONGO_ERROR_DETAIL:", JSON.stringify(data));
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("CRITICAL_BACKEND_ERROR:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
  // Static files at SPA routing
  app.use(express.static(path.join(__dirname, "../dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} // <--- Ito yung nagsasara ng startServer function

startServer();
