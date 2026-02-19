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

        {/* Cash on Delivery Option — hidden for now */}
        {/* <label className="cursor-pointer">
          <div className={`border p-4 rounded-lg hover:shadow-md transition-shadow flex items-start gap-3 ${selectedPayment === 'cashOnDelivery' ? 'ring-2 ring-black' : ''}`}>
            <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-md border">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
                <circle cx="12" cy="15" r="2"></circle>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Cash on Delivery</p>
              <p className="text-xs text-gray-500 mt-1">Pay when your order is delivered</p>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMode"
                id="cashOnDelivery"
                value="cashOnDelivery"
                onChange={handleSelectedPayment}
                checked={selectedPayment === "cashOnDelivery"}
              />
            </div>
          </div>
        </label> */}
      </div>

      {/* Optional wallet display (kept commented out) */}
    </>
  );
};

export default CheckoutPaymentOption;
