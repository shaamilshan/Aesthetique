import React from 'react';
import logo from '../../assets/others/bm-logo.png';

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-2xl text-center">
        <img src={logo} alt="logo" className="mx-auto h-24 w-auto mb-6" />
        <h1 className="text-4xl font-extrabold mb-4">Coming Soon</h1>
        <p className="text-lg text-gray-600 mb-6">
          We are making some updates to the site. The main page will be back shortly — check again soon.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="/login" className="px-6 py-2 rounded-full bg-black text-white">Sign in</a>
          <a href="/contact-us" className="px-6 py-2 rounded-full border">Contact us</a>
        </div>
      </div>
    </div>
  );
}
