import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <h1 className="text-3xl font-bold mb-4">Return & Refund Policy</h1>

      <p className="mb-4">At BM Aesthetique, your satisfaction is important to us. We strive to deliver high-quality skincare products and ensure that your order reaches you in perfect condition. If something isn’t right with your order, we’ll make sure it’s taken care of quickly and fairly.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">When You Can Request a Return or Refund</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>You received an incorrect product</li>
        <li>The product arrived damaged or leaking</li>
        <li>The product was delivered past its expiry date</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Eligibility Conditions</h2>
      <p className="mb-2">To be eligible for a return or refund:</p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>The product must be <strong>unused, unopened, and in its original packaging</strong></li>
        <li>The item must be returned with all original labels, seals, and packaging intact</li>
      </ul>
      <p className="mb-4"><em>For hygiene and safety reasons, opened or used skincare products cannot be returned or refunded</em>, unless the issue is due to a manufacturing defect or damage during transit.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Non-Returnable Items</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Products that have been opened, used, or tampered with</li>
        <li>Items damaged due to improper handling or storage by the customer</li>
        <li>Free samples, promotional items, or gifts</li>
        <li>Products purchased during sale or promotional events (unless defective or incorrect)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Allergic Reactions & Skin Sensitivity</h2>
      <p className="mb-4">Individual skin types and reactions vary. We strongly recommend conducting a <strong>patch test</strong> before full application of any skincare product.</p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Reactions due to skin sensitivity or allergies do not qualify as defects</li>
        <li>Refunds or replacements will not be issued for adverse reactions unless the product is proven to be defective</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">How to Submit a Request</h2>
      <p className="mb-2">Please notify us <strong>within 7 days of receiving your order</strong> by contacting our support team at <a className="text-blue-600 underline" href="mailto:help.bmaesthetique@gmail.com">help.bmaesthetique@gmail.com</a>.</p>
      <p className="mb-2">Kindly include:</p>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Your order number</li>
        <li>Clear photos or videos of the issue (damaged product, incorrect item, or visible expiry date)</li>
      </ul>
      <p className="mb-4"><em>Requests raised after the 7-day window cannot be accepted.</em></p>

      <h2 className="text-xl font-semibold mt-6 mb-2">What Happens After You Contact Us</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Our team will review your request within <strong>2 business days</strong></li>
        <li>If approved, we will arrange a pickup of the affected product</li>
        <li>Once the item is received and inspected, your refund will be processed within <strong>2 business days</strong></li>
        <li>Refunds will be issued to the <strong>original method of payment</strong>. Banks or payment providers may take additional time (5–10 business days) to reflect the amount in your account.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Charges</h2>
      <ul className="list-disc list-inside mb-4 space-y-1">
        <li>Shipping fees are non-refundable unless the return is due to our error</li>
        <li>Replacement products, if approved, will be shipped at no additional cost</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Final Decision</h2>
      <p>BM Aesthetique reserves the right to approve or reject any return or refund request after reviewing and inspecting the product.</p>
    </div>
  );
};

export default ReturnPolicy;
