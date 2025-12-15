import React, { useState, useEffect } from 'react';

const TestimonialCarousel = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="absolute right-8 bottom-8 w-3/5 text-white">
      <div className="mb-4">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="opacity-90">
          <path d="M7 7h3v10H7zM14 7h3v10h-3z" fill="currentColor" />
        </svg>
      </div>
      <p className="text-lg leading-relaxed mb-4 transition-opacity duration-500">
        "{currentTestimonial.quote}"
      </p>
      <p className="font-semibold">{currentTestimonial.author}</p>
      <p className="text-sm">{currentTestimonial.title}</p>

      {/* Dots indicator */}
      <div className="flex mt-4 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;