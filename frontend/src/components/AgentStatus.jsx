import React from 'react';

function AgentStatus({ activeAgent }) {
  if (!activeAgent) return null;

  const getAgentInfo = (agent) => {
    switch (agent) {
      case 'recommender':
        return {
          name: 'Recommender Agent',
          description: 'Analyzing your request using Gemini AI',
          icon: '🧠',
          color: 'from-blue-500 to-purple-600'
        };
      case 'checkout':
        return {
          name: 'Checkout Agent',
          description: 'Processing payment through x402 protocol',
          icon: '💳',
          color: 'from-green-500 to-teal-600'
        };
      default:
        return {
          name: 'AI Agent',
          description: 'Working on your request',
          icon: '🤖',
          color: 'from-gray-500 to-gray-600'
        };
    }
  };

  const agentInfo = getAgentInfo(activeAgent);

  return (
    <div className="mb-6">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${agentInfo.color}`}>
            <span className="text-2xl">{agentInfo.icon}</span>
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-semibold">{agentInfo.name} Active</h3>
            <p className="text-gray-300 text-sm">{agentInfo.description}</p>
          </div>
          
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentStatus;