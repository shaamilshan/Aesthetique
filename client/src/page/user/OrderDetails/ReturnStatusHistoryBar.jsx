import React from "react";
import { TiTick } from "react-icons/ti";
import { BiDockLeft, BiPackage } from "react-icons/bi";
import { FaShippingFast, FaRegHandshake } from "react-icons/fa";

const StatusHistoryLoadingBar = ({ statusHistory }) => {
  const steps = [
    { key: "pending", name: "Order Placed", icon: <BiDockLeft /> },
    { key: "processing", name: "Packaging", icon: <BiPackage /> },
    { key: "shipped", name: "Shipped", icon: <FaShippingFast /> },
    { key: "delivered", name: "Delivered", icon: <FaRegHandshake /> },
  ];

  const statusIndexes = (statusHistory || [])
    .map((s) => steps.findIndex((st) => st.key === s.status))
    .filter((i) => i >= 0);

  const activeIndex = statusIndexes.length ? Math.max(...statusIndexes) : -1;

  const loadingPercentage = activeIndex >= 0 ? Math.round(((activeIndex + 1) / steps.length) * 100) : 0;

  return (
    <div className="relative h-24">
      <div className="flex justify-between w-full ">
        {steps.map((step, index) => (
          <div className=" flex flex-col items-center z-10" key={index}>
            <div
              key={index}
              className={`w-6 h-6  rounded-full flex justify-center items-center text-white ${
                  index <= activeIndex ? "bg-black" : "border-4 border-black bg-white"
                }`}
            >
              {index <= activeIndex && <TiTick />}
            </div>
            <span className="text-2xl text-black mt-3">{step.icon}</span>
            <p className="text-sm font-semibold">{step.name}</p>
          </div>
        ))}
      </div>
      <div className="w-full px-8 absolute top-2">
        <div className="h-2 bg-gray-200 rounded-md">
          <div
            className="h-2 rounded-md bg-black"
            style={{ width: `${loadingPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StatusHistoryLoadingBar;
