import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { HomeIcon, ShoppingCart, Zap } from "lucide-react";
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
import { BsSlash } from "react-icons/bs";

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
    <div className="max-w-screen-2xl mx-auto px-4 flex flex-col justify-start items-center ">
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
      <h1 className="flex justify-center items-center font-Inter px-5 pl-2 sm:pl-12 md:pl-0 lg:pr-32">
        <span className="text-[10px] sm:text-sm">
          <HomeIcon
            color="#2C2C2C"
            onClick={onHomeClick}
            size={14}
            className="text-xs sm:text-sm"
          />
        </span>

        {product.category && (
          <>
            <span
              className="hover:text-[#CC4254] ml-2 text-[10px] font-semibold sm:text-sm"
              onClick={onCategoryClick}
            >
              {product.category.name}
            </span>
            <BsSlash className=" text-3xl" />
          </>
        )}

        <span className="hover:text-[#CC4254]  text-[10px] font-semibold sm:text-sm">
          {product.name}
        </span>
      </h1>
    </div>

    <div className="w-full lg:px-20 justify-center">
      <div className="w-full my-2 flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2  lg:h-[750px] h-[700px] flex flex-col">
          <ProductSlider
            images={imageArray}
            selectedImageIndex={selectedImageIndex}
            imgUrl={`${URL}/img/${selectedImageIndex}`}
          />
          <br />

          {/* Product Images */}
          <div className="lg:w-1/2 bg-white p-5 rounded flex flex-col   h-fit">
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
            <div className="flex justify-center w-full">
              <div className="flex justify-center items-center">
                <div className="flex gap-1 lg:gap-5 mt-5 justify-center items-center mx-auto">
                  {product.moreImageURL &&
                    product.moreImageURL.map((image, i) => (
                      <div
                        key={i}
                        className={`flex justify-center items-center w-12 h-12 lg:w-20 lg:h-20 overflow-clip border p ${
                          currentImage === image
                            ? "border-gray-500"
                            : "border-gray-300"
                        } hover:border-gray-500 cursor-pointer`}
                        onClick={() => setSelectedImageIndex(i + 1)}
                      >
                        <img
                          className="w-full h-full object-contain"
                          src={`${URL}/img/${image}`}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Product Details */}

        <div className="mt-4 lg:mt-0 lg:w-1/2 px-8">
          <h1 className="text-[20px] font-semibold lg:text-[20px] xl:text-[30px]  font-sans">
            {product.name}
          </h1>
          <div>
            <ProductDetailsStarAndRating rating={product.rating || 4} />
          </div>
          <div className="flex w-full mt-1  lg:mt-6 pt-3 border-b pb-6 ">
            <h1 className="text-[16px] lg:text-[20px] text-red-500 xl:text-[25px] font-semibold font-Inter">
              ₹
              {(
                product.price -
                product.price * (product.offer / 100)
              ).toFixed(2)}
            </h1>

            {product.offer && (
              <div className="flex justify-center ">
                <h1 className="text-[16px] lg:text-[18px] xl:text-[20px]font-light font-Inter text-[#949494] ml-3 line-through">
                  ₹{product.price}
                </h1>
                <div className="ml-3 px-2 w-auto h-auto md:ml-4 bg-black rounded-[2px] text-white text-[12px] lg:text-[13px] flex justify-center items-center">
                  {parseInt(product.offer)} % Off
                </div>
              </div>
            )}
          </div>

          <p className="text-[14px] border-b lg:text-[16px] py-4 pr-2">
            {product.description}
          </p>
          {/* <div className="mt-1">
              <h1 className="text-[14px] lg:text-[16px] xl:text-[18px] font-light font-Inter text-[#C84253] ">
              Incl. of all taxes
              </h1>
            </div> */}
          <div className="w-full max-w-4xl mx-auto ">
    <div className="flex  md:flex-row gap-4 items-center  mt-5 ">
      {/* Quantity Selector */}
      
        
          <Quantity 
            count={count} 
            setCount={setCount}  
            className="p-2 " 
          />
       
     

      {/* Action Buttons */}
      <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
        {/* Buy Now Button (Desktop) */}
        {!isOutOfStock && (
          <Button
          onClick={buyNow}
            variant="destructive"
            size="lg"
            disabled={isOutOfStock}
            className="w-full sm:w-auto hidden md:flex items-center gap-2"
          >
            <Zap size={18} />
            Buy Now
            {/* {cartLoading ? "Processing..." : "Buy Now"} */}
            
          </Button>
        )}

        {/* Add to Cart Button */}
        {!isOutOfStock && (
          <Button
          onClick={addToCart}
            variant="default"
            size="lg"
            // disabled={cartLoading}
            className="w-full sm:w-auto hidden md:flex  items-center gap-2"
          >
            <ShoppingCart size={18} />
            Add to Cart
            {/* {cartLoading ? "Adding..." : "Add to Cart"} */}
          </Button>
        )}

        {/* Notify Me Button */}
        {isOutOfStock && (
          <Button
            variant="secondary"
            size="lg"
            disabled={cartLoading}
            className="w-full sm:w-auto flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white"
          >
            <Bell size={18} />
            {cartLoading ? "Processing..." : "Notify Me"}
          </Button>
        )}
      </div>
    </div>
  </div>




  <div className="w-full">
<div className="w-full pt-3 font-Inter">
  {product.attributes &&
    Object.entries(groupAttributes(product.attributes)).map(
      ([name, values], index) => (
        <div key={index} className="mt-4">
          <p className="font-semibold text-gray-500 text-sm mb-1">
            {name.toUpperCase()}
          </p>

          {/* Responsive Grid Layout */}
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {values.map(({ value, imageIndex, quantity }, valueIndex) => (
              <button
                key={valueIndex}
                className={`flex justify-center items-center py-2 px-4 rounded-md text-sm font-medium transition-all duration-300
                  ${
                    selectedAttributes[name] === value
                      ? "bg-black text-white border border-black" // Selected
                      : "bg-white text-black border border-gray-300 hover:bg-blue-100" // Default + Hover
                  }
                  ${
                    quantity <= 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-400" // Out of Stock
                      : "cursor-pointer"
                  }
                `}
                onClick={() =>
                  quantity > 0
                    ? handleSelectAttribute(name, value)
                    : notifyManager(product._id, name, value)
                }
                disabled={quantity <= 0} // Disable out-of-stock items
              >
                {value}
              </button>
            ))} 
          </div>
        </div>
      )
    )}
</div>
</div>


          {/* Shipping & Returns , Size & Material*/}

          {/* <div className="w-full">
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
          </div> */}
        </div>
      </div>

      <div></div>
    </div>

    <DescReview product={product} id={product._id} />
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