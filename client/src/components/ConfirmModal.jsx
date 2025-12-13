import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({ title, positiveAction, negativeAction, description, type = "warning" }) => {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="w-12 h-12 text-red-500" />;
      case "warning":
      default:
        return <AlertTriangle className="w-12 h-12 text-amber-500" />;
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case "danger":
        return {
          positive: "bg-black hover:bg-gray-800 text-white",
          negative: "bg-gray-100 hover:bg-gray-200 text-gray-700"
        };
      case "warning":
      default:
        return {
          positive: "bg-black hover:bg-gray-800 text-white",
          negative: "bg-gray-100 hover:bg-gray-200 text-gray-700"
        };
    }
  };

  const buttonStyles = getButtonStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={negativeAction}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
        {/* Close button */}
        <button
          onClick={negativeAction}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gray-50 rounded-full">
              {getIcon()}
            </div>
          </div>
          
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {title}
          </h2>
          
          {/* Description */}
          {description && (
            <p className="text-gray-600 mb-8 leading-relaxed">
              {description}
            </p>
          )}
          
          {/* Action buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-center">
            <button
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${buttonStyles.negative}`}
              onClick={negativeAction}
            >
              Cancel
            </button>
            <button
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${buttonStyles.positive}`}
              onClick={positiveAction}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
