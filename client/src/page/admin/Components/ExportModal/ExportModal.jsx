import React from "react";
import useExportHook from "./useExportHook";
import { FiX, FiDownload, FiCalendar, FiFileText } from "react-icons/fi";

const ExportModal = ({ toggleExportModal }) => {
  const {
    loading,
    handleDownload,
    selectedType,
    changeSelectedType,
    selectedDateType,
    changeSelectedDate,
    startingDate,
    setStartingDate,
    endingDate,
    setEndingDate,
  } = useExportHook();

  const TypeButton = ({ children, value }) => (
    <button
      onClick={() => changeSelectedType(value)}
      className={`px-4 py-2 rounded-md border transition focus:outline-none flex items-center gap-2 ${
        selectedType === value
          ? "bg-black text-white border-black"
          : "bg-white text-gray-700 border-gray-200"
      }`}
    >
      {children}
    </button>
  );

  if (loading) {
    return (
      <div className="lg:w-[520px] w-11/12 bg-white rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Preparing export...</h2>
        </div>
        <div className="py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:w-[560px] w-11/12 bg-white rounded-xl p-6 shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-2 rounded-md">
            <FiFileText />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Export Orders</h2>
            <p className="text-sm text-gray-500">Download order details as Excel, PDF or CSV</p>
          </div>
        </div>
        <button
          onClick={toggleExportModal}
          className="text-gray-500 hover:text-gray-800 p-2 rounded-md"
          aria-label="Close export dialog"
        >
          <FiX size={18} />
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Date range</h3>
        <div className="flex gap-3">
          <button
            onClick={() => changeSelectedDate("all")}
            className={`px-3 py-2 rounded-md border ${
              selectedDateType === "all" ? "bg-black text-white border-black" : "bg-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => changeSelectedDate("custom")}
            className={`px-3 py-2 rounded-md border ${
              selectedDateType === "custom" ? "bg-black text-white border-black" : "bg-white"
            }`}
          >
            <FiCalendar className="inline mr-2" /> Choose date
          </button>
        </div>

        {selectedDateType === "custom" && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">Starting date</label>
              <input
                type="date"
                value={startingDate}
                onChange={(e) => setStartingDate(e.target.value)}
                className="w-full mt-1 border px-3 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Ending date</label>
              <input
                type="date"
                value={endingDate}
                onChange={(e) => setEndingDate(e.target.value)}
                className="w-full mt-1 border px-3 py-2 rounded-md"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-medium text-gray-700 mb-2">File type</h3>
        <div className="flex gap-3">
          <TypeButton value="excel">
            <FiFileText /> Excel
          </TypeButton>
          <TypeButton value="pdf">
            <FiFileText /> PDF
          </TypeButton>
          <TypeButton value="csv">
            <FiFileText /> CSV
          </TypeButton>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          onClick={toggleExportModal}
          className="px-4 py-2 rounded-md border bg-white text-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded-md bg-gradient-to-r from-green-600 to-green-500 text-white flex items-center gap-2"
        >
          <FiDownload />
          Download
        </button>
      </div>
    </div>
  );
};

export default ExportModal;
