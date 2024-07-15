import { useDispatch, useSelector } from "react-redux";
import { Sidebar } from "../components/sidebar";
import { useEffect, useState } from "react";
import {
  endCall,
  getConversations,
  setIncomingCall,
  updateDeleteMessages,
  updateEditedMessage,
  updateMessages,
} from "../features/chatSlice";
import { ChatContainer, WelcomeHome } from "../components/chat";
import SocketContext from "../contexts/SocketContext";
import Call from "../components/chat/call/Call";

function Home({ socket }) {
  const [showPicker, setShowPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState({});
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation, call, incomingCall } = useSelector(
    (state) => state.chat
  );
  const [totalSecInCall, setTotalSecInCall] = useState(0);
  const [show, setShow] = useState(undefined);
  const [showMenu, setShowMenu] = useState(false);
  // join event for socket io
  //join user into the socket io
  useEffect(() => {
    socket.emit("join", user._id);
    //get online users
    socket.on("get-online-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  // get conversations
  useEffect(() => {
    if (user?.token) dispatch(getConversations(user.token));
  }, [user, dispatch]);

  // message and typing
  useEffect(() => {
    //  listening recieved msgs
    socket.on("message_recieved", async (message) => {
      await dispatch(updateMessages(message));
    });
    // Listening typing..
    socket.on("typing", (conversation) => setTyping(conversation));
    socket.on("stop_typing", (conversation) => setTyping(conversation));
    // edited
    socket.on("editMsg", async (msg) => {
      await dispatch(updateEditedMessage(msg));
    });
    // delete Message
    socket.on("deleteMsg", async (msg) => {
      console.log(msg);
      await dispatch(updateDeleteMessages(msg));
    });
  }, []);

  // call
  useEffect(() => {
    socket.on("incoming-call", ({ from, roomId, callType }) => {
      dispatch(
        setIncomingCall({
          ...from,
          roomId,
          callType,
        })
      );
    });
    socket.on("call-rejected", async () => {
      setTotalSecInCall(0);
      console.log("ending Call");
      await dispatch(endCall());
    });
  }, []);

  return (
    <>
      <div
        className="h-screen dark:bg-dark_bg_1 flex items-center justify-center"
        onClick={() => {
          if (show) {
            setShow(false);
          }
          if (showMenu) {
            setShowMenu(false);
          }
          if (showPicker) {
            setShowPicker(false);
          }
        }}
      >
        {/* container */}
        <div className="container h-screen flex py-[10px]">
          {/* Sidebar */}
          <Sidebar
            onlineUsers={onlineUsers}
            typing={typing}
            show={show}
            setShow={setShow}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
          />
          {/* Main Chat Component */}
          {activeConversation && activeConversation?._id ? (
            <ChatContainer
              onlineUsers={onlineUsers}
              typing={typing}
              showPicker={showPicker}
              showAttachments={showAttachments}
              setShowPicker={setShowPicker}
              setShowAttachments={setShowAttachments}
            />
          ) : (
            <WelcomeHome />
          )}
        </div>
      </div>
      {/* Call */}
      {(call || incomingCall) && (
        <div>
          <Call
            totalSecInCall={totalSecInCall}
            setTotalSecInCall={setTotalSecInCall}
          />
        </div>
      )}
    </>
  );
}

const HomeWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default HomeWithSocket;
