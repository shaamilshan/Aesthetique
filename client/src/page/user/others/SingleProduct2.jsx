
import ProductCard2 from "@/components/Cards/ProductCard2";
import ProductSlider from "@/components/Others/ProductSlider";
import { Button } from "@/components/ui/button";
import { HomeIcon, Replace } from "lucide-react";
import React, { useState } from "react";
import { IoMdStar } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";

const SingleProduct2 = () => {
  const [toggleStates, setToggleStates] = useState({
    div1: false,
    div2: false,
    div3: false,
  });

  const handleClick = (div) => {  
    setToggleStates((prevState) => ({
      ...prevState,
      [div]: !prevState[div],
    }));
  };
  return (
    <div className="w-full flex flex-col  justify-start items-center   ">
      <div className="w-full flex my-6  ">
        <h1 className="flex justify-center items-center font-Inter px-5 lg:px-32">
          <span>
            <HomeIcon color="#2C2C2C" />
          </span>
          <span className="hover:text-[#CC4254] ml-2">Necklace</span>
          <span className="hover:text-[#CC4254] ml-2">Silver Temple Chain</span>
        </h1>
      </div>
      <div className="w-full  lg:px-20 justify-center">
        <div className="w-full my-2 flex flex-col  lg:flex-row ">
          <div className="w-full lg:w-1/2 lg:h-[650px] h-[400px] flex flex-col  ">
            {/* <img className="md:rounded-xl w-full max-h-[650px] object-cover" src="https://s3-alpha-sig.figma.com/img/62da/19c4/b2e856a52e09b9c6e5f3de84a81c2229?Expires=1717977600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=N-Qk8cNJAAiJjIUbdmZgKghe1Sas4832W6S5JMPAxDvo8vhTJUpCrXKvSZHSL~wG~eBB4ZP453Z27rJUrHIZe-ffpUnvI5pldgTT7cooktc3PaHYj3PITeU0T~haS4DgV0NKaAc7pO2r744JBjwUaTtZ8uzhrUNHPBEVL6zFs21cPZFpHyF6woLRDSf1vHRV0BKVeaiSPWb2EVaqhr5aZXLYQUMwStxs23eA67Vj5m6vzcAJDjZcIUgwDlGQEpaMVMmRiRr4Earu34~3icwRlZ9kcG439z-yVq5rnCG3vnsSkQbEYR-HeBrarJf6dLtTyaFbhgKCIX6tkDyPMM~YUg__" alt="" /> */}
            <ProductSlider />
          </div>
          <div className="mt-8 lg:mt-0 lg:w-1/2 px-8">
            <h1 className="text-[16px] lg:text-[30px] xl:text-[40px] font-light font-sans">
              Silver Temple Chain
            </h1>
            <div className=" flex text-[#CC4254]  mt-2">
              <IoMdStar className="h-5 w-5" />
              <IoMdStar className="h-5 w-5" />
              <IoMdStar className="h-5 w-5" />
              <IoMdStar className="h-5 w-5" />
              <IoMdStar className="h-5 w-5" />
            </div>
            <div className="flex w-full mt-1 lg:border-t-[1px] border-t-[#9F9F9F] lg:mt-6 pt-3">
              <h1 className="text-[16px] lg:text-[20px] xl:text-[30px] font-semibold font-Inter text-[#2C2C2C] ">
                ₹1,999
              </h1>
              <h1 className="text-[16px] lg:text-[20px] xl:text-[30px] font-light font-Inter text-[#949494] ml-3 ">
                ₹2,499
              </h1>
              <div className="ml-3 px-2 w-auto h-auto md:ml-4 bg-[#C84253]   rounded-[2px] text-white text-[12px] lg:text-[13px] flex justify-center items-center">
                50% OFF
              </div>
            </div>
            <div className="mt-1">
              <h1 className="text-[14px] lg:text-[16px] xl:text-[18px] font-light font-Inter text-[#C84253] ">
                Incl. of all taxes
              </h1>
            </div>
            <div className="w-full lg:hidden h-4 mt-2 bg-[#F7F7F7]"></div>
            <div className="w-full px-">
              <div className="w-full pt-3 font-Inter">
                <h1 className="text-[14px] lg:text-[18px] xl:text-[22px] font-light font-Inter ">
                  Select Size
                </h1>
                <div className="flex space-x-4 pt-1">
                  <div className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full border-[1px] border-[#777777] text-[14px] font-light">
                    S
                  </div>
                  <div className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full border-[1px] border-[#777777] text-[14px] font-light">
                    M
                  </div>
                  <div className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full border-[1px] border-[#777777] text-[14px] font-light">
                    L
                  </div>
                  <div className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full border-[1px] border-[#777777] text-[14px] font-light">
                    XL
                  </div>
                </div>
                <div className="flex items-center justify-center w-24 lg:w-[150px] lg:h-[50px] border mt-5 border-gray-300 rounded-md lg:mt-8">
                  <button className="w-8 h-8 text-lg flex items-center justify-center  lg:text-[25px] rounded-full mx-2">
                    -
                  </button>
                  <span className="text-lg font-medium mx-4 lg:text-[25px]">1</span>
                  <button className="w-8 h-8 text-lg lg:text-[25px] flex items-center justify-center  rounded-full mx-2">
                    +
                  </button>
                </div>
                <div className="w-full flex space-x-4 pt-8 ">
                  <div className="flex items-center  flex-col  ">
                    <ReplacementPolicy />
                    <h1 className="text-[#2C2C2C] text-[14px]">
                    7 Days Replacement 
                    </h1>
                  </div>
                  <div className="flex items-center  flex-col w-auto mb-0   ">
                    <FastDelivery className="mb-0" />
                    <h1 className="text-[#2C2C2C] text-[14px]">
                      Fast Delivery
                    </h1>
                  </div>
                </div>
                <div className="flex justify-ce space-x-2  w-full pt-10">
                  <Button className=" bg-[#CC4254] mt-3 w-1/2 md:w-auto h-12 rounded-[10px] font-Inter text-[16px] text-white px-10  ">
                    Add to Bag
                  </Button>
                  <Button className="  bg-white mt-3 w-1/2 md:w-auto h-12 rounded-[10px] font-Inter text-[16px] text-black px-10 border-[1px] border-[#777777] ">
                    Wishlist
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full h-4 mt-2 lg:hidden  bg-[#F7F7F7]"></div>
            <div className="w-full px-">
              <div
                className="flex items-center w-full h-[60px] pl-4 justify-between border-b-[#5F5F5F] border-b-[0.5px] cursor-pointer lg:mt-4"
                onClick={() => handleClick("div1")}
              >
                <h1 className="font-sans text-[16px] lg:text-[22px] font-light">
                  Product Discription
                </h1>

                <RiArrowDropDownLine
                  className={`text-4xl font-[100] transition-transform duration-300 ${
                    toggleStates.div1 ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
              <div
                className="flex items-center w-full h-[60px] pl-4 justify-between border-b-[#5F5F5F] border-b-[0.5px] cursor-pointer lg:mt-4"
                onClick={() => handleClick("div2")}
              >
                <h1 className="font-sans text-[16px] lg:text-[22px] font-light ">
                  Size & Material
                </h1>

                <RiArrowDropDownLine
                  className={`text-4xl font-[100] transition-transform duration-300 ${
                    toggleStates.div2 ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </div>
            <div
              className="flex items-center w-full h-[60px] pl-4 justify-between border-b-[#5F5F5F] border-b-[0.5px] cursor-pointer lg:mt-4"
              onClick={() => handleClick("div3")}
            >
              <h1 className="font-sans text-[16px] font-light lg:text-[22px] ">
                Shipping & Returns
              </h1>

              <RiArrowDropDownLine
                className={`text-4xl font-[100] transition-transform duration-300 ${
                  toggleStates.div3 ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </div>
        </div>
        <div className="w-full h-4 mt-2 bg-[#F7F7F7] lg:hidden "></div>

        <div></div>
      </div>
      <div className="flex flex-col w-full mt-2 px-5 lg:mt-20 lg:px-20">
        <h1 className="text-[16px] lg:text-[25px] lg:text-center xl:text-[30px] text-[#2C2C2C]">
          You may also like
        </h1>
        <div className="grid gap-4 mt-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <ProductCard2 />
          <ProductCard2 />
          <ProductCard2 />
          <ProductCard2 />
          <ProductCard2 />
          <ProductCard2 />
        </div>
      </div>
    </div>
  );
};

export default SingleProduct2;



function FastDelivery(props) {
    return (
      <svg
        width="36"
        height="30"
        viewBox="0 0 36 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 29.2V27.8H8.3V22.5H2V21.1H8.3V15.8H4.1V14.4H8.3V8.6L4.9 1.1L6.2 0.5L9.8 8.4H33.6L29.9 0.6L31.2 0L35.1 8.4V29.2H0ZM17.7 16.5H25.7C25.8983 16.5 26.0645 16.4327 26.1985 16.298C26.3328 16.1637 26.4 15.997 26.4 15.798C26.4 15.5993 26.3328 15.4333 26.1985 15.3C26.0645 15.1667 25.8983 15.1 25.7 15.1H17.7C17.5017 15.1 17.3353 15.1673 17.201 15.302C17.067 15.4363 17 15.603 17 15.802C17 16.0007 17.067 16.1667 17.201 16.3C17.3353 16.4333 17.5017 16.5 17.7 16.5Z"
          fill="#CC4254"
        />
      </svg>
    );
  }
  
  function ReplacementPolicy(props) {
    return (
      <svg
        width="41"
        height="46"
        viewBox="0 0 41 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.1177 33.7537V22.2255L11.0732 16.3928V26.7544C11.0732 27.1204 11.1643 27.4635 11.3466 27.7837C11.5288 28.104 11.7793 28.3556 12.0982 28.5386L21.1177 33.7537ZM22.0744 33.7537L31.0939 28.5386C31.4128 28.3556 31.6633 28.104 31.8455 27.7837C32.0277 27.4635 32.1189 27.1204 32.1189 26.7544V16.3928L22.0744 22.2255V33.7537ZM26.9599 18.2798L31.5722 15.6379L22.621 10.4571C22.3021 10.2741 21.9605 10.1826 21.596 10.1826C21.2316 10.1826 20.89 10.2741 20.5711 10.4571L17.0863 12.4814L26.9599 18.2798ZM21.596 21.402L26.0033 18.8288L16.0613 13.0647L11.654 15.6036L21.596 21.402Z"
          fill="#CC4254"
        />
        <path
          d="M29.7887 39.0964L30.1132 39.7725L29.7887 39.0964ZM32.4553 38.4046C32.5926 38.0138 32.3871 37.5857 31.9963 37.4484L25.6279 35.211C25.2371 35.0737 24.809 35.2792 24.6717 35.67C24.5344 36.0608 24.7399 36.4889 25.1307 36.6262L30.7915 38.615L28.8028 44.2758C28.6655 44.6666 28.871 45.0947 29.2618 45.232C29.6526 45.3693 30.0807 45.1638 30.218 44.773L32.4553 38.4046ZM39.0761 13.0013L38.3973 13.3203L39.0761 13.0013ZM3.48002 29.733L2.80127 30.0521L3.48002 29.733ZM12.7674 3.6379L13.092 4.31403L12.7674 3.6379ZM30.1132 39.7725L32.0723 38.8321L31.4231 37.4798L29.4641 38.4203L30.1132 39.7725ZM38.3973 13.3203L39.3217 15.287L40.6792 14.6489L39.7548 12.6822L38.3973 13.3203ZM2.80127 30.0521C7.62547 40.3153 19.8896 44.6802 30.1132 39.7725L29.4641 38.4203C19.9916 42.9674 8.62854 38.9232 4.15878 29.414L2.80127 30.0521ZM12.4429 2.96176C2.33636 7.81321 -1.96766 19.9064 2.80127 30.0521L4.15878 29.414C-0.259766 20.0137 3.72803 8.80903 13.092 4.31403L12.4429 2.96176ZM13.092 4.31403C22.5645 -0.233076 33.9275 3.8111 38.3973 13.3203L39.7548 12.6822C34.9306 2.41896 22.6665 -1.94592 12.4429 2.96176L13.092 4.31403Z"
          fill="#C84253"
        />
      </svg>
    );
  }