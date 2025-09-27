import axios from "axios";
import dotenv from "dotenv";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonAmoy } from "viem/chains";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";

dotenv.config();

const baseURL = "http://localhost:4020";

// 1️⃣ Create account from private key
const account = privateKeyToAccount(process.env.CLIENT_PRIVATE_KEY);

// 2️⃣ WalletClient for viem
const walletClient = createWalletClient({
  account,
  chain: polygonAmoy,
  transport: http(process.env.RPC_URL),
});

// 3️⃣ Axios with x402 interceptor
const api = withPaymentInterceptor(axios.create({ baseURL }), walletClient);

async function main() {
  try {
    const response = await api.post("/buy-product", {
      productId: "Decentralized-Hoodie",
      amount: ".005", // 0.005 USDC (6 decimals)
    });

    console.log("✅ Server Response:", response.data);

    if (response.headers["x-payment-response"]) {
      const paymentInfo = decodeXPaymentResponse(
        response.headers["x-payment-response"]
      );
      console.log("💸 Payment Info:", paymentInfo);
    }
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
}

main();
