import React, { useEffect, useState } from "react";
import {
  getAddresses,
  deleteAddress,
} from "../../../redux/actions/user/addressActions";
import Address from "./Address";
import Modal from "../../../components/Modal";
import ConfirmModal from "../../../components/ConfirmModal";
import AddressEdit from "./AddressEdit";
import { useDispatch, useSelector } from "react-redux";
import AddressProfileRow from "./AddressProfileRow";
import { MapPin } from "lucide-react";

const AddressProfile = () => {
  const dispatch = useDispatch();

  const { addresses, loading, error } = useSelector((state) => state.address);

  // Fetching address when the page is loading
  useEffect(() => {
    dispatch(getAddresses());
  }, []);

  // Selecting the first address as default when the address are loaded
  useEffect(() => {
    setCreateAddress(false);
    setEnableDeleteModal(false);
    setEditAddressModal(false);
  }, [addresses]);

  // Displaying address modal for creating address
  const [createAddress, setCreateAddress] = useState(false);
  const toggleAddress = () => {
    setCreateAddress(!createAddress);
  };

  // Enabling delete modal
  const [enableDeleteModal, setEnableDeleteModal] = useState(false);
  const toggleDeleteModal = (deleteAddressId) => {
    setEnableDeleteModal(!enableDeleteModal);
    setToBeDeletedId(deleteAddressId);
  };

  // Dispatching the delete function
  const [toBeDeletedId, setToBeDeletedId] = useState("");
  const dispatchDeleteAddress = () => {
    dispatch(deleteAddress(toBeDeletedId));
  };

  const [toBeEditedAddress, setToBeEditedAddress] = useState({});
  const [editAddressModal, setEditAddressModal] = useState(false);
  const toggleEditAddress = () => {
    setEditAddressModal(!editAddressModal);
  };

  return (
    <>
      {createAddress && <Modal tab={<Address closeToggle={toggleAddress} />} />}
      {editAddressModal && (
        <Modal
          tab={
            <AddressEdit
              closeToggle={toggleEditAddress}
              address={toBeEditedAddress}
            />
          }
        />
      )}
      {enableDeleteModal && (
        <ConfirmModal
          title="Delete Address?"
          description="Are you sure you want to delete this address? This action cannot be undone and you'll need to re-enter the address details if you want to use it again."
          type="danger"
          negativeAction={toggleDeleteModal}
          positiveAction={dispatchDeleteAddress}
        />
      )}
      {/* Address listing */}
      <div className="space-y-4">
        {addresses.length > 0 ? (
          <>
            <div className="grid gap-4">
              {addresses.map((item, index) => {
                return (
                  <AddressProfileRow
                    item={item}
                    key={index}
                    setToBeEditedAddress={setToBeEditedAddress}
                    toggleDeleteModal={toggleDeleteModal}
                    toggleEditAddress={toggleEditAddress}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Addresses</h3>
            <p className="text-gray-500 mb-4">Add your first delivery address to get started</p>
          </div>
        )}
        
        <div className="pt-4">
          <button 
            className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium flex items-center justify-center gap-2" 
            onClick={toggleAddress}
          >
            <MapPin className="w-5 h-5" />
            Add New Address
          </button>
        </div>
      </div>
    </>
  );
};

export default AddressProfile;
