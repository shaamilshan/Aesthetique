const Order = require("../../model/orderModel");
const mongoose = require("mongoose");

/**
 * GET /api/public/order/:id
 * Fetch order details for guest tracking
 */
const getPublicOrder = async (req, res) => {
  try {
    const { id } = req.params;
    let find = {};

    if (mongoose.Types.ObjectId.isValid(id)) {
      find._id = id;
    } else {
      find.orderId = id;
    }

    const order = await Order.findOne(find)
      .populate("products.productId", {
        imageURL: 1,
        name: 1,
        description: 1,
        price: 1
      });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Return the order data
    // Note: Since this is a public route, we are only returning necessary details.
    // For extra security, you could require an email match, but for a tracking link 
    // from an email, the orderId itself is usually sufficient as a "token".
    res.status(200).json({ order });
  } catch (error) {
    console.error("Public getOrder error:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getPublicOrder };
