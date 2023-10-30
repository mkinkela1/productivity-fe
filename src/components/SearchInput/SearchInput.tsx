const SearchInput = () => {
  return (
    <>
      <div className="relative mt-2">
        <input
          type="text"
          className="pl-8 h-9 bg-transparent border border-gray-700 text-white w-full rounded-md text-sm"
          placeholder="Search"
        />
        <svg
          viewBox="0 0 24 24"
          className="w-4 absolute text-gray-400 top-1/2 transform translate-x-0.5 -translate-y-1/2 left-2"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </>
  );
};

export default SearchInput;
