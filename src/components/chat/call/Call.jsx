import { useState } from "react";
import CallActions from "./CallActions";
import Header from "./Header";
import Ringing from "./Ringing";
import CallInfos from "./callInfos";

function Call({
  call,
  setCall,
  callAccepted,
  stream,
  userVideo,
  myVideo,
  show,
  answerCall,
  endCall,
  totalSecInCall,
  setTotalSecInCall,
}) {
  const { receivingCall, callEnded, name } = call;
  const [showActions, SetShowActions] = useState(false);
  return (
    <>
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[450px] h-[550px] rounded-2xl overflow-hidden callbg ${
          receivingCall && !callAccepted ? "hidden" : ""
        }`}
        onMouseOver={() => SetShowActions(true)}
        onMouseOut={() => SetShowActions(false)}
      >
        <div>
          {/* Header */}
          <Header />
          {/* Call infos */}
          <CallInfos
            name={name}
            totalSecInCall={totalSecInCall}
            setTotalSecInCall={setTotalSecInCall}
            callAccepted={callAccepted}
          />
          {/* Call Actions */}
          {showActions && <CallActions endCall={endCall} />}
          {/* Video Streams */}
          <div>
            {/* User Video */}
            {callAccepted && !callEnded && (
              <div>
                <video
                  ref={userVideo}
                  playsInline
                  muted
                  autoPlay
                  className="largeVideoCall"
                ></video>
              </div>
            )}
            {/* My Video */}

            <div>
              <video
                ref={myVideo}
                playsInline
                muted
                autoPlay
                className={` ${
                  !callAccepted && !callEnded
                    ? "largeVideoCall"
                    : "SmallVideoCall rounded-lg"
                } ${showActions && "moveVideoCall"}`}
              ></video>
            </div>
          </div>
        </div>
      </div>

      {receivingCall && !callAccepted && (
        <Ringing
          call={call}
          setCall={setCall}
          answerCall={answerCall}
          endCall={endCall}
        />
      )}

      {/* Ringing Audio */}
      {!callAccepted && show && (
        <audio src="/audio/ringing.mp3" autoPlay loop></audio>
      )}
    </>
  );
}

export default Call;
