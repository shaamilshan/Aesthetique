import React from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";
import { URL } from "@common/api";
import { getImageUrl } from "@/Common/functions";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const discountPercent =
    product.markup && product.markup > product.price
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
      className="p-5 bg-white rounded-lg border border-gray-200 hover:shadow-lg cursor-pointer"
      onClick={() => {
        navigate(`/product/${product._id}`);
      }}
    >
      <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingTop: '100%' }}>
        <img
          src={getImageUrl(product.imageURL, URL)}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
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
      <p className="font-bold  text-gray-800 line-clamp-1">{product.name}</p>
      <p className="font-semibold text-md text-blue-500">
        {product.markup && product.markup > product.price && (
          <span className="text-gray-500 line-through mr-2">
            {product.markup}₹
          </span>
        )}
        {product.price}₹
      </p>
      {discountPercent > 0 && (
        <p className="text-xs text-green-600 font-semibold">{discountPercent}% off</p>
      )}
    </div>
  );
};

export default ProductCard;
