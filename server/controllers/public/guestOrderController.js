const mongoose = require("mongoose");
const Order = require("../../model/orderModel");
const Products = require("../../model/productModel");
const Counter = require("../../model/counterModel");
const Payment = require("../../model/paymentModel");
const managerOrderModel = require("../../model/managerOrderModel");
const { generateInvoicePDF } = require("../Common/invoicePDFGenFunctions");
const { sendOrderPlacedMail, sendAdminOrderNotification } = require("../../util/mailFunction");
const { getShippingCharge } = require("../../utils/shippingCharges");

// Helper — update product stock & attribute quantities (same logic as user orderController)
const updateProductList = async (id, count, attributes) => {
  const product = await Products.findById(id);
  if (!product) throw new Error("Product not found");

  if (count < 0 && attributes instanceof Map && attributes.size > 0) {
    for (let [key, value] of attributes) {
      const attr = product.attributes.find((a) => a.name === key && a.value === value);
      if (attr && attr.quantity < Math.abs(count)) {
        throw new Error(`${product.name} doesn't have enough stock for ${key}: ${value}`);
      }
    }
  }

  const updated = await Products.findByIdAndUpdate(id, { $inc: { stockQuantity: count } }, { new: true });

  if (parseInt(updated.stockQuantity) < 5 && parseInt(updated.stockQuantity) > 0) {
    await Products.findByIdAndUpdate(id, { $set: { status: "low quantity" } });
  }
  if (parseInt(updated.stockQuantity) === 0) {
    await Products.findByIdAndUpdate(id, { $set: { status: "out of stock" } });
  }
  if (parseInt(updated.stockQuantity) > 5) {
    await Products.findByIdAndUpdate(id, { $set: { status: "published" } });
  }

  if (count < 0 && attributes instanceof Map) {
    for (let [key, value] of attributes) {
      await Products.findOneAndUpdate(
        { _id: id, "attributes.name": key, "attributes.value": value },
        { $inc: { "attributes.$.quantity": count } }
      );
    }
  }
  return updated;
};

/**
 * POST /api/public/guest-order
 * Body: { items, address, paymentMode, notes, guestEmail, guestPhone }
 *   items: [{ productId, quantity, attributes }]
 *   address: { firstName, lastName, address, country, regionState, city, pinCode, email, phoneNumber }
 */
const createGuestOrder = async (req, res) => {
  try {
    const { items, address, paymentMode, notes, guestEmail, guestPhone } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Cart is empty");
    }
    if (!address || !address.firstName || !address.pinCode) {
      throw new Error("Delivery address is required");
    }
    if (!paymentMode) {
      throw new Error("Payment mode is required");
    }

    // Validate and build products array
    let sum = 0;
    let totalQuantity = 0;
    const products = [];

    for (const item of items) {
      const product = await Products.findById(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      if (product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const attrs = item.attributes && typeof item.attributes === "object"
        ? new Map(Object.entries(item.attributes))
        : new Map();

      products.push({
        productId: product._id,
        quantity: item.quantity,
        totalPrice: product.price,
        price: product.price,
        markup: product.markup || 0,
        attributes: attrs,
      });

      sum += product.price * item.quantity;
      totalQuantity += item.quantity;
    }

    // Calculate shipping
    const shippingCharge = getShippingCharge(address.pinCode || null);
    const totalPrice = sum + shippingCharge;

    // Build order data (no user field for guest)
    const orderData = {
      address: {
        firstName: address.firstName,
        lastName: address.lastName || "",
        companyName: address.companyName || "",
        address: address.address || "",
        country: address.country || "",
        regionState: address.regionState || "",
        city: address.city || "",
        pinCode: address.pinCode,
        email: address.email || guestEmail || "",
        phoneNumber: address.phoneNumber || guestPhone || "",
      },
      guestEmail: guestEmail || address.email || "",
      guestPhone: guestPhone || address.phoneNumber || "",
      products,
      subTotal: sum,
      shipping: shippingCharge,
      tax: 0,
      totalPrice,
      paymentMode,
      totalQuantity,
      statusHistory: [{ status: "pending" }],
      ...(notes ? { notes } : {}),
    };

    // Create manager orders for products that belong to a manager
    for (const item of items) {
      const product = await Products.findById(item.productId);
      if (product && product.managerId) {
        await managerOrderModel.create({
          managerId: product.managerId,
          productId: product._id,
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
          totalPrice: product.price * item.quantity,
          orderDate: new Date(),
          status: "pending",
        });
      }
    }

    // Update stock
    await Promise.all(
      products.map((p) => updateProductList(p.productId, -p.quantity, p.attributes))
    );

    const order = await Order.create(orderData);

    // Send confirmation emails (non-blocking)
    try {
      const populated = await Order.findById(order._id)
        .populate("products.productId", { name: 1, price: 1, gstPercent: 1, hsnCode: 1 });

      const customerEmail = orderData.guestEmail;
      const customerName = `${address.firstName} ${address.lastName || ""}`.trim();
      const adminEmail = "help.bmaesthetique@gmail.com";

      const productsForMail = (populated.products || []).map((p) => ({
        name: p.productId?.name || "",
        quantity: p.quantity,
        price: p.price,
      }));
      const orderNumber = populated.orderId || populated._id;

      const addressString = `${address.firstName} ${address.lastName || ""}, ${address.address || ""}, ${address.city || ""}, ${address.regionState || ""}, ${address.country || ""} - ${address.pinCode || ""}. Ph: ${address.phoneNumber || ""}`;

      sendAdminOrderNotification(adminEmail, {
        customerName: customerName || "Guest",
        orderNumber,
        totalPrice,
        products: productsForMail,
        address: addressString,
      }).catch((err) => console.error("Failed to send admin order notification", err));

      if (customerEmail) {
        try {
          const pdfBuffer = await generateInvoicePDF(populated);
          sendOrderPlacedMail(
            customerEmail,
            { customerName: customerName || "Customer", orderNumber, totalPrice, products: productsForMail },
            [{ filename: `invoice_${orderNumber}.pdf`, content: pdfBuffer }]
          ).catch((err) => console.error("Failed to send guest order email", err));
        } catch (err) {
          console.error("Failed to generate invoice for guest order:", err);
          sendOrderPlacedMail(customerEmail, {
            customerName: customerName || "Customer",
            orderNumber,
            totalPrice,
            products: productsForMail,
          }).catch((err) => console.error("Failed to send guest order email (no attach)", err));
        }
      }
    } catch (err) {
      console.error("Failed to trigger guest order email:", err);
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Guest order error:", error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * POST /api/public/guest-razor-verify
 * Verify Razorpay payment for a guest order (no auth needed)
 */
const guestVerifyPayment = async (req, res) => {
  try {
    const crypto = require("crypto");
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      throw new Error("Invalid Signature");
    }

    const Payment = require("../../model/paymentModel");
    await Payment.create({
      ...req.body,
      payment_id: razorpay_payment_id,
      status: "success",
      paymentMode: "razorPay",
    });

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Guest payment verify error:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createGuestOrder, guestVerifyPayment };
