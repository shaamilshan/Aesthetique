import React from "react";
import { FaInstagram } from "react-icons/fa";
import instabanner from "../../assets/trendskart/home/instabannerbg.jpg";

const BannerSection = () => {
  return (
    <section className="flex flex-col md:flex-row w-full h-auto md:h-[300px] overflow-hidden ">
      {/* Left Side - Image */}
      <div className="w-full md:w-1/2 h-[200px] md:h-full">
        <img
          src={instabanner}
          alt="Instagram banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Content */}
      <div className="w-full md:w-1/2 bg-gray-50 flex flex-col justify-center items-center md:items-start text-center md:text-left p-4 md:p-8 space-y-4">
        <h2 className="text-xl md:text-3xl font-semibold text-gray-800">
          @TREND_KART_MUKKAM_
        </h2>
        <p className="text-sm md:text-lg text-gray-600">
          Follow us on Instagram
        </p>
        <a
          href="https://www.instagram.com/trend_kart_mukkam_?igsh=MWVoZGQzczNvMWRpcA%3D%3D&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="px-5 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition-all flex items-center gap-2">
            <FaInstagram className="text-lg" />
            Follow Us
          </button>
        </a>
      </div>
    </section>
  );
};

export default BannerSection;
