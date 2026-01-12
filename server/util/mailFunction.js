const mailSender = require("./mailSender");
const axios = require("axios");

// small helpers to escape user-provided values when interpolating into HTML
const escapeHtml = (str = "") => {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const escapeAttr = (str = "") => {
  return escapeHtml(str).replace(/\n/g, "");
};

const sendEnquiryMail = async (email, enquiryData) => {
  const {
    name,
    description,
    stockQuantity,
    category,
    imageURL,
    price,
    markup,
    status,
    attributes,
    moreImageURL,
  } = enquiryData;
  console.log(enquiryData);

  const mailResponse = await mailSender(
    email,
    "Product Enquiry Details",
    `<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Product Enquiry</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
  
              h2 {
                font-weight: 500;
                color: #6b7280;
              }
      
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 40px;
                  border-radius: 10px;
                  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
              }
      
              .header {
                  background-color: #4caf50;
                  color: #ffffff;
                  padding: 10px 20px;
                  border-radius: 5px;
                  text-align: left;
              }
      
              .content {
                  margin-top: 30px;
                  font-size: 18px;
                  color: #333;
                  text-align: left;
              }
      
              .product-details {
                  margin-top: 20px;
                  border: 1px solid #ddd;
                  padding: 20px;
                  border-radius: 5px;
                  background-color: #f9f9f9;
              }
  
              .footer {
                  margin-top: 30px;
                  font-size: 14px;
                  color: #555;
                  text-align: left;
              }
            .view-button {
                background-color: #4caf50; /* Green background */
                color: white; /* White text */
                border: none; /* Remove borders */
                padding: 15px 30px; /* Some padding */
                text-align: center; /* Centered text */
                text-decoration: none; /* Remove underline */
                display: inline-block; /* Make the link behave like a button */
                font-size: 16px; /* Increase font size */
                border-radius: 5px; /* Rounded corners */
                cursor: pointer; /* Pointer cursor on hover */
                transition: background-color 0.3s; /* Smooth transition for hover effect */
              }

            .view-button:hover {
                background-color: #45a049; /* Darker green on hover */
            }
          </style>
      </head>
      
      <body>
          <div class="container">
              <h2>Product Enquiry</h2>
              <div class="header">
                  <h1>Enquiry for ${name}</h1>
              </div>
              <div class="content">
                  <p>Dear User,</p>
                  <p>Thank you for your enquiry regarding our product. Below are the details:</p>
                  <div class="product-details">
                      <p><strong>Name:</strong> ${name}</p>
                      <p><strong>Description:</strong> ${description}</p>
                      <p><strong>Category:</strong> ${category}</p>
                      <p><strong>Price:</strong> Rs. ${price}</p>
                      <p><strong>Stock Quantity:</strong> ${stockQuantity}</p>
                      <p><strong>Status:</strong> ${status}</p>
                      <p><strong>Markup:</strong> ${markup}</p>
                      <p><strong>Attributes:</strong> ${
                        attributes ? JSON.stringify(attributes) : "N/A"
                      }</p>
                     
                  </div>
                      <a href="http://localhost:5173/manager/enquiries" target="_blank" class="view-button">View</a>

              </div>
              <div class="footer">
                  <p>Best regards,</p>
                  <p>TrendKart</p>
                  <p>&copy; 2024 TrendKart. All rights reserved.</p>
              </div>
          </div>
      </body>
      
      </html>
      `
  );
  /*
  add option to view product too

 <p><strong>Image:</strong> <img src="${imageURL}" alt="${name}" style="max-width: 100%; height: auto;"></p>
                      ${
                        moreImageURL
                          ? `<p><strong>More Images:</strong> <img src="${moreImageURL}" alt="More ${name} images" style="max-width: 100%; height: auto;"></p>`
                          : ""
                      }
*/
  console.log("Enquiry email sent successfully: ", mailResponse);
};

const sendEnquiryWhtspMsg = async (email, enquiryData) => {
  const {
    name,
    description,
    stockQuantity,
    category,
    imageURL,
    price,
    markup,
    status,
    attributes,
    moreImageURL,
  } = enquiryData;
  console.log(enquiryData);

  const textMessage = `
Product Enquiry Details

Dear User,

Thank you for your enquiry regarding our product. Below are the details:

Enquiry for: ${name}

Name: ${name}
Description: ${description}
Category: ${category}
Price: Rs. ${price}
Stock Quantity: ${stockQuantity}
Status: ${status}
Markup: ${markup}
Attributes: ${attributes ? JSON.stringify(attributes) : "N/A"}

To view more details, visit: http://localhost:5173/manager/enquiries

Best regards,
TrendKart
© 2024 TrendKart. All rights reserved.
`;

  const url = "https://graph.facebook.com/v21.0/164359763435616/messages";
  const token =
    "EAAKBFCWuzvUBOwezh1JszG2bcTmdhUkBFl8EjyJUSKJpyL3IMrhdSIk4zr233eFOmkCzCGTs7piJfEG9VPjtYPZCObFwZBXZCP9TZCq9AFuj997UocyWkglTztvKyc87XFdO3ZCteC39sqAiryGmy2YchZBgE7wdEgZAM02YyhpZB6XhmbWCIPJbUjyutBlvffGd76EvqMok8ZBxpXytf09CCfZAV3pM2R";
  const data = {
    messaging_product: "whatsapp",
    to: "918921992747",
    type: "template",
    template: {
      name: "product_enquiry",
      language: { code: "en" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", parameter_name: "name", text: name },
            { type: "text", parameter_name: "description", text: description },
            { type: "text", parameter_name: "category", text: category },
            { type: "text", parameter_name: "price", text: `Rs. ${price}` },
            // {
            //   type: "text",
            //   parameter_name: "product_description",
            //   text: description,
            // },
            // {
            //   type: "text",
            //   parameter_name: "product_category",
            //   text: category,
            // },
            // {
            //   type: "text",
            //   parameter_name: "product_price",
            //   text: `Rs. ${price}`,
            // },
            // {
            //   type: "text",
            //   parameter_name: "product_stock",
            //   text: stockQuantity.toString(),
            // },
            // { type: "text", parameter_name: "product_status", text: status },
            // { type: "text", parameter_name: "product_markup", text: markup },
            // {
            //   type: "text",
            //   parameter_name: "product_attributes",
            //   text: attributes ? JSON.stringify(attributes) : "N/A",
            // },
          ],
        },
      ],
    },
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Message sent:", response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message
    );
  }

  // EAAKBFCWuzvUBOwezh1JszG2bcTmdhUkBFl8EjyJUSKJpyL3IMrhdSIk4zr233eFOmkCzCGTs7piJfEG9VPjtYPZCObFwZBXZCP9TZCq9AFuj997UocyWkglTztvKyc87XFdO3ZCteC39sqAiryGmy2YchZBgE7wdEgZAM02YyhpZB6XhmbWCIPJbUjyutBlvffGd76EvqMok8ZBxpXytf09CCfZAV3pM2R
  /*
curl -i -X POST `
  https://graph.facebook.com/v21.0/164359763435616/messages `
  -H 'Authorization: Bearer EAAKBFCWuzvUBOwezh1JszG2bcTmdhUkBFl8EjyJUSKJpyL3IMrhdSIk4zr233eFOmkCzCGTs7piJfEG9VPjtYPZCObFwZBXZCP9TZCq9AFuj997UocyWkglTztvKyc87XFdO3ZCteC39sqAiryGmy2YchZBgE7wdEgZAM02YyhpZB6XhmbWCIPJbUjyutBlvffGd76EvqMok8ZBxpXytf09CCfZAV3pM2R' `
  -H 'Content-Type: application/json' `
  -d '{ \"messaging_product\": \"whatsapp\", \"to\": \"918921992747\", \"type\": \"template\", \"template\": { \"name\": \"hello_world\", \"language\": { \"code\": \"en_US\" } } }'
*/
  //   console.log("Enquiry email sent successfully: ", mailResponse);
};

