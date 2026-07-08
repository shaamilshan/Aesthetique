const Coupon = require("../../model/couponModel");
const jwt = require("jsonwebtoken");
const Cart = require("../../model/cartModel");
const mongoose = require("mongoose");

const getCoupons = async (req, res) => {
  try {
    const currentDate = new Date();

    const coupons = await Coupon.find({
      isActive: true,
      expirationDate: { $gt: currentDate },
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
      expirationDate: { $gt: currentDate },
    });

    if (!coupon) {
      throw Error("Coupon not found!!");
    }

    if (coupon.used === coupon.maximumUses) {
      throw Error("Coupon Usage Limit Reached");
    }

    const token = req.cookies.user_token;

    const { _id } = jwt.verify(token, process.env.SECRET);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw Error("Invalid ID!!!");
    }

    // CHECK FOR FIRST ORDER ONLY COUPONS
    if (coupon.isFirstOrder) {
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

    let sum = 0;
    let totalQuantity = 0;

    cart.items.map((item) => {
      sum = sum + item.product.price * item.quantity;
      totalQuantity = totalQuantity + item.quantity;
    });

    if (sum < coupon.minimumPurchaseAmount) {
      throw Error("Coupon Minimum Purchase Amount is not reached");
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { _id: cart._id },
      {
        $set: {
          coupon: coupon._id,
          couponCode: coupon.code,
          discount: coupon.value,
          type: coupon.type,
        },
      }
    );

    if (!updatedCart) {
      throw Error("Cart couldn't update!");
    }

    res.status(200).json({
      discount: coupon.value,
      couponType: coupon.type,
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

    const Order = require("../../model/orderModel");
    const existingOrder = await Order.findOne({ user: _id, status: { $ne: "canceled" } });

    if (existingOrder) {
      return res.status(200).json({ coupon: null });
    }

    const currentDate = new Date();
    const coupon = await Coupon.findOne({
      isFirstOrder: true,
      isActive: true,
      expirationDate: { $gt: currentDate },
    });

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
      expirationDate: { $gt: currentDate },
    });

    if (!coupon) {
      throw Error("Coupon not found!!");
    }

    if (coupon.used === coupon.maximumUses) {
      throw Error("Coupon Usage Limit Reached");
    }

    const token = req.cookies.user_token;
    const { _id } = jwt.verify(token, process.env.SECRET);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw Error("Invalid ID!!!");
    }

    if (coupon.isFirstOrder) {
      const Order = require("../../model/orderModel");
      const existingOrder = await Order.findOne({ user: _id, status: { $ne: "canceled" } });
      if (existingOrder) {
        throw Error("This coupon is only valid for your first order!");
      }
    }

    if (subTotal < coupon.minimumPurchaseAmount) {
      throw Error(`Coupon Minimum Purchase Amount of ₹${coupon.minimumPurchaseAmount} is not reached`);
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
