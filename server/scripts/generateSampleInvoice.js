const fs = require('fs');
const path = require('path');

// Require the invoice generator
const { generateInvoicePDF } = require('../controllers/Common/invoicePDFGenFunctions');

async function run() {
  try {
    // Minimal sample order object matching what the generator expects
    const sampleOrder = {
      orderId: 123456,
      createdAt: new Date(),
      paymentMode: 'card',
      address: {
        firstName: 'John',
        lastName: 'Doe',
        address: '12 Example Street',
        city: 'Mukkam',
        regionState: 'Kerala',
        country: 'India',
        pinCode: '673602',
        phoneNumber: '+91 9000090000',
      },
      products: [
        {
          productId: { name: 'Sample Product A' },
          price: 499,
          quantity: 1,
        },
        {
          productId: { name: 'Sample Product B with a longer name to test truncation' },
          price: 299,
          quantity: 2,
        },
      ],
      subTotal: 1097,
      tax: 0,
      totalPrice: 1097,
    };

    const buffer = await generateInvoicePDF(sampleOrder);

    const outPath = path.join(process.cwd(), 'sample-invoice.pdf');
    fs.writeFileSync(outPath, buffer);
    console.log('Sample invoice written to:', outPath);
  } catch (err) {
    console.error('Failed to generate sample invoice:', err);
    process.exitCode = 1;
  }
}

run();
