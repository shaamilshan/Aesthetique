const PDFDocument = require("pdfkit");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

// Table Row with Bottom Line — 7 columns for GST invoice
function generateTableRow(doc, y, c1, c2, c3, c4, c5, c6, c7) {
  c2 = (c2 || "").slice(0, 32);

  doc
    .fontSize(8)
    .text(c1, 50, y, { width: 25 })
    .text(c2, 78, y, { width: 150 })
    .text(c3, 230, y, { width: 60, align: "center" })
    .text(c4, 295, y, { width: 40, align: "center" })
    .text(c5, 340, y, { width: 50, align: "center" })
    .text(c6, 395, y, { width: 80, align: "right" })
    .text(c7, 480, y, { width: 80, align: "right" })
    .moveTo(50, y + 15)
    .lineTo(560, y + 15)
    .lineWidth(0.5)
    .strokeColor("#ccc")
    .stroke();
}

// Table row without bottom line — for summary rows (label + value aligned to table)
function generateSummaryRow(doc, y, label, value, bold) {
  if (bold) doc.font("Helvetica-Bold");
  doc
    .fontSize(8)
    .text(label, 395, y, { width: 85, align: "right" })
    .text(value, 480, y, { width: 80, align: "right" });
  if (bold) doc.font("Helvetica");
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
        email: "help.bmaesthetique@gmail.com",
        phone: "7539995287",
        gstin: "33AAMCB7228C1ZW",
        addressLine: "2nd floor, No-16, Alex Square,\nopposite to Amirtha School, Ettimadai,\nCoimbatore, Tamil Nadu\nPIN CODE - 641112",
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
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("BEST MED AESTHETIQUE PRIVATE LIMITED", 140, 50, { width: 200 });

      // Contact details on the right (explicitly right-aligned)
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#444444")
        .text("BEST MED AESTHETIQUE PVT LTD", 350, 50, { align: "right", width: 210 })
        .text(contactInfo.addressLine, 350, 62, { align: "right", width: 210 })
        .text(`GSTIN NO: ${contactInfo.gstin}`, 350, 110, { align: "right", width: 210 })
        .text(`PH NO : ${contactInfo.phone}`, 350, 123, { align: "right", width: 210 })
        .text(contactInfo.email, 350, 136, { align: "right", width: 210 });

      // Draw a subtle separator under header (moved down to accommodate info)
      doc.moveTo(50, 155).lineTo(560, 155).lineWidth(0.5).strokeColor("#e6e6e6").stroke();

      // Invoice title
      doc.fontSize(20).font("Helvetica-Bold").fillColor("#111111").text("TAX INVOICE", 50, 170);

      // Order meta lines below the invoice heading (no outline)
      const metaTop = 205;
      doc.fillColor("#000").fontSize(10).font("Helvetica");
      const orderNum = order?.orderId ? order.orderId : order?._id || "";
      const invoiceNum = order?.invoiceNumber || `INV-${orderNum}`;
      doc.text(`INVOICE NO : ${invoiceNum}`, 50, metaTop);
      doc.text(`ORDER NO : ${orderNum}`, 50, metaTop + 16);
      doc.text(`INVOICE DATE : ${order?.createdAt ? moment(new Date(order.createdAt)).format("DD/MM/YYYY") : ""}`, 50, metaTop + 32);
      // Format payment mode for display
      const paymentModeLabels = { cashOnDelivery: "Cash on Delivery", razorPay: "Razorpay", myWallet: "Wallet" };
      const paymentLabel = paymentModeLabels[order?.paymentMode] || order?.paymentMode || "";
      doc.text(`PAYMENT MODE : ${paymentLabel}`, 50, metaTop + 48);

      // Billing / Shipping block (moved down to create clear gap from payment/meta)
      const billTop = 285;
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
      const invoiceTableTop = Math.max(370, billTop + (order?.notes ? 160 : 120));

      // Table Header — 7 columns for GST invoice
      generateTableRow(
        doc,
        invoiceTableTop,
        "#",
        "Product",
        "HSN",
        "Qty",
        "GST %",
        "Rate",
        "Taxable Amount"
      );

      // Table body — reverse-calculate GST from inclusive price
      const products = Array.isArray(order?.products) ? order.products : [];
      let totalTaxableAmount = 0;
      let totalGstAmount = 0;

      for (i = 0; i < products.length; i++) {
        const item = products[i];
        const position = invoiceTableTop + (i + 1) * 30;

        const unitPrice = Number(item?.price) || 0;
        const qty = Number(item?.quantity) || 0;
        const lineTotal = unitPrice * qty;

        // Get GST % and HSN from the populated product reference
        const gstPercent = Number(item?.productId?.gstPercent) || 0;
        const hsnCode = item?.productId?.hsnCode || "";

        // Reverse-calculate: price is GST-inclusive
        // Base (taxable) = lineTotal / (1 + gstPercent/100)
        let taxableAmt = lineTotal;
        let gstAmt = 0;
        if (gstPercent > 0) {
          taxableAmt = lineTotal / (1 + gstPercent / 100);
          gstAmt = lineTotal - taxableAmt;
        }

        totalTaxableAmount += taxableAmt;
        totalGstAmount += gstAmt;

        generateTableRow(
          doc,
          position,
          String(i + 1),
          item?.productId?.name || "",
          hsnCode,
          String(qty),
          gstPercent > 0 ? `${gstPercent}%` : "-",
          (unitPrice / (1 + gstPercent / 100)).toFixed(2),
          taxableAmt.toFixed(2)
        );
      }

      // Summary rows
      const subtotalPosition = invoiceTableTop + (i + 1) * 30;
      generateSummaryRow(doc, subtotalPosition, "MRP", `Rs. ${(order?.subTotal ?? 0).toFixed(2)}`);

      // Taxable Amount row
      const taxablePosition = subtotalPosition + 18;
      generateSummaryRow(doc, taxablePosition, "Taxable Amount", `Rs. ${totalTaxableAmount.toFixed(2)}`);

      // GST total row (adjusted position)
      const gstPosition = taxablePosition + 18;
      generateSummaryRow(doc, gstPosition, "Total GST", `Rs. ${totalGstAmount.toFixed(2)}`);

      // Shipping row
      const shippingPosition = gstPosition + 18;
      const shippingAmt = Number(order?.shipping) || 0;
      generateSummaryRow(doc, shippingPosition, "Shipping", shippingAmt > 0 ? `Rs. ${shippingAmt.toFixed(2)}` : "Free");

      // Grand total (same as order.totalPrice — includes product prices + shipping)
      const totalPosition = shippingPosition + 22;
      generateSummaryRow(doc, totalPosition, "Total", `Rs. ${(order?.totalPrice ?? 0).toFixed(2)}`, true);

      // GST note explaining that product prices are inclusive of GST
      const notePosition = totalPosition + 30;
      doc.fontSize(8).fillColor("#666").text("* Product prices are inclusive of GST.", 50, notePosition, { width: 510 });

      // Totals are shown below the products table (no separate summary box)

      // Footer for the PDF
      doc
        .fontSize(10)
        .fillColor("#000000")
        .text(
          "Payment has been received. Thank you for your Order.",
          50,
          700,
          { align: "center", width: 500 }
        );

      // Computer-generated notice just below the footer with 60% opacity
      doc
        .fontSize(8)
        .opacity(0.6)
        .text(
          "This is a Computer Generated Invoice",
          50,
          718,
          { align: "center", width: 500 }
        )
        .opacity(1); // reset opacity

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
