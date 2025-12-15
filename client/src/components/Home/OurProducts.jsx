import React, { useEffect, useState } from "react";
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

const OurProducts = ({ id }) => {
  const navigate = useNavigate();
  const { userProducts, loading } = useSelector((state) => state.userProducts);
  const dispatch = useDispatch();
  const [visibleProducts, setVisibleProducts] = useState(8);

  useEffect(() => {
    dispatch(getUserProducts(""));
  }, [dispatch]);

  const shuffledProducts = userProducts ? shuffleArray(userProducts) : [];

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 4, shuffledProducts.length));
  };
  
  return (  
    <section id={id} className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Split Layout like AboutUs */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start mb-8">
          {/* Left Column - Heading */}
          <div className="text-center lg:text-left">
            <button
              className="inline-flex items-center rounded-full border border-black/20 px-6 py-2.5 text-sm font-medium text-black hover:bg-black hover:text-white transition-colors mb-6"
              type="button"
            >
              Our Products
            </button>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Our <span className="font-serif italic">Premium</span> Skin Care Range
            </h1>
          </div>

          {/* Right Column - View All Products Button */}
          <div className="flex justify-center lg:justify-end items-center h-full">
            <button
              onClick={() => navigate('/collections')}
              className="bg-white text-black font-medium py-3 px-8 rounded-lg   hover:text-black transition-colors duration-300 "
            >
              View All Products
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <JustLoading size={10} />
          </div>
        ) : (
          <>
            {shuffledProducts && shuffledProducts.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
                    {shuffledProducts.slice(0, 8).map((product, index) => (
                      <div key={product._id || index} className="flex-none w-80">
                        <ProductCard2 product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-60 flex items-center justify-center bg-white/10 rounded-lg backdrop-blur-sm">
                <p className="text-white text-lg">No products available</p>
              </div>
            )}
          </>
        )}

        {/* <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate(`/collections`)}
            className="group flex items-center bg-[#C84332] py-3 px-6 rounded-lg text-white font-medium shadow-lg hover:bg-[#E55242] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E55242] focus:ring-opacity-50"
          >
            View all collections
            <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default OurProducts;