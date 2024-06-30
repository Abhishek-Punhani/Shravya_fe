import { useEffect, useRef, useState } from "react";
import { DialIcon } from "../../../svg";
import { capitalize } from "../../../utils/string";

function Ringing({ call, setCall, answerCall, endCall }) {
  const { receivingCall, callEnded, name, picture } = call;
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef(null);
  const handleTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };
  useEffect(() => {
    if (timer < 20) {
      handleTimer();
    } else {
      setCall({ ...call, receivingCall: false });
    }
    return () => clearInterval(intervalRef.current);
  }, [timer]);

  return (
    <>
      <div className=" dark:bg-dark_bg_1 rounded-lg fixed top-0 right-0 z-30 shadow-lg select-none pt-3 pr-4">
        {/* Container */}
        <div className=" p-4 flex items-center justify-between gap-x-8">
          {/* Call infos */}
          <div className=" flex items-center gap-x-2">
            <img
              src={picture}
              alt=""
              className=" w-14 h-14 object-cover rounded-full"
            />
            <div>
              {/* Caller name */}
              <h1 className=" dark:text-dark_text_1">
                <b>{capitalize(name)}</b>
              </h1>
              <span className=" dark:text-dark_text_2 text-xs">
                Incoming Video Call...
              </span>
            </div>
          </div>
          {/* Call Actions */}
          <ul className=" flex items-center gap-x-2">
            <li>
              <button
                className="btn_secondary rotate-[135deg] bg-red-500"
                onClick={endCall}
              >
                <DialIcon className="fill-white w-5" />
              </button>
            </li>
            <li>
              <button
                className="btn_secondary bg-green-500"
                onClick={answerCall}
              >
                <DialIcon className="fill-white w-5" />
              </button>
            </li>
          </ul>
        </div>
        {/* Ringtone */}
        {!callEnded && <audio src="/audio/ringtone.mp3" autoPlay loop></audio>}
      </div>
    </>
  );
}

export default Ringing;
