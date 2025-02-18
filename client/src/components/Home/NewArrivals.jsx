import React, { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import ProductCard2 from "../Cards/ProductCard2";
import { useDispatch, useSelector } from "react-redux";
import { getUserProducts } from "@/redux/actions/user/userProductActions";
import { useNavigate, useSearchParams } from "react-router-dom";
import JustLoading from "../JustLoading";
import AOS from "aos";
import "aos/dist/aos.css";

const NewArrivals = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userProducts, loading } = useSelector((state) => state.userProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    AOS.init({
      duration: 800, // Animation duration in milliseconds
      once: true,    // Animation occurs only once
    });

    dispatch(getUserProducts(""));
    // dispatch(getUserProducts(searchParams));
  }, [searchParams, dispatch]);

  return (
   <div className="container mx-auto px-4 py-8" id="newArrival" data-aos="fade-up">
      <div className="flex items-center justify-between mb-8">
      <h1 className="text-xl md:text-3xl font-bold">New Arrivals</h1>

        <div
          onClick={() => navigate(`/collections`)}
          className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          View all
          <ChevronRight className="h-5 w-5 ml-1" />
        </div>
      </div>

      {loading ? (
        <div className="flex ju stify-center items-center h-96">
          <JustLoading size={10} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {userProducts && userProducts.length > 0 ? (
            userProducts.slice(0, 4).map((product, index) => (
              <ProductCard2 product={product} key={index} />
            ))
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p>Nothing to show</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewArrivals;
