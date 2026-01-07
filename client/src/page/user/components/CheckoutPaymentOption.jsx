import React from "react";

const CheckoutPaymentOption = ({ selectedPayment, handleSelectedPayment }) => {

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
        <label className="cursor-pointer">
          <div className={`border p-4 rounded-lg hover:shadow-md transition-shadow flex items-start gap-3 ${selectedPayment === 'razorPay' ? 'ring-2 ring-black' : ''}`}>
            <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-md border">
              <img
                src="https://d6xcmfyh68wv8.cloudfront.net/assets/razorpay-glyph.svg"
                alt="Razor Pay Icon"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Razorpay</p>
              <p className="text-xs text-gray-500 mt-1">Pay securely using Razorpay</p>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMode"
                id="razorPay"
                value="razorPay"
                onChange={handleSelectedPayment}
                checked={selectedPayment === "razorPay"}
              />
            </div>
          </div>
        </label>

        {/* Wallet option removed */}
      </div>

      {/* Optional wallet display (kept commented out) */}
    </>
  );
};

export default CheckoutPaymentOption;
