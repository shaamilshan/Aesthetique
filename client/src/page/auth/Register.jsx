import React, { useEffect, useState } from "react";
import SignUpBG from "../../assets/authentication/registerbg.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../../redux/actions/userActions";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import InputWithIcon from "../../components/InputWithIcon";
import PasswordInputWithIcon from "../../components/PasswordInputWithIcon";
import CustomSingleFileInput from "../../components/CustomSingleFileInput";
// ...existing code...
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

  const [loadingLocal, setLoadingLocal] = useState(false);

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

  // ...existing code...

  const handleRegister = async (value) => {
    setLoadingLocal(true);
    try {
      let formData = new FormData();
      formData.append("firstName", value.firstName);
      formData.append("lastName", value.lastName);
      formData.append("email", value.email);
      formData.append("password", value.password);
      formData.append("passwordAgain", value.passwordAgain);
      formData.append("phoneNumber", value.phoneNumber);
      if (value.profileImgURL) {
        formData.append("profileImgURL", value.profileImgURL);
      }
      dispatch(signUpUser(formData));
    } catch (err) {
      toast.error(err.message || "An error occurred while signing up");
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={SignUpBG}
          alt="Sign Up Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form Container */}
      <div className="relative z-10 bg-white p-8 rounded-none shadow-lg w-full max-w-lg mx-4" style={{ borderRadius: 0 }}>
        <h1 className="text-4xl font-bold mb-6 text-center">Sign Up</h1>

        <Formik
          initialValues={initialValues}
          onSubmit={handleRegister}
          validationSchema={validationSchema}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* First Name Field */}
              <InputWithIcon
                icon={<AiOutlineUser className="text-gray-500 group-hover:text-gray-700 transition duration-200" />}
                name="firstName"
                placeholder="Enter your first name"
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#C84332] shadow-sm"
              />
              {/* Last Name Field */}
              <InputWithIcon
                icon={<AiOutlineUser className="text-gray-500 group-hover:text-gray-700 transition duration-200" />}
                name="lastName"
                placeholder="Enter your last name"
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#C84332] shadow-sm"
              />
              {/* Phone Number Field */}
              <InputWithIcon
                icon={<AiOutlinePhone className="text-gray-500 group-hover:text-gray-700 transition duration-200" />}
                name="phoneNumber"
                placeholder="Enter your phone number"
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#C84332] shadow-sm"
              />
              {/* Email Field */}
              <InputWithIcon
                icon={<AiOutlineMail className="text-gray-500 group-hover:text-gray-700 transition duration-200" />}
                name="email"
                placeholder="Enter your email"
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#C84332] shadow-sm"
              />
              {/* Password Field */}
              <PasswordInputWithIcon
                icon={<AiOutlineLock className="text-gray-500 group-hover:text-gray-700 transition duration-200" />}
                name="password"
                placeholder="Enter your password"
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#C84332] shadow-sm"
              />
              {/* Confirm Password Field */}
              <PasswordInputWithIcon
                icon={<AiOutlineLock className="text-gray-500 group-hover:text-gray-700 transition duration-200" />}
                name="passwordAgain"
                placeholder="Confirm your password"
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#C84332] shadow-sm"
              />
              {/* Submit Button */}
              <button
                type="submit"
                className="h-12 w-full bg-gradient-to-r from-[#C84332] to-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-300"
                disabled={loadingLocal}
              >
                {loadingLocal ? "Loading..." : "Sign Up"}
              </button>
              {/* Error Message */}
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;