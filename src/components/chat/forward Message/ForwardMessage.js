import { useState } from "react";
import { ReturnIcon } from "../../../svg";
import SearchUsers from "../../sidebar/header/groupChats/SearchUsers";
import SearchUsersResults from "../../sidebar/header/groupChats/searchUsersResults";
import { useDispatch, useSelector } from "react-redux";
import { getConversationId, sendMessages } from "../../../features/chatSlice";
import SocketContext from "../../../contexts/SocketContext";

function ForwardMessage({ setForward, forward, socket }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const forwardHandler = async () => {
    for (const user of selectedUsers) {
      let values = {
        token,
        reciever_id: user._id,
      };
      const id = await dispatch(getConversationId(values));
      const convo_id = id.payload;
      values = {
        token,
        convo_id: convo_id,
        message: forward.message,
        isForwarded: forward.isForwarded ? forward.isForwarded : forward._id,
        file: forward.file,
      };
      console.log(values);
      let newMsg = await dispatch(sendMessages(values));
      socket.emit("new_message", newMsg.payload);
      setForward(undefined);
    }
  };
  return (
    <div className=" z-50 absolute  h-[400px] w-[350px] dark:bg-dark_bg_5 translate-x-[100%] translate-y-1/3 p-3">
      <div className="flex items-center ">
        <button
          className="btn w-6 h-6 border"
          type="button"
          onClick={() => setForward(undefined)}
        >
          <ReturnIcon className="fill-white" />
        </button>
        <h1 className=" dark:text-dark_text_1 text-[17px] text-center font-sans font-semibold mx-auto  ">
          Forward To ...
        </h1>
      </div>
      {/* Search Users and show selected users */}
      <SearchUsers
        setSearchResults={setSearchResults}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        createGroupHandler={forwardHandler}
        scale={true}
      />
      {/* Displaying Results */}
      <SearchUsersResults
        searchResults={searchResults}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        scale={true}
      />
    </div>
  );
}

const ForwardMessageWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ForwardMessage {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ForwardMessageWithSocket;
