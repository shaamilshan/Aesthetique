import { URL } from "@/Common/api";
import React, { useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";

const ProductSlider = ({ images, selectedImageIndex, imgUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(selectedImageIndex); // Initialize with the selected index

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  // Update the current index when selectedImageIndex changes
  React.useEffect(() => {
    setCurrentIndex(selectedImageIndex);
  }, [selectedImageIndex]);

  return (
    // <div className="w-full h-full m-auto relative group">
 <div className="w-full h-full m-auto relative group">

      <div
        style={{
          
          backgroundImage: `url('${URL}/img/${images[currentIndex]}')`,
        }}
        className="w-full h-full bg-center bg-cover duration-500 lg:rounded-xl"
      ></div>

      {/* <div className="relative w-full" style={{ paddingBottom: "133.33%" }}>
        <div
          style={{
            // backgroundImage: `url('${URL}/img/${images[currentIndex]}')`,
            backgroundImage: `url('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1vYmlsZSUyMHBob25lfGVufDB8fDB8fHww')`,
          }}
          className="absolute top-0 left-0 w-full h-full bg-center bg-cover duration-500 lg:rounded-xl"
        ></div>
      </div> */}
      {/* <div className="relative w-full" style={{ paddingBottom: '133.33%' }}>
        <img
          // Uncomment the line below to use actual image URL
          // src={`${URL}/img/${images[selectedImageIndex]}`}
          src="https://via.placeholder.com/1024x768/eee?text=4:3"
          // src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1vYmlsZSUyMHBob25lfGVufDB8fDB8fHww"
          alt="Sample Image"
          className="absolute top-0 left-0 w-full h-full object-cover lg:rounded-xl"
          style={{ maxHeight: '300px' }}
        />
      </div> */}


      {/* Left Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactLeft onClick={prevSlide} size={30} />
      </div>
      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactRight onClick={nextSlide} size={30} />
      </div>
      <div className="flex top-4 justify-center py-2">
        {images.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className="text-2xl cursor-pointer"
          >
            <RxDotFilled className="text-[#CC4254]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;
