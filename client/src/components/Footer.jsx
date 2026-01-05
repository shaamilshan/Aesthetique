import React from 'react';
import logo from "../assets/others/bm-logo.png";

function Footer() {
  const handleScrollAbout = (e) => {
    // Try to smooth-scroll to an in-page about section if present.
    // If not found, fall back to full page navigation to /about-us.
    try {
      e.preventDefault();
    } catch (err) {
      /* ignore if called programmatically without an event */
    }
    const ids = ["about", "about-us"];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    // No in-page anchor found — navigate to the dedicated about page
    window.location.href = "/about-us";
  };

  return (
    <footer className="bg-white text-black py-8 border-t">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Brand Section */}
        <div className="md:w-1/4">
          <div className="flex flex-col items-start gap-1 mb-4">
            <img src={logo} alt="BM Aesthetique" className="h-10 w-auto object-contain" />
            <h4 className="text-lg font-medium">BM AESTHETIQUE</h4>
          </div>
          {/* Contact details */}
          <div className="text-sm text-gray-700">
            <div className="font-semibold">BEST MED AESTHETIQUE PVT LTD</div>
            <div className="mt-1">2nd floor, No-16, Alex Square, opposite to Amirtha School, Ettimadai, Coimbatore, Tamil Nadu</div>
            <div className="mt-1">PIN CODE - 641112</div>
            <div className="mt-1">phone no : <a href="tel:8137011855" className="text-blue-600 hover:underline">81370 11855</a></div>
          </div>
        </div>

        {/* Grid Links */}
        <div className="w-full md:flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Links */}
          <div>
            <h4 className="text-lg font-medium mb-4">Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-gray-700">Home</a></li>
              <li><a href="/collections" className="hover:text-gray-700">Shop</a></li>
              <li>
                <a href="/about-us" onClick={handleScrollAbout} className="hover:text-gray-700">
                  About
                </a>
              </li>
              <li><a href="#contact" className="hover:text-gray-700">Contact</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-lg font-medium mb-4">Help</h4>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-gray-700">Payment Options</a></li>
              <li><a href="https://merchant.razorpay.com/policy/RnRbtSskV6hPhM/refund" className="hover:text-gray-700">Cancellations and Refunds</a></li>
              <li><a href="https://merchant.razorpay.com/policy/RnRbtSskV6hPhM/terms" className="hover:text-gray-700">Terms and Conditions</a></li>
              <li><a href="https://merchant.razorpay.com/policy/RnRbtSskV6hPhM/privacy" className="hover:text-gray-700">Privacy Policy</a></li>
              <li><a href="https://merchant.razorpay.com/policy/RnRbtSskV6hPhM/shipping" className="hover:text-gray-700">Shipping & Delivery Policy</a></li>
               <li><a href="https://merchant.razorpay.com/policy/RnRbtSskV6hPhM/contact_us" className="hover:text-gray-700">Contact Us</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className=''>
            <h4 className="text-lg font-medium mb-4">Newsletter</h4>
            <form className="flex sm:flex-col flex-row gap-2 sm:gap-1">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="bg-white text-black rounded-md px-4 py-2 text-sm w-full border"
              />
              <button
                type="submit"
                className="bg-black text-white font-semibold rounded-md px-4 py-2 text-sm hover:bg-gray-800 transition"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-sm text-gray-600 px-4">
        <p>&copy; 2025 BM Aesthetique. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
