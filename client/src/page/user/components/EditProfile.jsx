import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import {
  AiOutlineClose,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineUser,
} from "react-icons/ai";
import { RiCalendarEventFill } from "react-icons/ri";

import InputWithIcon from "../../../components/InputWithIcon";
import CustomSingleFileInput from "../../admin/Components/CustomSingleFileInput";
import { editUserProfile } from "../../../redux/actions/userActions";
import { URL } from "../../../Common/api";
import { appJson } from "../../../Common/configurations";
import toast from "react-hot-toast";
import { getPassedDateOnwardDateForInput } from "../../../Common/functions";
import { commonRequest } from "../../../Common/api";
import EditProfileOTPComponent from "./EditProfileOTPComponent";

const EditProfile = ({ closeToggle }) => {
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.user);

  // If user changes email there should be OTP validation
  const [emailChanged, setEmailChanged] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [otp, setOTP] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const initialValues = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    dateOfBirth: getPassedDateOnwardDateForInput(user.dateOfBirth) || "",
    profileImgURL: user.profileImgURL || user.profileImageURL || "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email().required("Email is required"),
    phoneNumber: Yup.number()
      .typeError("Phone number should be digits")
      .moreThan(999999999, "Not valid phone number"),
    dateOfBirth: Yup.date(),
  });

  const handleSubmit = async (value) => {
    if (user.email !== value.email) {
      if (!isOTPVerified) {
        setEmailChanged(true);
        setNewEmail(value.email);
        const data = await commonRequest(
          "POST",
          "/auth/send-otp",
          { email: value.email },
          appJson
        );

        // Check if OTP request was successful
        if (data.success) {
          // Update state to show OTP section
          toast.success("OTP Sent successfully");
        } else {
          // Handle OTP request failure
          toast.error(data.response.data.error);
        }
      } else {
        const formData = new FormData();
        formData.append("firstName", value.firstName);
        formData.append("lastName", value.lastName);
        formData.append("phoneNumber", value.phoneNumber);
        formData.append("dateOfBirth", value.dateOfBirth);
        formData.append("email", value.email);
        formData.append("profileImgURL", value.profileImgURL || "");

        dispatch(editUserProfile(formData));
        closeToggle();
      }
    } else {
      const formData = new FormData();
      formData.append("firstName", value.firstName);
      formData.append("lastName", value.lastName);
      formData.append("phoneNumber", value.phoneNumber);
      formData.append("dateOfBirth", value.dateOfBirth);
      formData.append("email", value.email);
      formData.append("profileImgURL", value.profileImgURL || "");

      dispatch(editUserProfile(formData));
      closeToggle();
    }
  };

  const verifyOTP = async () => {
    const data = await commonRequest(
      "POST",
      "/auth/validate-otp",
      { email: newEmail, otp: parseInt(otp) },
      appJson
    );

    if (data) {
      if (data.success) {
        setIsOTPVerified(true);
        toast.success("OTP Verified");
        return;
      } else {
        toast.error(data.response.data.message);
      }
    } else {
      setError(data.error);
      toast.error(data.error);
    }
  };

  return (
    <div className="bg-white w-full max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh] rounded-2xl border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Update your personal information</p>
        </div>
        <button
          onClick={closeToggle}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <AiOutlineClose className="text-xl text-gray-600" />
        </button>
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({ values, setFieldValue }) => (
          <Form className="p-6">
            {/* Profile Image Section */}
        

            {/* Personal Information Form */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  icon={<AiOutlinePhone />}
                  title="Phone Number"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                />
                <InputWithIcon
                  icon={<RiCalendarEventFill />}
                  title="Date of Birth"
                  name="dateOfBirth"
                  as="date"
                  placeholder="Select your birth date"
                />
                
                <div className="md:col-span-2">
                  <InputWithIcon
                    icon={<AiOutlineMail />}
                    title="Email Address"
                    name="email"
                    placeholder="Enter your email address"
                  />
                </div>
                
                {emailChanged && (
                  <div className="md:col-span-2">
                    <EditProfileOTPComponent
                      otp={otp}
                      isOTPVerified={isOTPVerified}
                      setOTP={setOTP}
                      verifyOTP={verifyOTP}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Action Button and Error Display */}
            <div className="pt-6 border-t border-gray-200 mt-8">
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating Profile...
                  </div>
                ) : (
                  "Update Profile"
                )}
              </button>
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditProfile;
