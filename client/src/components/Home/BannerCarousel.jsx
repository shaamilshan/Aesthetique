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

  // Use custom dot rendering so banner dots match the site's compact dot style
  // React-slick will add `slick-active` class to the corresponding li which we use
  // to style the active dot via Tailwind utility classes rendered here.
  settings.appendDots = (dots) => (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-30">
      <ul className="flex gap-2">{dots}</ul>
    </div>
  );

  settings.customPaging = (i) => (
    <button className="w-2.5 h-2.5 rounded-full bg-gray-300 hover:bg-gray-500 focus:outline-none" />
  );

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
