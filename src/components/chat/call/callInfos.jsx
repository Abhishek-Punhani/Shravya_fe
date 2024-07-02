import { capitalize } from "../../../utils/string";
import CallTimes from "./callTimes";

function CallInfos({ name, totalSecInCall, setTotalSecInCall, callAccepted }) {
  return (
    <>
      <div className="absolute top-12 w-full p-1 z-30">
        {/* Conatiner */}
        <div className=" flex flex-col items-center">
          {/* Call Infos */}
          <div className="flex flex-col items-center gap-y-1">
            <h1 className=" text-white text-lg">
              <b>{capitalize(name)}</b>
            </h1>
            {totalSecInCall === 0 ? (
              <span className="text-dark_text_1">Ringing...</span>
            ) : null}
            {callAccepted && (
              <CallTimes
                totalSecInCall={totalSecInCall}
                setTotalSecInCall={setTotalSecInCall}
                callAccepted={callAccepted}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CallInfos;
