import React, { useState } from 'react';
import { Send, Bot, User, Loader, Wallet, CheckCircle } from 'lucide-react';

function Chat({ onRecommendation, messages, setMessages, onCheckout, isWalletConnected, walletAddress, connectWallet }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [awaitingPurchaseConfirmation, setAwaitingPurchaseConfirmation] = useState(false);
  const [awaitingWalletConnection, setAwaitingWalletConnection] = useState(false);
  const [currentAgent, setCurrentAgent] = useState('recommender'); // 'recommender', 'checkout', 'payment'



  const handleWalletConnectionForCheckout = async () => {
    await connectWallet();
    setAwaitingWalletConnection(false);
    
    // Check if wallet got connected and proceed with checkout
    setTimeout(() => {
      if (isWalletConnected && currentProduct) {
        setMessages((prev) => [...prev, { 
          text: `Now I'll process your order for ${currentProduct.name} (${currentProduct.price} USDC). Please approve the transaction in your wallet when prompted.`, 
          from: 'agent',
          agentType: 'checkout'
        }]);
        
        setTimeout(() => {
          onCheckout(currentProduct, walletAddress);
        }, 1000);
      }
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { text: prompt, from: 'user' }]);
    
    const currentPrompt = prompt.toLowerCase();
    setPrompt('');

    // Handle wallet connection prompt
    if (awaitingWalletConnection) {
      if (currentPrompt.includes('connect') || currentPrompt.includes('yes')) {
        await handleWalletConnectionForCheckout();
        return;
      } else if (currentPrompt.includes('no') || currentPrompt.includes('cancel')) {
        setAwaitingWalletConnection(false);
        setAwaitingPurchaseConfirmation(false);
        setCurrentAgent('recommender');
        setMessages((prev) => [...prev, { 
          text: 'No problem! Feel free to ask for other recommendations.', 
          from: 'agent',
          agentType: 'recommender'
        }]);
        return;
      }
    }

    // Check if user is confirming purchase
    if (awaitingPurchaseConfirmation && currentProduct) {
      if (currentPrompt.includes('yes') || currentPrompt.includes('buy') || currentPrompt.includes('purchase')) {
        setAwaitingPurchaseConfirmation(false);
        setCurrentAgent('checkout');
        
        // Transfer to checkout agent
        setMessages((prev) => [...prev, { 
          text: 'Transferring you to our Checkout Agent...\n\nHi! I\'m the Checkout Agent. I\'ll help you complete your purchase securely.', 
          from: 'agent',
          agentType: 'checkout'
        }]);
        
        setTimeout(() => {
          setMessages((prev) => [...prev, { 
            text: `Order Summary:\n• Product: ${currentProduct.name}\n• Price: ${currentProduct.price} USDC\n• Payment Method: x402 Protocol\n• Network: Polygon Amoy\n\nChecking for available coupons and discounts...`, 
            from: 'agent',
            agentType: 'checkout'
          }]);
        }, 1000);
        
        setTimeout(() => {
          if (!isWalletConnected) {
            setAwaitingWalletConnection(true);
            setMessages((prev) => [...prev, { 
              text: `No coupons found, but you're getting our best price!\n\nTo complete your payment, I need to connect to your Web3 wallet. This ensures secure, decentralized payments.\n\nWould you like to connect your wallet now? (Type 'connect' or 'yes')`, 
              from: 'agent',
              agentType: 'checkout'
            }]);
          } else {
            setMessages((prev) => [...prev, { 
              text: `No coupons found, but you're getting our best price!\n\nYour wallet is already connected (${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}). Processing your order now...`, 
              from: 'agent',
              agentType: 'checkout'
            }]);
            setTimeout(() => onCheckout(currentProduct, walletAddress), 1000);
          }
        }, 2500);
        
        return;
      } else if (currentPrompt.includes('no') || currentPrompt.includes('cancel')) {
        setAwaitingPurchaseConfirmation(false);
        setCurrentAgent('recommender');
        setMessages((prev) => [...prev, { 
          text: 'No problem! Feel free to ask for other recommendations.', 
          from: 'agent',
          agentType: 'recommender'
        }]);
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add agent response with full product details
        setMessages((prev) => [...prev, { 
          text: `Perfect! I found the ideal hoodie for you:\n\n${data.name}\nPrice: ${data.price} USDC\nDescription: ${data.description}\n\nThis hoodie is exactly what you're looking for! Would you like to purchase this item? Just say "yes" to buy it now!`, 
          from: 'agent',
          agentType: 'recommender'
        }]);
        onRecommendation(data);
        setCurrentProduct(data);
        setAwaitingPurchaseConfirmation(true);
      } else {
        setMessages((prev) => [...prev, { 
          text: 'Sorry, I encountered an issue while finding recommendations. Please try again.', 
          from: 'agent',
          agentType: 'recommender'
        }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { 
        text: 'Sorry, I had trouble connecting to my recommendation system. Please try again.', 
        from: 'agent',
        agentType: 'recommender'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAgentIcon = (agentType) => {
    switch (agentType) {
      case 'checkout':
        return <CheckCircle className="w-4 h-4 text-white" />;
      case 'payment':
        return <Wallet className="w-4 h-4 text-white" />;
      default:
        return <Bot className="w-4 h-4 text-white" />;
    }
  };

  const getAgentColor = (agentType) => {
    switch (agentType) {
      case 'checkout':
        return 'bg-green-500';
      case 'payment':
        return 'bg-purple-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getPlaceholder = () => {
    if (awaitingWalletConnection) {
      return "Type 'connect' to connect your wallet...";
    }
    if (awaitingPurchaseConfirmation) {
      return "Say 'yes' to buy or 'no' to cancel...";
    }
    return "Describe your ideal hoodie...";
  };

  return (
    <div className="flex flex-col h-96">
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} items-start space-x-2`}>
            {msg.from === 'agent' && (
              <div className={`w-8 h-8 ${getAgentColor(msg.agentType)} rounded-full flex items-center justify-center flex-shrink-0`}>
                {getAgentIcon(msg.agentType)}
              </div>
            )}
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              msg.from === 'user' 
                ? 'bg-blue-600 text-white rounded-br-sm' 
                : 'bg-gray-700 text-gray-100 rounded-bl-sm'
            }`}>
              {msg.agentType && msg.from === 'agent' && (
                <div className="text-xs text-gray-400 mb-1 capitalize">
                  {msg.agentType === 'recommender' ? 'Recommender Agent' : 
                   msg.agentType === 'checkout' ? 'Checkout Agent' : 
                   'Payment Agent'}
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
            </div>
            {msg.from === 'user' && (
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-start space-x-2">
            <div className={`w-8 h-8 ${getAgentColor(currentAgent)} rounded-full flex items-center justify-center`}>
              {getAgentIcon(currentAgent)}
            </div>
            <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-2xl rounded-bl-sm">
              <div className="flex items-center space-x-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm">Finding the perfect hoodie for you...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getPlaceholder()}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={isLoading}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-1"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;