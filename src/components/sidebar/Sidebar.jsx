import { useState } from "react";
import { SidebarHeader } from "./header";
import { Notifications } from "./notifications";
import { SearchResults, Searchbar } from "./searchbar";
import { Conversations } from "./conversations";

function Sidebar({ onlineUsers, typing }) {
  const [searchResults, setSearchResults] = useState([]);
  return (
    <div className="flex0030 max-w-[30%] h-full select-none">
      {/* Sidebar Header */}
      <SidebarHeader />
      {/* Notifications */}
      <Notifications />
      {/* Searchbar */}
      <Searchbar
        searchLength={searchResults.length}
        setSearchResults={setSearchResults}
      />

      {searchResults.length > 0 ? (
        <>
          {/* Search Results */}
          <SearchResults
            searchResults={searchResults}
            setSearchResults={setSearchResults}
          />
        </>
      ) : (
        <>
          {/* Conversations */}
          <Conversations onlineUsers={onlineUsers} typing={typing} />
        </>
      )}
    </div>
  );
}

export default Sidebar;
