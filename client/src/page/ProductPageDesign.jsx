import React from 'react';
// import productImage from '../assets/images/product1.jpg'; 
import productImage from "../assets/trendskart/categories/perfumes.png";

// Replace with actual image path

const ProductPageDesign = () => {
  return (
    <div className="product-page">
      <nav className="breadcrumb">
        <a href="/">Home</a> &gt; 
        <a href="/products"> Products</a> &gt; 
        <span> Yezwe Parrot Green Floral Georgette Maxi Dress</span>
      </nav>

      <div className="product-details">
        <div className="product-image">
          <img src={productImage} alt="Product" />
          <div className="sale-tag">Sale</div>
        </div>

        <div className="image-thumbnails">
          <img src={productImage} alt="Thumbnail" />
          <img src={productImage} alt="Thumbnail" />
          <img src={productImage} alt="Thumbnail" />
        </div>
        
        <div className="live-chat-button">
          <button>Live Chat</button>
        </div>
      </div>

      <footer className="footer">
        <a href="/">Home</a>
        <a href="/collection">Collection</a>
        <a href="/cart">Cart</a>
        <a href="/account">Account</a>
      </footer>
    </div>
  );
};

export default ProductPageDesign;
