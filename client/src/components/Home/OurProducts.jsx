import React, { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProducts } from "@/redux/actions/user/userProductActions";
import { useNavigate } from "react-router-dom";
import JustLoading from "../JustLoading";
import ProductCard2 from "../Cards/ProductCard2";

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const OurProducts = () => {
  const navigate = useNavigate();
  const { userProducts, loading } = useSelector((state) => state.userProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserProducts(""));
  }, [dispatch]);

  const shuffledProducts = userProducts ? shuffleArray(userProducts) : [];

  return (
    <div className="container mx-auto px-4 py-8" data-aos="fade-up">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl md:text-3xl font-bold">Our Products</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <JustLoading size={10} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {shuffledProducts && shuffledProducts.length > 0 ? (
            shuffledProducts.slice(0, 20).map((product, index) => (
              <ProductCard2 product={product} key={index} />
            ))
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p>Nothing to show</p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center mt-10">
        <div
          onClick={() => navigate(`/collections`)}
          className="flex items-center bg-[#C84332] py-3 px-4 rounded-md text-white hover:text-gray-200 cursor-pointer"
        >
          View all
          <ChevronRight className="h-5 w-5 ml-1" />
        </div>
      </div>
    </div>
  );
};

export default OurProducts;
