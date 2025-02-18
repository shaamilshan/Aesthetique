import React from "react";
import Nike from "../../assets/trendskart/home/nike.jpg";
import Adidas from "../../assets/trendskart/home/adidas.png";
import lv from "../../assets/trendskart/home/lv.jpg";
import asics from "../../assets/trendskart/home/asics.png";
import casio from "../../assets/trendskart/home/casio.png";
import converse from "../../assets/trendskart/home/converse.png";
import crocs from "../../assets/trendskart/home/crocs.png";
import newbalance from "../../assets/trendskart/home/newbalance.png";
import omega from "../../assets/trendskart/home/omega.png";

function LogoSlider() {
  const logos = [
    { id: 2, src: Adidas, alt: "Adidas" },
    { id: 4, src: asics, alt: "Asics" },
    { id: 5, src: casio, alt: "Casio" },
    { id: 1, src: Nike, alt: "Nike" },
    { id: 6, src: converse, alt: "Converse" },
    { id: 7, src: newbalance, alt: "New Balance" },
    { id: 3, src: lv, alt: "Louis Vuitton" },
    { id: 8, src: omega, alt: "Omega" },
  ];

  return (
    <div className="w-full bg-white p-4 my-1 hidden sm:block">
      {/* Hidden on mobile screens, visible from small screens upwards */}
      <div className="container mx-auto">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex space-x-4">
            {logos.map((logo) => (
              <div
                key={logo.id}
                className="flex items-center justify-center w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-28 lg:w-56 lg:h-32"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoSlider;
