import React, { useState } from "react";
import { useSelector } from "react-redux";
import InputWithIcon from "./components/InputWithIcon";
import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineUser,
  AiOutlineClose,
} from "react-icons/ai";
import { RiCalendarEventFill } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import Modal from "../../components/Modal";
import EditProfile from "./components/EditProfile";
import { getPassedDateOnwardDateForInput } from "../../Common/functions";
import ProfileImage from "../../components/ProfileImage";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.user);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const toggleEditProfile = () => {
    setShowEditProfile(!showEditProfile);
  };

  return (
    <>
      {showEditProfile && (
        <Modal tab={<EditProfile closeToggle={toggleEditProfile} />} />
      )}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full sm:mx-5 lg:mx-0">
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
        </div>
        <div className="p-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
            <div className="flex-shrink-0">
              {/* <div className="w-20 h-20 mx-auto sm:mx-0">
                <ProfileImage user={user} />
              </div> */}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-500 mb-3">{user?.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {user?.isEmailVerified ? (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <TiTick className="w-4 h-4" />
                    <span>Verified Account</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AiOutlineClose className="w-4 h-4" />
                    <span>Unverified Account</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={toggleEditProfile}
              className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-colors duration-200 font-medium text-sm"
            >
              Edit Profile
            </button>
          </div>

          {/* Profile Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AiOutlineUser className="w-5 h-5" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">First Name</label>
                  <p className="text-gray-900 font-medium mt-1">{user?.firstName || "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Last Name</label>
                  <p className="text-gray-900 font-medium mt-1">{user?.lastName || "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date of Birth</label>
                  <p className="text-gray-900 font-medium mt-1">
                    {user?.dateOfBirth
                      ? getPassedDateOnwardDateForInput(user?.dateOfBirth)
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AiOutlineMail className="w-5 h-5" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Address</label>
                  <p className="text-gray-900 font-medium mt-1">{user?.email || "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone Number</label>
                  <p className="text-gray-900 font-medium mt-1">{user?.phoneNumber || "-"}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account Status</label>
                  <div className="mt-1">
                    {user?.isEmailVerified ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        <TiTick className="w-4 h-4" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                        <AiOutlineClose className="w-4 h-4" />
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
