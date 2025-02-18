import React from "react";
import { Button } from "@/components/ui/button";
import about1 from "../../../assets/trendskart/about/about1.jpg";
import about2 from "../../../assets/trendskart/about/about2.jpg";
import { useNavigate } from "react-router-dom";


const About = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 md:px-8">
      {/* Header Section */}
      <h1 className="text-4xl md:text-5xl text-[#2C2C2C] mb-12 text-center">About Us</h1>

      {/* Introduction Section */}
      <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-16">
        <div className="rounded-lg overflow-hidden w-[300px] h-[400px] md:w-[400px] md:h-[500px]">
          <img
            alt="Fashion"
            src={about1}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="max-w-md space-y-6 p-3">
          <h2 className="text-3xl md:text-4xl text-[#CC4254]">Upgrade Your Style with Trend Kart</h2>
          <p className="text-base md:text-lg font-light text-gray-700">
            Welcome to Trend Kart, your one-stop online shopping destination for high-quality, first-copy sneakers,
            t-shirts, pants, and more. We offer the latest trends in fashion at prices you can’t resist. Whether you’re
            looking to upgrade your wardrobe with stylish essentials or explore premium first-copy products, Trend Kart
            is here to redefine affordable luxury.
          </p>
          <Button
            className="bg-[#CC4254] w-full max-w-[230px] h-[52px] font-Inter text-lg hover:bg-[#973b47] text-white"
            onClick={() => navigate("/collections")}>
            Explore Collections
            </Button>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-[#FFEFF1] rounded-2xl p-8 md:p-16 mt-20 w-full">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div className="w-full space-y-6 text-right">
            <h2 className="text-3xl md:text-4xl text-[#CC4254] mb-6">Why Choose Trend Kart?</h2>
            <p className="text-base md:text-lg font-light text-gray-700">
              At Trend Kart, we believe in offering the best of both worlds — style and affordability. Specializing in
              premium first-copy products, we deliver exceptional quality and design that mirror your favorite
              international and local brands. Experience fashion excellence at prices that won’t break the bank.
            </p>
            <Button className="bg-[#CC4254] w-full max-w-[230px] h-[52px] font-Inter text-lg hover:bg-[#973b47] text-white"
            onClick={() => navigate("/")}>
              Shop Now
              
            </Button>
          </div>
          <div className="flex justify-center">
            <img
              alt="Trend Kart Products"
              src={about2}
              className="rounded-lg w-[300px] md:w-[350px] lg:w-[400px] object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto py-16 text-center">
        <h2 className="text-3xl md:text-4xl text-[#2C2C2C] mb-8">Our Mission</h2>
        <p className="text-base md:text-lg font-light text-gray-700 max-w-3xl mx-auto">
          At Trend Kart, our mission is simple: to bring premium fashion within reach of everyone. We are dedicated to
          providing first-copy products that deliver the same style and feel as high-end brands, empowering you to shop
          confidently and affordably. With Trend Kart, elevate your wardrobe without compromise.
        </p>
      </div>

      {/* Join Community Section */}
      <div className="text-center mt-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#CC4254] mb-4">Join the Trend Kart Community</h2>
        <p className="text-base md:text-lg font-light text-gray-700">
          Stay updated with our latest collections, exclusive offers, and fashion tips. Follow us on social media and
          subscribe to our newsletter today.
        </p>
      </div>
    </div>
  );
};

export default About;