const sendOTPMail = async (email, otp) => {
  const subject = "Password Reset Code";

  // Build HTML matching the provided template style
  const mailResponse = await mailSender(
    email,
    subject,
    `<!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>${subject}</title>
      <style>
        body{font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial; background:#f7f7f9; margin:0; padding:0}
        .card{max-width:680px;margin:28px auto;background:#fff;border-radius:8px;padding:24px;box-shadow:0 6px 18px rgba(0,0,0,0.06)}
        .brand{font-weight:700;color:#0f172a;text-align:left;font-size:18px;margin-bottom:6px}
        .lead{color:#111827;font-size:15px;line-height:1.5}
        .muted{color:#6b7280;font-size:13px}
        .code{display:block;margin:18px 0;padding:18px;background:#f3f4f6;border-radius:6px;border:1px dashed #e5e7eb;text-align:center;font-size:22px;font-weight:700;letter-spacing:2px}
        a.support{color:#0f172a;font-weight:600;text-decoration:none}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="brand">BM AESTHETIQUE</div>
        <div class="lead">Hello,</div>
        <p class="muted">We received a request to reset the password for your <strong>BM Aesthetique</strong> account.</p>
        <p class="muted">Please use the verification code below to proceed with resetting your password. This code is valid for <strong>5 minutes</strong>.</p>
        <div class="code">${escapeHtml(String(otp))}</div>
        <p class="muted">If you did not request a password reset, please ignore this email. Your account remains secure and no changes have been made.</p>
        <p class="muted">If you need assistance, contact our support team at <a class="support" href="mailto:help.bmaesthetique@gmail.com">help.bmaesthetique@gmail.com</a> — we’re happy to help.</p>
        <p style="margin-top:12px">Warm regards,<br/><strong>BM Aesthetique</strong></p>
        <p style="font-size:12px;color:#9ca3af;margin-top:12px">&copy; ${new Date().getFullYear()} BM Aesthetique. All rights reserved.</p>
      </div>
    </body>
    </html>`
  );
  console.log("OTP email sent successfully: ", mailResponse);
};

