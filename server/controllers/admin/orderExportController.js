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
      // Define columns with label, key, and fixed widths to ensure they fit on A4 Landscape (841.89 wide, 741.89 usable)
      const columns = [
        { label: "Name", key: "user.firstName", width: 120 },
        { label: "Email", key: "user.email", width: 160 },
        { label: "Status", key: "status", width: 80 },
        { label: "Address", key: "address.address", width: 300 },
        { label: "Price", key: "totalPrice", width: 80 },
      ];

      // Compute x positions for each column
      const startX = 50;
      const xPositions = [];
      let currentX = startX;
      columns.forEach((col) => {
        xPositions.push(currentX);
        currentX += col.width;
      });

      // Table row generator handling multi-line text and tracking max height
      const generateTableRow = (values, isHeader = false) => {
        if (isHeader) {
          doc.font("Helvetica-Bold");
        } else {
          doc.font("Helvetica");
        }

        // Measure row height before drawing to handle page breaks safely
        let rowHeight = 0;
        values.forEach((value, index) => {
          const colWidth = columns[index].width - 10;
          const h = doc.heightOfString(value, { width: colWidth });
          if (h > rowHeight) {
            rowHeight = h;
          }
        });

        // A4 Landscape height is 595.28. Bottom margin is 50. Usable bottom is ~545.
        // If this row doesn't fit on the current page, add a new page.
        if (doc.y + rowHeight > 540) {
          doc.addPage();
        }

        const startY = doc.y;
        let maxY = startY;

        values.forEach((value, index) => {
          const x = xPositions[index];
          const colWidth = columns[index].width - 10; // 10px padding

          // doc.text automatically wraps text if width is provided
          doc.text(value, x, startY, {
            width: colWidth,
            align: "left",
          });

          // Track the tallest cell in the row
          if (doc.y > maxY) {
            maxY = doc.y;
          }
        });

        // Set y to the tallest cell's y to avoid overlap in the next row
        doc.y = maxY;
      };

      // Print headers with styling (friendly labels)
      generateTableRow(columns.map((c) => c.label), true);

      // Add a line under the headers
      doc.moveTo(50, doc.y + 5).lineTo(790, doc.y + 5).lineWidth(1).strokeColor("#000").stroke();
      doc.y += 15; // Move down below the line

      // Loop through orders and add content manually
      orderData.forEach((item) => {
        generateTableRow(
          columns.map((col) => {
            const val = item[col.key];
            return val !== null && val !== undefined ? String(val) : "";
          }),
          false
        );

        doc.moveDown(0.5); // Add a small gap between rows
        
        // Add a subtle line under each row
        doc.moveTo(50, doc.y).lineTo(790, doc.y).lineWidth(0.5).strokeColor("#ccc").stroke();
        doc.y += 10;
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
