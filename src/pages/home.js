import { useDispatch, useSelector } from "react-redux";
import { Sidebar } from "../components/sidebar";
import { useEffect, useRef, useState } from "react";
import { getConversations, updateMessages } from "../features/chatSlice";
import { ChatContainer, WelcomeHome } from "../components/chat";
import SocketContext from "../contexts/SocketContext";
import Call from "../components/chat/call/Call";
import {
  getConversationId,
  getConversationName,
  getConversationPicture,
} from "../utils/chat";
import Peer from "simple-peer";
const callData = {
  socketId: "",
  receivingCall: false,
  callEnded: false,
  name: "",
  picture: "",
};

function Home({ socket }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState({});
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  // Call
  const [stream, setStream] = useState();
  const [call, setCall] = useState(callData);
  const { receivingCall, callEnded, socketId } = call;
  const [totalSecInCall, setTotalSecInCall] = useState(0);
  const [callAccepted, setCallAccepted] = useState(false);
  const [show, setShow] = useState(false);
  const myVideo = useRef();
  const userVideo = useRef(null);
  const connectionRef = useRef(null);
  // join event for socket io

  //join user into the socket io
  useEffect(() => {
    socket.emit("join", user._id);
    //get online users
    socket.on("get-online-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);
  useEffect(() => {
    if (myVideo?.current?.srcObject) {
      enableMedia();
      console.log(myVideo?.current?.srcObject);
    }
  }, []);
  // Call
  useEffect(() => {
    setupMedia();
    socket.on("get_socket", (id) => {
      setCall({ ...call, socketId: id });
    });
    socket.on("call_user", (data) => {
      console.log("call_recieved!");
      console.log(call);
      setCall({
        ...call,
        socketId: data.socketId,
        callerId: data.from,
        name: data.name,
        picture: data.picture,
        signal: data.signal,
        receivingCall: true,
      });
    });
    socket.on("get caller", (data) => {});
    socket.on("call_ended", async () => {
      console.log("ending call");
      setShow(false);
      setCall({ ...call, callEnded: true, receivingCall: false });
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
      if (myVideo.current) {
        myVideo.current.srcObject = null;
      }
    });
  }, []);

  const callUser = () => {
    enableMedia();
    setCall({
      ...call,
      name: getConversationName(user, activeConversation.users),
      picture: getConversationPicture(user, activeConversation.users),
    });
    console.log(call);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("call_user", {
        userToCall: getConversationId(user, activeConversation.users),
        signal: data,
        from: call.socketId,
        name: user.name,
        picture: user.picture,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("call_accepted", (data) => {
      console.log(data);
      setCall({ ...call, callerId: data.callerId });
      setCallAccepted(true);
      console.log("call accepted", call);
      console.log("call Accepted->", callAccepted);
      peer.signal(data.signal);
    });
    connectionRef.current = peer;
    console.log(peer);
  };

  const answerCall = async () => {
    enableMedia();
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    console.log("call at answer user", call);
    peer.on("signal", (data) => {
      socket.emit("answer_call", {
        signal: data,
        to: call.callerId,
        from: call.socketId,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const endCall = () => {
    console.log("ending call", call);
    setShow(false);
    setCall({ ...call, callEnded: true });
    myVideo.current.srcObject = null;
    connectionRef?.current?.destroy();
    socket.emit(
      "call_ended",
      getConversationId(user, activeConversation.users)
    );
  };
  const setupMedia = async () => {
    if (stream) setStream(null);
    await navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
      });
  };
  const enableMedia = () => {
    if (myVideo.current) {
      myVideo.current.srcObject = stream;
    }
    setShow(true);
  };
  // get conversations
  useEffect(() => {
    if (user?.token) dispatch(getConversations(user.token));
  }, [user, dispatch]);

  useEffect(() => {
    //  listening recieved msgs
    socket.on("message_recieved", async (message) => {
      await dispatch(updateMessages(message));
    });
    // Listening typing..
    socket.on("typing", (conversation) => setTyping(conversation));
    socket.on("stop_typing", (conversation) => setTyping(conversation));
  }, []);
  return (
    <>
      <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center">
        {/* container */}
        <div className="container h-screen flex py-[10px]">
          {/* Sidebar */}
          <Sidebar onlineUsers={onlineUsers} typing={typing} />
          {/* Main Chat Component */}
          {activeConversation?._id ? (
            <ChatContainer
              onlineUsers={onlineUsers}
              typing={typing}
              callUser={callUser}
            />
          ) : (
            <WelcomeHome />
          )}
        </div>
      </div>
      {/* Call */}
      <div className={(show || call.signal) && !call.callEnded ? "" : "hidden"}>
        <Call
          call={call}
          setCall={setCall}
          callAccepted={callAccepted}
          myVideo={myVideo}
          userVideo={userVideo}
          stream={stream}
          show={show}
          answerCall={answerCall}
          endCall={endCall}
          totalSecInCall={totalSecInCall}
          setTotalSecInCall={setTotalSecInCall}
        />
      </div>
    </>
  );
}

const HomeWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default HomeWithSocket;
