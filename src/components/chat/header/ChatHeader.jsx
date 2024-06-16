import { useSelector } from "react-redux";
import { DotsIcon, SearchLargeIcon } from "../../../svg";
import { capitalize } from "../../../utils/string";
function ChatHeader() {
  const { activeConversation } = useSelector((state) => state.chat);
  const { name, picture } = activeConversation;
  return (
    <>
      <div className=" h-[59px] w-full flex items-center dark:bg-dark_bg_2 select-none p-[16px]">
        {/* Container */}
        <div className=" w-full flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-x-4">
            {/* Conversation Image */}
            <button className="btn">
              <img
                src={picture}
                alt={`${name}picture`}
                className="h-full w-full rounded-full object-cover"
              />
            </button>
            {/* Conversation Name and Online Status */}
            <div className="flex flex-col">
              <h1 className=" dark:text-dark_text_1 text-md font-bold">
                {capitalize(name)}
              </h1>
              <span className="text-xs dark:text-dark_svg_2">Online</span>
            </div>
          </div>
          {/* Right */}
          <div className="flex items-center gap-x-2.5">
            <ul className="flex items-center">
              <li>
                <button className="btn">
                  <SearchLargeIcon className="dark:fill-dark_svg_1" />
                </button>
              </li>
              <li>
                <button className="btn">
                  <DotsIcon className="dark:fill-dark_svg_1" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatHeader;
