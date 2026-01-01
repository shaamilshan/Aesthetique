import React from "react";
import { Edit3, Trash2, MapPin } from "lucide-react";

const CheckoutAddressRow = ({
  item,
  selectedAddress,
  setSelectedAddress,
  setToBeEditedAddress,
  toggleDeleteModal,
  toggleEditAddress,
}) => {
  const selected = selectedAddress === item._id;

  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-150 cursor-pointer ${
        selected ? 'ring-2 ring-black' : ''
      }`}
      onClick={() => setSelectedAddress(item._id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <MapPin className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {item.firstName} {item.lastName}
              </span>
            </div>
          </div>

          <div className="ml-11">
            <p className="text-gray-700 leading-relaxed">{item.address}</p>
            {item.city && (
              <p className="text-sm text-gray-500 mt-1">
                {item.city}{item.state && `, ${item.state}`}{item.zipCode && ` - ${item.zipCode}`}
              </p>
            )}
            {item.phone && (
              <p className="text-sm text-gray-500 mt-1">Phone: {item.phone}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 ml-4">
          <div>
            {/* Hidden radio for accessibility only - visual selection shown by card outline */}
            <input
              type="radio"
              name="chosen"
              checked={selected}
              onChange={() => setSelectedAddress(item._id)}
              className="sr-only"
            />
          </div>
          <div className="flex gap-2">
            <button
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                setToBeEditedAddress(item);
                toggleEditAddress();
              }}
              title="Edit Address"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                toggleDeleteModal(item._id);
              }}
              title="Delete Address"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutAddressRow;
