import { useEffect, useRef, useState } from "react";
import CallActions from "./CallActions";
import Header from "./Header";
import Ringing from "./Ringing";
import CallInfos from "./callInfos";
import { useDispatch, useSelector } from "react-redux";
import Peer from "simple-peer";
import SocketContext from "../../../contexts/SocketContext";
import { endCall, setCall, setIncomingCall } from "../../../features/chatSlice";
import { getConversationPicture } from "../../../utils/chat";

function Call({ socket, totalSecInCall, setTotalSecInCall }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { call, incomingCall, activeConversation } = useSelector(
    (state) => state.chat
  );

  const [stream, setStream] = useState();
  const [showActions, SetShowActions] = useState(false);
  const [callerSignal, setCallerSignal] = useState();

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  // If there is an incomingCall, track its signal
  useEffect(() => {
    setCallerSignal(incomingCall?.signal);
  }, [incomingCall]);

  // Get local stream
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        setStream(localStream);
        if (myVideo.current) {
          myVideo.current.srcObject = localStream;
        }
      });
  }, []);

  // If the local stream or call changes, update myVideo
  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream, call]);

  // Leave Call
  const leaveCall = async () => {
    setTotalSecInCall(0);

    // Stop local stream tracks so camera/audio stops
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    // Destroy the peer connection safely
    if (connectionRef.current) {
      if (typeof connectionRef.current.removeAllListeners === "function") {
        connectionRef.current.removeAllListeners();
      }
      try {
        connectionRef.current.destroy();
      } catch (e) {
        // Ignore errors from double destroy
      }
      connectionRef.current = null;
    }
    if (call) {
      socket.emit("reject-call", call._id);
    } else if (incomingCall) {
      socket.emit("reject-call", incomingCall._id);
    }

    await dispatch(endCall());
  };

  // Answer Call
  const answerCall = async () => {
    await dispatch(
      setCall({
        ...incomingCall,
        type: "in-coming",
        accepted: true,
      })
    );
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    // Send our signal back to the caller
    peer.on("signal", (data) => {
      socket.emit("accept-incoming-call", incomingCall._id, data);
    });

    // When we receive the remote stream, attach it to userVideo
    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });

    // Accept the caller's signal
    if (callerSignal) {
      peer.signal(callerSignal);
    }
    connectionRef.current = peer;

    // Clear the incomingCall from Redux
    await dispatch(setIncomingCall(undefined));
  };

  // Out-going call logic
  useEffect(() => {
    if (call && call.type === "out-going") {
      setTotalSecInCall(0);

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      // Send our signal to the callee
      peer.on("signal", (data) => {
        socket.emit("outgoing-call", {
          to: call._id,
          from: {
            _id: user._id,
            name: user.name,
            picture: user.picture,
          },
          callType: call.callType,
          signal: data,
        });
      });

      // When we receive the remote stream, attach it to userVideo
      peer.on("stream", (remoteStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
        }
      });

      // When the callee accepts, signal back
      socket.on("call-accepted", (signal) => {
        dispatch(
          setCall({
            ...call,
            accepted: true,
          })
        );
        peer.signal(signal);
      });

      connectionRef.current = peer;
    }
  }, [call, dispatch, socket, stream, user, setTotalSecInCall]);

  return (
    <>
      {call && (
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[450px] h-[550px] rounded-2xl overflow-hidden callbg"
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
              {/* Remote / userVideo */}
              {call.accepted && (
                <div>
                  <video
                    ref={userVideo}
                    playsInline
                    autoPlay
                    className="largeVideoCall"
                  ></video>
                </div>
              )}
              {/* My Video */}
              <div className="flex items-center justify-center h-full">
                <video
                  ref={myVideo}
                  muted
                  playsInline
                  autoPlay
                  className={`${
                    call.accepted
                      ? `SmallVideoCall ${showActions && "moveVideoCall"}`
                      : "largeVideoCall"
                  }`}
                ></video>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ringing Audio */}
      {call && !call.accepted && (
        <audio src="/audio/ringing.mp3" autoPlay loop></audio>
      )}

      {/* Incoming Ringing */}
      {incomingCall?._id && !call?.accepted && (
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
