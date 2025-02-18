import React, { useEffect, useState } from "react";
import SignUpBG from "../../assets/SignUpBG.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { signUpUser } from "../../redux/actions/userActions";
import { updateError } from "../../redux/reducers/userSlice";

const OldRegister = () => {
  const { user, error } = useSelector((state) => state.user);
  const [otpLoading, setOTPLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    return () => {
      dispatch(updateError(""));
    };
  }, [user, dispatch, navigate]);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordAgain: "",
    phoneNumber: "",
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
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    phoneNumber: Yup.number()
      .typeError("Phone number should be digits")
      .moreThan(999999999, "Not a valid phone number"),
  });

  const handleRegister = (values) => {
    setOTPLoading(true);
    toast.success("Registration Successful!");
    dispatch(signUpUser(values));
    setOTPLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-50">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 h-full">
        <img
          src={SignUpBG}
          alt="Sign Up Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
          <Formik
            initialValues={initialValues}
            onSubmit={handleRegister}
            validationSchema={validationSchema}
          >
            {() => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium">
                    First Name
                  </label>
                  <Field
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium">
                    Last Name
                  </label>
                  <Field
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="passwordAgain" className="block text-sm font-medium">
                    Confirm Password
                  </label>
                  <Field
                    id="passwordAgain"
                    name="passwordAgain"
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <ErrorMessage
                    name="passwordAgain"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium">
                    Phone Number
                  </label>
                  <Field
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-blue-600 transition"
                  disabled={otpLoading}
                >
                  {otpLoading ? "Loading..." : "Sign Up"}
                </button>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
              </Form>
            )}
          </Formik>
          <p className="mt-6 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black font-semibold hover:underline"
            >
              Login now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OldRegister;
