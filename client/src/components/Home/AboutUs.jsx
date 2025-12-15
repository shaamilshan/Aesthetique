import React, { useEffect } from "react";
import aboutusimg from "../../assets/others/about.jpg";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = ({ id = "about2" }) => {
  useEffect(() => {
    AOS.init({ 
      duration: 1000,
      once: false,  // Allow animations to repeat
      mirror: true, // Reverse animation when scrolling back up
      offset: 200
    });
  }, []);

  return (
    <section className="brand-story-section" id={id}>
      <div className="px-4 md:px-8 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Text Content */}
          <div className="order-2 lg:order-1" 
               data-aos="fade-up"
               data-aos-delay="800"
               data-aos-duration="1000">
            <button
              className="inline-flex items-center rounded-full border border-black/20 px-6 py-2.5 text-sm font-medium text-black hover:bg-black hover:text-white transition-colors mb-6"
              type="button"
            >
              Our Brand Story
            </button>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Where <span className="font-serif italic">Science</span> Meets Care
            </h1>
            
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Every great journey begins with a single step — ours began with a simple yet powerful belief
            </p>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>Skincare should be <strong>effective, uncomplicated,</strong> and <strong>trustworthy</strong>. We set out to create products that are more than just part of a routine  they're daily companions in your journey to healthy, radiant skin. Each formula is carefully designed to protect, repair, and restore balance, blending science with care to deliver results you can see and feel.</p>
              <p>For us, skincare is not about overwhelming shelves or confusing routines. It's about honest solutions that deliver real results. That's why we've invested time, research, and care into developing products that are safe, dermatologically tested, and designed to suit diverse skin types.</p>
            </div>
          </div>

          {/* Right Column - Product Image */}
          <div className="order-1 lg:order-2 flex justify-center  lg:justify-end"
               data-aos="fade-up"
               data-aos-delay="200"
               data-aos-duration="1000">
            <img
              src={aboutusimg}
              alt="BM Aesthetique Golden Glow Products"
              className="w-full max-w-lg lg:max-w-xl object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
