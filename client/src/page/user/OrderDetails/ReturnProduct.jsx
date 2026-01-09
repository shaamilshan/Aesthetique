import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { requestReturn } from "../../../redux/actions/user/userOrderActions";
import { useDispatch } from "react-redux";

const ReturnProduct = ({ closeToggle, id, loadData }) => {
  const dispatch = useDispatch();

  const initialValues = {
    reason: "",
  };

  const validationSchema = Yup.object().shape({
    reason: Yup.string().required("Return reason is required"),
  });

  const handleSubmit = (value) => {
    dispatch(requestReturn({ formData: value, id: id }))
      .then(() => {
        loadData();
        closeToggle();
      })
      .catch((error) => {
        console.error("Error making return request order: ", error);
      });
  };

  return (
    // Make the return form occupy the modal's content area instead of a narrow column.
    // Modal already provides the outer white card; keep this component as inner content
    // with a sensible max-width so it looks centered and not cramped to the left.
    <div className="w-full max-w-md overflow-y-auto">
      <div className="bg-white pt-5 pb-3 px-5 flex items-center justify-between">
        <h1 className="font-bold text-lg ">Confirm Return</h1>
        <AiOutlineClose
          className="text-xl cursor-pointer"
          onClick={closeToggle}
        />
      </div>
      <div className="p-5">
        <h1>Enter the reason for return</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <Field
              name="reason"
              as="textarea"
              className="h-36 lg:h-64 w-full p-5 rounded mt-2"
              placeholder="Type the reason here"
            />
            <ErrorMessage
              className="text-sm text-red-500"
              name="reason"
              component="span"
            />

            <button className="btn-red text-white w-full mt-3" type="submit">
              Request for Return
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ReturnProduct;
