import { useState, useEffect } from "react";
import { SidebarHeader } from "./header";
import { Notifications } from "./notifications";
import { SearchResults, Searchbar } from "./searchbar";
import { Conversations } from "./conversations";
import PendingRequests from './searchbar/PendingRequests';
import { useSelector, useDispatch } from "react-redux";
import { getOutgoingRequests, getPendingRequests } from '../../features/friendRequestSlice';

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
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const [tab, setTab] = useState(null); // null, 'friends', or 'pending'

  useEffect(() => {
    if (user?.token) {
      dispatch(getOutgoingRequests(user.token));
      dispatch(getPendingRequests(user.token));
    }
  }, [user, dispatch]);

  return (
    <div
      className={`flex flex-col flex0030 lg:min-w-[30%] min-h-screen max-h-screen select-none overflow-hidden md:min-w-[40%] sm-sidebar bg-dark_bg_1`}
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
          {/* Tabs */}
          <div className="sticky top-0 z-10 flex flex-row justify-center items-center gap-4 mt-2 mb-2 bg-dark_bg_1 pb-2 border-b border-dark_border_1 shadow-sm">
            <button
              className={`px-5 py-2 rounded-full font-semibold transition-colors duration-200 focus:outline-none shadow-sm ${tab === 'friends' ? 'bg-green-500 text-white' : 'bg-dark_bg_2 text-gray-300 hover:bg-dark_bg_3'}`}
              onClick={() => setTab(tab === 'friends' ? null : 'friends')}
            >
              Friends
            </button>
            <button
              className={`px-5 py-2 rounded-full font-semibold transition-colors duration-200 focus:outline-none shadow-sm ${tab === 'pending' ? 'bg-green-500 text-white' : 'bg-dark_bg_2 text-gray-300 hover:bg-dark_bg_3'}`}
              onClick={() => setTab(tab === 'pending' ? null : 'pending')}
            >
              Pending Requests
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar px-1 pt-2">
            {tab === 'friends' ? (
              <Conversations
                onlineUsers={onlineUsers}
                typing={typing}
                show={show}
                setShow={setShow}
                onlyActive={false}
              />
            ) : tab === 'pending' ? (
              <PendingRequests />
            ) : (
              <Conversations
                onlineUsers={onlineUsers}
                typing={typing}
                show={show}
                setShow={setShow}
                onlyActive={true}
              />
            )}
          </div>
        </>
      )}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #23272f;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

export default Sidebar;
