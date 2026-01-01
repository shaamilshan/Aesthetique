import React from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";
import { URL } from "@common/api";
import { getImageUrl } from "@/Common/functions";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const hasStrike = Number(product.markup) > 0 && Number(product.markup) > Number(product.price);
  const discountPercent = hasStrike
      ? Math.max(
          0,
          Math.round(
            ((Number(product.markup) - Number(product.price)) /
              Number(product.markup)) *
              100
          )
        )
      : 0;

  return (
    <div
      className="p-5 bg-white rounded-lg border border-gray-200 hover:shadow-lg cursor-pointer flex flex-col h-full"
      onClick={() => {
        navigate(`/product/${product._id}`);
      }}
    >
      <div className="overflow-hidden rounded-lg aspect-[4/3] w-full bg-gray-50 mb-4">
        <img
          src={getImageUrl(product.imageURL, URL)}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>
      {product.numberOfReviews > 0 ? (
        <RatingStars
          numberOfReviews={product.numberOfReviews}
          rating={product.rating}
        />
      ) : (
        <div className="h-9"></div>
      )}
      <p className="font-bold text-gray-800 line-clamp-2 flex-grow mb-2">{product.name}</p>
      <p className="font-semibold text-md text-blue-500">
        {hasStrike && (
          <span className="text-gray-500 line-through mr-2">
            ₹{Number(product.markup).toLocaleString()}
          </span>
        )}
        ₹{Number(product.price).toLocaleString()}
      </p>
      {discountPercent > 0 && (
        <p className="text-xs text-green-600 font-semibold mt-1">{discountPercent}% off</p>
      )}
    </div>
  );
};

export default ProductCard;
