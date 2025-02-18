import React, { useEffect, useState } from "react";
import SignUpBG from "../../assets/register.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../../redux/actions/userActions";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputWithIcon from "../../components/InputWithIcon";
import PasswordInputWithIcon from "../../components/PasswordInputWithIcon";
import CustomSingleFileInput from "../../components/CustomSingleFileInput";
import OTPEnterSection from "./Register/OTPEnterSection";
import OTPExpired from "./components/OTPExpired";
import { toast } from "react-hot-toast";
import { appJson } from "../../Common/configurations";
import { commonRequest } from "../../Common/api";
import { updateError } from "../../redux/reducers/userSlice";
import {
  AiOutlineLock,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineUser,
} from "react-icons/ai";

const Register = () => {
  const { user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailSec, setEmailSec] = useState(true);
  const [otpSec, setOTPSec] = useState(false);
  const [otpExpired, setOTPExpired] = useState(false);
  const [otpLoading, setOTPLoading] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    return () => {
      dispatch(updateError(""));
    };
  }, [user, navigate, dispatch]);

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
    phoneNumber: Yup.number()
      .typeError("Phone number should be digits")
      .moreThan(999999999, "Not valid phone number"),
  });

  const dispatchSignUp = () => {
    let formData = new FormData();
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

  const handleRegister = async (value) => {
    setOTPLoading(true);
    setData(value);

    try {
      const res = await commonRequest(
        "POST",
        "/auth/send-otp",
        { email: value.email },
        appJson
      );

      if (res.success) {
        setEmailSec(false);
        setOTPSec(true);
        toast.success("OTP sent successfully!");
      } else {
        throw new Error(res.response.data.error || "OTP request failed");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while sending OTP");
    } finally {
      setOTPLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-100">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src={SignUpBG}
          alt="Sign Up Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
          <div className="flex items-center justify-center mb-6">
            {/* <img src={Logo} alt="Logo" className="w-12" /> */}
            {/* <p className="text-3xl font-bold ml-3">ex.iphones.</p> */}
          </div>
          <h1 className="text-4xl font-bold mb-6 text-center">Sign Up</h1>

          {emailSec && (
            <Formik
              initialValues={initialValues}
              onSubmit={handleRegister}
              validationSchema={validationSchema}
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-6">
                  {/* <div className="flex justify-center">
                    <CustomSingleFileInput
                      onChange={(file) => setFieldValue("profileImgURL", file)}
                    />
                    <ErrorMessage
                      className="text-sm text-red-500"
                      name="profileImgURL"
                      component="span"
                    />
                  </div> */}
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
                  <button
                    type="submit"
                    className="h-12 w-full bg-[#C84332] text-white hover:bg-red-500 rounded-md"
                    disabled={otpLoading}
                  >
                    {otpLoading ? "Loading..." : "Sign Up"}
                  </button>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
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
          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Login now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
