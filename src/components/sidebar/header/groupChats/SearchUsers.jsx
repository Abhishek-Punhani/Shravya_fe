import axios from "axios";
import { useSelector } from "react-redux";
import { CloseIcon, ValidIcon } from "../../../../svg";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
function SearchUsers({
  setSearchResults,
  selectedUsers,
  setSelectedUsers,
  createGroupHandler,
}) {
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const { status } = useSelector((state) => state.chat);
  const [noResult, setNoResult] = useState(false);
  const removeUser = (user) => {
    selectedUsers = selectedUsers.filter((u) => u._id !== user._id);
    setSelectedUsers([...selectedUsers]);
  };
  const handleSearch = async (e) => {
    if (e.target.value === "") {
      setSearchResults([]);
      setNoResult(false);
    } else {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_AUTH_ENDPOINT}/user/?search=${e.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSearchResults(data);
        if (data.length === 0) {
          setNoResult(true);
        } else {
          setNoResult(false);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
  };

  return (
    <>
      <div className="mt-5 pr-2 pb-5 border-b border-b-green_1 relative">
        <input
          type="text"
          placeholder="Add Users"
          onChange={(e) => handleSearch(e)}
          className="input "
        />
        {/* selected Users */}
        {selectedUsers.length > 0 ? (
          <div className=" mt-3 flex items-center justify-start flex-wrap px-3">
            {selectedUsers.map((user) => (
              <>
                <div className="w-[60px] h-[60px] flex flex-col items-center justify-center relative ">
                  <div
                    className=" absolute bottom-[-1] right-0 cursor-pointer bg-[rgb(0,0,0,0.4)] w-fit h-fit"
                    onClick={() => removeUser(user)}
                  >
                    <CloseIcon className="fill-dark_svg_1 w-5 h-5" />
                  </div>
                  <div className=" flex flex-col items-center justify-center">
                    <img
                      src={user.picture}
                      alt=""
                      className="w-12 h-12 rounded-full object-contain"
                    />
                    <h1 className="mt-1 text-[15px] font-light dark:text-dark_text_1">
                      {user.name}
                    </h1>
                  </div>
                </div>
                ;
              </>
            ))}
          </div>
        ) : noResult ? (
          <p className="dark:text-dark_svg_1">No Results found !</p>
        ) : null}

        {/* Create Group Button */}
        <div className="mt-2 flex items-center justify-end">
          <button className="btn bg-green_1 scale-75 hover:bg-green-500">
            {status === "loading" ? (
              <ClipLoader color="#E9EDEF" size={25} />
            ) : (
              <span
                onClick={() => createGroupHandler()}
                className="h-full flex items-center justify-center"
              >
                <ValidIcon className="fill-white mt-2 h-full" />
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default SearchUsers;
