import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { paymentMiddleware } from "x402-express";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const merchantWallet = process.env.MERCHANT_WALLET;

// Product pricing configuration
const productPrices = {
  "Decentralized-Hoodie": "0.005",
  "Premium-Hoodie": "0.007", 
  "Budget-Hoodie": "0.003"
};

// Create separate x402 protected endpoints for each product
app.use(
  "/buy-budget",
  paymentMiddleware(
    merchantWallet,
    {
      "POST /buy-budget": {
        price: "0.003",
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
        price: "0.005",
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
        price: "0.007",
        network: "polygon-amoy",
      },
    },
    { url: "https://x402.polygon.technology" }
  )
);

// Generic buy-product endpoint that routes to specific endpoints
app.post("/buy-product", async (req, res) => {
  const { productId, amount } = req.body;
  
  // Route to appropriate endpoint based on product
  let targetEndpoint;
  switch(productId) {
    case "Budget-Hoodie":
      targetEndpoint = "/buy-budget";
      break;
    case "Decentralized-Hoodie":
      targetEndpoint = "/buy-classic";
      break;
    case "Premium-Hoodie":
      targetEndpoint = "/buy-premium";
      break;
    default:
      return res.status(400).json({ error: "Unknown product" });
  }
  
  // Forward the request to the appropriate protected endpoint
  req.url = targetEndpoint;
  req.originalUrl = targetEndpoint;
  app.handle(req, res);
});

// Handlers for each product endpoint
app.post("/buy-budget", async (req, res) => {
  console.log(`✅ Payment received for Budget-Hoodie of 0.003 USDC`);
  res.json({ message: "Budget Hoodie Order Placed! Transaction Successful." });
});

app.post("/buy-classic", async (req, res) => {
  console.log(`✅ Payment received for Decentralized-Hoodie of 0.005 USDC`);
  res.json({ message: "Classic Hoodie Order Placed! Transaction Successful." });
});

app.post("/buy-premium", async (req, res) => {
  console.log(`✅ Payment received for Premium-Hoodie of 0.007 USDC`);
  res.json({ message: "Premium Hoodie Order Placed! Transaction Successful." });
});

app.listen(4020, () => {
  console.log("⚡️ Merchant server running on http://localhost:4020");
});
