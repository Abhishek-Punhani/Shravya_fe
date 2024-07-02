import { useDispatch } from "react-redux";
import {
  ArrowIcon,
  DialIcon,
  MuteIcon,
  SpeakerIcon,
  VideoDialIcon,
} from "../../../svg";

function CallActions({ leaveCall }) {
  return (
    <>
      <div className="absolute bottom-0 w-full h-22 px-1 z-50">
        {/* Conatiner */}
        <div className=" relative bg-[#222] px-4 py-6 rounded-xl">
          {/* Expand Icon */}
          <button className=" -rotate-90 scale-y-[300%] absolute top-1 left-1/2">
            <ArrowIcon className="fill-dark_svg_2" />
          </button>
          {/* Actions */}
          <ul className="flex items-center justify-between">
            <li>
              <button className="btn_secondary">
                <SpeakerIcon className="fill-white w-6" />
              </button>
            </li>
            <li>
              <button className="btn_secondary">
                <VideoDialIcon className="fill-white w-14 mt-2.5 h-full" />
              </button>
            </li>
            <li>
              <button className="btn_secondary">
                <MuteIcon className="fill-white w-4" />
              </button>
            </li>
            <li>
              <button
                className="btn_secondary rotate-[135deg] bg-red-500"
                onClick={() => leaveCall()}
              >
                <DialIcon className="fill-white w-5" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default CallActions;
