import React from 'react';

function Footer() {
  return (
    <footer className="bg-[#A53030] text-white py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Brand Section */}
        <div className="md:w-1/4">
          <h4 className="text-lg font-medium mb-4">BM AESTHETIQUE</h4>
          {/* <p className="text-sm">Karassery Junction, Mukkam, Calicut, India 673602</p> */}
        </div>

        {/* Grid Links */}
        <div className="w-full md:flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Links */}
          <div>
            <h4 className="text-lg font-medium mb-4">Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-gray-300">Home</a></li>
              <li><a href="/collections" className="hover:text-gray-300">Shop</a></li>
              <li><a href="/about-us" className="hover:text-gray-300">About</a></li>
              <li><a href="/contact-us" className="hover:text-gray-300">Contact</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-lg font-medium mb-4">Help</h4>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-gray-300">Payment Options</a></li>
              <li><a href="https://merchant.razorpay.com/policy/PQGLwBVaRsVDHy/refund" className="hover:text-gray-300">Returns</a></li>
              <li><a href="https://merchant.razorpay.com/policy/PQGLwBVaRsVDHy/terms" className="hover:text-gray-300">Privacy Policies</a></li>
              <li><a href="https://merchant.razorpay.com/policy/PQGLwBVaRsVDHy/shipping" className="hover:text-gray-300">Shipping & Delivery Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className=''>
            <h4 className="text-lg font-medium mb-4">Newsletter</h4>
            <form className="flex sm:flex-col flex-row gap-2 sm:gap-1">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="bg-white text-black rounded-md px-4 py-2 text-sm w-full"
              />
              <button
                type="submit"
                className="bg-white text-red-600 font-semibold rounded-md px-4 py-2 text-sm hover:bg-gray-200 transition"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-sm text-white/80 px-4">
        <p>&copy; 2025 BM Aesthetique. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
