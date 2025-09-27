import React, { useState, useEffect } from 'react';
import Chat from './components/Chat';
import Product from './components/Product';
import PaymentModal from './components/PaymentModal';
import { Bot, ShoppingBag, Wallet, AlertCircle } from 'lucide-react';

function App() {
  const [product, setProduct] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI shopping assistant. What kind of hoodie are you looking for today?", from: 'agent', agentType: 'recommender' }
  ]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // Check wallet connection on component mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setMessages((prev) => [...prev, { 
        text: 'Please install MetaMask or another Web3 wallet to make payments.', 
        from: 'agent',
        agentType: 'checkout'
      }]);
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setIsWalletConnected(true);
        setWalletAddress(accounts[0]);
        
        setMessages((prev) => [...prev, { 
          text: `Wallet connected successfully!\n\nAddress: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}\nNetwork: Polygon Amoy`, 
          from: 'agent',
          agentType: 'recommender'
        }]);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setMessages((prev) => [...prev, { 
        text: 'Failed to connect wallet. Please try again.', 
        from: 'agent',
        agentType: 'recommender'
      }]);
    }
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
    setMessages((prev) => [...prev, { 
      text: 'Wallet disconnected successfully.', 
      from: 'agent',
      agentType: 'recommender'
    }]);
  };

  // Function to handle the recommendation from the Chat component
  const handleRecommendation = (recommendedProduct) => {
    setProduct(recommendedProduct);
  };

  // Function to handle the checkout process through chat
  const handleCheckout = async (productToCheckout, userWalletAddress) => {
    setPaymentStatus('processing');
    
    // Add processing message to chat
    setMessages(prev => [...prev, {
      text: "Transferring to Payment Agent...\n\nHi! I'm the Payment Agent. I'll handle your secure transaction using the x402 protocol.",
      from: 'agent',
      agentType: 'payment'
    }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Initiating x402 payment protocol...\nBroadcasting transaction to Polygon network...",
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
          text: `Payment successful! Your order has been placed successfully.\n\nTransaction Details:\n• Product: ${productToCheckout.name}\n• Amount: ${productToCheckout.price} USDC\n• Network: Polygon Amoy${txHash ? `\n• Tx Hash: ${txHash}` : ''}\n\nThank you for your purchase!`,
          from: 'agent',
          agentType: 'payment'
        }]);
      } else {
        setPaymentStatus('failed');
        setMessages(prev => [...prev, {
          text: `Payment failed. ${result.error || 'There was an issue processing your payment.'} Please try again.`,
          from: 'agent',
          agentType: 'payment'
        }]);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setPaymentStatus('failed');
      setMessages(prev => [...prev, {
        text: "Network error. Please check your connection and try again.",
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
        <div className="w-full max-w-6xl mb-8">
          <div className="flex justify-between items-start w-full mb-6">
            {/* Logo - Top Left */}
            <div className="flex items-center space-x-3">
              <img 
                src="/agentx402-logo.svg" 
                alt="AgentX402 Logo" 
                className="w-12 h-12 drop-shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                  AgentX402
                </h1>
                <p className="text-gray-400 text-sm">
                  AI Commerce Platform
                </p>
              </div>
            </div>
            
            {/* Wallet Connect Button - Top Right */}
            <button
              onClick={isWalletConnected ? disconnectWallet : connectWallet}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                isWalletConnected 
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300 hover:from-green-500/30 hover:to-emerald-500/30' 
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              {isWalletConnected ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </>
              )}
            </button>
          </div>
          
          {/* Centered Title and Subtitle */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              Conversational Commerce
            </h2>
            <p className="text-gray-400 text-lg">
              Powered by intelligent agents and x402 micropayments
            </p>
          </div>
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
                isWalletConnected={isWalletConnected}
                walletAddress={walletAddress}
                connectWallet={connectWallet}
              />
            </div>


          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>Secure payments powered by x402 • Multi-agent AI system</p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {paymentStatus && (
        <PaymentModal 
          status={paymentStatus} 
          onClose={() => setPaymentStatus('')}
        />
      )}
    </div>
  );
}

export default App;
