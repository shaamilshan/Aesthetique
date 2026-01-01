const Order = require("../../model/orderModel");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const csv = require("csv");
const stringify = csv.stringify;

// Generating Excel sheet for orders.
const generateOrderExcel = async (req, res) => {
  const { startingDate, endingDate } = req.query;

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    worksheet.columns = [
      { header: "Order ID", key: "_id", width: 20 },
      { header: "User ID", key: "user._id", width: 20 },
      { header: "User Name", key: "user.firstName" },
      { header: "User Email", key: "user.email" },
      { header: "Status", key: "status" },
      { header: "Address", key: "address.address", width: 35 },
      { header: "City", key: "address.city" },
      { header: "Products", key: "products", width: 40 },
      { header: "Subtotal", key: "subTotal" },
      { header: "Shipping", key: "shipping" },
      { header: "Tax", key: "tax" },
      { header: "Total Price", key: "totalPrice" },
    ];

    // Filtering based on dates. If they are provided along the URL as query
    const filter = {};
    if (startingDate) {
      const date = new Date(startingDate);
      filter.createdAt = { $gte: date };
    }
    if (endingDate) {
      const date = new Date(endingDate);
      filter.createdAt = { ...filter.createdAt, $lte: date };
    }

    // Fetching all the orders
    const orders = await Order.find(filter).populate([
      "user",
      "address",
      "statusHistory",
      "products",
      "products.productId",
    ]);

    orders.map((item) => {
      const productsDetails = (item.products || [])
        .map((product) => {
          const name = product?.productId?.name || "(product removed)";
          const qty = product?.quantity ?? "-";
          const price = product?.price ?? "-";
          return `${name} (${qty} units, ₹${price} each)`;
        })
        .join("\n");

      const row = {
        _id: item._id ? item._id.toString() : "",
        "user._id": item.user?._id ? item.user._id.toString() : "",
        "user.firstName": (item.user?.firstName || "") + (item.user?.lastName ? " " + item.user.lastName : ""),
        "user.email": item.user?.email || "",
        status: item.status || "",
        "address.address": item.address?.address || "",
        "address.city": item.address?.city || "",
        products: productsDetails,
        subTotal: item.subTotal ?? "",
        shipping: item.shipping ?? "",
        tax: item.tax ?? "",
        totalPrice: item.totalPrice ?? "",
      };

      worksheet.addRow(row);
    });

    // Set headers for the response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=orders.xlsx");

    const buffer = await workbook.xlsx.writeBuffer();

    res.send(buffer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Generating CSV for orders
const generateOrderCSV = async (req, res) => {
  const { startingDate, endingDate } = req.query;

  try {
    // Filtering based on dates. If they are provided along the URL as query
    const filter = {};
    if (startingDate) {
      const date = new Date(startingDate);
      filter.createdAt = { $gte: date };
    }
    if (endingDate) {
      const date = new Date(endingDate);
      filter.createdAt = { ...filter.createdAt, $lte: date };
    }

    // Fetching all the orders
    const orders = await Order.find(filter).populate([
      "user",
      "address",
      "statusHistory",
      "products",
      "products.productId",
    ]);

    const csvData = [];

    // Headers
    const headers = [
      "Order ID",
      "User ID",
      "User Name",
      "User Email",
      "Status",
      "Address",
      "City",
      "Products",
      "Subtotal",
      "Shipping",
      "Tax",
      "Total Price",
    ];

    csvData.push(headers);

    orders.forEach((item) => {
      const productsDetails = (item.products || [])
        .map((product) => {
          const name = product?.productId?.name || "(product removed)";
          const qty = product?.quantity ?? "-";
          const price = product?.price ?? "-";
          return `${name} (${qty} units, ₹${price} each)`;
        })
        .join("\n");

      const row = [
        item._id ? item._id.toString() : "",
        item.user?._id ? item.user._id.toString() : "",
        (item.user?.firstName || "") + (item.user?.lastName ? " " + item.user.lastName : ""),
        item.user?.email || "",
        item.status || "",
        item.address?.address || "",
        item.address?.city || "",
        productsDetails,
        item.subTotal ?? "",
        item.shipping ?? "",
        item.tax ?? "",
        item.totalPrice ?? "",
      ];

      csvData.push(row);
    });

    // Set headers for the response
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=orders.csv");

    // Convert the CSV data to a string and send it in the response
    stringify(csvData, { quoted: true }, (err, output) => {
      if (err) {
        return res.status(500).json({ error: "Failed to generate CSV" });
      }

      res.send(output);
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Generate PDF function

const generatePDF = async (orderData) => {
  return new Promise((resolve, reject) => {
    try {
  // Use a wider page (A4 landscape) so table content fits horizontally
  const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 50 });

      const buffers = [];
      doc.on("data", (buffer) => buffers.push(buffer));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (error) => reject(error));

      doc.text("Order History", { align: "center", fontSize: 18 }).moveDown();

      // Headers
      // Keep only the requested fields in the PDF: Username, Status, Address, Total Price
      // Define columns with label and key so we can show friendly headers and map data
      const columns = [
        { label: "Name", key: "user.firstName" },
        { label: "Email", key: "user.email" },
        { label: "Status", key: "status" },
        { label: "Address", key: "address.address" },
        { label: "Price", key: "totalPrice" },
      ];

      // Calculate column widths based on labels and data (approximate pixel widths)
      const columnCharWidths = columns.map((col) =>
        Math.max(
          col.label.length,
          ...orderData.map((item) => String(item[col.key] || "").length)
        )
      );

      // Convert character counts to approximate pixel widths and add padding
      const pixelWidths = columnCharWidths.map((w) => w * 7 + 24); // ~7px per char + padding

      // Add extra gap between Email (index 1) and Status (index 2)
      const extraGapAfterEmail = 40;

      // Compute x positions for each column
      const startX = 50;
      const xPositions = [];
      (function computeXPositions() {
        let x = startX;
        for (let i = 0; i < pixelWidths.length; i++) {
          xPositions.push(x);
          x += pixelWidths[i] + 12; // base padding between columns
          if (i === 1) x += extraGapAfterEmail; // extra space after Email column
        }
      })();

      // Table row with bottom line using computed x positions
      const generateTableRow = (y, values) => {
        values.forEach((value, index) => {
          const x = xPositions[index] || (50 + index * 100);
          doc.text(value, x, y);
          if (index < values.length - 1) {
            const nextX = xPositions[index + 1] || (50 + (index + 1) * 100);
            doc.moveTo(nextX, y).lineTo(nextX, y + 15);
          }
        });
      };

  // Print headers with styling (friendly labels)
  generateTableRow(doc.y + 10, columns.map((c) => c.label));

      doc.moveDown();

      // Loop through orders and add content manually
      orderData.forEach((item) => {
        generateTableRow(
          doc.y,
          columns.map((col) => String(item[col.key] || ""))
        );

        doc.moveDown(); // Move down for the next row
      });

      // End the document
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Controller function for Generating PDF for orders
const generateOrderPDF = async (req, res) => {
  const { startingDate, endingDate } = req.query;

  try {
    // Filtering based on dates. If they are provided along the URL as query
    const filter = {};
    if (startingDate) {
      const date = new Date(startingDate);
      filter.createdAt = { $gte: date };
    }
    if (endingDate) {
      const date = new Date(endingDate);
      filter.createdAt = { ...filter.createdAt, $lte: date };
    }

    // Fetching all the orders
    const orders = await Order.find(filter).populate([
      "user",
      "address",
      "statusHistory",
      "products",
      "products.productId",
    ]);

    // Normalize orders into a flat structure matching PDF headers to avoid nested key lookups
    // Note: we intentionally omit _id and user._id from the PDF export per UI request
    // Only include fields requested for PDF export
    const orderDataFlat = orders.map((item) => ({
      "user.firstName": (item.user?.firstName || "") + (item.user?.lastName ? " " + item.user.lastName : ""),
      "user.email": item.user?.email || "",
      status: item.status || "",
      "address.address": item.address?.address || "",
      totalPrice: item.totalPrice ?? "",
    }));

    const pdfBuffer = await generatePDF(orderDataFlat);

    // Set headers for the response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=orders.pdf");

    res.status(200).end(pdfBuffer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  generateOrderExcel,
  generateOrderCSV,
  generateOrderPDF,
};
