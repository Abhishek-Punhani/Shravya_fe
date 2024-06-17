import { useDispatch, useSelector } from "react-redux";
import { dateHandler } from "../../../utils/date";
import { getConversationId } from "../../../utils/chat";
import { create_open_conversation } from "../../../features/chatSlice";
import { capitalize } from "../../../utils/string";

function Conversation({ convo }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  const { token } = user;
  const values = {
    reciever_id: getConversationId(user, convo.users),
    token: token,
  };
  const openConversation = () => {
    dispatch(create_open_conversation(values));
  };
  return (
    <li
      onClick={() => openConversation()}
      className={`list-none h-[72px] w-full dark:bg-dark_bg_1 hover:${
        !convo._id === activeConversation._id ? "dark:bg-dark_bg_2" : ""
      } cursor-pointer dark:text-dark_text_1 px-[10px] ${
        convo._id === activeConversation._id ? "dark:bg-dark_hover_1" : ""
      }`}
    >
      {/* Container */}
      <div className="relative flex w-full items-center justify-between py-[10px]">
        {/* left */}
        <div className="flex items-center gap-x-3">
          {/* Conversation user picture */}
          <div className="relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden">
            <img
              src={convo.picture}
              alt={convo.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            {/* Conversation name and latest msg */}
            <div className="w-full flex flex-col">
              {/* convo name */}
              <h1 className="font-bold flex items-center gap-x-2">
                {capitalize(convo.name)}
              </h1>
              {/* conversation message */}
              <div className="flex items-center gap-x-1 dark:text-dark_text_2">
                <div className="flex-1 items-center gap-x-1  dark:text-dark_text_2">
                  <p className="font-bold">
                    {convo?.latestMessage?.message?.length > 25
                      ? `${convo.latestMessage?.message.substring(0, 25)}...`
                      : convo.latestMessage?.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* right */}
        <div className="flex flex-col gap-y-4 items-end text-xs">
          <span className="dark:text-dark_text_2">
            {convo?.latestMessage?.createdAt
              ? dateHandler(convo.latestMessage.createdAt)
              : ""}
          </span>
        </div>
      </div>
      {/* Border */}
      <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
    </li>
  );
}

export default Conversation;
