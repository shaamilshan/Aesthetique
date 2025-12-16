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
        email: "bmaesthetique@gmail.com",
        phone: "+91 12345 12345",
        addressLine: `Coimbatore, Tamil Nadu\nOpposite Amirtha School`,
      };

      // Prefer the client-side logo used in the navbar, else fall back to server public logo
      try {
        // Try a few likely logo locations (PNG/JPEG preferred for pdfkit).
        // Use __dirname-based paths first so the generator works regardless of
        // the current working directory when the server is started.
        const repoRootFromThisFile = path.join(__dirname, '..', '..', '..');
        const preferredLogoPaths = [
          // Direct client asset used by Navbar
          path.join(repoRootFromThisFile, "client", "src", "assets", "others", "bm-logo.png"),
          path.join(repoRootFromThisFile, "client", "src", "assets", "others", "logo.png"),
          // Also try process.cwd() based locations (covers cases where server is started from repo root)
          path.join(process.cwd(), "client", "src", "assets", "others", "bm-logo.png"),
          path.join(process.cwd(), "client", "src", "assets", "others", "logo.png"),
          path.join(process.cwd(), "client", "public", "logo.png"),
          path.join(process.cwd(), "public", "official", "logo.png"),
          path.join(process.cwd(), "public", "official", "Logo.png"),
          path.join(process.cwd(), "server", "public", "official", "logo.png"),
          path.join(process.cwd(), "server", "public", "official", "Logo.png"),
          // Fallback to svg if nothing else found (pdfkit may not support svg directly)
          path.join(process.cwd(), "public", "official", "Logo.svg"),
          path.join(process.cwd(), "server", "public", "official", "Logo.svg"),
        ];

        for (const p of preferredLogoPaths) {
          try {
            if (!fs.existsSync(p)) continue;

            // Read file buffer and let pdfkit handle common raster formats
            const buffer = fs.readFileSync(p);
            // pdfkit supports PNG/JPEG buffers. For SVGs this may throw, so wrap in try/catch.
            try {
              doc.image(buffer, 50, 50, { width: 80 });
              break;
            } catch (innerErr) {
              // If svg was found and pdfkit couldn't draw it, ignore and continue
              continue;
            }
          } catch (e) {
            // ignore and continue
            continue;
          }
        }
      } catch (e) {
        // ignore image errors and continue generating PDF
      }

      // Company name / left header (logo already placed at left)
      doc
        .fillColor("#222222")
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("BM Aesthetique Inc.", 140, 50);

      // Contact details on the right (explicitly right-aligned)
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#444444")
        .text(contactInfo.email, 350, 50, { align: "right", width: 210 })
        .text(contactInfo.phone, 350, 66, { align: "right", width: 210 })
        .text(contactInfo.addressLine, 350, 82, { align: "right", width: 210 });

      // Draw a subtle separator under header
      doc.moveTo(50, 125).lineTo(560, 125).lineWidth(0.5).strokeColor("#e6e6e6").stroke();

      // Invoice title
      doc.fontSize(20).font("Helvetica-Bold").fillColor("#111111").text("INVOICE", 50, 138);

      // Order meta lines below the invoice heading (no outline)
      const metaTop = 170;
      doc.fillColor("#000").fontSize(10).font("Helvetica");
      doc.text(`Order ID: ${order?.orderId ? order.orderId : order?._id || ""}`, 50, metaTop);
      doc.text(`Date: ${order?.createdAt ? moment(new Date(order.createdAt)).format("DD/MM/YYYY") : ""}`, 50, metaTop + 16);
      doc.text(`Payment: ${order?.paymentMode || ""}`, 50, metaTop + 32);

  // Billing / Shipping block (moved down to create clear gap from payment/meta)
  const billTop = 230;
      doc.fontSize(11).font("Helvetica-Bold").text("Bill To:", 50, billTop);
      doc.fontSize(10).font("Helvetica");
      const billName = (order?.address?.firstName || "") + " " + (order?.address?.lastName || "");
      doc.text(billName, 50, billTop + 18);
      doc.text(order?.address?.address || "", 50, billTop + 34);
      doc.text(`${order?.address?.city || ""}, ${order?.address?.regionState || ""}, ${order?.address?.country || ""} - ${order?.address?.pinCode || ""}`, 50, billTop + 50);
      doc.text(order?.address?.phoneNumber || "", 50, billTop + 66);

      // Customer notes (if provided) appear under billing
      if (order?.notes) {
        doc.moveDown(0.2);
        doc.fontSize(10).fillColor("#333").text("Notes:", 50, billTop + 86);
        doc.fontSize(9).fillColor("#555").text(order.notes, 50, billTop + 100, { width: 260 });
      }

  // Products
  let i;
  // Compute table top dynamically so it doesn't overlap the billing/notes area.
  // Leave at least 120px below the billing top; if notes exist give extra space.
  const invoiceTableTop = Math.max(330, billTop + (order?.notes ? 160 : 120));

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

  // Table body
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
      generateTableRowNoLine(doc, subtotalPosition, "", "", "Subtotal", "", order?.subTotal ?? "");

      const paidToDatePosition = subtotalPosition + 20;
      generateTableRowNoLine(doc, paidToDatePosition, "", "", "Tax", "", order?.tax ?? "");

      const duePosition = paidToDatePosition + 20;
      generateTableRowNoLine(doc, duePosition, "", "", "Total", "", order?.totalPrice ?? "");

  // Totals are shown below the products table (no separate summary box)

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
