import { useEffect, useState } from "react";
import CallActions from "./CallActions";
import Header from "./Header";
import Ringing from "./Ringing";
import CallInfos from "./callInfos";
import { useDispatch, useSelector } from "react-redux";
import SocketContext from "../../../contexts/SocketContext";
import {
  endCall,
  getZegoToken,
  setCall,
  setIncomingCall,
} from "../../../features/chatSlice";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import { getConversationPicture } from "../../../utils/chat";

function Call({ socket, totalSecInCall, setTotalSecInCall }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [showActions, SetShowActions] = useState(false);
  const { call, incomingCall, activeConversation } = useSelector(
    (state) => state.chat
  );
  const [callToken, setCallToken] = useState(undefined);
  const [zgVar, setZgVar] = useState(undefined);
  const [localStream, setLocalStream] = useState(undefined);
  const [publishStream, setPublishStream] = useState(undefined);
  const leaveCall = async () => {
    setTotalSecInCall(0);
    if (call) {
      if (zgVar && localStream && publishStream) {
        zgVar.destroyStream(localStream);
        zgVar.stopPublishingStream(publishStream);
        zgVar.logoutRoom(call.roomId.toString());
      }
      socket.emit("reject-call", call._id);
    } else if (incomingCall) {
      socket.emit("reject-call", incomingCall._id);
    }

    await dispatch(endCall());
  };
  const answerCall = async () => {
    await dispatch(
      setCall({
        ...incomingCall,
        type: "in-coming",
        accepted: true,
      })
    );
    socket.emit("accept-incoming-call", incomingCall._id);
    await dispatch(setIncomingCall(undefined));
  };
  useEffect(() => {
    const fetchToken = async () => {
      if (call?.accepted === true) {
        let zegoToken = await dispatch(getZegoToken(token));
        console.log(zegoToken);
        setCallToken(zegoToken.payload.token);
      }
    };
    fetchToken();
    console.log(callToken);
  }, [call?.accepted]);
  useEffect(() => {
    const startCall = async () => {
      const zg = new ZegoExpressEngine(
        parseInt(process.env.REACT_APP_ZEGO_APP_ID),
        process.env.REACT_APP_ZEGO_SERVER_ID.toString()
      );
      setZgVar(zg);
      zg.on(
        "roomStreamUpdate",
        async (roomId, updateType, streamList, extendedData) => {
          if (updateType === "ADD") {
            const vd = document.getElementById("userVideo");
            vd.id = streamList[0].streamID;
            vd.muted = false;
            zg.startPlayingStream(streamList[0].streamID, {
              video: call.callType === "video",
              audio: true,
            }).then((stream) => (vd.srcObject = stream));
          } else if (
            updateType === "DELETE" &&
            zg &&
            localStream &&
            streamList[0].streamID
          ) {
            zg.destroyStream(localStream);
            zg.stopPublishingStream(streamList[0].streamID);
            zg.logoutRoom(call.roomId.toString());
            dispatch(endCall());
          }
        }
      );
      await zg.loginRoom(
        call.roomId.toString(),
        callToken.toString(),
        { userID: user._id, userName: user.name },
        { userUpdate: true }
      );
      const localStream = await zg.createStream({
        camera: {
          audio: true,
          video: call.callType === "video",
        },
      });
      const localVideo = document.getElementById("myVideo");
      localVideo.srcObject = localStream;
      localVideo.muted = false;
      const streamID = "123" + Date.now();
      setPublishStream(streamID);
      setLocalStream(localStream);
      zg.startPublishingStream(streamID, localStream);
    };
    if (callToken) {
      console.log(
        callToken,
        process.env.REACT_APP_ZEGO_APP_ID,
        process.env.REACT_APP_ZEGO_SERVER_ID
      );
      startCall();
    }
  }, [callToken]);
  useEffect(() => {
    socket.on("call-accepted", () => {
      dispatch(
        setCall({
          ...call,
          accepted: true,
        })
      );
    });
    if (call && call?.type.toString() === "out-going" && !call?.accepted) {
      setTotalSecInCall(0);
      socket.emit("outgoing-call", {
        to: call._id,
        from: {
          _id: user._id,
          name: user.name,
          picture: user.picture,
        },
        callType: call.callType,
        roomId: call.roomId,
      });
    }
  }, []);
  return (
    <>
      {call && (
        <div
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[450px] h-[550px] rounded-2xl overflow-hidden callbg`}
          onMouseOver={() => SetShowActions(true)}
          onMouseOut={() => SetShowActions(false)}
        >
          <div>
            {/* Header */}
            <Header />
            {/* Call infos */}
            <CallInfos
              name={call?.name}
              callAccepted={call?.accepted}
              setTotalSecInCall={setTotalSecInCall}
              totalSecInCall={totalSecInCall}
            />
            {/* Call Actions */}
            {showActions && <CallActions leaveCall={leaveCall} />}
            {/* Video Streams */}
            <div>
              {/* User Video */}
              {call.accepted && (
                <div>
                  <video
                    id="userVideo"
                    playsInline
                    autoPlay
                    className="largeVideoCall"
                  ></video>
                </div>
              )}
              {/* My Video */}

              <div className="flex items-center justify-center h-full">
                {call?.accepted ? (
                  <video
                    id="myVideo"
                    playsInline
                    autoPlay
                    className={`${
                      call.accepted
                        ? `SmallVideoCall
                 ${showActions && "moveVideoCall"}`
                        : "largeVideoCall"
                    }`}
                  ></video>
                ) : (
                  <img
                    src={getConversationPicture(user, activeConversation.users)}
                    alt=""
                    className=" h-[200px] w-[200px] flex justify-center items-center rounded-full mt-[30%]"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ringing Audio */}
      {call && !call.accepted && (
        <audio src="/audio/ringing.mp3" autoPlay loop></audio>
      )}

      {/* Ringing  */}
      {incomingCall?._id && (
        <Ringing leaveCall={leaveCall} answerCall={answerCall} />
      )}
    </>
  );
}
const CallWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Call {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default CallWithSocket;
