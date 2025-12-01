import React, { useEffect } from "react";
import aboutusimg from "../../assets/others/about.jpg";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = ({ id = "about2" }) => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="brand-story-section" id={id}>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="story-header text-center mb-8" data-aos="fade-up">
          <div className="story-subtitle text-sm uppercase text-[#A53030] font-semibold">Our Brand Story</div>
          <h1 className="story-title text-3xl sm:text-4xl md:text-5xl font-bold mt-2">Where Science Meets Care</h1>
          <p className="story-tagline text-gray-600 mt-3 max-w-2xl mx-auto">Every great journey begins with a single step — ours began with a simple yet powerful belief</p>
        </div>

        {/* Story Content */}
        <div className="story-content grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="story-text text-gray-700" data-aos="fade-right">
            <p className="mb-4">Skincare should be effective, uncomplicated, and trustworthy.</p>
            <p className="mb-4">We set out to create products that are more than just part of a routine — they're daily companions in your journey to healthy, radiant skin. Each formula is carefully designed to protect, repair, and restore balance, blending science with care to deliver results you can see and feel.</p>
            <p>For us, skincare is not about overwhelming shelves or confusing routines. It's about honest solutions that deliver real results. That's why we've invested time, research, and care into developing products that are safe, dermatologically tested, and designed to suit diverse skin types.</p>
          </div>

          <div className="story-image flex justify-center lg:justify-end" data-aos="fade-left">
            <img src={aboutusimg} alt="Best Med Aesthetique Story" className="w-full max-w-md rounded-lg shadow-md object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
