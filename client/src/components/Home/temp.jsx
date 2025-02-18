// NewArrivals.jsx
import React from 'react';
import { ChevronRight } from 'lucide-react'; // Assuming you're using lucide-react for icons

import pant from "../../assets/trendskart/products/pant.png";
import shirt from "../../assets/trendskart/products/shirt.png";
import tshirt from "../../assets/trendskart/products/t-shirt.png";
import tshirtorange from "../../assets/trendskart/products/t-shirt-orange.png";

const products = [
  {
    id: 1,
    name: 'T-shirt with Tape Details',
    image: pant,
    rating: 4.5,
    price: 120,
    discountedPrice: null,
    discount: null,
  },
  {
    id: 2,
    name: 'Skinny Fit Jeans',
    image: tshirt,
    rating: 3.5,
    price: 240,
    discountedPrice: 260,
    discount: 20,
  },
  {
    id: 3,
    name: 'Checkered Shirt',
    image: tshirtorange,
    rating: 4.5,
    price: 180,
    discountedPrice: null,
    discount: null,
  },
  {
    id: 4,
    name: 'Sleeve Striped T-shirt',
    image: shirt,
    rating: 4.5,
    price: 130,
    discountedPrice: 160,
    discount: 30,
  },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`h-4 w-4 ${
            index < Math.floor(rating) 
              ? 'text-yellow-400' 
              : index < rating 
                ? 'text-yellow-400' 
                : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating}/5</span>
    </div>
  );
};

const OurProducts = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <button className="flex items-center text-gray-600 hover:text-gray-900">
          View all
          <ChevronRight className="h-5 w-5 ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-gray-100 rounded-lg p-4">
            <div className="aspect-w-1 aspect-h-1 w-full mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover rounded-lg"
              />
            </div>
            <h3 className="font-semibold mb-2">{product.name}</h3>
            <StarRating rating={product.rating} />
            <div className="mt-2 flex items-center">
              <span className="text-lg font-bold">${product.price}</span>
              {product.discountedPrice && (
                <>
                  <span className="ml-2 text-gray-500 line-through">
                    ${product.discountedPrice}
                  </span>
                  <span className="ml-2 text-red-500">-{product.discount}%</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurProducts;