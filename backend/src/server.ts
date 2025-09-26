import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import { paymentMiddleware, Resource } from "x402-express";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use(
  paymentMiddleware(
    "0xyour-receiving-wallet-address", // your receiving wallet
    {
      "GET /get-data": {
        price: "$0.001", // cost in USDC
        network: "polygon-amoy", // testnet network
      },
    },
    { url: "https://x402.polygon.technology" } // Facilitator URL
  )
);

app.get("/get-data", async (req: Request, res: Response) => {
  res.json({ message: "Data fetched successfully", data: "sample-data" });
});

app.listen(4020, () => {
  console.log(`⚡ Server running at http://localhost:4020`);
});