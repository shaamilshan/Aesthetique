import React, { useEffect, useState } from "react";
import HeroVideo from "../../assets/banner/herovideo2.mp4";
import MobileHero from "../../assets/banner/mobhom.mp4";

function ImageSlider() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Use a media query that matches the Tailwind `sm` breakpoint (640px)
    const mq = window.matchMedia("(max-width: 639px)");

    const handle = (e) => setIsMobile(e.matches);

    // Set initial
    setIsMobile(mq.matches);

    // Listen for changes
    if (mq.addEventListener) {
      mq.addEventListener("change", handle);
    } else if (mq.addListener) {
      mq.addListener(handle);
    }

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", handle);
      } else if (mq.removeListener) {
        mq.removeListener(handle);
      }
    };
  }, []);

  // Choose a mobile-optimized video on small screens instead of just resizing the desktop video.
  const videoSrc = isMobile ? MobileHero : HeroVideo;

  return (
    <div className="px-4 md:px-8 lg:px-12 mt-4 sm:mt-0">
      {/* Mobile: let the video determine height so there is no letterboxing; on larger screens keep a fixed vh height */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-xl bg-transparent">
        <div className="sm:h-[70vh] lg:h-[85vh] w-full">
          <video
            src={videoSrc}
            className={isMobile ? "w-full h-auto block" : "w-full h-full object-cover block"}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      </div>
    </div>
  );
}

export default ImageSlider;
