import { Search } from "lucide-react";
import { useRef, useState } from "react";
import SearchResult from "./SearchResult.jsx";
import { useSearchUsers } from "../../../hooks/useSearchUser.js";

function SearchComponent({ InpRef }) {
  const [query, setQuery] = useState("");
  const timerRef = useRef(null);

  let { data: searchedUsers = [], isLoading } = useSearchUsers(query);

  const handleChange = (e) => {
    const value = e.target.value;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setQuery(value);
    }, 300);
  };

  if (InpRef.current?.value === "") {
    searchedUsers = [];
  }

  const Clearvalue = () => {
    if (InpRef.current) {
      InpRef.current.value = "";
      setQuery(""); // also clear the search query state
    }
  };

  return (
    <div className="relative shadow-all bg-white dark:bg-slate-700 rounded-full py-2 w-full md:w-72 lg:w-80 px-4 sm:px-6 flex gap-2">
      <input
        type="text"
        placeholder="Search for a user"
        className="flex-1 outline-none text-sm dark:bg-transparent dark:text-slate-100 dark:placeholder-slate-400"
        onChange={handleChange}
        ref={InpRef}
      />

      <Search size={18} className="cursor-pointer dark:text-slate-300 shrink-0" />

      {isLoading && <p className="text-sm mt-2">Searching...</p>}

      {searchedUsers.length > 0 && (
        <SearchResult searchedUsers={searchedUsers} Clearvalue={Clearvalue} />
      )}
    </div>
  );
}

export default SearchComponent;