const sendManagerNoti = async (email) => {
  const mailResponse = await mailSender(
    email,
    "Product Stock Notification",
    `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }

            h2 {
              font-weight:500;
              color: #6b7280;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
            }
    
            .logo {
                display: block;
                margin: 0 auto 20px;
            }
    
            .header {
                background-color: #4caf50;
                color: #ffffff;
                padding: 10px 20px;
                border-radius: 5px;
                text-align: left;
            }
    
            .otp-content {
                margin-top: 30px;
                font-size: 18px;
                color: #333;
                text-align: left;
                background-color: #f9f9f9;
                border: 1px solid #ddd;
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
                padding: 20px;
                border-radius: 5px;
            }

            .otp-nb {
              font-size: 14px;
            }
    
            .otp-code {
                font-size: 24px;
                font-weight: bold;
                color: #4caf50;
            }
    
            .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #555;
                text-align: left;
            }
        </style>
    </head>
    
    <body>
        <div className="container">
            <h2>TrendKart.</h2>
            <div className="header">
                <h1>Email Verification</h1>
            </div>
            <div className="otp-content">
                <p>Dear User,</p>
                <p>We have received a request to verify your email address. Please use the following OTP code to complete the verification:</p>
                <p><span className="otp-code"></span></p>
                <p className="otp-nb">If you didn't request this OTP, please ignore this email.</p>
            </div>
            <div className="footer">
                <p>Best regards,</p>
                <p>TrendKart</p>
                <p>&copy; 2023 TrendKart. All rights reserved.</p>
            </div>
        </div>
    </body>
    
    </html>
    
    `
  );
  console.log("Email sent successfully: ", mailResponse);
};

const passwordChangedMail = async (email) => {
  const mailResponse = await mailSender(
    email,
    "Email Verification",
    `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Authentication Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }

            
            h2 {
              font-weight:500;
              color: #6b7280;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
            }
    
            .logo {
                display: block;
                margin: 0 auto 20px;
            }
    
            .header {
                background-color: #4caf50;
                color: #ffffff;
                padding: 10px 20px;
                border-radius: 5px;
                text-align: left;
            }
    
            .notification-content {
                margin-top: 30px;
                font-size: 18px;
                color: #333;
                text-align: left;
            }
    
            .footer {
                margin-top: 30px;
                font-size: 14px;
                color: #555;
                text-align: left;
            }
        </style>
    </head>
    
    <body>
        <div className="container">
            <h2>TrendKart.</h2>
            <div className="header">
              <h1>Email Authentication Notification</h1>
            </div>
            <div className="notification-content">
              <p>Dear User,</p>
              <p>We want to inform you that your password has been changed. If you did not initiate this change, please contact our customer care immediately.</p>
              <p>Thank you for choosing our services.</p>
            </div>
            <div className="footer">
              <p>Best regards,</p>
              <p>TrendKart</p>
              <p>&copy; 2023 TrendKart. All rights reserved.</p>
            </div>
        </div>
    </body>
    
    </html>`
  );
  console.log("Email sent successfully: ", mailResponse);
};

