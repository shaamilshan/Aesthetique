"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  AiOutlineLock,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  googleLoginOrSignUp,
  signUpUser,
} from "../../redux/actions/userActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputWithIcon from "../../components/InputWithIcon";
import PasswordInputWithIcon from "../../components/PasswordInputWithIcon";
import CustomSingleFileInput from "../../components/CustomSingleFileInput";
import OTPEnterSection from "./Register/OTPEnterSection";
import OTPExpired from "./components/OTPExpired";
import toast from "react-hot-toast";
import { appJson } from "../../Common/configurations";
import { commonRequest } from "../../Common/api";
import { updateError } from "../../redux/reducers/userSlice";

import RegImg from "../../assets/register.png";

const Register = () => {
  const { user, loading, error } = useSelector((state) => state.user);
  const [emailSec, setEmailSec] = useState(true);
  const [otpSec, setOTPSec] = useState(false);
  const [otpExpired, setOTPExpired] = useState(false);
  const [otpLoading, setOTPLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    return () => {
      dispatch(updateError(""));
    };
  }, [user]);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordAgain: "",
    phoneNumber: "",
    profileImgURL: null,
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    passwordAgain: Yup.string()
      .required("Password is required")
      .oneOf([Yup.ref("password"), null], "Password must match"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Not a valid phone number")
      .required("Phone number is required"),
  });

  const handleRegister = async (value) => {
    setOTPLoading(true);
    setData(value);
    if (value.email.trim() === "") {
      toast.error("Enter an email to continue");
      return;
    }

    const res = await commonRequest(
      "POST",
      "/auth/send-otp",
      { email: value.email },
      appJson
    );
    if (res.success) {
      const res = await commonRequest(
        "POST",
        "/auth/validate-otp",
        { email: value.email, otp: "000000" },
        appJson
      );
      dispatchSignUp();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error(res.response.data.error);
      setOTPLoading(false);
    }
  };
  const [data, setData] = useState({});

  const dispatchSignUp = () => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("passwordAgain", data.passwordAgain);
    formData.append("phoneNumber", data.phoneNumber);
    if (data.profileImgURL) {
      formData.append("profileImgURL", data.profileImgURL);
    }
    dispatch(signUpUser(formData));
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-8 py-12 md:px-12">
        <div className="w-full max-w-[440px] space-y-8">
          <h1 className="text-4xl font-bold tracking-tight">Sign Up</h1>
          {emailSec && (
            <Formik
              initialValues={initialValues}
              onSubmit={handleRegister}
              validationSchema={validationSchema}
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-6">
                  <InputWithIcon
                    icon={<AiOutlineUser />}
                    title="First Name"
                    name="firstName"
                    placeholder="Enter your first name"
                  />
                  <InputWithIcon
                    icon={<AiOutlineUser />}
                    title="Last Name"
                    name="lastName"
                    placeholder="Enter your last name"
                  />
                  <InputWithIcon
                    icon={<AiOutlineMail />}
                    title="Email"
                    name="email"
                    placeholder="Enter your email"
                  />
                  <PasswordInputWithIcon
                    icon={<AiOutlineLock />}
                    title="Password"
                    name="password"
                    placeholder="Enter your password"
                  />
                  <PasswordInputWithIcon
                    icon={<AiOutlineLock />}
                    title="Confirm Password"
                    name="passwordAgain"
                    placeholder="Confirm your password"
                  />
                  <InputWithIcon
                    icon={<AiOutlinePhone />}
                    title="Phone Number"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                  />
                  <Button
                    type="submit"
                    className="h-12 w-full bg-black text-white hover:bg-black/90"
                  >
                    {otpLoading ? "Loading..." : "Register"}
                  </Button>
                  {error && <p className="my-2 text-red-400">{error}</p>}
                </Form>
              )}
            </Formik>
          )}
          {otpSec && (
            <OTPEnterSection
              email={data.email}
              setOTPExpired={setOTPExpired}
              setOTPSec={setOTPSec}
              dispatchSignUp={dispatchSignUp}
            />
          )}
          {otpExpired && <OTPExpired />}
          <div className="text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              Login now
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-black lg:block">
        <div className="relative flex h-full items-center justify-center">
          <img
            alt="Register Illustration"
            className="object-cover"
            height={800}
            width={800}
            src={RegImg}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
