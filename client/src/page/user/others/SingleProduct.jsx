import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Bell, HomeIcon, ShoppingCart, Zap } from "lucide-react";
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

import { FaShareAlt } from "react-icons/fa";
import "./singleproduct.css";
import { useMediaQuery } from 'react-responsive'; 
import { BsSlash } from "react-icons/bs";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState("");
  const isMobile = useMediaQuery({ maxWidth: 767 });

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
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const filteredProducts = userProducts?.filter(
    (product) => product._id !== id
  );

  const { user } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const isProductInWishlist = wishlist.some((item) => item.product._id === id);
  
  const isOutOfStock = product.stockQuantity === 0;

  // Combine the base image and more images
  const imageArray = product.moreImageURL
    ? [product.imageURL, ...product.moreImageURL]
    : [product.imageURL];

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
          toast.success('Link copied to clipboard!');
        },
        (error) => {
          console.error('Error copying URL to clipboard:', error);
          toast.error('Failed to copy link');
        }
      );
    }
  };

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${URL}/user/product/${id}`, {
        withCredentials: true,
      });
      if (data) {
        setProduct(data.product);
        setLoading(false);
        setCurrentImage(data.product.imageURL);
        // Set default selected attributes to the first value of each attribute
        const defaultAttributes = {};
        data.product.attributes.forEach((attribute) => {
          if (attribute.value && attribute.quantity > 0) {
            defaultAttributes[attribute.name] = attribute.value; // Set first available value as default
          }
        });
        setSelectedAttributes(defaultAttributes); // Update state with default attributes
      }
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error("Failed to load product details");
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    dispatch(getUserProducts(searchParams));
    loadProduct();
  }, [id, dispatch, searchParams]);

  const increment = async () => {
    try {
      const { data } = await axios.get(
        `${URL}/user/product-quantity/${id}`,
        config
      );
      if (data.stockQuantity > count) {
        setCount((c) => c + 1);
      } else {
        toast.error("Maximum available quantity reached");
      }
    } catch (error) {
      toast.error("Failed to check product quantity");
    }
  };

  const decrement = () => {
    if (count > 1) {
      setCount((c) => c - 1);
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

  const onHomeClick = () => {
    navigate("/");
  };
  
  const onCategoryClick = () => {
    if (product.category && product.category._id) {
      navigate(`/collections?category=${product.category._id}`);
    }
  };

  const notifyManager = async (productid, name, value) => {
    try {
      const userConfirmed = window.confirm(`Request for ${name}: ${value} of product "${product.name}"`);
      if (userConfirmed) {
        await axios.get(`${URL}/manager/notify/${id}/${name}/${value}`, config);
        toast.success(`Manager notified about your interest in this variant`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to notify manager");
    }
  };

  const validateAttributesSelection = () => {
    // Get all attribute names that have at least one option with quantity > 0
    const availableAttributes = product.attributes
      ? Array.from(new Set(product.attributes
          .filter(attr => attr.quantity > 0)
          .map(attr => attr.name)))
      : [];

    // For each available attribute, check if there's a selection
    for (const attrName of availableAttributes) {
      if (!selectedAttributes[attrName]) {
        return false;
      }
    }
    return true;
  };

  const addToCart = async () => {
    if (!user) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      navigate("/login");
      return;
    }
  
    if (!validateAttributesSelection()) {
      toast.error("Please select all required options");
      return;
    }
  
    setCartLoading(true);
    try {
      // Fetch cart items
      const response = await axios.get(`${URL}/user/cart`, {
        ...config,
        withCredentials: true,
      });
  
      const cartItems = response.data?.cart?.items || [];
  
      if (!Array.isArray(cartItems)) {
        throw new Error("Invalid cart data structure");
      }
  
      // Check if the product with the same attributes is already in the cart
      const isProductInCart = cartItems.some((item) => 
        item.product?._id === id && 
        JSON.stringify(Object.entries(item.attributes || {}).sort()) === 
        JSON.stringify(Object.entries(selectedAttributes).sort())
      );
  
      if (isProductInCart) {
        toast.error("This product is already in your cart");
      } else {
        await axios.post(
          `${URL}/user/cart`,
          {
            product: id,
            quantity: count,
            attributes: selectedAttributes,
          },
          { ...config, withCredentials: true }
        );
        toast.success("Added to cart successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };
  
  const buyNow = async () => {
    if (!user) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      navigate("/login");
      return;
    }
  
    if (!validateAttributesSelection()) {
      toast.error("Please select all required options");
      return;
    }
  
    setCartLoading(true);
    try {
      // Fetch cart items
      const response = await axios.get(`${URL}/user/cart`, {
        ...config,
        withCredentials: true,
      });
  
      const cartItems = response.data?.cart?.items || [];
  
      if (!Array.isArray(cartItems)) {
        throw new Error("Invalid cart data structure");
      }
  
      // Check if the product with the same attributes is already in the cart
      const isProductInCart = cartItems.some((item) => 
        item.product?._id === id && 
        JSON.stringify(Object.entries(item.attributes || {}).sort()) === 
        JSON.stringify(Object.entries(selectedAttributes).sort())
      );
  
      if (isProductInCart) {
        
      } else {
        await axios.post(
          `${URL}/user/cart`,
          {
            product: id,
            quantity: count,
            attributes: selectedAttributes,
          },
          { ...config, withCredentials: true }
        );
        
      }
    } catch (error) {
    } finally {
      setCartLoading(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate("/cart");
  };
  
  

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
        imageIndex: attribute.imageIndex,
        quantity: attribute.quantity,
      });
      return acc;
    }, {});
  };

  const handleSelectAttribute = (attributeName, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value === prev[attributeName] ? null : value,
    }));

    const selectedAttribute = product.attributes?.find(
      (attr) => attr.name === attributeName && attr.value === value
    );

    if (selectedAttribute && selectedAttribute.imageIndex !== undefined) {
      setSelectedImageIndex(selectedAttribute.imageIndex);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <JustLoading size={12} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl text-red-500 mb-2">Error loading product</h2>
          <Button 
            variant="outline" 
            onClick={() => loadProduct()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 flex flex-col justify-start items-center">
      {/* Fixed bottom panel for mobile devices */}
      {isMobile && (
        <div className="fixed-bottom-panel">
          <button
            className="buy-now-btn"
            onClick={buyNow}
            disabled={cartLoading || isOutOfStock}
          >
            {cartLoading ? "Processing..." : isOutOfStock ? "Notify Me" : "Buy Now"}
          </button>
          <button
            className="add-to-cart-btn"
            onClick={addToCart}
            disabled={cartLoading || isOutOfStock}
          >
            {cartLoading ? "Adding..." : "Add to Cart"}
          </button>
          <button className="share-btn" onClick={handleShare}>
            {copied ? "Link Copied!" : "Share"}
          </button>
        </div>
      )}

      {/* Breadcrumb navigation */}
      <div className="container w-full flex my-3 sm:my-6 px-2">
        <nav className="flex items-center text-sm font-Inter px-2 sm:px-5 md:px-0">
          <span className="cursor-pointer flex items-center" onClick={onHomeClick}>
            <HomeIcon color="#2C2C2C" size={isMobile ? 12 : 14} className="mr-1" />
            <span className="text-xs sm:text-sm hover:text-[#CC4254]">Home</span>
          </span>

          {product.category && (
            <>
              <BsSlash className="text-xl mx-1" />
              <span
                className="hover:text-[#CC4254] text-xs font-medium sm:text-sm cursor-pointer"
                onClick={onCategoryClick}
              >
                {product.category.name}
              </span>
              <BsSlash className="text-xl mx-1" />
            </>
          )}

          <span className="text-xs font-medium sm:text-sm truncate max-w-[150px] sm:max-w-none">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main product content */}
      <div className="w-full lg:px-5 xl:px-20 justify-center">
        <div className="w-full my-2 flex flex-col lg:flex-row gap-6">
          {/* Product Images Section */}
          <div className="w-full lg:w-1/2 lg:h-[720px] h-[450px] sm:h-[550px] flex flex-col">
            <ProductSlider
              images={imageArray}
              selectedImageIndex={selectedImageIndex}
              imgUrl={`${URL}/img/${selectedImageIndex}`}
            />
            
            {/* Thumbnail Gallery */}
            <div className="mt-4 px-2">
              <div className="flex justify-center">
                <div className="flex gap-2 sm:gap-3 overflow-x-auto py-2 px-1 max-w-full">
                  {imageArray.map((image, i) => (
                    <div
                      key={i}
                      className={`flex-shrink-0 w-14 h-14  mt-5 sm:w-16 sm:h-16 border rounded-md overflow-hidden cursor-pointer transition-all
                        ${selectedImageIndex === i ? "border-2 border-gray-800" : "border-gray-300 hover:border-gray-400"}`}
                      onClick={() => setSelectedImageIndex(i)}
                    >
                      <img
                        className="w-full h-full object-cover"
                        src={`${URL}/img/${image}`}
                        alt={`Product view ${i+1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="w-full lg:w-1/2 px-2 sm:px-4 lg:px-6 pb-20 lg:pb-0">
            {/* Product Name & Rating */}
            <div className="mb-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold font-sans mb-2">
                {product.name}
              </h1>
              <div className="mb-2">
                <ProductDetailsStarAndRating rating={product.rating || 4} />
              </div>
            </div>

            {/* Price Section */}
            <div className="flex items-center border-b pb-4 mb-4">
              <h1 className="text-xl sm:text-2xl text-red-500 font-semibold font-Inter">
                ₹{(product.price - product.price * (product.offer / 100)).toFixed(2)}
              </h1>

              {product.offer > 0 && (
                <div className="flex items-center ml-3">
                  <h1 className="text-sm sm:text-base font-light text-gray-500 line-through mr-3">
                    ₹{product.price.toFixed(2)}
                  </h1>
                  <div className="px-2 py-1 bg-black rounded text-white text-xs">
                    {parseInt(product.offer)}% Off
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-sm sm:text-base text-gray-700">
                {product.description}
              </p>
              {product.stockQuantity <= 10 && product.stockQuantity > 0 && (
                <p className="text-sm text-orange-600 mt-2 font-medium">
                  Only {product.stockQuantity} left in stock - order soon
                </p>
              )}
              {product.stockQuantity === 0 && (
                <p className="text-sm text-red-600 mt-2 font-medium">
                  Currently out of stock
                </p>
              )}
            </div>

            {/* Quantity & Action Buttons */}
            {/* Quantity & Action Buttons */}
<div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
  
  {/* Quantity Selector */}
  {!isOutOfStock && (
    <div className="w-auto">
      <Quantity 
        count={count} 
        increment={increment}
        decrement={decrement}
        className="h-10" 
      />
    </div>
  )}

  {/* Action Buttons for Desktop */}
  <div className="flex flex-wrap md:flex-nowrap flex-1 gap-3 justify-center md:justify-end w-full">
    {!isOutOfStock ? (
      <>
        <Button
          onClick={buyNow}
          variant="destructive"
          size="lg"
          disabled={cartLoading}
          className="flex-1 md:flex-none h-12 w-full md:w-auto"
        >
          <Zap size={18} className="mr-2" />
          Buy Now
        </Button>
        <Button
          onClick={addToCart}
          variant="outline"
          size="lg"
          disabled={cartLoading}
          className="flex-1 md:flex-none h-12 w-full md:w-auto border-gray-300"
        >
          <ShoppingCart size={18} className="mr-2" />
          Add to Cart
        </Button>
      </>
    ) : (
      <Button
        onClick={() => notifyManager(product._id, "stock", "restock")}
        variant="outline"
        size="lg"
        className="flex-1 md:flex-none h-12 w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white border-none"
      >
        <Bell size={18} className="mr-2" />
        Notify Me When Available
      </Button>
    )}

    <Button
      onClick={handleShare}
      variant="ghost"
      size="icon"
      className="h-12 w-12"
    >
      <FaShareAlt size={18} />
    </Button>
  </div>
</div>


            {/* Product Attributes */}
            <div className="mb-6">
              {product.attributes &&
                Object.entries(groupAttributes(product.attributes || [])).map(
                  ([name, values], index) => (
                    <div key={index} className="mb-4">
                      <p className="font-medium text-gray-700 text-sm mb-2">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {values.map(({ value, imageIndex, quantity }, valueIndex) => (
                          <button
                            key={valueIndex}
                            className={`py-1 px-3 rounded text-sm font-medium transition-all
                              ${
                                selectedAttributes[name] === value
                                  ? "bg-black text-white border border-black" 
                                  : "bg-white text-black border border-gray-300 hover:bg-gray-100"
                              }
                              ${
                                quantity <= 0
                                  ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed opacity-60"
                                  : "cursor-pointer"
                              }
                            `}
                            onClick={() =>
                              quantity > 0
                                ? handleSelectAttribute(name, value)
                                : notifyManager(product._id, name, value)
                            }
                            disabled={quantity <= 0}
                          >
                            {value}
                            {quantity <= 0 && " (Out of Stock)"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
            </div>

            {/* Additional Info (Shipping, Returns, etc) - Collapsible sections */}
            <div className="border-t pt-4">
              <div className="mb-3">
                <button 
                  className="flex justify-between items-center w-full py-2"
                  onClick={() => handleClick('div1')}
                >
                  <span className="font-medium">Shipping Information</span>
                  <RiArrowDropDownLine 
                    size={24} 
                    className={`transition-transform ${toggleStates.div1 ? 'rotate-180' : ''}`}
                  />
                </button>
                {toggleStates.div1 && (
                  <div className="py-2 text-sm text-gray-600">
                    Free shipping on orders above ₹499. Standard delivery in 3-5 business days.
                  </div>
                )}
              </div>
              
              <div className="mb-3 border-t pt-2">
                <button 
                  className="flex justify-between items-center w-full py-2"
                  onClick={() => handleClick('div2')}
                >
                  <span className="font-medium">Returns & Exchanges</span>
                  <RiArrowDropDownLine 
                    size={24} 
                    className={`transition-transform ${toggleStates.div2 ? 'rotate-180' : ''}`}
                  />
                </button>
                {toggleStates.div2 && (
                  <div className="py-2 text-sm text-gray-600">
                    Easy 15-day returns. Defective or damaged products can be returned for a full refund or replacement.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Description & Reviews */}
        <div className="mt-8">
          <DescReview product={product} id={id} />
        </div>

        {/* Recommended Products */}
        <div className="w-full mt-10 mb-16">
          <h2 className="text-xl font-medium text-center mb-6">
             You May Also Like
          </h2>
          {loadingproducts ? (
            <div className="flex justify-center items-center h-48">
              <JustLoading size={10} />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts
                  .slice(0, 4)
                  .map((pro, index) => (
                    <ProductCard2
                      star={true}
                      product={pro}
                      key={pro._id || index}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No related products to show
                </div>
              )}
            </div>
          )}
        </div>
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