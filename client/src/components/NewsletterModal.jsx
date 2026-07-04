import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { HiX } from "react-icons/hi";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

// Import local image assets
import popup1 from "../assets/others/popup1.jpg";
import popup2 from "../assets/others/popup2.jpg";
import popup3 from "../assets/others/popup3.jpg";

const slides = [
  {
    image: popup1,
    headline: "SMARTER SKINCARE",
    subtitle: "FOR A BETTER YOU",
    description: "Unlock your skin's true potential. Subscribe now and get 15% OFF our bestselling Hyaluronic Boost Serum & Golden Glow MS Sunscreen.",
    features: ["15% Off Serum & Sunscreen", "Alkali & Paraben Free", "100% Vegan & Cruelty Free"],
    badge: "Limited Time Offer"
  },
  {
    image: popup2,
    headline: "GLOW MORE, SAVE MORE",
    subtitle: "PREMIUM BEAUTY DEALS",
    description: "Experience professional-grade skincare. Subscribe to claim 15% savings on Hyaluronic Boost Serum and Golden Glow MS Sunscreen.",
    features: ["Premium Ingredients", "Dermatologist Tested", "Free Shipping on Orders Over $50"],
    badge: "Exclusive Promo"
  },
  {
    image: popup3,
    headline: "FIRST PURCHASE BONUS",
    subtitle: "EXCLUSIVE INTRODUCTORY OFFER",
    description: "New to Aesthetique? Sign up today and enjoy a special 10% OFF coupon code on Hydraluxe Serum & Golden Glow CL Sunscreen!",
    features: ["10% Off First Purchase", "Hydraluxe Serum Deal", "Golden Glow CL Sunscreen Deal"],
    badge: "New Customer Gift"
  }
];

export default function NewsletterModal() {
  const [showModal, setShowModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fadeText, setFadeText] = useState(true);
  
  const location = useLocation();
  const slideTimerRef = useRef(null);

  // Exclude modal from admin and manager views
  const isAdminOrManager = 
    location.pathname.startsWith("/admin") || 
    location.pathname.startsWith("/manager");

  // Trigger modal display after a 3-second delay on mount
  useEffect(() => {
    if (isAdminOrManager) return;

    const modalTimer = setTimeout(() => {
      setShowModal(true);
    }, 3000);

    return () => clearTimeout(modalTimer);
  }, [isAdminOrManager]);

  // Handle auto-sliding every 3 seconds when modal is visible
  useEffect(() => {
    if (!showModal) {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
      return;
    }

    slideTimerRef.current = setInterval(() => {
      // Trigger text transition animation
      setFadeText(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setFadeText(true);
      }, 300); // match fade duration
    }, 3000);

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [showModal]);

  const handleDotClick = (index) => {
    if (index === currentSlide) return;
    
    // Clear auto-play timer on manual interaction and reset
    if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    
    setFadeText(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setFadeText(true);
    }, 300);

    // Restart slider interval
    slideTimerRef.current = setInterval(() => {
      setFadeText(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setFadeText(true);
      }, 300);
    }, 3000);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // Setup the template parameters matching their Contact template:
      // full_name, email, phone, message, submitted_at
      const templateParams = {
        full_name: "Newsletter Subscriber",
        email: email,
        phone: "N/A",
        message: `Newsletter subscription request from website.\n\nActive Promotion Slide: ${slides[currentSlide].headline} - ${slides[currentSlide].subtitle}\nOffer Selected: ${slides[currentSlide].description}`,
        submitted_at: new Date().toLocaleString()
      };

      await emailjs.send(
        "service_4fs8no7",      // Service ID
        "template_jtlajch",     // Template ID
        templateParams,
        "157EmcNlKJNcCyE25"     // Public Key
      );

      toast.success("Subscribed successfully! Welcome to Aesthetique.");
      setEmail("");
      setShowModal(false);
    } catch (err) {
      console.error("EmailJS Subscription Error:", err);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showModal || isAdminOrManager) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-fade-in">
      {/* Modal Container */}
      <div 
        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full flex flex-col md:flex-row min-h-[500px] border border-gray-100 transition-all duration-500 scale-95 md:scale-100"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)"
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 text-gray-500 hover:text-black hover:scale-110 bg-white/90 rounded-full p-2 shadow-md transition-all duration-200 focus:outline-none"
          aria-label="Close Newsletter Modal"
        >
          <HiX className="w-5 h-5" />
        </button>

        {/* Left Column: Interactive Subscription Form */}
        <div className="flex-[1.2] p-8 sm:p-12 flex flex-col justify-between text-left bg-white relative">
          
          {/* Header branding */}
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold tracking-widest text-gray-900 font-serif">
              AESTHETIQUE
            </h2>
            <p className="text-[10px] tracking-[0.2em] text-gray-400 font-bold uppercase mt-1">
              Canada's Premium Skincare
            </p>
          </div>

          {/* Dynamic Content Area */}
          <div className={`transition-all duration-300 transform flex-1 flex flex-col justify-center ${fadeText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
            
            <span className="inline-block bg-amber-100 text-amber-900 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase mb-3 w-fit">
              {slides[currentSlide].badge}
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 uppercase tracking-tight font-serif leading-tight mb-2">
              {slides[currentSlide].headline}
            </h3>
            
            <h4 className="text-sm font-semibold text-amber-700 tracking-wide mb-4">
              {slides[currentSlide].subtitle}
            </h4>

            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
              {slides[currentSlide].description}
            </p>

            {/* Micro-Features checklist */}
            <ul className="space-y-2 mb-6">
              {slides[currentSlide].features.map((feat, idx) => (
                <li key={idx} className="flex items-center text-xs font-semibold text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Subscription Input Form */}
          <div className="mt-4">
            <form onSubmit={handleSubscribe} className="space-y-3 w-full">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={isSubmitting}
                  className="w-full border border-gray-200 rounded-lg pl-4 pr-10 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all bg-gray-50/50"
                />
                <div className="absolute right-3.5 top-3.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-3 rounded-lg transition-all duration-200 text-xs sm:text-sm uppercase tracking-widest shadow-md hover:shadow-lg disabled:bg-gray-400 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4.5 w-4.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    SUBSCRIBING...
                  </span>
                ) : (
                  "SUBSCRIBE & UNLOCK DEALS"
                )}
              </button>
            </form>

            <p className="text-[9px] text-gray-400 mt-3.5 leading-relaxed text-center sm:text-left">
              By subscribing, you agree to receive marketing communications. Unsubscribe at any time. View our <a href="/return-policy" className="underline hover:text-black">Privacy & Policy</a>.
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center md:justify-start gap-2.5 mt-6">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                  index === currentSlide ? "w-7 bg-black" : "w-2.5 bg-gray-200 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>

        {/* Right Column: Sliding Image Carousel Panel */}
        <div className="hidden md:block md:w-[45%] relative overflow-hidden bg-zinc-50 border-l border-gray-100">
          <div 
            className="flex h-full w-full transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`
            }}
          >
            {slides.map((slide, index) => (
              <div 
                key={index} 
                className="w-full h-full shrink-0 relative select-none"
              >
                <img
                  src={slide.image}
                  alt={slide.headline}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Visual subtle overlay for dark/light contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
