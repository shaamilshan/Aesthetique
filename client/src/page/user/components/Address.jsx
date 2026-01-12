import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputType from "../components/InputType";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { createAddress } from "../../../redux/actions/user/addressActions";
// import { Country, State, City } from "country-state-city";
import SearchInput from "./SearchInput";

const Address = ({ closeToggle, onSave }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  // const countries = Country.getAllCountries();
  let [states, setStates] = useState([]);
  let [cities, setCities] = useState([]);

  const initialValues = {
    firstName: "",
    lastName: "",
    address: "",
    country: "",
    regionState: "",
    city: "",
    pinCode: "",
    email: "",
    phoneNumber: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
    regionState: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    pinCode: Yup.number()
      .required("Required")
      .moreThan(99999, "Pin code should be at-least 6 digit")
      .typeError("Pin code should be digits"),
    email: Yup.string().email("Invalid Email"),
    phoneNumber: Yup.number()
      .typeError("Phone number should be digits")
      .moreThan(999999999, "Not valid phone number")
      .required("Phone number is required"),
  });

  const handleSubmit = (value) => {
    // if user is authenticated, create address via API
    if (user) {
      dispatch(createAddress(value));
      // close modal; the redux flow will refresh addresses and parent will pick default
      if (closeToggle) closeToggle();
      return;
    }

    // Guest flow: pass the address object back to parent via onSave callback
    if (onSave && typeof onSave === "function") {
      onSave(value);
    }
    if (closeToggle) closeToggle();
  };

  // const handleCountrySelect = (country) => {
  //   const state = State.getStatesOfCountry(country.isoCode);
  //   setStates(state);
  // };
  // const handleSelectState = (state) => {
  //   const city = City.getCitiesOfState(state.countryCode, state.isoCode);
  //   setCities(city);
  // };

  return (
    <div className="bg-gray-100 w-full max-w-full shadow-2xl overflow-y-auto max-h-[80vh] lg:max-h-none rounded-lg">
      <div className="bg-white pt-5 pb-3 px-5 flex items-center justify-between">
        <h1 className="font-bold text-lg ">Delivery Address</h1>
        <AiOutlineClose
          className="text-xl cursor-pointer"
          onClick={closeToggle}
        />
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="px-5 pb-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InputType
                name="firstName"
                placeholder="John"
                title="First Name"
              />
              <InputType
                name="lastName"
                placeholder="Doe"
                title="Last Name"
              />
            </div>

            <InputType name="address" placeholder="House number, street, landmark" title="Address" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputType
                name="country"
                placeholder="Country"
                title="Country"
              />
              <InputType
                name="regionState"
                placeholder="State/Region"
                title="State/Region"
              />
              <InputType name="city" placeholder="City" title="City" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* <SearchInput
                onInput={setFieldValue}
                onSelect={handleCountrySelect}
                data={countries}
                title={"Country"}
                placeholder={"Select your country"}
                name={"country"}
              />
              <SearchInput
                onInput={setFieldValue}
                onSelect={handleSelectState}
                data={states}
                title={"State/Region"}
                placeholder={"Select your state"}
                name={"regionState"}
              />
              <SearchInput
                onInput={setFieldValue}
                onSelect={() => {}}
                data={cities}
                title={"City"}
                placeholder={"Select your City"}
                name={"city"}
              /> */}

              <InputType name="pinCode" placeholder="Pin Code" title="Pin Code" />
            </div>
            <InputType name="email" placeholder="" title="Email" />
            <InputType name="phoneNumber" placeholder="" title="Phone Number" />
            <button type="submit" className="btn-blue text-white">
              Save
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Address;
