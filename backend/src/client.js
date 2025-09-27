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

console.log("🔧 Payment Configuration:");
console.log(`📦 Product ID: ${paymentInfo.productId}`);
console.log(`💰 Amount: ${paymentInfo.amount} USDC`);
console.log(`👛 Target Wallet: ${paymentInfo.walletAddress || 'Using default private key'}`);

// Use wallet address from frontend if provided, otherwise fallback to private key
let walletClient;
if (paymentInfo.walletAddress) {
  console.log("🌐 Using frontend wallet connection");
  // Note: In a real implementation, you'd need to handle wallet connection differently
  // For now, we'll still use the private key but acknowledge the wallet address
  const account = privateKeyToAccount(process.env.CLIENT_PRIVATE_KEY);
  walletClient = createWalletClient({
    account,
    chain: polygonAmoy,
    transport: http(process.env.RPC_URL),
  });
} else {
  console.log("🔑 Using private key from environment");
  const account = privateKeyToAccount(process.env.CLIENT_PRIVATE_KEY);
  walletClient = createWalletClient({
    account,
    chain: polygonAmoy,
    transport: http(process.env.RPC_URL),
  });
}

const api = withPaymentInterceptor(axios.create({ baseURL: "http://localhost:4020" }), walletClient);

async function main() {
  try {
    console.log("🚀 Initiating x402 payment...");
    
    const response = await api.post("/buy-product", {
      productId: paymentInfo.productId,
      amount: paymentInfo.amount.toString(),
    });

    console.log("✅ Server Response:", response.data);

    if (response.headers["x-payment-response"]) {
      const paymentResp = decodeXPaymentResponse(response.headers["x-payment-response"]);
      console.log("💸 Payment Response:", paymentResp);
      
      // Extract and display transaction hash if available
      if (paymentResp.txHash || paymentResp.transactionHash) {
        const txHash = paymentResp.txHash || paymentResp.transactionHash;
        console.log(`🔗 Transaction Hash: ${txHash}`);
        console.log(`🌐 View on PolygonScan: https://amoy.polygonscan.com/tx/${txHash}`);
      }
    }

    console.log("🎉 Payment completed successfully!");
    
  } catch (err) {
    console.error("❌ Payment Error:", err.response?.data || err.message);
    if (err.response?.status === 402) {
      console.error("💳 Payment Required - x402 protocol error");
    }
    throw err;
  }
}

main();
