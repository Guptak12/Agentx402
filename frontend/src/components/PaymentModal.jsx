import React from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

function PaymentModal({ status, onClose }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: <Loader className="w-12 h-12 text-blue-500 animate-spin" />,
          title: 'Processing Payment',
          message: 'Preparing your order and processing payment via x402...',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/20'
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-500" />,
          title: 'Payment Successful!',
          message: 'Your order has been placed successfully. Thank you for your purchase!',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20'
        };
      case 'failed':
        return {
          icon: <XCircle className="w-12 h-12 text-red-500" />,
          title: 'Payment Failed',
          message: 'There was an issue processing your payment. Please try again.',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20'
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700">
        <div className={`flex flex-col items-center text-center p-6 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
          {config.icon}
          <h3 className="text-xl font-semibold text-white mt-4 mb-2">{config.title}</h3>
          <p className="text-gray-300 mb-6">{config.message}</p>
          {status !== 'processing' && (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;