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
    // PayMongo Checkout Session Route
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      // Direkta nating i-hardcode ang base64 para wala nang computation error
      // Ito ay base64 ng 'sk_test_PYGoLvTtaMmAQtvf1htbPEua:'
      const authHeader = 'Basic c2tfdGVzdF9QWUdvTHZUdGFNbUFRdHZmMWh0YlBFdWE6';

      const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          data: {
            attributes: {
              show_description: true,
              show_line_items: true,
              description: 'Zanshin Dojo Fee',
              line_items: [
                {
                  amount: 150000,
                  currency: 'PHP',
                  name: 'Monthly Membership',
                  quantity: 1
                }
              ],
              payment_method_types: ['card', 'gcash', 'maya'],
              success_url: 'https://zanshindojo101.onrender.com/MemberDashboard?payment=success',
              cancel_url: 'https://zanshindojo101.onrender.com/MemberDashboard?payment=cancelled'
            }
          }
        })
      });

      const result = await response.json();
      console.log("PAYMONGO_DEBUG:", result); // Lalabas ito sa Render logs

      if (result.errors) {
        return res.status(400).json({ error: "PayMongo Error", details: result.errors });
      }

      res.json(result);
    } catch (error) {
      console.error("BACKEND_CRASH:", error);
      res.status(500).json({ error: "Server error", message: error.message });
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

// Wag kalimutan tawagin ang function sa dulo
startServer();
