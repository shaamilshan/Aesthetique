import React, { useEffect } from "react";
import { BiWallet } from "react-icons/bi";
import { FaMoneyBillWave } from "react-icons/fa";
import axios from "axios";
import { URL } from "../../../Common/api";
import { config } from "../../../Common/configurations";

const CheckoutPaymentOption = ({
  selectedPayment,
  handleSelectedPayment,
  walletBalance,
  setWalletBalance,
}) => {
  useEffect(() => {
    const fetchWalletBalance = async () => {
      const { data } = await axios.get(`${URL}/user/wallet-total`, config);

      setWalletBalance(data.balance);
    };
    fetchWalletBalance();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
        <label className="cursor-pointer">
          <div className={`border p-4 rounded-lg hover:shadow-md transition-shadow flex items-start gap-3 ${selectedPayment === 'cashOnDelivery' ? 'ring-2 ring-black' : ''}`}>
            <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-md border">
                <FaMoneyBillWave className="text-2xl" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Cash On Delivery</p>
              <p className="text-xs text-gray-500 mt-1">Pay with cash upon delivery</p>
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
        </label>
        {/* <label className="cursor-pointer" htmlFor="razorPay">
          <div className="border-r px-5 flex flex-col items-center">
            <div className="w-10 h-10">
              <img
                src="https://d6xcmfyh68wv8.cloudfront.net/assets/razorpay-glyph.svg"
                alt="Razor Pay Icon"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="mb-2 text-sm">Razor Pay</p>
            <input
              type="radio"
              name="paymentMode"
              id="razorPay"
              value="razorPay"
              onChange={handleSelectedPayment}
              checked={selectedPayment === "razorPay"}
            />
          </div>
        </label> */}
        {/* <label className="cursor-pointer" htmlFor="myWallet">
          <div className="flex items-center">
            <div className="px-5 flex flex-col items-center">
              <div className="w-10 h-10 flex items-center justify-center">
                <BiWallet className="text-2xl" />
              </div>
              <p className="mb-2 text-sm">My Wallet</p>
              <input
                type="radio"
                name="paymentMode"
                id="myWallet"
                value="myWallet"
                onChange={handleSelectedPayment}
                checked={selectedPayment === "myWallet"}
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
