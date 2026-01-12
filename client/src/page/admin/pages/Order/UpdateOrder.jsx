import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { updateOrderStatus } from "../../../../redux/actions/admin/ordersAction";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  getPassedDateOnwardDateForInput,
  getTodayOnwardDateForInput,
} from "../../../../Common/functions";

const UpdateOrder = ({ toggleModal, data }) => {
  const { id, status, paymentMode, deliveryDate,trackingId } = data;
  console.log("data");
  console.log(data);
  
  const dispatch = useDispatch();
  const todayDate = getTodayOnwardDateForInput();
  // compute a safe min date: only use deliveryDate when it's a valid date <= today
  const rawOrderDate = deliveryDate ? getPassedDateOnwardDateForInput(deliveryDate) : "";
  const minDate = rawOrderDate && rawOrderDate <= todayDate ? rawOrderDate : "";

  const initialValues = {
    status: status,
    // default date to today so validation passes and admins don't always need to pick a date
    date: todayDate,
    description: "",
    paymentStatus: "",
    trackingId: trackingId || "",
  };

  const validationSchema = Yup.object().shape({
    status: Yup.string().required("Status is required"),
    date: Yup.date().nullable().required("Date is required"),
    description: Yup.string(),
    paymentStatus: Yup.string().nullable(),
  });

  const handleSubmit = (values) => {
    // Create a payload copy so we don't mutate Formik's values object
    const payload = { ...values };

    // paymentStatus is only relevant when marking delivered + COD; remove when empty
    if (payload.status !== "delivered" && payload.paymentStatus === "") {
      delete payload.paymentStatus;
    }

    // If date is empty string, remove it so server can default or handle accordingly
    if (!payload.date) delete payload.date;

    dispatch(updateOrderStatus({ id, formData: payload }))
      .then(() => {
        toggleModal({});
      })
      .catch((err) => {
        // let redux slice handle toast; keep modal open on error
        console.error("Failed to update order status", err);
      });
  };

  return (
    // Use the Modal's outer white container for chrome; make this content
    // stretch to fill the available modal width/height.
    <div className="w-full h-full px-0 py-0">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-lg font-semibold">Update Order</h1>
                <p className="text-xs text-gray-500">Modify order status and details</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm px-3 py-1 rounded bg-blue-50 text-blue-700">{paymentMode}</div>
                <AiOutlineClose
                  className="text-2xl cursor-pointer hover:text-gray-500"
                  onClick={() => toggleModal({})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="text-sm mb-1 block">Status</label>
                <Field
                  as="select"
                  name="status"
                  className="capitalize px-3 py-2 w-full bg-gray-100 rounded border"
                >
                  <option value="pending" disabled={
                    status === "pending" ||
                    status === "processing" ||
                    status === "shipped" ||
                    status === "delivered"
                  }>
                    Pending
                  </option>
                  <option value="processing" disabled={
                    status === "processing" ||
                    status === "shipped" ||
                    status === "delivered"
                  }>
                    Processing
                  </option>
                  <option value="shipped" disabled={status === "shipped" || status === "delivered"}>
                    Shipped
                  </option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Field>
                <ErrorMessage name="status" component="div" className="text-red-600 text-xs mt-1" />
              </div>

              <div>
                <label className="text-sm mb-1 block">Date</label>
                <Field
                  type="date"
                  name="date"
                  min={minDate || undefined}
                  max={todayDate}
                  className="px-3 py-2 w-full bg-gray-100 rounded border"
                />
                <ErrorMessage name="date" component="div" className="text-red-600 text-xs mt-1" />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-sm mb-1 block">Tracking ID</label>
              <Field
                type="text"
                name="trackingId"
                placeholder="Enter tracking id (when shipped)"
                className="px-3 py-2 w-full bg-gray-100 rounded border"
                disabled={values.status !== "shipped"}
              />
              <ErrorMessage name="trackingId" component="div" className="text-red-600 text-xs mt-1" />
            </div>

            {values.status === "delivered" && paymentMode === "cashOnDelivery" && (
              <div className="mt-3">
                <label className="text-sm mb-1 block">Payment Collected?</label>
                <Field as="select" name="paymentStatus" className="px-3 py-2 w-full bg-gray-100 rounded border">
                  <option value="">Choose</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Field>
                <ErrorMessage name="paymentStatus" component="div" className="text-red-600 text-xs mt-1" />
              </div>
            )}

            <div className="mt-3">
              <label className="text-sm mb-1 block">Notes / Description</label>
              <Field as="textarea" name="description" rows={4} className="px-3 py-2 w-full bg-gray-100 rounded border" />
              <ErrorMessage name="description" component="div" className="text-red-600 text-xs mt-1" />
            </div>

            <div className="mt-4 flex gap-3 flex-col sm:flex-row">
              <button
                type="button"
                className="w-full sm:flex-1 px-4 py-2 border rounded"
                onClick={() => toggleModal({})}
              >
                Cancel
              </button>
              <button type="submit" className="w-full sm:flex-1 px-4 py-2 bg-black text-white rounded">
                Update Order
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdateOrder;
