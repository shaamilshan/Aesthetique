const PDFDocument = require("pdfkit");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

// Table Row with Bottom Line
function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
  c2 = (c2 || "").slice(0, 40);

  doc
    .fontSize(10)
    .text(c1, 50, y)
    .text(c2, 100, y)
    .text(c3, 280, y, { width: 90, align: "right" })
    .text(c4, 370, y, { width: 90, align: "right" })
    .text(c5, 0, y, { align: "right" })
    .moveTo(50, y + 15)
    .lineTo(560, y + 15)
    .lineWidth(0.5)
    .strokeColor("#ccc")
    .stroke();
}

// Table row without bottom line
function generateTableRowNoLine(doc, y, c1, c2, c3, c4, c5) {
  c2 = (c2 || "").slice(0, 40);

  doc
    .fontSize(10)
    .text(c1, 50, y)
    .text(c2, 100, y)
    .text(c3, 280, y, { width: 90, align: "right" })
    .text(c4, 370, y, { width: 90, align: "right" })
    .text(c5, 0, y, { align: "right" });
}

// Generating Invoice for customers
const generateInvoicePDF = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });

      const buffers = [];
      doc.on("data", (buffer) => buffers.push(buffer));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (error) => reject(error));

      // Header for the PDF - professional layout with logo, company name and contact
      const contactInfo = {
        email: "trendkartonline@gmail.com",
        phone: "+91 90373 95052",
        addressLine:
          "Trend Kart, Karassery junction, Mukkam, Calicut, Kerala, India 673602",
      };

      // Prefer the client-side logo used in the navbar, else fall back to server public logo
      try {
        const preferredLogoPaths = [
          path.join(process.cwd(), "client", "src", "assets", "others", "bm-logo.png"),
          path.join(process.cwd(), "public", "official", "Logo.svg"),
          path.join(process.cwd(), "server", "public", "official", "Logo.svg"),
        ];

        let logoPlaced = false;
        for (const p of preferredLogoPaths) {
          if (fs.existsSync(p)) {
            try {
              doc.image(p, 50, 50, { width: 80 });
              logoPlaced = true;
              break;
            } catch (e) {
              // continue to next path
            }
          }
        }
      } catch (e) {
        // ignore image errors and continue generating PDF
      }

      // Company name / left header
      doc.fillColor("#222222").fontSize(18).font("Helvetica-Bold").text("BM Aesthetique Inc.", 140, 55);

      // Contact details on the right
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#444444")
        .text(contactInfo.email, 350, 55, { align: "right" })
        .text(contactInfo.phone, { align: "right" })
        .moveDown(0.2)
        .text(contactInfo.addressLine, { align: "right", width: 220 })
        .moveDown();

      // Draw a subtle separator
      doc.moveTo(50, 120).lineTo(560, 120).lineWidth(0.5).strokeColor("#e6e6e6").stroke();

      // Invoice title and meta box
      doc.fontSize(20).font("Helvetica-Bold").fillColor("#111111").text("INVOICE", 50, 135);

      const metaTop = 140;
      const metaLeft = 380;
      doc.roundedRect(metaLeft, metaTop, 170, 60, 4).fillOpacity(0.03).fillAndStroke("#000000", "#f0f0f0");
      doc.fillOpacity(1).fillColor("#000").fontSize(10).font("Helvetica");
      doc.text(`Order ID: ${order?.orderId ? order.orderId : order?._id || ""}`, metaLeft + 8, metaTop + 8);
      doc.text(`Date: ${order?.createdAt ? moment(new Date(order.createdAt)).format("DD/MM/YYYY") : ""}`, metaLeft + 8, metaTop + 24);
      doc.text(`Payment: ${order?.paymentMode || ""}`, metaLeft + 8, metaTop + 40);

      // Billing / Shipping block
      const billTop = 210;
      doc.fontSize(11).font("Helvetica-Bold").text("Bill To:", 50, billTop);
      doc.fontSize(10).font("Helvetica");
      const billName = (order?.address?.firstName || "") + " " + (order?.address?.lastName || "");
      doc.text(billName, 50, billTop + 16);
      doc.text(order?.address?.address || "", 50, billTop + 32);
      doc.text(`${order?.address?.city || ""}, ${order?.address?.regionState || ""}, ${order?.address?.country || ""} - ${order?.address?.pinCode || ""}`, 50, billTop + 48);
      doc.text(order?.address?.phoneNumber || "", 50, billTop + 64);

      // Order summary / totals area label to the right of bill
      doc.fontSize(11).font("Helvetica-Bold").text("Summary:", 350, billTop);
      doc.fontSize(10).font("Helvetica");
      doc.text(`Subtotal: ${order?.subTotal ?? 0}`, 350, billTop + 18);
      doc.text(`Tax: ${order?.tax ?? 0}`, 350, billTop + 34);
      doc.text(`Total: ${order?.totalPrice ?? 0}`, 350, billTop + 50);

      // Products
      let i;
      const invoiceTableTop = 330;

      // Table Header
      generateTableRow(
        doc,
        invoiceTableTop,
        "SL No",
        "Product Name",
        "Price",
        "Quantity",
        "Sub Total"
      );

      const products = Array.isArray(order?.products) ? order.products : [];
      for (i = 0; i < products.length; i++) {
        const item = products[i];
        const position = invoiceTableTop + (i + 1) * 30;

        generateTableRow(
          doc,
          position,
          i + 1,
          item?.productId?.name || "",
          item?.price ?? "",
          item?.quantity ?? "",
          (item?.price ?? 0) * (item?.quantity ?? 0)
        );
      }

      const subtotalPosition = invoiceTableTop + (i + 1) * 30;
      generateTableRowNoLine(
        doc,
        subtotalPosition,
        "",
        "",
        "Subtotal",
        "",
        order?.subTotal ?? ""
      );

      const paidToDatePosition = subtotalPosition + 30;
      generateTableRowNoLine(
        doc,
        paidToDatePosition,
        "",
        "",
        "Tax",
        "",
        order?.tax ?? ""
      );

      const duePosition = paidToDatePosition + 30;
      generateTableRowNoLine(
        doc,
        duePosition,
        "",
        "",
        "Total",
        "",
        order?.totalPrice ?? ""
      );

      // Footer for the PDF
      doc
        .fontSize(10)
        .text(
          "Payment has been received. Thank you for your business.",
          50,
          700,
          { align: "center", width: 500 }
        );

      // End the document
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateInvoicePDF,
};
