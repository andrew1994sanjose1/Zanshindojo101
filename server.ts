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
        const options = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: 'Basic ' + Buffer.from('process.env.PAYMONGO_SECRET_KEY').toString('base64')
          },
          body: JSON.stringify({
            data: {
              attributes: {
                send_email_receipt: true,
                show_description: true,
                description: 'Zenith Dojo Monthly Membership Fee',
                line_items: [
                  {
                    amount: 150000, 
                    currency: 'PHP',
                    name: 'Monthly membership fee',
                    quantity: 1
                  }
                ],
                payment_method_types: ['card', 'gcash', 'maya'],
                success_url: 'https://zanshindojo101.onrender.com/MemberDashboard?payment=success',
                cancel_url: 'https://zanshindojo101.onrender.com/MemberDashboard?payment=cancelled'
              }
            }
          })
        };

        const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options);
        const result = await response.json();
        res.json(result);
      } catch (error) {
        console.error("PayMongo Backend Error:", error);
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

// Wag kalimutan tawagin ang function sa dulo
startServer();
