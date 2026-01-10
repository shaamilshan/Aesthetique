const mailSender = require('./util/mailSender');

(async function(){
  try {
    console.log('Sending test mail...');
    const res = await mailSender('ottestuser123@example.com', 'Test Subject', '<p>This is a test</p>');
    console.log('mailSender returned:', res);
  } catch (e) {
    console.error('Error in test mail:', e);
  }
})();
