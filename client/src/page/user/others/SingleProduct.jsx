import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import ProductCard2 from "@/components/Cards/ProductCard2";
import ProductSlider from "@/components/Others/ProductSlider";
import { IoMdStar } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import JustLoading from "@/components/JustLoading";
import ImageZoom from "@/components/ImageZoom";
import Quantity from "../components/Quantity";
import DescReview from "../components/DescReview";
import { URL } from "@/Common/api";
import { addToWishlist } from "@/redux/actions/user/wishlistActions";
import { config } from "@/Common/configurations";
import ProductDetailsStarAndRating from "../components/ProductDetailsStarAndRating";
import { addToBuyNowStore } from "@/redux/reducers/user/buyNowSlice";
import { getUserProducts } from "@/redux/actions/user/userProductActions";

import redbanner from "../../../assets/trendskart/home/red-banner.jpg";
import { FaShareAlt } from "react-icons/fa";
import "./singleproduct.css";
import { useMediaQuery } from 'react-responsive'; 

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [currentImage, setCurrentImage] = useState("");

  const {
    userProducts,
    loadingproducts,
    errorproducts,
    totalAvailableProducts,
  } = useSelector((state) => state.userProducts);
  const [searchParams, setSearchParams] = useSearchParams();

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [count, setCount] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [toggleStates, setToggleStates] = useState({
    div1: false,
    div2: false,
    div3: false,
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const filteredProducts = userProducts?.filter(
    (product) => product._id !== id
  );




  const handleShare = async () => {
    const currentUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: currentUrl,
        });
        console.log('Content shared successfully');
      } catch (error) {
        console.error('Error sharing content:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(currentUrl).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
          console.log('URL copied to clipboard');
        },
        (error) => {
          console.error('Error copying URL to clipboard:', error);
        }
      );
    }
  };



  const dispatchAddWishlist = () => {
    if (!user) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      navigate("/login");
      return;
    }
    dispatch(addToWishlist({ product: id }));
  };

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${URL}/user/product/${id}`, {
        withCredentials: true,
      });
      if (data) {
        setProduct(data.product);
        console.log("data.product", data.product);
        setLoading(false);
        setCurrentImage(data.product.imageURL);
        // Set default selected attributes to the first value of each attribute
        const defaultAttributes = {};
        data.product.attributes.forEach((attribute) => {
          if (attribute.value) {
            defaultAttributes[attribute.name] = attribute.value; // Set first value as default
          }
        });
        setSelectedAttributes(defaultAttributes); // Update state with default attributes
      }
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 100,
      behavior: "smooth",
    });

    dispatch(getUserProducts(searchParams));

    loadProduct();
  }, [id]);

  const increment = async () => {
    const { data } = await axios.get(
      `${URL}/user/product-quantity/${id}`,
      config
    );
    if (data.stockQuantity > count) {
      setCount((c) => c + 1);
    } else {
      toast.error("Quantity Insufficient");
    }
  };

  const decrement = () => {
    if (count > 1) {
      setCount((c) => c - 1);
    }
  };

  const { user } = useSelector((state) => state.user);

  // const addToCart = async () => {
  //   if (!user) {
  //     window.scrollTo({
  //       top: 0,
  //       behavior: "smooth",
  //     });
  //     navigate("/login");
  //     return;
  //   }
  //   setCartLoading(true);
  //   await axios
  //     .post(
  //       `${URL}/user/cart`,
  //       { product: id, quantity: count },
  //       { ...config, withCredentials: true }
  //     )
  //     .then((data) => {
  //       toast.success("Added to cart");
  //       setCartLoading(false);
  //     })
  //     .catch((error) => {
  //       const err = error.response.data.error;
  //       toast.error(err);
  //       setCartLoading(false);
  //     });
  // };

  const onHomeClick = async () => {
    navigate("/");
  };
  const onCategoryClick = async () => {
    navigate(`/collections?category=${product.category._id}`);
  };

  const notifyManager = async (productid,name,value) => {
    // if (!user) {
    //   window.scrollTo({
    //     top: 0,
    //     behavior: "smooth",
    //   });
    //   navigate("/login");
    //   return;
    // }
    // setCartLoading(true);
    try {

      const userConfirmed = window.confirm(`Request for ${name} : ${value} product ${product.name} `);
      if (userConfirmed) {
      await axios.get(`${URL}/manager/notify/${id}/${name}/${value}`, config);
      toast.success(`Notified `);
    }

    } catch (error) {
      const err = error.response.data.error;
      toast.error(err);
    }
    // setCartLoading(false);
  };

  const validateAttributesSelection = () => {
    for (const attribute in selectedAttributes) {
      if (!selectedAttributes[attribute]) {
        return false; // If any attribute is not selected, return false
      }
    }
    return true; // All attributes are selected
  };

  const addToCart = async () => {
    if (!user) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      navigate("/login");
      return;
    }
    // Validate attribute selections
    if (!validateAttributesSelection()) {
      toast.error("Please select a value for each attribute.");
      return; // Prevent adding to cart if validation fails
    }
    setCartLoading(true);
    try {
      await axios.post(
        `${URL}/user/cart`,
        {
          product: id,
          quantity: count,
          attributes: selectedAttributes, // Pass selected attributes here
        },
        { ...config, withCredentials: true }
      );
      toast.success("Added to cart");
      
    } catch (error) {
      const err = error.response.data.error;
      toast.error(err);
    }
    setCartLoading(false);
  };
  const buyNow = async () => {
    if (!user) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      navigate("/login");
      return;
    }
    // Validate attribute selections
    if (!validateAttributesSelection()) {
      toast.error("Please select a value for each attribute.");
      return; // Prevent adding to cart if validation fails
    }
    setCartLoading(true);
    try {
      await axios.post(
        `${URL}/user/cart`,
        {
          product: id,
          quantity: count,
          attributes: selectedAttributes, // Pass selected attributes here
        },
        { ...config, withCredentials: true }
      );
      // toast.success("Added to cart");
      navigate("/cart");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      const err = error.response.data.error;
      toast.error(err);
    }
    setCartLoading(false);
  };

  const { wishlist } = useSelector((state) => state.wishlist);
  const isProductInWishlist = wishlist.some((item) => item.product._id === id);

  const handleClick = (div) => {
    setToggleStates((prevState) => ({
      ...prevState,
      [div]: !prevState[div],
    }));
  };

  const groupAttributes = (attributes) => {
    return attributes.reduce((acc, attribute) => {
      acc[attribute.name] = acc[attribute.name] || [];
      acc[attribute.name].push({
        value: attribute.value,
        imageIndex: attribute.imageIndex, // Include imageIndex
        quantity: attribute.quantity, // Include imageIndex
      });
      return acc;
    }, {});
  };

  const [selectedAttributes, setSelectedAttributes] = useState({});

  const handleSelectAttribute = (attributeName, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value === prev[attributeName] ? null : value, // Toggle selection
    }));

    const selectedAttribute = product.attributes.find(
      (attr) => attr.name === attributeName && attr.value === value
    );

    if (selectedAttribute) {
      const imageIndex = selectedAttribute.imageIndex; // Get imageIndex
      if (imageIndex !== undefined) {
        setSelectedImageIndex(imageIndex); // Set selected image index
      }
    }
  };

  // Combine the base image and more images
  const imageArray = product.moreImageURL
    ? [product.imageURL, ...product.moreImageURL]
    : [product.imageURL];

  const isOutOfStock = product.stockQuantity === 0;
  console.log(product);
  const isMobile = useMediaQuery({ maxWidth: 767 }); // Use this to check if the device is mobile

  return (
    <div className="w-full flex flex-col justify-start items-center">
       {/* Fixed bottom panel for mobile devices */}
       {isMobile && (
        <div className="fixed-bottom-panel">
          <button
            className="buy-now-btn"
            onClick={buyNow}
            disabled={cartLoading || isOutOfStock}
          >
            {cartLoading ? "Loading" : isOutOfStock ? "Notify Me" : "Buy Now"}
          </button>
          <button
            className="wishlist-btn"
            onClick={addToCart}
            disabled={isProductInWishlist}
          >
            {isProductInWishlist ? "Added to Cart" : "Add to Cart"}
          </button>
          {/* <button className="share-btn" onClick={handleShare}>
            {copied ? "Link Copied!" : "Share"}
          </button> */}
        </div>
      )}
      
      <div className="container w-full flex my-6 px-4">
        <h1 className="flex justify-center items-center font-Inter px-5 pl-2 sm:pl-12 md:pl-0 lg:pr-32 ">
          <span className="text-[10px] sm:text-sm">
            <HomeIcon
              color="#2C2C2C"
              onClick={onHomeClick}
              size={14}
              // style={{ fontSize: "1em" }} // Adjusts icon size based on text size
              className="text-xs sm:text-sm" // Adjusts icon size based on screen size
            />
          </span>
          <span
            className="hover:text-[#CC4254] ml-2 text-[10px] sm:text-sm"
            onClick={onCategoryClick}
          >
            {product.category && product.category.name + " -"}
          </span>
          {" >"}
          <span className="hover:text-[#CC4254] ml-2 text-[10px] sm:text-sm">
            {product.name}
          </span>
        </h1>
      </div>

      <div className="w-full lg:px-20 justify-center">
        <div className="w-full my-2 flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 lg:h-[750px] h-[700px] flex flex-col">
            <ProductSlider
              images={imageArray}
              selectedImageIndex={selectedImageIndex}
              imgUrl={`${URL}/img/${selectedImageIndex}`}
            />
            <br />

            {/* Product Images */}
            <div className="lg:w-1/2 bg-white p-5 rounded flex flex-col items-center h-fit">
              {/* <div className="w-80 h-80 lg:w-96 lg:h-96 hidden lg:block">
                {currentImage && (
                  <ImageZoom
                    imageUrl={`${URL}/img/${currentImage}`}
                    width={400}
                    zoomedValue={820}
                    zoomedWidth={500}
                  />
                )}
              </div> */}
              {/* <div className="w-80 lg:w-96 lg:h-96 lg:hidden mx-auto">
                {currentImage && (
                  <img
                    src={`${URL}/img/${currentImage}`}
                    alt="Product"
                    className="w-60 h-60 object-cover"
                  />
                )}
              </div> */}

              <div className="flex gap-1 lg:gap-5 mt-5 justify-center sm:ml-20">
                {product.moreImageURL &&
                  product.moreImageURL.map((image, i) => (
                    <div
                      key={i}
                      className={`flex justify-center items-center w-12 h-12 lg:w-20 lg:h-20 overflow-clip border p ${
                        currentImage === image
                          ? "border-gray-500"
                          : "border-gray-300"
                      } hover:border-gray-500 cursor-pointer `}
                      onClick={() => setSelectedImageIndex(i + 1)}
                    >
                      <img
                        className="w-full h-full object-contain"
                        key={i}
                        src={`${URL}/img/${image}`}
                      />
                    </div>
                  ))}
              </div>
            </div>
            {/* Product Details */}
          </div>
          <div className="mt-4 lg:mt-0 lg:w-1/2 px-8">
            <h1 className="text-[24px] font-semibold lg:text-[30px] xl:text-[40px]  font-sans">
              {product.name}
            </h1>
            <div className="flex w-full mt-1 lg:border-t-[1px] border-t-[#9F9F9F] lg:mt-6 pt-3">
              <h1 className="text-[16px] lg:text-[20px] xl:text-[30px] font-semibold font-Inter text-[#2C2C2C] ">
                ₹ {product.price}
              </h1>
              {product.offer && (
                <>
                  <h1 className="text-[16px] lg:text-[20px] xl:text-[30px] font-light font-Inter text-[#949494] ml-3 line-through">
                    ₹ {product.offer}
                  </h1>
                  <div className="ml-3 px-2 w-auto h-auto md:ml-4 bg-[#C84253] rounded-[2px] text-white text-[12px] lg:text-[13px] flex justify-center items-center">
                    {parseInt(
                      ((product.offer - product.price) * 100) / product.offer
                    )}{" "}% Off
                  </div>
                </>
              )}
            </div>
            <div className="mt-1">
              <h1 className="text-[14px] lg:text-[16px] xl:text-[18px] font-light font-Inter text-[#C84253] ">
                Incl. of all taxes
              </h1>
            </div>
            <div className="w-full lg:hidden h-4 mt-2 bg-[#F7F7F7]"></div>
            <div className="w-full px-">
              <div className="w-full pt-3 font-Inter">
                {/* <div className="w-full pt-3 font-Inter">
                  <h1 className="text-[14px] lg:text-[18px] xl:text-[22px] font-light font-Inter">
                    Select Size
                  </h1>
                  <div className="flex space-x-4 pt-1">
                    {["S", "M", "L", "XL"].map((size) => (
                      <div
                        key={size}
                        className={`cursor-pointer flex items-center justify-center w-12 h-12 rounded-full border-[1px] text-[14px] font-light transition duration-200 ${
                          product.selectedSize === size
                            ? "border-[#CC4254] bg-[#FEE4E4] text-[#CC4254]"
                            : "border-[#777777] text-black hover:bg-[#F7F7F7]"
                        }`}
                        onClick={() =>
                          setProduct((prev) => ({
                            ...prev,
                            selectedSize: size,
                          }))
                        }
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div> */}

                {product.attributes &&
                  Object.entries(groupAttributes(product.attributes)).map(
                    ([name, values], index) => (
                      <div key={index} className="mt-4">
                        <p className="font-semibold text-gray-500 text-sm mb-1">
                          {console.log("testing")}
                          {console.log(values)}
                          {name.toUpperCase()}{" "}
                        </p>
                        <div className="grid gap-2 grid-cols-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-10">
                          {values.map(
                            ({ value, imageIndex, quantity }, valueIndex) => (
                              <>
                                {quantity > 0 ? (
                                  <p
                                    key={valueIndex}
                                    className={`flex justify-center items-center py-2 my-2 px-2 rounded-full cursor-pointer 
               transition-colors duration-300 
               ${
                 selectedAttributes[name] === value
                   ? "bg-[#C84253]   text-white text-sm text-center px-4 py-4 " // Selected state
                   : "bg-[white] text-[#C84253] text-sm text-center  border px-4 py-4 border-[#C84253] hover:bg-blue-100"
               } // Default and hover states
             `}
                                    onClick={() =>
                                      handleSelectAttribute(name, value)
                                    }
                                    style={{
                                      // background: quantity <= 0 ? "gray" : "white",
                                      cursor:
                                        quantity <= 0
                                          ? "not-allowed"
                                          : "pointer",
                                    }}
                                    disabled={quantity <= 0} // Disable the button if out of stock
                                  >
                                    {value}{" "}
                                    {/* {imageIndex !== undefined && `(${imageIndex})`}{" "} */}
                                    {/* Display imageIndex next to value */}
                                  </p>
                                ) : (
                                  <p
                                    key={valueIndex}
                                    className={`flex justify-center items-center text-sm text-center py-2 my-2 px-2 rounded-full cursor-pointer 
              transition-colors duration-300 
              ${
                selectedAttributes[name] === value
                  ? "bg-blue-600 text-white" // Selected state
                  : "bg-gray-200 text-black hover:bg-blue-100"
              } // Default and hover states
            `}
                                    // onClick={() => console.log(name, value,"notifying.......")}
                                    onClick={() => notifyManager(product._id,name, value)}
                                    style={{
                                      background:
                                        quantity <= 0 ? "gray" : "white",
                                      // cursor:
                                      //   quantity <= 0
                                      //     ? "not-allowed"
                                      //     : "pointer",
                                    }}
                                    // disabled={quantity <= 0} // Disable the button if out of stock
                                  >
                                    {value}{" "}
                                    {/* {imageIndex !== undefined && `(${imageIndex})`}{" "} */}
                                    {/* Display imageIndex next to value */}
                                  </p>
                                )}
                              </>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )}

                <div className="flex items-center justify-center w-24 lg:w-[150px] lg:h-[50px] mt-5 border-gray-300 rounded-md lg:mt-8">
                  <Quantity
                    count={count}
                    decrement={decrement}
                    increment={increment}
                  />
                </div>
                <div className="w-full flex justify-start pt-8">
                  <div className="flex items-center flex-col text-center">
                    <div className="flex items-center justify-center h-12 w-12 mb-2">
                      <ReplacementPolicy className="h-full w-full" />
                    </div>
                    <h1 className="text-[#2C2C2C] text-[16px] font-semibold w-32">
                      3 Days Easy Replacement
                    </h1>
                  </div>
                  <div className="flex items-center flex-col text-center">
                    <div className="flex items-center justify-center h-12 w-12 mb-2">
                      <FastDelivery className="h-full w-full" />
                    </div>
                    <h1 className="text-[#2C2C2C] text-[16px] font-semibold w-32">
                      Fast Delivery
                    </h1>
                  </div>
                </div>
               
                <div className="flex justify-start space-x-2 w-full pt-10">

  {!isOutOfStock && !isMobile && (
    
   <button
  className="bg-[#CC4254] mt-3 w-1/2 md:w-auto hover:bg-white hover:outline hover:text-[#CC4254] hover:outline-[#CC4254] h-12 rounded-[10px] font-Inter text-[16px] text-white px-10"
   onClick={buyNow}
   disabled={cartLoading || isOutOfStock}
 >
   {cartLoading ? "Loading" : isOutOfStock ? "Notify Me" : "Buy Now"}
 </button>
  )}
  {!isOutOfStock && (
    <Button
      disabled={cartLoading}
      onClick={addToCart}
      className="hover:bg-[#CC4254] mt-3 w-1/2 md:w-auto bg-white outline text-[#CC4254] outline-[#CC4254] h-12 rounded-[10px] font-Inter text-[16px] hover:text-white px-10"
    >
      {cartLoading ? "Loading" : "Add to Cart"}
    </Button>
  )}
  {isOutOfStock && (
    <Button
      disabled={cartLoading}
      onClick={notifyManager}
      className="bg-[#b3cc42] mt-3 w-1/2 md:w-auto h-12 rounded-[10px] font-Inter text-[16px] text-white px-10"
    >
      {cartLoading ? "Loading" : "Notify Me"}
    </Button>
  )}

  {isProductInWishlist ? (
    <Button className="bg-white mt-3 h-12 rounded-full font-Inter text-[16px] text-[#CC4254] border-[1px] border-[#CC4254] flex items-center justify-center">
      <AiFillHeart className="text-2xl" />
    </Button>
  ) : (
    <Button
      onClick={dispatchAddWishlist}
      className="bg-white mt-3 hover:bg-[#CC4254] hover:text-white hover:border-[#CC4254] h-12 rounded-full font-Inter text-[16px] text-red-500 border-[1px] border-red-500 flex items-center justify-center"
    >
      <AiOutlineHeart className="text-2xl" />
    </Button>
  )}

  <Button
    onClick={handleShare}
    className="bg-white mt-3 text-center hover:text-white hover:bg-green-500 h-12 rounded-full font-Inter text-[16px] text-green-500 border-[1px] border-green-500 flex items-center justify-center"
  >
    <FaShareAlt className="text-xl" />
  </Button>
</div>

              </div>
            </div>
            <div className="w-full h-4 mt-2 lg:hidden bg-[#F7F7F7]"></div>
            <div className="w-full px-">
              <div
                className="flex items-center w-full h-[60px] pl-4 justify-between border-b-[#5F5F5F] border-b-[0.5px] cursor-pointer lg:mt-4"
                onClick={() => handleClick("div1")}
              >
                <h1 className="font-sans text-[16px] lg:text-[22px] font-light">
                  Product Description
                </h1>
                <RiArrowDropDownLine
                  className={`text-4xl font-[100] transition-transform duration-300 ${
                    toggleStates.div1 ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
              {toggleStates.div1 && (
                <div className="p-4">
                  <p className="text-[14px] lg:text-[16px]">
                    {product.description}
                  </p>
                </div>
              )}
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
              {toggleStates.div2 && (
                <div className="p-4">
                  <p className="text-[14px] lg:text-[16px]">
                    Size: {product.size ? product.size : "N/A"}
                  </p>
                  <p className="text-[14px] lg:text-[16px]">
                    Material: {product.material ? product.material : "N/A"}
                  </p>
                </div>
              )}
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
              {toggleStates.div3 && (
                <div className="p-4">
                  <p className="text-[14px] lg:text-[16px]">
                    Shipping:{" "}
                    {product.shippingInfo
                      ? product.shippingInfo
                      : "No shipping information available"}
                  </p>
                  <p className="text-[14px] lg:text-[16px]">
                    Returns:{" "}
                    {product.returnPolicy
                      ? product.returnPolicy
                      : "No return policy available"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-4 mt-2 bg-[#F7F7F7] lg:hidden "></div>

        <div></div>
      </div>
      {/* Recommended Products */}
      <div className="w-full px-4 lg:px-20 mt-8 mb-8">
        <h2 className="text-xl lg:text-2xl text-center mb-4">
          You may also like
        </h2>
        {loadingproducts ? (
          <div className="flex justify-center items-center h-96">
            <JustLoading size={10} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts
                .slice(0, 4) // Limit to 8 products
                .map((pro, index) => (
                  <ProductCard2
                    star={true}
                    product={pro}
                    key={pro._id || index}
                  />
                ))
            ) : (
              <div className="col-span-full text-center">Nothing to show</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProduct;

function FastDelivery(props) {
  return (
    <>
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
    </>
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

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
};