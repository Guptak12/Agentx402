import React from 'react';
import { ShoppingBag } from 'lucide-react';

function Product({ product }) {
  if (!product) return null;

  return (
    <div className="mt-6 p-6 bg-gray-700 rounded-lg border border-gray-600">
      <div className="flex items-start space-x-4">
        <div className="w-24 h-24 bg-gray-600 rounded-lg flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-gray-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
          <p className="text-2xl font-bold text-green-400 mb-4">{product.price} USDC</p>
          <p className="text-gray-300 text-sm mb-4">Product ID: {product.productId}</p>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <span className="text-blue-400 text-sm">💬</span>
              <div className="text-xs text-blue-300">
                <p className="font-medium mb-1">Chat to Purchase:</p>
                <p>Say "yes" in the chat above to buy this item instantly with x402 protocol!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;