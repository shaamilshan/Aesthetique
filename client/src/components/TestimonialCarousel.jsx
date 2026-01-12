import React, { useState, useEffect, useMemo, useRef } from 'react';

const TestimonialCarousel = ({ testimonials = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const trackRef = useRef(null);

  const slideCount = testimonials.length;
  // For seamless looping we append a clone of the first slide at the end.
  const slides = slideCount > 1 ? [...testimonials, testimonials[0]] : testimonials;

  useEffect(() => {
    if (slideCount <= 1) return undefined;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 4000); // Change testimonial every 4 seconds

    return () => clearInterval(interval);
  }, [slideCount]);

  // When we reach the cloned slide (index === slideCount), snap back to 0
  // without transition so the loop appears seamless.
  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;

    const handleTransitionEnd = () => {
      if (currentIndex === slideCount && slideCount > 1) {
        setTransitionEnabled(false);
        // snap back to the real first slide
        setCurrentIndex(0);
        // re-enable transition on next tick
        setTimeout(() => setTransitionEnabled(true), 20);
      }
    };

    node.addEventListener('transitionend', handleTransitionEnd);
    return () => node.removeEventListener('transitionend', handleTransitionEnd);
  }, [currentIndex, slideCount]);

  const trackStyle = useMemo(() => ({
    width: `${slides.length * 100}%`,
    transform: `translateX(-${currentIndex * (100 / Math.max(slides.length, 1))}%)`,
    transition: transitionEnabled ? 'transform 500ms ease' : 'none',
  }), [currentIndex, slides.length, transitionEnabled]);

  return (
    <div className="absolute right-8 bottom-8 w-3/5 text-white">
      <div className="mb-4">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="opacity-90">
          <path d="M7 7h3v10H7zM14 7h3v10h-3z" fill="currentColor" />
        </svg>
      </div>

      {/* Sliding track - single visible slide, centered card to avoid overlap/peeking */}
      <div className="overflow-hidden">
        <div ref={trackRef} className="flex" style={trackStyle}>
          {slides.map((t, idx) => (
            // Each slide takes the full width of the visible area so adjacent slides
            // are hidden by overflow. The actual testimonial card inside is limited
            // with max-w so it appears centered and doesn't stretch edge-to-edge.
            <div key={idx} className="flex-shrink-0 w-full flex justify-center items-start">
              <div className="w-full max-w-xl bg-white/5 p-6 rounded-md shadow-md">
                <p className="text-lg leading-relaxed mb-4">"{t.quote}"</p>
                <p className="font-semibold">{t.author}</p>
                <p className="text-sm">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex mt-4 space-x-2">
        {testimonials.map((_, index) => {
          const activeIndex = slideCount > 0 ? (currentIndex % slideCount) : 0;
          return (
            <button
              key={index}
              onClick={() => {
                setTransitionEnabled(true);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TestimonialCarousel;