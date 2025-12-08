import React, { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/actions/userActions";
import { updateError } from "../../redux/reducers/userSlice";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import LoginImg from "../../assets/authentication/loginbg.jpg";

const Login = () => {
  const { user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email is not valid").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    return () => {
      dispatch(updateError(""));
    };
  }, [user, navigate, dispatch]);

  const handleLoginSubmit = (value) => {
    dispatch(loginUser(value));
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50  ">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={LoginImg}
          alt="Login Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Form Container */}
      <div className="relative z-10  bg-white p-8  shadow-lg w-full max-w-lg mx-4" style={{ borderRadius: 0 }}>
        <h1 className="text-4xl font-bold mb-6 text-center">Welcome Back</h1>
        <Formik
          initialValues={initialValues}
          onSubmit={handleLoginSubmit}
          validationSchema={validationSchema}
        >
          {({ errors, touched }) => (
            <Form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none">
                  Email
                </label>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  className="h-12"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none">
                  Password
                </label>
                <div className="relative">
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-sm font-medium">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Button
                type="submit"
                className="h-12 w-full bg-black text-white hover:bg-white hover:text-black hover:border-2 hover:border-black rounded-full transition duration-300"
                disabled={loading}
              >
                {loading ? "Loading..." : "Login"}
              </Button>
            </Form>
          )}
        </Formik>
        <p className="mt-6 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Sign Up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;