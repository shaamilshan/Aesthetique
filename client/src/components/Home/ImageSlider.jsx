import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HomeImg from "../../assets/others/main-bg.jpg";
import Image2 from "../../assets/others/main-bg2.jpg";
// import Image3 from "../../assets/trendskart/home/1Artboard 3_2.jpg";

const images = [HomeImg ];

function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0); 
  const totalImages = images.length;

  // Prevent auto-slide if only one image exists
  useEffect(() => {
    if (totalImages <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalImages, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex flex-col">
      <main>
        <section  className="relative bg-[#a43030] lg:h-[75vh] sm:h-[50vh] w-full overflow-hidden items-center justify-center">
          <div className="relative h-full w-full">
            {/* Navigation Buttons */}
            {totalImages > 1 && (
              <>
                <Button
                  className="absolute z-10 left-5 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-transform hover:scale-110 opacity-70"
                  size="icon"
                  variant="ghost"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="h-8 w-8 text-black" />
                </Button>
                <Button
                  className="absolute z-10 right-5 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-transform hover:scale-110 opacity-70"
                  size="icon"
                  variant="ghost"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-8 w-8 text-black" />
                </Button>
              </>
            )}

            {/* Sliding Image Container */}
            <div className="h-full w-full overflow-hidden">
              <div
                className="flex h-full w-full transition-transform duration-500 ease-in-out whitespace-nowrap"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  // width: `${totalImages * 100}%`,
                }}
              >
                {images.map((image, index) => (
                  <img
                    key={index}
                    alt={`Slide ${index}`}
                    className="h-full w-full object-cover flex-shrink-0"
                    src={image}
                    style={{ maxWidth: "100%", height: "auto", objectFit: "" }}
                  />
                ))}
              </div>
            </div>

            {/* Dots Navigation */}
            {totalImages > 1 && (
              <div className="absolute bottom-6 w-full flex justify-center gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`h-3 w-3 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-white scale-125 shadow-md"
                        : "bg-white opacity-50"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ImageSlider;
