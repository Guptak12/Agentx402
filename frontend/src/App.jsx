import React, { useState } from 'react';
import Chat from './components/Chat';
import Product from './components/Product';
import PaymentModal from './components/PaymentModal';
import { Bot, ShoppingBag } from 'lucide-react';

function App() {
  const [product, setProduct] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI shopping assistant. What kind of hoodie are you looking for today?", from: 'agent' }
  ]);

  // Function to handle the recommendation from the Chat component
  const handleRecommendation = (recommendedProduct) => {
    setProduct(recommendedProduct);
  };

  // Function to handle the checkout process through chat
  const handleCheckout = async (productToCheckout, userWalletAddress) => {
    setPaymentStatus('processing');
    
    // Add processing message to chat
    setMessages(prev => [...prev, {
      text: "🔄 Transferring to Payment Agent...\n\n💳 Hi! I'm the Payment Agent. I'll handle your secure transaction using the x402 protocol.",
      from: 'agent',
      agentType: 'payment'
    }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "⚡ Initiating x402 payment protocol...\n📡 Broadcasting transaction to Polygon network...",
        from: 'agent',
        agentType: 'payment'
      }]);
    }, 1000);
    
    try {
      const response = await fetch('http://localhost:5001/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...productToCheckout,
          walletAddress: userWalletAddress
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setPaymentStatus('success');
        
        // Extract transaction hash from the response
        const txHash = result.output ? extractTxHash(result.output) : null;
        
        setMessages(prev => [...prev, {
          text: `🎉 Payment successful! Your order has been placed successfully.\n\n📄 Transaction Details:\n• Product: ${productToCheckout.name}\n• Amount: ${productToCheckout.price} USDC\n• Network: Polygon Amoy${txHash ? `\n• Tx Hash: ${txHash}` : ''}\n\nThank you for your purchase!`,
          from: 'agent',
          agentType: 'payment'
        }]);
      } else {
        setPaymentStatus('failed');
        setMessages(prev => [...prev, {
          text: `❌ Payment failed. ${result.error || 'There was an issue processing your payment.'} Please try again.`,
          from: 'agent',
          agentType: 'payment'
        }]);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setPaymentStatus('failed');
      setMessages(prev => [...prev, {
        text: "❌ Network error. Please check your connection and try again.",
        from: 'agent',
        agentType: 'payment'
      }]);
    }
  };

  // Helper function to extract transaction hash from response
  const extractTxHash = (output) => {
    const txHashRegex = /0x[a-fA-F0-9]{64}/;
    const match = output.match(txHashRegex);
    return match ? match[0] : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-gray-900"></div>
      
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            AgentX402
          </h1>
          <p className="text-gray-400 text-lg max-w-md">
            Powered by intelligent agents and x402 micropayments
          </p>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-4xl">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
            {/* Chat Section */}
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Bot className="w-6 h-6 text-blue-500" />
                <span>Chat with AI Assistant</span>
              </h2>
              <Chat 
                onRecommendation={handleRecommendation}
                messages={messages}
                setMessages={setMessages}
                onCheckout={handleCheckout}
              />
            </div>

  );
}

export default App;
