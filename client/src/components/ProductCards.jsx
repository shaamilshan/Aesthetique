import React from "react";
import { URL } from "../Common/api";
import { getImageUrl } from "../Common/functions";
import { Link } from "react-router-dom";

const ProductCards = ({ data }) => {
  return (
    <div className="flex-shrink-0 text-center">
      {/* smaller image on mobile, keep existing size from md and up */}
      <div className="w-44 h-44 md:w-56 md:h-56 mx-auto">
        <img
          className="h-full w-full object-contain"
          src={getImageUrl(data.imageURL, URL)}
          alt={data.name}
        />
      </div>
      <p className="text-orange-800 font-bold my-1 md:my-2 text-sm md:text-base">New</p>
      {/* reduce title size a bit on mobile */}
      <h1 className="text-xl md:text-2xl font-bold my-1 md:my-2 w-44 md:w-56 line-clamp-1">{data.name}</h1>
      <h2 className="my-1 md:my-2 text-sm md:text-base">From ₹{Number(data.price).toLocaleString()}</h2>
      <Link
        className="btn-blue-no-pad px-2 md:px-3 lg:px-12 py-1 text-white text-sm md:text-base"
        to="/login"
      >
        Buy
      </Link>
    </div>
  );
};

export default ProductCards;
