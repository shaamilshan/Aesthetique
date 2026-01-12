import React from "react";

// Flexible Modal: accepts either `tab` prop (legacy usage) or `children`.
// If `onClose` is provided, clicking the backdrop will call it.
const Modal = ({ tab, children, onClose }) => {
  const content = tab || children || null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center supports-[backdrop-filter]:backdrop-blur-sm p-4"
      style={{ backdropFilter: "blur(6px)" }}
      onClick={(e) => {
        // Close when backdrop is clicked
        if (e.target === e.currentTarget && typeof onClose === "function") {
          onClose();
        }
      }}
    >
      {/* Dialog: constrain width and height so content is centered and scrollable on small screens */}
      <div className="relative w-full max-w-3xl max-h-[90vh] mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full h-full">
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
          {/* Make inner area scrollable when content exceeds max height */}
          <div className="p-4 overflow-auto max-h-[90vh]">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
