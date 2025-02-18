import { URL } from "@/Common/api";
import React from "react";
import { useNavigate } from "react-router-dom";

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`h-4 w-4 ${index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
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

const ProductCard2 = ({ product }) => {
  const navigate = useNavigate();
  const originalPrice = product.offer
    ? Math.round(product.price / (1 - product.offer / 100))
    : product.price;

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="cursor-pointer space-y-3    "
    >
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img
          src={`${URL}/img/${product?.imageURL}`}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105 "
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium uppercase tracking-wide">
          {product.name}
        </h3>
        {/* <p className="text-sm text-gray-600 line-clamp-2">
          {product.description ||
            "Contrary To Popular Belief, Lorem Ipsum Is Not Simply Random Text."}
        </p> */}
        <div className="flex items-center gap-[6px]">
          <span className="text-[11px] sm:text-[12px] lg:text-[18px] font-semibold line-through">
            {product.offer && (
              <>
               {product.offer} {/* ₹{originalPrice.toLocaleString()} */}
              </>
            )}
          </span>
          {product.offer && (

            <span className="text-[11px] sm:text-[12px] lg:text-[18px] text-gray-500">From</span>
          )}
          <span className="text-[11px] sm:text-[12px] lg:text-[18px] font-semibold text-red-500">
            ₹{product.price.toLocaleString()}
          </span>
          <div className="ml-2 px-1 w-auto h-auto md:ml-4 bg-[#C84253] rounded-[2px] text-white text-[10px] sm:text-[12px] lg:text-[13px] flex  justify-center items-center text-center">
            {product.offer && (
              <>
                {parseInt(((product.offer - product.price) * 100) / product.offer)}%Off
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductCard2;
