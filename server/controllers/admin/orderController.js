const Order = require("../../model/orderModel");
const mongoose = require("mongoose");
const Payment = require("../../model/paymentModel");
const uuid = require("uuid");
const { generateInvoicePDF } = require("../Common/invoicePDFGenFunctions");
const managerOrderModel = require("../../model/managerOrderModel");

// Function checking if the passed status is valid or not. Ensuring redundant searches are avoided
function isValidStatus(status) {
  const validStatusValues = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "returned",
  ];

  return validStatusValues.includes(status);
}

// Get a single order details
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    let find = {};

    if (mongoose.Types.ObjectId.isValid(id)) {
      find._id = id;
    } else {
      find.orderId = id;
    }

    // console.log(find);

    const order = await Order.findOne(find).populate("products.productId", {
      imageURL: 1,
      name: 1,
    });

    // console.log(order);

    if (!order) {
      throw Error("No Such Order");
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single order details
const getManagerOrder = async (req, res) => {
  try {
    const { id } = req.params;

    let find = {};

    if (mongoose.Types.ObjectId.isValid(id)) {
      find._id = id;
    } else {
      find.orderId = id;
    }

    // console.log(find);

    const order = await managerOrderModel.findOne(find);

    console.log(order);

    if (!order) {
      throw Error("No Such Order");
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Orders List
const getOrders = async (req, res) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 10,
      startingDate,
      endingDate,
    } = req.query;

    let filter = {};

    // Date
    if (startingDate) {
      const date = new Date(startingDate);
      filter.createdAt = { $gte: date };
    }
    if (endingDate) {
      const date = new Date(endingDate);
      filter.createdAt = { ...filter.createdAt, $lte: date };
    }

    if (status) {
      if (!isValidStatus(status)) {
        throw Error("Not a valid status");
      }
      filter.status = status;
    } else {
      filter.status = {
        $in: [
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
          "returned",
        ],
      };
    }

    if (search) {
      if (mongoose.Types.ObjectId.isValid(search)) {
        filter._id = search;
      } else {
        const searchAsNumber = Number(search);
        if (!isNaN(searchAsNumber)) {
          filter.orderId = searchAsNumber;
        } else {
          throw new Error("Please search using order Id");
        }
      }
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter, {
      address: 0,
      statusHistory: 0,
      products: { $slice: 1 },
    })
      .skip(skip)
      .limit(limit)
      .populate("user", { firstName: 1, lastName: 1 })
      .populate("products.productId", { imageURL: 1, name: 1 })
      .sort({ createdAt: -1 });

    const totalAvailableOrders = await Order.countDocuments(filter);

    res.status(200).json({ orders, totalAvailableOrders });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Get Orders List
const getManagerOrders = async (req, res) => {
  try {
    console.log(req.params.id);
    
    const orders = await managerOrderModel.find({ managerId: req.params.id });
    console.log("orders");
    console.log(orders);
    
    const totalAvailableOrders = orders.length;

    res.status(200).json({ orders, totalAvailableOrders });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Updating the status of orders.
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    
    let find = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      find._id = id;
    } else {
      find.orderId = id;
    }
    const { status, description, date, paymentStatus,trackingId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw Error("Invalid ID!!!");
    }

    const statusExists = await Order.findOne({
      ...find,
      "statusHistory.status": status,
    });

    let updateOptions = {
      $set: {
        status,
      },
    };
    let updateOptionstrack = {
      $set: {
        trackingId,
      },
    };

    if (!statusExists) {
      updateOptions.$push = {
        statusHistory: {
          status,
          description,
          trackingId,
          date: new Date(date),
        },
      };
    }

    await Order.findOneAndUpdate(find, updateOptionstrack, {
      new: true,
    });

    const updated = await Order.findOneAndUpdate(find, updateOptions, {
      new: true,
    });

    if (!updated) {
      throw Error("Something went wrong");
    }

    if (paymentStatus === "yes") {
      await Payment.create({
        order: updated._id,
        payment_id: `cod_${uuid.v4()}`,
        user: updated.user,
        status: "success",
        paymentMode: "cashOnDelivery",
      });
    }

    if (paymentStatus === "no") {
      await Payment.create({
        order: updated._id,
        user: updated.user,
        status: "pending",
        paymentMode: "cashOnDelivery",
      });
    }

    const order = await Order.findOne(find, {
      address: 0,
      products: { $slice: 1 },
    })
      .populate("user", { firstName: 1, lastName: 1 })
      .populate("products.productId", { imageURL: 1, name: 1 });

    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Generating pdf invoices
const generateOrderInvoice = async (req, res) => {
  try {

//     const Recipient = require("mailersend").Recipient;
// const EmailParams = require("mailersend").EmailParams;
// const MailerSend = require("mailersend");

// const mailersend = new MailerSend({
//   apiKey: "mlsn.8f84babf8e239be21d64fa2fecbac1b427eec82d1e3fb9f8d7b7a584d387e26b",
// });

// const recipients = [new Recipient("govindhans10@gmail.com", "Govind")];

// const emailParams = new EmailParams()
//   .setFrom("info@domain.com")
//   .setFromName("Your Name")
//   .setRecipients(recipients)
//   .setSubject("Subject")
//   .setHtml("Greetings from the team, you got this message through MailerSend.")
//   .setText("Greetings from the team, you got this message through MailerSend.");

// mailersend.send(emailParams);

//     var nodemailer = require("nodemailer");

    
// const transporter = nodemailer.createTransport({
//   host: "smtp.mailersend.net",
//   port: 587,
//   secure: false, // true for port 465, false for other ports
//   auth: {
//     user: "MS_R5fALu@trial-v69oxl5nxddl785k.mlsender.net",
//     pass: "oPcQ1mNZ7tHAVwnu",
//   },
// });

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
//     to: "govindhans10@gmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }

// main().catch(console.error);

    // var mailOptions = {
    //   from: "manavalanrockz24@gmail.com",
    //   to: "govindhans10@gmail.com",
    //   subject: "Sending Email using Node.js",
    //   text: "That was easy!",
    // };

    const { id } = req.params;

    let find = {};

    if (mongoose.Types.ObjectId.isValid(id)) {
      find._id = id;
    } else {
      find.orderId = id;
    }

    const order = await Order.findOne(find).populate("products.productId");

    const pdfBuffer = await generateInvoicePDF(order);

    // Set headers for the response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");

    res.status(200).end(pdfBuffer);
  } catch (error) {
    console.log(error);
    
    res.status(400).json({ error: error.message, err: "err" });
  }
};

// Clearing all orders only for testing
const clearOrder = async (req, res) => {
  try {
    const data = await Order.deleteMany({});

    res.status(200).json({ status: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getOrders,
  getManagerOrders,
  getManagerOrder,
  clearOrder,
  updateOrderStatus,
  getOrder,
  generateOrderInvoice,
};
