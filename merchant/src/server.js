import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { paymentMiddleware } from "x402-express";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const merchantWallet = process.env.MERCHANT_WALLET;

// Create separate x402 protected endpoints for each product
app.use(
  "/buy-budget",
  paymentMiddleware(
    merchantWallet,
    {
      "POST /buy-budget": {
        price: "0.3",
        network: "polygon-amoy",
      },
    },
    { url: "https://x402.polygon.technology" }
  )
);

app.use(
  "/buy-classic", 
  paymentMiddleware(
    merchantWallet,
    {
      "POST /buy-classic": {
        price: "0.5",
        network: "polygon-amoy",
      },
    },
    { url: "https://x402.polygon.technology" }
  )
);

app.use(
  "/buy-premium",
  paymentMiddleware(
    merchantWallet,
    {
      "POST /buy-premium": {
        price: "0.7",
        network: "polygon-amoy",
      },
    },
    { url: "https://x402.polygon.technology" }
  )
);

// This generic endpoint is no longer needed for direct calls from the x402 client
// but can be kept for other purposes if necessary.
app.post("/buy-product", async (req, res) => {
  const { productId, amount } = req.body;
  console.log(`✅ Payment received for ${productId} of ${amount} USDC`);
  res.json({ message: "Order Placed! Transaction Successful." });
});

// Handlers for each product endpoint
app.post("/buy-budget", async (req, res) => {
  console.log(`✅ Payment received for Budget-Hoodie of 0.3 USDC`);
  res.json({ message: "Budget Hoodie Order Placed! Transaction Successful." });
});

app.post("/buy-classic", async (req, res) => {
  console.log(`✅ Payment received for Decentralized-Hoodie of 0.5 USDC`);
  res.json({ message: "Classic Hoodie Order Placed! Transaction Successful." });
});

app.post("/buy-premium", async (req, res) => {
  console.log(`✅ Payment received for Premium-Hoodie of 0.7 USDC`);
  res.json({ message: "Premium Hoodie Order Placed! Transaction Successful." });
});


app.listen(4020, () => {
  console.log("⚡️ Merchant server running on http://localhost:4020");
});