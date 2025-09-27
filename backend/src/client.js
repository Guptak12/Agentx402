import axios from "axios";
import dotenv from "dotenv";
import { privateKeyToAccount } from "viem/accounts";
import {
  withPaymentInterceptor,
  decodeXPaymentResponse,
} from "x402-axios";

dotenv.config();

const baseURL = "http://localhost:4020";

// This is the wallet that will pay
const account = privateKeyToAccount(process.env.CLIENT_PRIVATE_KEY);

// Wrap axios with payment interceptor
const api = withPaymentInterceptor(axios.create({ baseURL }), account);

async function main() {
  try {
    const response = await api.post("/buy-product", {
      productId: "Decentralized-Hoodie",
      amount: "5000", // 50 USDC
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
