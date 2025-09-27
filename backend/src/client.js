// js-client/client.js
import axios from "axios";
import dotenv from "dotenv";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonAmoy } from "viem/chains";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read payment info from Python orchestrator
const paymentInfo = JSON.parse(fs.readFileSync(path.join(__dirname, "payment.json"), "utf-8"));

const account = privateKeyToAccount(process.env.CLIENT_PRIVATE_KEY);
const walletClient = createWalletClient({
  account,
  chain: polygonAmoy,
  transport: http(process.env.RPC_URL),
});

const api = withPaymentInterceptor(axios.create({ baseURL: "http://localhost:4020" }), walletClient);

async function main() {
  try {
    const response = await api.post("/buy-product", {
      productId: "Decentralized-Hoodie",
      amount: paymentInfo.amount.toString(), // 0.005 USDC
    });

    console.log("✅ Server Response:", response.data);

    if (response.headers["x-payment-response"]) {
      const paymentResp = decodeXPaymentResponse(response.headers["x-payment-response"]);
      console.log("💸 Payment Info:", paymentResp);
    }
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
}

main();
