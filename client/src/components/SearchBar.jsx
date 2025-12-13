import React from "react";
import { BiSearch } from "react-icons/bi";
import { GrClose } from "react-icons/gr";

const SearchBar = ({ handleClick, search, setSearch, placeholder, label, autoFocus = false, dark = false, showIcon = true, inPill = false }) => {
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
        className={`flex items-center ${dark && !inPill ? 'bg-black text-white ring-1 ring-white/40' : (dark && inPill ? 'bg-transparent text-white' : 'bg-white')} ${dark ? (inPill ? 'py-0 px-3' : 'py-1 px-4') : 'py-2 px-4'} ${dark && !inPill ? 'rounded-full' : (dark && inPill ? 'rounded-none' : 'rounded-lg')} flex-grow h-full`}
        onSubmit={(e) => handleSubmit(e)}
      >
        {/* Optional search icon on the left */}
        {showIcon && (
          <button
            type="submit"
            aria-label="Search"
            className={`mr-2 transition-colors ${dark ? 'text-white/90 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <BiSearch className="text-2xl" />
          </button>
        )}

        <input
          type="text"
          autoFocus={autoFocus}
          className={`outline-none w-full ${dark ? 'px-2 placeholder-white/70 text-white bg-transparent' : 'px-2 py-1 placeholder-gray-500 text-gray-800'} ${inPill ? 'py-1' : 'py-1'}`}
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
            aria-label="Clear search"
          >
            <GrClose className={`text-xl ${dark ? 'text-white/90 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`} />
          </button>
        ) : null}
      </form>
    </div>
  );
};

export default SearchBar;
