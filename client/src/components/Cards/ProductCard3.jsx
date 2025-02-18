import { URL } from "@/Common/api";
import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

const ProductCard3 = ({ item }) => {
  return (
    <div
      className="w-full max-w-[264px] min-h-[250px] sm:h-96 flex flex-col rounded-lg py-6 bg-cover items-center justify-between"
      style={{ backgroundImage: `url('${URL}/img/${item.imgURL}')` }}
    >
      <div className="text-[20px] sm:text-[24px] md:text-[30px] text-white text-center">
        {item.name}
      </div>
      <div>
        <Link to={`/collections?category=${item._id}`}>
          <Button className="bg-transparent border-[1px] mt-3 sm:w-[176px] sm:h-[62px] rounded-[5px] font-Inter text-[16px] sm:text-[20px] hover:opacity-100 hover:bg-white hover:text-[#2C2C2C] text-white">
            {/* <Link to={`/collections?category=${item._id}`}> */}
            View
            {/* </Link> */}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard3;
