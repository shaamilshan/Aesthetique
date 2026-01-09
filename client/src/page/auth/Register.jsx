import React, { useEffect, useState } from "react";
import SignUpBG from "../../assets/authentication/registerbg.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../../redux/actions/userActions";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// ...existing code...
import { toast } from "react-hot-toast";
import { appJson } from "../../Common/configurations";
import { commonRequest } from "../../Common/api";
import { updateError } from "../../redux/reducers/userSlice";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import siteLogo from "../../assets/others/bm-logo.png";
import TestimonialCarousel from "../../components/TestimonialCarousel";

const Register = () => {
  const { user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingLocal, setLoadingLocal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  // const registerTestimonials = [
  //   {
  //     quote: "Join thousands of satisfied customers who trust BM AESTHETIQUE for quality and style. The registration process was seamless and secure.",
  //     author: "Customer Review",
  //     title: "Verified Buyer"
  //   },
  //   {
  //     quote: "Creating an account opened up a world of premium beauty products. The user experience is exceptional from day one.",
  //     author: "Emma Rodriguez",
  //     title: "Beauty Enthusiast"
  //   },
  //   {
  //     quote: "The sign-up was quick and easy. Now I have access to exclusive deals and personalized recommendations. Highly recommended!",
  //     author: "David Kim",
  //     title: "Loyal Customer"
  //   }
  // ];

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
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long"),
    
  });

  // ...existing code...

  const handleRegister = async (value) => {
    setLoadingLocal(true);
    try {
      let formData = new FormData();
      formData.append("firstName", value.firstName);
      formData.append("email", value.email);
      formData.append("password", value.password);
      dispatch(signUpUser(formData));
    } catch (err) {
      toast.error(err.message || "An error occurred while signing up");
    } finally {
      setLoadingLocal(false);
    }
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
            <h1 className="text-3xl font-bold mb-6">Create your account</h1>

            <Formik
              initialValues={initialValues}
              onSubmit={handleRegister}
              validationSchema={validationSchema}
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {/* First Name Field */}
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium leading-none">
                        First Name
                      </label>
                      <Field
                        as={Input}
                        id="firstName"
                        name="firstName"
                        placeholder="Enter your first name"
                        className="h-12"
                      />
                      <ErrorMessage name="firstName" component="p" className="text-red-500 text-sm" />
                    </div>

                    {/* Email Field */}
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
                      <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                    </div>

                    {/* Password Field */}
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
                      <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="h-12 w-full bg-black text-white hover:bg-white hover:text-black hover:border-2 hover:border-black rounded-full transition duration-300"
                    disabled={loadingLocal}
                  >
                    {loadingLocal ? "Loading..." : "Sign Up"}
                  </Button>

                  {/* Error Message */}
                  {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                </Form>
              )}
            </Formik>

            <p className="mt-6 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Login now
              </Link>
            </p>
          </div>

          {/* Right: image + testimonial carousel */}
          <div className="hidden lg:block lg:w-1/2 relative bg-gray-100">
            <img src={SignUpBG} alt="auth" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30"></div>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;