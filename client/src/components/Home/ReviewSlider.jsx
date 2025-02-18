import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function ReviewSlider() {
  const reviews = [
    {
      name: 'Sarah M.',
      message: "I'm blown away by the quality and style of the clothes I received from ShopZoo. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
      rating: 5
    },
    {
      name: 'Alex K.',
      message: "Finding clothes that align with my personal style used to be a challenge until I discovered ShopZoo. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
      rating: 5
    },
    {
      name: 'James L.',
      message: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon ShopZoo. The selection of clothes is not only diverse but also on-point with the latest trends.",
      rating: 5
    },
    {
      name: 'James L.',
      message: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon ShopZoo. The selection of clothes is not only diverse but also on-point with the latest trends.",
      rating: 5
    },
  ];

  const settings = {
    dots: true,  // Remove pagination dots
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true, // Ensure cards are centered
    focusOnSelect: true, // Click to select the card
    draggable:true,
    arrows:false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, centerMode: true } },
      { breakpoint: 600, settings: { slidesToShow: 1, centerMode: true } },
    ],
  };

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <Header />
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <Review key={index} review={review} />
        ))}
      </Slider>
    </div>
  );
}

function Header() {
  return (
    <div className="text-center my-6">
      <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
        Our Happy Customers
      </h2>
    </div>
  );
}

function Review({ review }) {
  return (
    <div className="bg-gray-50 overflow-hidden shadow rounded-lg p-6 gap-3 flex flex-col h-full space-y-4 mx-2">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <img
            className="inline-block h-12 w-12 rounded-full"
            src={`https://ui-avatars.com/api/?name=${review.name}&background=0D8ABC&color=fff`}
            alt={review.name}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">{review.name}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500 flex-1">{review.message}</p>
      <div className="mt-4 flex items-center">
        {[...Array(review.rating)].map((_, i) => (
          <svg
            key={i}
            className="text-yellow-400 h-5 w-5 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

export default ReviewSlider;
