import { useDispatch, useSelector } from "react-redux";
import ChatHeader from "./header/ChatHeader";
import ChatMessages from "./messages/ChatMessages";
import { useEffect } from "react";
import { getCoversationMessages } from "../../features/chatSlice";
import { ChatInput } from "./inputs";

function ChatContainer() {
  const dispatch = useDispatch();
  const { activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const values = {
    token,
    convo_id: activeConversation?._id,
  };
  useEffect(() => {
    if (activeConversation?._id) {
      dispatch(getCoversationMessages(values));
    }
  }, [activeConversation]);
  return (
    <>
      <div className="relative h-full w-full  select-none border-l dark:border-l-dark_border_2 overflow-hidden">
        {/* Chat Header */}
        <ChatHeader />
        {/* Chat Messages */}
        <ChatMessages />
        {/* Chat Inputs */}
        <ChatInput />
      </div>
    </>
  );
}

export default ChatContainer;
