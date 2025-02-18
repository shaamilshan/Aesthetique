import React, { useState, useEffect } from "react";

const Marquee = () => {
  const texts = [
    "📢 Follow us on Instagram: @trend_kart_mukkam_",
    "🎉 Big Sale: Flat 50% off on selected items! 🛍️",
    "🚚 Free Shipping on all orders ",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [texts.length]);

  return (
    <div className="w-full text-xs bg-red-500 text-white py-2 overflow-hidden relative">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {texts.map((text, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full text-center font-semibold text-md"
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
