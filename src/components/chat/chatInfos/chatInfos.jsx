import { useDispatch, useSelector } from "react-redux";
import { ReturnIcon } from "../../../svg";
import {
  getConversationName,
  getConversationPicture,
  getConversationUser,
} from "../../../utils/chat";
import { dateHandler } from "../../../utils/date";
import { create_open_conversation } from "../../../features/chatSlice";

function ChatInfos({ setShowChatInfos, convo, online }) {
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const dispatch = useDispatch();

  const openConvo = async (convoUser) => {
    if (convoUser._id === user._id) {
      return;
    }
    const values = {
      token,
      reciever_id: convoUser._id, // Changed to convoUser._id
      isGroup: false,
    };
    await dispatch(create_open_conversation(values));
    setShowChatInfos(false);
  };

  // Sort the users array so that the user appears at the top
  const sortedUsers = [...convo.users].sort((a, b) => {
    return a._id === user._id ? -1 : b._id === user._id ? 1 : 0;
  });

  return (
    <div className="absolute top-0 right-0 h-full w-full flex flex-col select-none border-l bg-dark_bg_2 dark:border-l-dark_border_2  z-[1000] scrollbar">
      {/* Container */}
      <div className="w-full flex flex-col items-start px-4">
        {/* return button and convo name and picture */}
        <div className="px-4 flex items-center justify-between w-full">
          {/* Return Button */}
          <button className="btn" onClick={() => setShowChatInfos(false)}>
            <ReturnIcon className="fill-dark_svg_2" />
          </button>
          <div className="w-full flex flex-col items-center justify-center">
            {/* Convo Picture */}
            <div
              className={`rounded-full ${
                convo.isGroup ? "" : `${online ? "online" : ""}`
              }`}
            >
              <img
                src={
                  convo.isGroup
                    ? convo.picture
                    : getConversationPicture(user, convo.users)
                }
                alt=""
                className="h-[145px] w-[145px] object-cover rounded-full"
              />
            </div>
            {/* Convo Name */}
            <h1 className="text-[25px] dark:text-dark_text_1 mx-auto block mt-6">
              {convo.isGroup
                ? convo.name
                : getConversationName(user, convo.users)}
            </h1>
            {convo.admin.find((admin) => admin._id === user._id) ? (
              <button className="w-fit px-3 py-1 rounded-2xl bg-green-700 text-dark_svg_1 ml-auto mr-7">
                Edit
              </button>
            ) : null}
          </div>
        </div>
        {/* status div */}
        {!convo.isGroup || convo?.description?.length > 0 ? (
          <div className="px-4 flex flex-col items-center justify-between w-full dark:bg-dark_bg_3 py-5 mt-4 rounded-xl">
            <p className="text-[15px] dark:text-dark_text_1 pl-5 w-full">
              {convo.isGroup
                ? convo?.description
                : `${getConversationUser(user, convo.users).status}`}
            </p>
            <p className="text-[10px] dark:text-dark_text_3 pl-5 w-full">
              {dateHandler(getConversationUser(user, convo.users).updatedAt)}
            </p>
          </div>
        ) : (
          <button className="w-fit px-3 py-1 rounded-2xl bg-gray-700 text-dark_svg_1 ml-auto mr-7">
            Add Group Description
          </button>
        )}
        {/* Show Members */}
        {convo.isGroup ? (
          <div className="px-4 flex flex-col items-center justify-between w-full dark:bg-dark_bg_3 py-5 mt-4 rounded-xl">
            <h3 className="text-[15px] dark:text-white pl-5 w-full font-bold">
              {convo.users.length} Members
            </h3>
            {/* Members */}
            <div className="w-full py-2 convos scrollbar">
              <ul className="convos scrollbar w-full py-5 px-4 h-fit space-y-4">
                {sortedUsers.map((convoUser) => {
                  return (
                    <li
                      key={convoUser._id}
                      className="flex items-center justify-start gap-x-4 w-full h-[60px] dark:bg-gray-800 rounded-3xl p-4 cursor-pointer"
                      onClick={() => openConvo(convoUser)}
                    >
                      {/* Image */}
                      <div className="rounded-full">
                        <img
                          src={convoUser.picture}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                      {/* Name and status */}
                      <div className="flex flex-col items-start justify-center">
                        <h3 className="text-[16px] dark:text-white pl-5">
                          {convoUser._id === user._id ? "You" : convoUser.name}
                        </h3>
                        <span className="text-[12px] dark:text-dark_svg_2 pl-5">
                          {convoUser.status}
                        </span>
                      </div>
                      <span className="text-dark_svg_1 text-[10px] mt-3 ml-auto mr-7">
                        {convo.admin.find(
                          (admin) => admin._id === convoUser._id
                        )
                          ? "Admin"
                          : null}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ChatInfos;
