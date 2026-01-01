import React from "react";
import AddressProfile from "../../../components/AddressProfile";
import { MapPin } from "lucide-react";

const Addresses = () => {
  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {/* <div className="p-2 bg-black rounded-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div> */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Addresses</h1>
            <p className="text-gray-500 text-sm">Manage your saved delivery addresses</p>
          </div>
        </div>
      </div>
      
      {/* Address Content */}
      <AddressProfile />
    </div>
  );
};

export default Addresses;
