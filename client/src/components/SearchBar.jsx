import React from "react";
import { BiSearch } from "react-icons/bi";
import { GrClose } from "react-icons/gr";

const SearchBar = ({ handleClick, search, setSearch, placeholder, label }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `${
      import.meta.env.VITE_FRONTEND_URL
    }/collections?search=${encodeURIComponent(search)}`;
  };

  return (
    <div className="w-full flex items-center space-x-4">
      {/* Text near the search bar */}
      {label && <span className="text-gray-700 text-lg">{label}</span>}

      {/* Search bar */}
      <form
        className="flex items-center bg-gray-200 py-2 px-4 rounded-lg border border-gray-300 flex-grow"
        onSubmit={(e) => handleSubmit(e)}
      >
        <input
          type="text"
          className="outline-none w-full bg-gray-200 rounded px-2 py-1 placeholder-gray-500 text-gray-800"
          placeholder={placeholder || "Search for Products..."}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleClick("search", e.target.value);
          }}
        />
        {search ? (
          <button
            type="button"
            className="ml-2"
            onClick={() => {
              handleClick("search", "");
              setSearch("");
            }}
          >
            <GrClose className="text-xl text-gray-500 hover:text-gray-800" />
          </button>
        ) : null}

        {/* Submit button replaced with icon */}
        <button
          type="submit"
          className="ml-2 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <BiSearch className="text-2xl" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
