import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0); 

  return (
    <div className="flex flex-col">
      <main>
        <section className="relative bg-[#a43030] lg:h-[75vh] sm:h-[50vh] w-full overflow-hidden items-center justify-center">
          {/* Video background for mobile and desktop */}
          <div className="absolute inset-0 w-full h-full">
            {/* Mobile video */}
            <video 
              className="w-full h-full object-cover lg:hidden"
              src="/videos/hero.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
            />
            
            {/* Desktop video */}
            <video 
              className="w-full h-full object-cover hidden lg:block"
              src="/videos/herodesktop.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
            />
          </div>

          {/* Overlay to maintain text readability */}
          <div className="absolute inset-0 bg-black opacity-30"></div>

          {/* Navigation Buttons */}
          {/* <Button
            className="absolute z-10 left-5 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-transform hover:scale-110 opacity-70"
            size="icon"
            variant="ghost"
            onClick={() => {}}
          >
            <ChevronLeft className="h-8 w-8 text-black" />
          </Button>
          <Button
            className="absolute z-10 right-5 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-transform hover:scale-110 opacity-70"
            size="icon"
            variant="ghost"
            onClick={() => {}}
          >
            <ChevronRight className="h-8 w-8 text-black" />
          </Button> */}

          {/* Dots Navigation */}
          <div className="absolute bottom-6 w-full flex justify-center gap-2">
            <button
              className={`h-3 w-3 rounded-full transition-all ${
                0 === currentIndex
                  ? "bg-white scale-125 shadow-md"
                  : "bg-white opacity-50"
              }`}
              onClick={() => setCurrentIndex(0)}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default ImageSlider;