import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { paymentMiddleware } from "x402-express";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const merchantWallet = process.env.MERCHANT_WALLET;

// x402 middleware: protects this endpoint
app.use(
  paymentMiddleware(
    merchantWallet,
    {
      "POST /buy-product": {
        price: "0.005", // 0.005 USDC in 6 decimals
        network: "polygon-amoy",
      },
    },
    { url: "https://x402.polygon.technology" }
  )
);

app.post("/buy-product", async (req, res) => {
  const { productId, amount } = req.body;
  console.log(`✅ Payment received for ${productId} of ${amount} USDC`);
  res.json({ message: "Order Placed! Transaction Successful." });
});

app.listen(4020, () => {
  console.log("⚡️ Merchant server running on http://localhost:4020");
});
