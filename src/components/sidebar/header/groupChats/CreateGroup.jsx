import { useState } from "react";
import { CloseIcon, ReturnIcon } from "../../../../svg";
import SearchUsers from "./SearchUsers";
import SearchUsersResults from "./searchUsersResults";
import { useDispatch, useSelector } from "react-redux";
import { createGroupConvo } from "../../../../features/chatSlice";

function CreateGroup({ setShow }) {
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const { status } = useSelector((state) => state.chat);
  const [name, setName] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();
  const createGroupHandler = async () => {
    if (status !== "loading") {
      let users = [];
      selectedUsers.forEach((user) => users.push(user._id));
      let values = {
        name,
        users,
        token,
      };
      await dispatch(createGroupConvo(values));
      setShow(false);
    }
  };
  return (
    <>
      <div className="createGroupAnimation relative flex0030 h-full z-40">
        {/* Container */}
        <div className="mt-5">
          {/* return button */}
          <button className="btn w-6 h-6 border" onClick={() => setShow(false)}>
            <ReturnIcon className="dark:fill-white" />
          </button>
          {/* Name input and picture */}
          <div className="mt-4 flex items-center justify-between pl-2 ">
            <div className=" flex flex-col items-center justify-center relative">
              <div className=" absolute bottom-[0.1px] right-0 cursor-pointer bg-green_1 rounded-full w-fit h-fit">
                <CloseIcon className="fill-white w-4 h-4 rotate-45" />
              </div>
              <img
                src="/defaultGroupPicture.png"
                alt=""
                className="w-14 h-14 rounded-full object-contain"
              />
            </div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=" w-full bg-transparent border-b border-green_1 dark:text-dark_text_1 outline-none pl-3"
            />
          </div>
          {/* Search Users and show selected users */}
          <SearchUsers
            setSearchResults={setSearchResults}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            createGroupHandler={createGroupHandler}
          />
          {/* Displaying Results */}
          <SearchUsersResults
            searchResults={searchResults}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        </div>
      </div>
    </>
  );
}

export default CreateGroup;
