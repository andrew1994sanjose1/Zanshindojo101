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
    // PAALALA: Siguraduhin na 'PYGo' (Capital G) ang nakasulat
    const secretKey = 'sk_test_PYGoLvTtaMmAQtvf1htbPEua'; 
    const authHeader = `Basic ${Buffer.from(secretKey + ':').toString('base64')}`;

    const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        data: {
          attributes: {
            line_items: [
              {
                amount: 150000, // PHP 1,500.00
                currency: 'PHP',
                name: 'Zanshin Dojo Membership',
                quantity: 1
              }
            ],
            payment_method_types: ['card', 'gcash', 'maya'],
            description: 'Monthly Membership Fee',
            // Palitan mo ito ng tamang URL ng Render mo
            success_url: 'https://zanshindojo101.onrender.com/MemberDashboard?payment=success',
            cancel_url: 'https://zanshindojo101.onrender.com/MemberDashboard?payment=cancelled'
          }
        }
      })
    });

    const result = await response.json();
    
    // Para makita natin sa Render Logs kung 200 o 401 ang lumabas
    console.log("CHECK_STATUS:", response.status);
    console.log("PAYMONGO_DEBUG:", JSON.stringify(result));

    if (!response.ok) {
      return res.status(response.status).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("BACKEND_ERROR:", error.message);
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
