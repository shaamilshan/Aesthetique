const mongoose = require('mongoose');
require('dotenv').config();
const Counter = require('./model/counterModel');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const counterKey = 'Invoice_FY_26-27';
  const counter = await Counter.findOne({ model: counterKey, field: 'invoiceSeq' });
  if (counter) {
    console.log('Current counter:', counter.count);
    counter.count = 0;
    await counter.save();
    console.log('Counter reset to 0');
  } else {
    console.log('No counter found for', counterKey);
  }
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
