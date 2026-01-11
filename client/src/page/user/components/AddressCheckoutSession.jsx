import React, { useEffect, useState } from "react";
import {
  getAddresses,
  deleteAddress,
} from "../../../redux/actions/user/addressActions";
import CheckoutAddressRow from "./CheckoutAddressRow";
import Address from "./Address";
import Modal from "../../../components/Modal";
import ConfirmModal from "../../../components/ConfirmModal";
import AddressEdit from "./AddressEdit";
import { useDispatch, useSelector } from "react-redux";

const AddressCheckoutSession = ({ selectedAddress, setSelectedAddress }) => {
  const dispatch = useDispatch();

  const { addresses, loading, error } = useSelector((state) => state.address);
  const { user } = useSelector((state) => state.user);

  // Fetching address when the page is loading
  useEffect(() => {
    // only fetch saved addresses for authenticated users
    if (user) {
      dispatch(getAddresses());
    }
  }, [user]);

  // Selecting the first address as default when the address are loaded
  useEffect(() => {
    if (addresses.length > 0) {
      setSelectedAddress(addresses[0]._id);
    }
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
      {createAddress && (
        <Modal
          tab={<Address closeToggle={toggleAddress} onSave={(addr) => setSelectedAddress(addr)} />}
        />
      )}
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
          title="Confirm Delete?"
          negativeAction={toggleDeleteModal}
          positiveAction={dispatchDeleteAddress}
        />
      )}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Delivery Address</h1>
          <p className="text-sm text-gray-500 mt-1">Choose where you'd like your order delivered. You can add or edit addresses below.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleAddress} className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors">
            Add Address
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((item, index) => {
              return (
                <div key={index} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                  <CheckoutAddressRow
                    item={item}
                    selectedAddress={selectedAddress}
                    setSelectedAddress={setSelectedAddress}
                    setToBeEditedAddress={setToBeEditedAddress}
                    toggleDeleteModal={toggleDeleteModal}
                    toggleEditAddress={toggleEditAddress}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 border border-dashed border-gray-200 text-center">
            <p className="text-gray-600 mb-4">No saved addresses found.</p>
            <button onClick={toggleAddress} className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors">Add your first address</button>
          </div>
        )}
      </div>
    </>
  );
};

export default AddressCheckoutSession;
