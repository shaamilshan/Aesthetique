import React from "react";
import HeroVideo from "../../assets/others/herodesktop.mp4";

const videoSrc = HeroVideo;

function ImageSlider() {
  return (
    <div className="px-4 md:px-8 lg:px-12">
  {/* Mobile: full viewport height (vh). Larger screens use smaller vh percentages for better visual balance. */}
  <div className="relative h-screen sm:h-[70vh] lg:h-[85vh] w-full rounded-3xl overflow-hidden shadow-xl">
        <video
          src={videoSrc}
          className="h-full w-full object-cover object-[50%_20%]"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </div>
  );
}

export default ImageSlider;
