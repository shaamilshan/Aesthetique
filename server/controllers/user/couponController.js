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

    let sum = 0;
    let totalQuantity = 0;

    cart.items.map((item) => {
      if (item.product) {
        sum = sum + item.product.price * item.quantity;
        totalQuantity = totalQuantity + item.quantity;
      }
    });

    const hasApplicableProducts = coupon.applicableProducts && coupon.applicableProducts.length > 0;
    let applicableSum = 0;
    let hasMatchingProduct = false;

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

    let finalDiscount = coupon.value;
    let finalType = coupon.type;

    if (hasApplicableProducts) {
      if (coupon.type === "percentage") {
        finalType = "fixed";
        finalDiscount = Math.round((applicableSum * coupon.value) / 100);
      } else {
        finalType = "fixed";
        finalDiscount = Math.min(coupon.value, applicableSum);
      }
    } else {
      if (coupon.type === "fixed") {
        finalDiscount = Math.min(coupon.value, applicableSum);
      }
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { _id: cart._id },
      {
        $set: {
          coupon: coupon._id,
          couponCode: coupon.code,
          discount: finalDiscount,
          type: finalType,
        },
      },
      { new: true }
    );

    if (!updatedCart) {
      throw Error("Cart couldn't update!");
    }

    res.status(200).json({
      discount: finalDiscount,
      couponType: finalType,
      couponCode: coupon.code,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeCoupon = async (req, res) => {
  try {
    const token = req.cookies.user_token;

    const { _id } = jwt.verify(token, process.env.SECRET);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw Error("Invalid ID!!!");
    }

    await Cart.findOneAndUpdate(
      { user: _id },
      {
        $set: {
          coupon: null,
          couponCode: null,
          discount: null,
          type: null,
        },
      },
      { new: true }
    );

    res.status(200).json({ success: true });
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

    const Cart = require("../../model/cartModel");
    const cart = await Cart.findOne({ user: _id }).populate("items.product");
    if (!cart) {
      throw Error("Cart not found!");
    }

    const hasApplicableProducts = coupon.applicableProducts && coupon.applicableProducts.length > 0;
    let applicableSum = 0;
    let hasMatchingProduct = false;

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
