import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/others/bm-logo.png";

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-xl w-full text-center">
        {/* Logo / brand - reuse same image used in Navbar */}
        <div className="mb-8">
          <img src={logo} alt="logo" className="mx-auto w-36 h-36 object-contain" />
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Coming Soon</h2>
        <p className="text-gray-600 mb-8">We're working hard to bring the new experience live. Sign up to be notified or sign in if you already have access.</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:opacity-90"
          >
            Sign up
          </button>

          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
