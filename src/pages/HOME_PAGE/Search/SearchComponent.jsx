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

  return (
    <div className="relative shadow-all bg-white rounded-full py-2 w-sm px-6 flex gap-2">
      <input
        type="text"
        placeholder="Search for a user"
        className="flex-1 outline-none"
        onChange={handleChange}
        ref={InpRef}
      />

      <Search className="cursor-pointer" />

      {isLoading && <p className="text-sm mt-2">Searching...</p>}

      {searchedUsers.length > 0 && (
        <SearchResult searchedUsers={searchedUsers} />
      )}
    </div>
  );
}

export default SearchComponent;
