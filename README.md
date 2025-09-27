# AgentX402: The Future of Conversational Commerce

**AgentX402 is a paradigm shift in e-commerce, moving from traditional point-and-click interfaces to a seamless, AI-driven conversational experience. This project demonstrates the power of a multi-agent system (AP2) combined with a decentralized micropayment protocol (x402) to create a truly interactive and intelligent shopping assistant.**

-----

## The Problem

The current e-commerce landscape, while vast, often presents a fragmented and overwhelming experience for consumers. Users are forced to navigate complex websites, apply multiple filters, and scroll through endless product listings to find what they're looking for. This process can be time-consuming, inefficient, and lacks the personalized touch of a real-world shopping assistant.

-----

## Introduction

AgentX402 reimagines the online shopping journey by introducing an AI-powered shopping assistant that understands natural language. Users can simply chat with the assistant, express their needs, and receive personalized product recommendations in a conversational manner. This not only simplifies the product discovery process but also makes it more engaging and intuitive.

-----

## How This Will Change the Future

x402 makes AI agents financially capable; AP2 makes them organizationally capable. Together, they unlock autonomous, AI-driven economies.

  - **AI-native commerce:** Agents can autonomously make decisions (find products, negotiate services, allocate resources) and seamlessly execute payments on-chain.
  - **Composable workflows:** With AP2, any workflow—whether shopping, SaaS subscriptions, cross-border remittances, or automated supply chains—can plug in x402 as a “payment agent,” turning ideas into executable actions.
  - **Decentralized trust layer:** Instead of relying on siloed payment processors, agents coordinate and settle value globally on Polygon, ensuring speed, transparency, and low fees
  - **Ecosystem impact**: This creates a new design space for developers—where multi-agent systems are not limited to information exchange, but extend to real-world financial execution.

-----

## Why AP2 with x402 is a Game Changer

The combination of a multi-agent system (AP2) and the x402 micropayment protocol is what makes AgentX402 truly innovative:

  - **Specialized Expertise:** The AP2 architecture allows for the creation of specialized agents, each an expert in its own domain (e.g., product recommendation, checkout, payment). This modular approach leads to a more robust and capable system.
  - **Decentralized and Secure Payments:** The x402 protocol enables secure and decentralized micropayments on the blockchain. This eliminates the need for traditional payment gateways, reduces transaction fees, and enhances user privacy.
  - **Seamless Integration:** The orchestrator seamlessly manages the interactions between the different agents and the user, creating a cohesive and unified experience.

-----

## Architecture Diagram

```
+-----------------+      +----------------------+      +------------------------+
|                 |      |                      |      |                        |
|  React Frontend |----->|  Backend Orchestrator|----->| Google Generative AI   |
| (User Interface)|      |      (Flask)         |      | (for conversational AI)|
|                 |      |                      |      |                        |
+-----------------+      +----------------------+      +------------------------+
      ^                            |
      |                            |
      v                            v
+-----------------+      +----------------------+      +------------------------+
|                 |      |                      |      |                        |
|  Web3 Wallet    |<-----|    Payment Agent     |      |  Merchant Server       |
| (e.g., MetaMask)|      |                      |----->|  (Express.js + x402)   |
|                 |      |                      |      |                        |
+-----------------+      +----------------------+      +------------------------+
```

-----

## Features

  - **Conversational Interface**: Engage with an AI shopping assistant to find the perfect product.
  - **Multi-Agent System**: The backend is powered by a Recommender Agent, a Checkout Agent, and a Payment Agent, each specializing in a specific task.
  - **x402 Micropayments**: Secure and decentralized payments are handled through the x402 protocol on the Polygon Amoy testnet.
  - **React Frontend**: A modern and responsive user interface built with React and Vite.
  - **Flask Backend**: The backend orchestrator is built with Flask, managing the agent interactions.
  - **Express Merchant Server**: A dedicated server to handle payment processing with x402 middleware.

-----

## Tech Stack

  - **Frontend**: React, Vite, Tailwind CSS, ethers.js
  - **Backend**: Python, Flask, Google Generative AI
  - **Merchant Server**: Node.js, Express.js
  - **Payment Protocol**: x402
  - **Blockchain**: Polygon Amoy Testnet

-----

## Getting Started

### Prerequisites

  - Node.js and npm
  - Python 3.x and pip
  - A Web3 wallet (e.g., MetaMask) configured for the Polygon Amoy testnet
  - An RPC URL for the Polygon Amoy testnet
  - A client private key for the wallet
  - A merchant wallet address

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/agentx402/agentx402.git
    cd agentx402
    ```

2.  **Install frontend dependencies:**

    ```bash
    cd frontend
    npm install
    ```

3.  **Install backend dependencies:**

    ```bash
    cd ../backend
    pip install -r requirements.txt
    npm install
    ```

4.  **Install merchant server dependencies:**

    ```bash
    cd ../merchant
    npm install
    ```

### Configuration

1.  Create a `.env` file in the `backend` directory with the following content:

    ```
    GEMINI_API_KEY=your_gemini_api_key
    CLIENT_PRIVATE_KEY=your_client_private_key
    RPC_URL=your_rpc_url
    ```

2.  Create a `.env` file in the `merchant` directory with the following content:

    ```
    MERCHANT_WALLET=your_merchant_wallet_address
    ```

### Running the Application

1.  **Start the merchant server:**

    ```bash
    cd merchant
    npm start
    ```

2.  **Start the backend server:**

    ```bash
    cd ../backend/ap2-orchestrator
    python run.py
    ```

3.  **Start the frontend development server:**

    ```bash
    cd ../../frontend
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

-----

## Usage

1.  Open the application in your browser.
2.  Connect your Web3 wallet.
3.  Interact with the AI assistant in the chat to get product recommendations.
4.  When you're ready to make a purchase, confirm in the chat.
5.  Approve the transaction in your wallet to complete the payment.

-----

## Contributing

Contributions are welcome\! Please follow these steps to contribute:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Make your changes.
4.  Commit your changes (`git commit -am 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature`).
6.  Create a new Pull Request.

-----

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
