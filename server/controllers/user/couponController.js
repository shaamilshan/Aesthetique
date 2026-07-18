const Coupon = require("../../model/couponModel");
const jwt = require("jsonwebtoken");
const Cart = require("../../model/cartModel");
const mongoose = require("mongoose");

const getCoupons = async (req, res) => {
  try {
    const currentDate = new Date();

    const coupons = await Coupon.find({
      isActive: true,
      $or: [
        { expirationDate: { $exists: false } },
        { expirationDate: null },
        { expirationDate: { $gt: currentDate } }
      ]
    });

    return res.status(200).json({ coupons });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const currentDate = new Date();

    const coupon = await Coupon.findOne({
      code: { $regex: new RegExp(`^${code.trim()}$`, "i") },
    });

    if (!coupon) {
      throw Error("Coupon not found!!");
    }

    if (!coupon.isActive) {
      throw Error("Coupon is inactive");
    }

    if (coupon.expirationDate && new Date(coupon.expirationDate) <= currentDate) {
      throw Error("Coupon has expired");
    }

    if (coupon.maximumUses !== null && coupon.maximumUses !== undefined && coupon.used >= coupon.maximumUses) {
      throw Error("Coupon Usage Limit Reached");
    }

    const token = req.cookies.user_token;
    if (!token) {
      throw Error("User is not authenticated");
    }

    const { _id } = jwt.verify(token, process.env.SECRET);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw Error("Invalid ID!!!");
    }

    const User = require("../../model/userModel");
    const user = await User.findById(_id);
    if (!user) {
      throw Error("User not found");
    }

    // CHECK FOR FIRST ORDER ONLY COUPONS
    if (coupon.isFirstOrder) {
      if (user.hasPlacedFirstOrder || user.firstOrderOfferUsed) {
        throw Error("This coupon is only valid for your first order!");
      }
      const Order = require("../../model/orderModel");
      const existingOrder = await Order.findOne({ user: _id, status: { $ne: "canceled" } });
      if (existingOrder) {
        throw Error("This coupon is only valid for your first order!");
      }
    }

    const cart = await Cart.findOne({ user: _id }).populate("items.product", {
      name: 1,
      price: 1,
      markup: 1,
    });

    if (!cart) {
      throw Error("Cart not found!");
    }

    // Check if coupon is already applied
    const alreadyApplied = cart.appliedCoupons.some(c => c.code.toLowerCase() === coupon.code.toLowerCase());
    if (alreadyApplied) {
      throw Error("Voucher code already applied!");
    }

    const hasApplicableProducts = coupon.applicableProducts && coupon.applicableProducts.length > 0;
    let applicableSum = 0;
    let hasMatchingProduct = false;

    // We only apply this coupon to products that match
    cart.items.forEach((item) => {
      if (item.product) {
        const isApplicable = !hasApplicableProducts || coupon.applicableProducts.some(
          (pId) => pId.toString() === item.product._id.toString()
        );
        if (isApplicable) {
          applicableSum += item.product.price * item.quantity;
          hasMatchingProduct = true;
        }
      }
    });

    if (hasApplicableProducts && !hasMatchingProduct) {
      throw Error("This coupon is not applicable to any products in your cart.");
    }

    if (applicableSum < coupon.minimumPurchaseAmount) {
      throw Error(`Coupon Minimum Purchase Amount of ₹${coupon.minimumPurchaseAmount} is not reached for applicable products`);
    }

    // Apply the discount to eligible products
    let totalDiscountAdded = 0;
    cart.items.forEach((item) => {
      if (item.product) {
        const isApplicable = !hasApplicableProducts || coupon.applicableProducts.some(
          (pId) => pId.toString() === item.product._id.toString()
        );

        if (isApplicable) {
          let itemDiscount = 0;
          const lineTotal = item.product.price * item.quantity;

          if (coupon.type === "percentage") {
            itemDiscount = Math.round((lineTotal * coupon.value) / 100);
          } else {
            // Proportional distribution for fixed coupons
            itemDiscount = Math.round((lineTotal / applicableSum) * coupon.value);
          }

          // Cap discount at item total
          itemDiscount = Math.min(itemDiscount, lineTotal);

          // Update item discount (or overwrite if this coupon gives a higher discount)
          // To prevent multiple coupons discounting the same product in stacks,
          // we can just associate the product with this new coupon
          item.discount = itemDiscount;
          item.appliedCouponCode = coupon.code;
          totalDiscountAdded += itemDiscount;
        }
      }
    });

    // Add to appliedCoupons list
    cart.appliedCoupons.push({
      coupon: coupon._id,
      code: coupon.code,
      discount: totalDiscountAdded,
      type: coupon.type,
      value: coupon.value
    });

    // Recompute cart total discount
    cart.discount = cart.appliedCoupons.reduce((sum, c) => sum + c.discount, 0);

    await cart.save();

    res.status(200).json({
      discount: cart.discount,
      appliedCoupons: cart.appliedCoupons,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeCoupon = async (req, res) => {
  try {
    const { code } = req.query;
    const token = req.cookies.user_token;

    const { _id } = jwt.verify(token, process.env.SECRET);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw Error("Invalid ID!!!");
    }

    const cart = await Cart.findOne({ user: _id });
    if (!cart) {
      throw Error("Cart not found!");
    }

    if (code) {
      // Remove specific coupon code
      cart.appliedCoupons = cart.appliedCoupons.filter(c => c.code.toLowerCase() !== code.trim().toLowerCase());
      cart.items.forEach(item => {
        if (item.appliedCouponCode && item.appliedCouponCode.toLowerCase() === code.trim().toLowerCase()) {
          item.discount = 0;
          item.appliedCouponCode = null;
        }
      });
    } else {
      // Clear all
      cart.appliedCoupons = [];
      cart.items.forEach(item => {
        item.discount = 0;
        item.appliedCouponCode = null;
      });
    }

    // Recompute total discount
    cart.discount = cart.appliedCoupons.reduce((sum, c) => sum + c.discount, 0);

    await cart.save();

    res.status(200).json({ success: true, discount: cart.discount, appliedCoupons: cart.appliedCoupons });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getFirstOrderCoupon = async (req, res) => {
  try {
    const token = req.cookies && req.cookies.user_token;
    if (!token) {
      return res.status(200).json({ coupon: null });
    }

    let _id;
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      _id = decoded._id;
    } catch (err) {
      return res.status(200).json({ coupon: null });
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(200).json({ coupon: null });
    }

    const User = require("../../model/userModel");
    const user = await User.findById(_id);
    if (!user || user.hasPlacedFirstOrder || user.firstOrderOfferUsed) {
      return res.status(200).json({ coupon: null });
    }

    const Order = require("../../model/orderModel");
    const existingOrder = await Order.findOne({ user: _id, status: { $ne: "canceled" } });

    if (existingOrder) {
      return res.status(200).json({ coupon: null });
    }

    const currentDate = new Date();
    const coupons = await Coupon.find({
      isFirstOrder: true,
      isActive: true,
    });

    const coupon = coupons.find(
      (c) => !c.expirationDate || new Date(c.expirationDate) > currentDate
    ) || null;

    return res.status(200).json({ coupon });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const checkCoupon = async (req, res) => {
  try {
    const { code, subTotal } = req.body;
    const currentDate = new Date();
    const coupon = await Coupon.findOne({
      code: { $regex: new RegExp(`^${code.trim()}$`, "i") },
    });

    if (!coupon) {
      throw Error("Coupon not found!!");
    }

    if (!coupon.isActive) {
      throw Error("Coupon is inactive");
    }

    if (coupon.expirationDate && new Date(coupon.expirationDate) <= currentDate) {
      throw Error("Coupon has expired");
    }

    if (coupon.maximumUses !== null && coupon.maximumUses !== undefined && coupon.used >= coupon.maximumUses) {
      throw Error("Coupon Usage Limit Reached");
    }

    const token = req.cookies.user_token;
    if (!token) {
      throw Error("User is not authenticated");
    }

    const { _id } = jwt.verify(token, process.env.SECRET);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw Error("Invalid ID!!!");
    }

    const User = require("../../model/userModel");
    const user = await User.findById(_id);
    if (!user) {
      throw Error("User not found");
    }

    if (coupon.isFirstOrder) {
      if (user.hasPlacedFirstOrder || user.firstOrderOfferUsed) {
        throw Error("This coupon is only valid for your first order!");
      }
      const Order = require("../../model/orderModel");
      const existingOrder = await Order.findOne({ user: _id, status: { $ne: "canceled" } });
      if (existingOrder) {
        throw Error("This coupon is only valid for your first order!");
      }
    }

    let items = [];
    if (req.body.isBuyNow || req.body.productId) {
      const ProductModel = require("../../model/productModel");
      const prodId = req.body.productId || (req.body.product && (req.body.product._id || req.body.product));
      const prod = await ProductModel.findById(prodId);
      if (!prod) {
        throw Error("Product not found!");
      }
      items = [{ product: prod, quantity: req.body.quantity || 1 }];
    } else {
      const Cart = require("../../model/cartModel");
      const cart = await Cart.findOne({ user: _id }).populate("items.product");
      if (!cart) {
        throw Error("Cart not found!");
      }
      items = cart.items;
    }

    const hasApplicableProducts = coupon.applicableProducts && coupon.applicableProducts.length > 0;
    let applicableSum = 0;
    let hasMatchingProduct = false;

    items.forEach((item) => {
      if (item.product) {
        const isApplicable = !hasApplicableProducts || coupon.applicableProducts.some(
          (pId) => pId.toString() === item.product._id.toString()
        );
        if (isApplicable) {
          applicableSum += item.product.price * item.quantity;
          hasMatchingProduct = true;
        }
      }
    });

    if (hasApplicableProducts && !hasMatchingProduct) {
      throw Error(req.body.isBuyNow ? "This coupon is not applicable to this product." : "This coupon is not applicable to any products in your cart.");
    }

    if (applicableSum < coupon.minimumPurchaseAmount) {
      throw Error(`Coupon Minimum Purchase Amount of ₹${coupon.minimumPurchaseAmount} is not reached for applicable products`);
    }

    if (hasApplicableProducts) {
      if (coupon.type === "percentage") {
        coupon.value = Math.round((applicableSum * coupon.value) / 100);
        coupon.type = "fixed";
      } else {
        coupon.value = Math.min(coupon.value, applicableSum);
        coupon.type = "fixed";
      }
    } else {
      if (coupon.type === "fixed") {
        coupon.value = Math.min(coupon.value, applicableSum);
      }
    }

    res.status(200).json({ coupon });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getCoupons,
  applyCoupon,
  removeCoupon,
  getFirstOrderCoupon,
  checkCoupon,
};
