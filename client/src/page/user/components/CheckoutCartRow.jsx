import React from "react";
import { URL } from "../../../Common/api";

const CheckoutCartRow = ({ item }) => {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center border">
        <img
          src={`${URL}/img/${item.product.imageURL}`}
          alt="Product"
          className="h-full w-full object-contain"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold line-clamp-2 text-gray-800">
          {item.product.name}
        </p>

        {item.attributes && (
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
            {Object.entries(item.attributes).map(([key, value]) => (
              <span key={key} className="bg-gray-100 px-2 py-1 rounded text-xs">
                <span className="font-medium">{key}:</span> {value}
              </span>
            ))}
          </div>
        )}

      </div>

      <div className="text-right min-w-[72px]">
        <div className="text-sm text-gray-600">{item.quantity} x</div>
        {(() => {
          const strike = item.product.originalPrice ?? item.product.markup ?? null;
          const hasStrike = strike && Number(strike) > Number(item.product.price);
          return (
            <div className="text-sm font-semibold text-gray-900">
              ₹{Number(item.product.price).toLocaleString()}
              {hasStrike && (
                <span className="text-xs text-gray-500 line-through ml-2">₹{Number(strike).toLocaleString()}</span>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default CheckoutCartRow;
