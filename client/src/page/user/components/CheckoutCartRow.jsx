import React from "react";
import { URL } from "../../../Common/api";

const CheckoutCartRow = ({ item }) => {
  return (
    <div className="flex gap-2 items-center mb-3">
      <div className="w-9 h-9 shrink-0">
        <img
          src={`${URL}/img/${item.product.imageURL}`}
          alt="Product"
          className="h-full w-full object-contain"
        />
      </div>
      <div>
        <p className="text-sm font-semibold line-clamp-1">
          {item.product.name}
        </p>
        {/* Displaying attributes */}
        {item.attributes && (
          <div className="text-xs text-gray-500">
            {Object.entries(item.attributes).map(([key, value]) => (
              <p key={key}>
                <span className="font-medium">{key}:</span> {value}
              </p>
            ))}
          </div>
        )}
        <p className="text-sm text-gray-600 mt-1">
          {item.quantity} x{" "}
          <span className="font-semibold text-blue-500">
            {item.product.price + item.product.markup}₹
          </span>
        </p>
      </div>
    </div>
  );
};

export default CheckoutCartRow;
