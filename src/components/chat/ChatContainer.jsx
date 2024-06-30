import { useDispatch, useSelector } from "react-redux";
import ChatHeader from "./header/ChatHeader";
import ChatMessages from "./messages/ChatMessages";
import { useEffect, useState } from "react";
import { getCoversationMessages } from "../../features/chatSlice";
import { ChatInput } from "./inputs";
import { checkOnline } from "../../utils/chat";
import FilesPreview from "./inputs/attachments/filesPreview/filesPreview";

function ChatContainer({ onlineUsers, typing, callUser }) {
  const dispatch = useDispatch();
  const { activeConversation, files } = useSelector((state) => state.chat);

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
  const [showPicker, setShowPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  return (
    <>
      <div className="relative h-full w-full  select-none border-l dark:border-l-dark_border_2 overflow-hidden">
        {/* Chat Header */}
        <ChatHeader
          callUser={callUser}
          online={
            activeConversation.isGroup
              ? false
              : checkOnline(onlineUsers, user, activeConversation.users)
          }
        />

        {files.length > 0 ? (
          <>
            {/* Files preview*/}
            <FilesPreview />
          </>
        ) : (
          <>
            {/* Chat Messages */}
            <ChatMessages typing={typing} />
            {/* Chat Inputs */}
            <ChatInput
              showPicker={showPicker}
              setShowPicker={setShowPicker}
              showAttachments={showAttachments}
              setShowAttachments={setShowAttachments}
            />
          </>
        )}
      </div>
    </>
  );
}

export default ChatContainer;
