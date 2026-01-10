const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const otpSchema = new mongoose.Schema({}, { strict: false, collection: 'otps' });
const OTP = mongoose.model('OTP', otpSchema);

(async function(){
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const otps = await OTP.find({}).sort({ createdAt: -1 }).limit(5).lean();
    console.log('Recent OTPs:', otps);
    await mongoose.disconnect();
  } catch(e){
    console.error(e);
    process.exit(1);
  }
})();
