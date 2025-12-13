import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";

const InputType = ({ title, name, placeholder, optional }) => {
  const { errors, touched } = useFormikContext();
  const hasError = errors[name] && touched[name];

  return (
    <div className="text-sm my-2 w-full">
      <label className="block text-xs font-medium text-gray-600 mb-2">
        {title} <span className="text-gray-400">{optional && "(Optional)"}</span>
      </label>
      <Field
        className={`w-full rounded-md px-4 py-3 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition shadow-sm ${
          hasError ? "border-red-300 ring-red-100" : "border border-gray-100"
        }`}
        name={name}
        placeholder={placeholder}
      />
      <ErrorMessage
        className="text-sm text-red-500 mt-1 block"
        name={name}
        component="span"
      />
    </div>
  );
};

export default InputType;
