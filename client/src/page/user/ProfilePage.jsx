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
      <div className="bg-white rounded-lg w-full sm:mx-5 lg:mx-0 p-5">
        <h1 className="uppercase text-lg font-semibold border-b pb-3">
          Profile Settings
        </h1>
        <div className="mt-5 flex flex-col lg:flex-row items-start gap-5">
          {/* <div className="h-56 w-56 shrink-0 mx-auto lg:mx-0">
            <ProfileImage user={user} />
          </div> */}

          <div className="w-full">
            {/* Utilize grid for larger screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <InputWithIcon
                icon={<AiOutlineUser />}
                title="First Name"
                name={user?.firstName || "-"}
              />
              <InputWithIcon
                icon={<AiOutlineUser />}
                title="Last Name"
                name={user?.lastName || "-"}
              />
              <InputWithIcon
                icon={<AiOutlineMail />}
                title="Email"
                name={user?.email || "-"}
              />
              <InputWithIcon
                icon={<AiOutlinePhone />}
                title="Phone Number"
                name={user?.phoneNumber || "-"}
              />
              <InputWithIcon
                icon={<RiCalendarEventFill />}
                title="Date of Birth"
                name={
                  user?.dateOfBirth
                    ? getPassedDateOnwardDateForInput(user?.dateOfBirth)
                    : "-"
                }
              />
              <InputWithIcon
                icon={
                  user?.isEmailVerified ? (
                    <TiTick className="text-green-500" />
                  ) : (
                    <AiOutlineClose className="text-red-500" />
                  )
                }
                title="Email Verified?"
                name={user?.isEmailVerified ? "Yes" : "No"}
              />
            </div>
            <button
              type="submit"
              className="btn-blue text-white w-full my-3"
              onClick={toggleEditProfile}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
