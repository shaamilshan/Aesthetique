import React from "react";
import ImageSlider from "@/components/Others/ImageSlider";
import FlashSaleBanner from "@/components/Others/FlashSaleBanner";
import RecentlyViewed from "@/components/Others/RecentlyViewed";
import HelahPromis from "@/components/Others/HelahPromis";
import BestSellers from "@/components/Others/BestSellers";
import ShopCatogories from "@/components/Others/ShopCatogories";

const Home = () => {
  return (
    <div>
      <div className="w-full flex h-[640px] bg-[#FFEFF1] md:py-11 md:px-20 justify-center">
        <ImageSlider />
      </div>
      <div className="mt-6">
        <FlashSaleBanner />
      </div>
      <div className="mt-8 lg:mx-16">
        <ShopCatogories />
      </div>
      {/* <div className="mt-8">
        <RecentlyViewed />
      </div> */}
      <div className="mt-8">
        <BestSellers />
      </div>
      <div className="sm:mt-24">
        <HelahPromis />
      </div>
    </div>
  );
};

export default Home;
