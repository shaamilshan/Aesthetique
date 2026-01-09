import React from "react";

// Flexible Modal: accepts either `tab` prop (legacy usage) or `children`.
// If `onClose` is provided, clicking the backdrop will call it.
const Modal = ({ tab, children, onClose }) => {
  const content = tab || children || null;

  return (
    <div
      className="w-full h-screen fixed top-0 left-0 z-50 bg-black/30 flex items-center justify-center supports-[backdrop-filter]:backdrop-blur-sm"
      style={{ backdropFilter: 'blur(6px)' }}
      onClick={(e) => {
        // Close when backdrop is clicked
        if (e.target === e.currentTarget && typeof onClose === "function") {
          onClose();
        }
      }}
    >
      <div className="relative max-w-xl w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg overflow-auto w-full">
          {typeof onClose === "function" && (
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute -top-3 -right-3 bg-white border rounded-full p-1 shadow hover:bg-gray-100"
              style={{ zIndex: 60 }}
            >
              ✕
            </button>
          )}
          <div className="p-4">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
