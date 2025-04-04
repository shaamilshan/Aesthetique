import { useState, useEffect } from "react";
import bgImage from "../../assets/others/butterfly.png";

const testimonials = [
  {
    name: "Ramesh",
    role: "Co-founder of Forpeople",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Gokul Sahaya",
    role: "Design director of Perfect Illustration",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Abhay",
    role: "Sr. Designer",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

export default function TestimonialSection({ id }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile view on mount and window resize
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeIndex]);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section
      className="relative px-4 sm:px-8 md:px-12 py-16 md:py-0 my-0 rounded-3xl mx-auto max-w-5xl text-center min-h-screen flex items-center justify-center bg-center bg-contain bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
      id={id}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-60 rounded-3xl"></div>

      <div className="relative z-10 w-full py-8">
        {/* Title and Description */}
        <h2 data-aos="fade-up" className="text-xs sm:text-sm text-gray-500 uppercase">Our Client</h2>
        <h3 data-aos="fade-up" className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Testimonial</h3>
        <p data-aos="fade-up" className="text-gray-600 mt-3 text-xs sm:text-sm max-w-lg mx-auto px-4">
          When applied to building block a website or similar work product, a Visual Guide can be an intermediate step toward the end goal of a complete website. By creating a visual guide along the way, the designer or developer can get input from the other people involved in the website such as the customer, their manager, and other members of the team.
        </p>

        {/* Testimonials - Show only active card on mobile, all on desktop */}
        <div data-aos="fade-up" className="mt-8 flex overflow-hidden justify-center gap-2 sm:gap-4">
          {isMobile ? (
            // Mobile view - only show active testimonial
            <div
              className="transition-all duration-500 p-4 rounded-xl bg-gray-100 flex items-center gap-4 w-full max-w-xs mx-auto shadow-md"
            >
              <img 
                src={testimonials[activeIndex].image} 
                alt={testimonials[activeIndex].name} 
                className="w-12 h-12 rounded-full object-cover" 
              />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">{testimonials[activeIndex].name}</h4>
                <p className="text-sm text-red-500">{testimonials[activeIndex].role}</p>
              </div>
            </div>
          ) : (
            // Desktop view - show all testimonials
            testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-500 p-4 rounded-xl bg-gray-100 flex items-center gap-4 w-64 ${
                  activeIndex === index ? "scale-105 shadow-md" : "opacity-60"
                }`}
              >
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover" 
                />
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-red-500">{testimonial.role}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Progress Indicator */}
        <div className="relative mt-6 w-full max-w-lg mx-auto h-1 bg-gray-300 rounded-full">
          <div
            className="absolute top-0 left-0 h-1 bg-red-500 rounded-full transition-all duration-500"
            style={{ width: `${((activeIndex + 1) / testimonials.length) * 100}%` }}
          ></div>
        </div>

        {/* Navigation Dots for Mobile */}
        {isMobile && (
          <div className="flex justify-center mt-4 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  activeIndex === index ? "bg-red-500" : "bg-gray-300"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full w-10 h-10 flex items-center justify-center transform transition-transform hover:scale-110"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
          >
            <span className="transform rotate-180">➜</span>
          </button>
          
          <button
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center transform transition-transform hover:scale-110"
            onClick={nextTestimonial}
            aria-label="Next testimonial"
          >
            ➜
          </button>
        </div>
      </div>
    </section>
  );
}