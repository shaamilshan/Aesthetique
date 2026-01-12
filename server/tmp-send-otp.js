const { sendOTPMail } = require('./util/mailFunction');

(async function(){
  try {
    console.log('Sending OTP test mail...');
    const res = await sendOTPMail('ottestuser123@example.com', '995515');
    console.log('sendOTPMail returned:', res);
  } catch (e) {
    console.error('Error in sendOTPMail test:', e);
  }
})();