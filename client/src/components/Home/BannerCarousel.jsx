import React from 'react';
import Slider from 'react-slick';

export default function BannerCarousel({ images = [], alt = 'Banner', className = '' }) {
  if (!Array.isArray(images) || images.length === 0) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: false,
    pauseOnFocus: false,
    pauseOnDotsHover: false,
    arrows: false,
    adaptiveHeight: false,
  };

  return (
    <div className={className}>
      <Slider {...settings}>
        {images.map((src, i) => (
          <div key={i} className="w-full h-full">
            <img src={src} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover object-[50%_20%]" />
          </div>
        ))}
      </Slider>
    </div>
  );
}
