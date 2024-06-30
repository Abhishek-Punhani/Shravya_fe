import { useSelector } from "react-redux";
import {
  CallIcon,
  DialIcon,
  DotsIcon,
  SearchLargeIcon,
  VideoDialIcon,
} from "../../../svg";
import { capitalize } from "../../../utils/string";
import {
  getConversationName,
  getConversationPicture,
} from "../../../utils/chat";
function ChatHeader({ online, callUser }) {
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
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
                src={
                  activeConversation.isGroup
                    ? activeConversation.picture
                    : getConversationPicture(user, activeConversation.users)
                }
                alt={
                  activeConversation.isGroup
                    ? activeConversation.name
                    : capitalize(
                        getConversationName(user, activeConversation.users)
                      )
                }
                className="h-full w-full rounded-full object-cover"
              />
            </button>
            {/* Conversation Name and Online Status */}
            <div className="flex flex-col">
              <h1 className=" dark:text-dark_text_1 text-md font-bold">
                {activeConversation.isGroup
                  ? activeConversation.name
                  : capitalize(
                      getConversationName(user, activeConversation.users)
                    )}
              </h1>
              <span className="text-xs dark:text-dark_svg_2">
                {online ? "Online" : ""}
              </span>
            </div>
          </div>
          {/* Right */}
          <div className="flex items-center gap-x-2.5">
            <ul className="flex items-center">
              <li onClick={() => callUser()}>
                <button className="btn">
                  <VideoDialIcon className="dark:fill-dark_svg_1 scale-[90%] mt-2" />
                </button>
              </li>
              <li>
                <button className="btn flex items-center justify-center">
                  <DialIcon className="dark:fill-dark_svg_1 scale-50" />
                </button>
              </li>
              <li>
                <button className="btn">
                  <SearchLargeIcon className="dark:fill-dark_svg_1" />
                </button>
              </li>
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
