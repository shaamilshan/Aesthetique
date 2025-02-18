import React, { useState } from "react";
// import ForgotBG from "../../assets/forggotpassb.jpg";
import ForgotBG from "../../assets/forgotpassbg.jpg";
import Logo from "../../assets/TrendKart.png";
import { Link } from "react-router-dom";

import OTPEmailSection from "./components/OTPEmailSection";
import OTPEnterSection from "./components/OTPEnterSection";
import PasswordEnterSection from "./components/PasswordEnterSection";
import OTPExpired from "./components/OTPExpired";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSec, setEmailSec] = useState(true);
  const [otpSec, setOTPSec] = useState(false);
  const [passwordSec, setPasswordSec] = useState(false);
  const [finalMessage, setFinalMessage] = useState(false);
  const [otpExpired, setOTPExpired] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-50">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 h-screen">
        <img
          src={ForgotBG}
          alt="Forgot Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
          <div className="flex items-center justify-center mb-6">
            {/* <img src={Logo} alt="Helah Logo" className="w-12" /> */}
            {/* <p className="text-3xl font-bold ml-2">Helah.</p> */}
          </div>
          <h1 className="text-2xl font-bold mb-4 text-center">Reset your Password</h1>

          {emailSec && (
            <OTPEmailSection
              setEmailSec={setEmailSec}
              setOTPSec={setOTPSec}
              email={email}
              setEmail={setEmail}
            />
          )}
          {otpSec && (
            <OTPEnterSection
              email={email}
              setOTPSec={setOTPSec}
              setPasswordSec={setPasswordSec}
              setOTPExpired={setOTPExpired}
            />
          )}
          {passwordSec && (
            <PasswordEnterSection
              email={email}
              setFinalMessage={setFinalMessage}
              setPasswordSec={setPasswordSec}
            />
          )}
          {finalMessage && (
            <div>
              <h1 className="my-4 text-center">
                Your password has been reset, please login again
              </h1>
              <Link
                className="w-full bg-black text-white py-2 rounded-full text-center"
                to="/login"
              >
                Go to Login
              </Link>
            </div>
          )}
          {otpExpired && <OTPExpired />}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
