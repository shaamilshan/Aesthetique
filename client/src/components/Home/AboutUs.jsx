import React, { useEffect, useState } from "react";
import aboutusimg from "../../assets/others/aboutus.png";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = ({ id }) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const shortText =
    "At Aesthetique, beauty is more than just a routine—it’s an experience. We believe in enhancing natural elegance through high-quality, luxurious cosmetics that empower you to look and feel your best.";
  const  fullText =
    " Our carefully curated collection is designed. Elevate your beauty. Redefine elegance. Experience Aesthetique.";

  return (
    <section className="container mx-auto px-4 py-12" id={id}>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Left Side (Text) */}
        <div data-aos="fade-right" className="lg:w-1/2 text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 relative inline-block">
            About Us
            <span className="block w-1/2 h-1 bg-[#A53030] mt-1"></span>
          </h2>

          <p className="text-gray-600 mt-4 text-sm sm:text-base">
            {shortText}
            {expanded && (
              <span className="inline">{fullText}</span>
            )}
          </p>

          {/* Read More / Less Button */}
          <button
            className="mt-4 px-5 py-2 text-sm font-medium text-[#A53030] border border-[#A53030] rounded-lg transition hover:bg-[#A53030] hover:text-white"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Read Less" : "Read More"}
          </button>
        </div>

        {/* Right Side (Image) */}
        <div data-aos="fade-left" className="lg:w-1/2 flex justify-end">
          <img
            src={aboutusimg}
            alt="About Us"
            className="w-full max-w-md rounded-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
