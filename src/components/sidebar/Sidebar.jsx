import { useState } from "react";
import { SidebarHeader } from "./header";
import { Notifications } from "./notifications";
import { SearchResults, Searchbar } from "./searchbar";
import { Conversations } from "./conversations";
import { useSelector } from "react-redux";

function Sidebar({
  onlineUsers,
  typing,
  show,
  setShow,
  showMenu,
  setShowMenu,
  showPicker,
  setShowPicker,
}) {
  const [searchResults, setSearchResults] = useState([]);
  const { activeConversation } = useSelector((state) => state.chat);
  return (
    <div
      className={`flex flex-col flex0030 lg:min-w-[30%] min-h-screen max-h-screen select-none overflow-hidden md:min-w-[40%] sm-sidebar ${
        activeConversation?._id ? "hidde" : ""
      }`}
    >
      {/* Sidebar Header */}
      <SidebarHeader
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
      />
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
          <Conversations
            onlineUsers={onlineUsers}
            typing={typing}
            show={show}
            setShow={setShow}
          />
        </>
      )}
    </div>
  );
}

export default Sidebar;
