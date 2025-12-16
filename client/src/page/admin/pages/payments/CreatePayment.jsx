import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";

const CreatePayment = () => {
  const navigate = useNavigate();

  return (
    <div className="p-5 w-full">
      <button
        className="mb-4 inline-flex items-center gap-2 text-sm text-gray-700"
        onClick={() => navigate(-1)}
      >
        <AiOutlineArrowLeft /> Back
      </button>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Create Order</h2>
        <p className="text-sm text-gray-600">
          This page is a placeholder for creating orders/payments. The full
          create-order flow is not implemented yet. You can wire a form here to
          call the server endpoint <code>POST /api/user/order</code> or the
          admin endpoint you prefer.
        </p>

        <div className="mt-6">
          <button
            onClick={() => navigate("/admin/payments")}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Go to Payments List
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePayment;
