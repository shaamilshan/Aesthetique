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
import TestimonialCarousel from "../../components/TestimonialCarousel";
import siteLogo from "../../assets/others/bm-logo.png";
import LoginImg from "../../assets/others/about.jpg";

const Login = () => {
  const { user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const loginTestimonials = [
    {
      // quote:
      //   "Professional service and a smooth experience from start to finish. I felt well taken care of.",
      // author: "Aisha",
      // title: "Client",
    },
    {
      // quote:
      //   "Booking and managing my appointments is quick and easy. The whole platform feels very intuitive.",
      // author: "Rahul",
      // title: "Client",
    },
    {
      // quote:
      //   "Great support and a secure login flow — I always feel confident accessing my account.",
      // author: "Nadia",
      // title: "Client",
    },
  ];

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
      // Redirect admins to admin dashboard, others to the coming soon landing
      if (user.role === "admin" || user.role === "superAdmin") {
        navigate("/admin/");
      } else {
        navigate("/coming-soon");
      }
    }
    return () => {
      dispatch(updateError(""));
    };
  }, [user, navigate, dispatch]);

  const handleLoginSubmit = (value) => {
    dispatch(loginUser(value));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-6xl mx-4">
        <div className="flex bg-white shadow-lg overflow-hidden rounded-lg">
          {/* Left: form panel */}
          <div className="w-full lg:w-1/2 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <img src={siteLogo} alt="logo" className="h-10 w-auto object-contain" />
              <h2 className="text-lg font-semibold">BM AESTHETIQUE</h2>
            </div>
            <h1 className="text-3xl font-bold mb-6">Welcome back</h1>

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

            <p className="mt-6 text-sm">
              Don’t have an account? {" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Sign Up now
              </Link>
            </p>
          </div>

          {/* Right: image + testimonial carousel */}
          <div className="hidden lg:block lg:w-1/2 relative bg-gray-100">
            <img src={LoginImg} alt="auth" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30"></div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;