/**
 * Send order dispatched/shipped notification to customer
 * data: { customerName, address, trackingLink, productName, orderId }
 */
const sendOrderShippedMail = async (email, data = {}, attachments = []) => {
  const { customerName = 'Customer', address = '', trackingLink = '', productName = '', orderId = '' } = data;
  const subject = 'BM Aesthetique — Your order has been dispatched';
  // Build a small items table if provided
  const itemsRowsHtml = (data.products || [])
    .map((p) => `<tr><td>${escapeHtml(p.name || '')}</td><td>${escapeHtml(String(p.quantity || ''))}</td><td>₹${escapeHtml(String(p.price || ''))}</td></tr>`)
    .join("");

  const mailResponse = await mailSender(
    email,
    subject,
    `<!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>${subject}</title>
      <style>
        body{font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial; background:#f7f7fa; margin:0; padding:0}
        .card{max-width:680px;margin:28px auto;background:#fff;border-radius:8px;padding:28px;box-shadow:0 6px 18px rgba(0,0,0,0.06)}
        .brand{font-weight:700;color:#0f172a;text-align:center;font-size:20px;margin-bottom:8px}
        .lead{color:#111827;font-size:15px;line-height:1.5}
        .meta{margin:18px 0;padding:16px;background:#f9fafb;border-radius:6px;border:1px solid #eef2f7}
        .muted{color:#6b7280;font-size:13px}
        .cta{display:inline-block;margin-top:12px;background:#0ea5a3;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none}
        .footer{margin-top:18px;color:#6b7280;font-size:13px}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="brand">BM Aesthetique</div>
        <div class="lead">Hi ${escapeHtml(customerName)},</div>
        <p class="lead">Good news — your order${orderId ? ` <strong>#${escapeHtml(orderId)}</strong>` : ''} has been dispatched and is on its way to the delivery address below.</p>
        <div class="meta">
          <p><strong>Shipping address</strong></p>
          <p class="muted">${escapeHtml(address) || 'Address not available'}</p>
          <p style="margin-top:8px"><strong>Product</strong>: ${escapeHtml(productName) || 'Item'}</p>
        </div>
        ${trackingLink ? `<p>Track your shipment: <a href="${escapeAttr(trackingLink)}" target="_blank" rel="noopener" class="cta">View tracking</a></p>` : '<p class="muted">No tracking link available.</p>'}
        <p class="muted">If you have any questions, reply to this email or contact our support at <strong>help.bmaesthetique@gmail.com</strong>.</p>
        <div class="footer">Warm regards,<br/>BM Aesthetique</div>
      </div>
    </body>
    </html>`
    ,
    attachments && attachments.length ? { attachments } : undefined
  );
  console.log('Order-shipped email sent:', mailResponse);
};

/**
 * Send order delivered notification
 * data: { customerName, orderNumber, productName, address, deliveryDate, contactDetails }
 */
const sendOrderDeliveredMail = async (email, data = {}, attachments = []) => {
  const {
    customerName = 'Customer',
    orderNumber = '',
    productName = '',
    address = '',
    deliveryDate = '',
    contactDetails = 'help.bmaesthetique@gmail.com',
  } = data;

  const subject = 'BM Aesthetique — Your Order Has Been Delivered';
  const itemsRowsHtml = (data.products || [])
    .map((p) => `<tr><td>${escapeHtml(p.name || '')}</td><td>${escapeHtml(String(p.quantity || ''))}</td><td>₹${escapeHtml(String(p.price || ''))}</td></tr>`)
    .join("");

  const mailResponse = await mailSender(
    email,
    subject,
    `<!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>${subject}</title>
      <style>
        body{font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial; background:#f7f7fa; margin:0; padding:0}
        .card{max-width:680px;margin:28px auto;background:#fff;border-radius:8px;padding:28px;box-shadow:0 6px 18px rgba(0,0,0,0.06)}
        .brand{font-weight:700;color:#0f172a;text-align:center;font-size:20px;margin-bottom:8px}
        .lead{color:#111827;font-size:15px;line-height:1.5}
        .list{margin:18px 0;padding:16px;background:#f9fafb;border-radius:6px;border:1px solid #eef2f7}
        .muted{color:#6b7280;font-size:13px}
        .footer{margin-top:18px;color:#6b7280;font-size:13px}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="brand">BM Aesthetique</div>
        <div class="lead">Hello ${escapeHtml(customerName)},</div>
        <p class="lead">We trust you are doing well. We're pleased to confirm that your order has been successfully delivered to the address provided at the time of purchase.</p>
        <div class="list">
          <p><strong>Order Number:</strong> ${escapeHtml(orderNumber) || 'N/A'}</p>
          <p><strong>Product:</strong> ${escapeHtml(productName) || 'N/A'}</p>
          <p><strong>Delivery Address:</strong> ${escapeHtml(address) || 'N/A'}</p>
          <p><strong>Delivery Date:</strong> ${escapeHtml(deliveryDate) || 'N/A'}</p>
        </div>
        <p class="muted">Thank you for choosing BM Aesthetique. We value your trust and look forward to serving you again.</p>
        <div class="footer">
          <p>Sincerely,</p>
          <p><strong>BM Aesthetique Team</strong></p>
          <p class="muted">Contact: ${escapeHtml(contactDetails)}</p>
        </div>
      </div>
    </body>
    </html>`
    ,
    attachments && attachments.length ? { attachments } : undefined
  );
  console.log('Order-delivered email sent:', mailResponse);
};

/**
 * Send order placed notification
 * data: { customerName, orderNumber, productName, totalPrice }
 */
const sendOrderPlacedMail = async (email, data = {}, attachments = []) => {
  const { customerName = 'Customer', orderNumber = '', productName = '', totalPrice = '' } = data;
  const subject = 'BM Aesthetique — Order Confirmed';
  const itemsRowsHtml = (data.products || [])
    .map((p) => `<tr><td>${escapeHtml(p.name || '')}</td><td>${escapeHtml(String(p.quantity || ''))}</td><td>₹${escapeHtml(String(p.price || ''))}</td></tr>`)
    .join("");

  const mailResponse = await mailSender(
    email,
    subject,
    `<!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>${subject}</title>
      <style>
        body{font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial; background:#f7f7fa; margin:0; padding:0}
        .card{max-width:680px;margin:28px auto;background:#fff;border-radius:8px;padding:28px;box-shadow:0 6px 18px rgba(0,0,0,0.06)}
        .brand{font-weight:700;color:#0f172a;text-align:center;font-size:20px;margin-bottom:8px}
        .lead{color:#111827;font-size:15px;line-height:1.5}
        .meta{margin:18px 0;padding:16px;background:#f9fafb;border-radius:6px;border:1px solid #eef2f7}
        .muted{color:#6b7280;font-size:13px}
        .footer{margin-top:18px;color:#6b7280;font-size:13px}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="brand">BM Aesthetique</div>
        <div class="lead">Hi ${escapeHtml(customerName)},</div>
        <p class="lead">Thanks for your order${orderNumber ? ` <strong>#${escapeHtml(orderNumber)}</strong>` : ''}. We are processing it and will notify you when it ships.</p>
        <div class="meta">
          <p><strong>Summary</strong></p>
          <p class="muted">Product: ${escapeHtml(productName) || 'Multiple items'}</p>
          <p class="muted">Total: ₹${escapeHtml(String(totalPrice)) || 'N/A'}</p>
        </div>
        <p class="muted">If you have any questions, reply to this email or contact our support at <strong>help.bmaesthetique@gmail.com</strong>.</p>
        <div class="footer">Warm regards,<br/>BM Aesthetique</div>
      </div>
    </body>
    </html>`
    ,
    attachments && attachments.length ? { attachments } : undefined
  );
  console.log('Order-placed email sent:', mailResponse);
};

module.exports = {
  sendOTPMail,
  passwordChangedMail,
  sendManagerNoti,
  sendEnquiryMail,
  sendEnquiryWhtspMsg,
  sendOrderShippedMail,
  sendOrderDeliveredMail,
  sendOrderPlacedMail,
};

// NOTE: add sendOrderPlacedMail for order creation notifications
