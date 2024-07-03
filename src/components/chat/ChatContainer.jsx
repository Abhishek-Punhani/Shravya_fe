import { useDispatch, useSelector } from "react-redux";
import ChatHeader from "./header/ChatHeader";
import ChatMessages from "./messages/ChatMessages";
import { useEffect, useState } from "react";
import { getCoversationMessages } from "../../features/chatSlice";
import { ChatInput, EditMsgInput } from "./inputs";
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
  const [edt, setedt] = useState(undefined);
  const [reply, setReply] = useState(undefined);
  return (
    <>
      <div className="relative h-full w-full  select-none border-l dark:border-l-dark_border_2 overflow-hidden">
        {/* Chat Header */}

        <ChatHeader
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
            <ChatMessages
              typing={typing}
              setedt={setedt}
              setReply={setReply}
              reply={reply}
            />
            {/* Chat Inputs */}
            {edt ? (
              <EditMsgInput
                showPicker={showPicker}
                setShowPicker={setShowPicker}
                showAttachments={showAttachments}
                setShowAttachments={setShowAttachments}
                edt={edt}
                setedt={setedt}
              />
            ) : (
              <ChatInput
                showPicker={showPicker}
                setShowPicker={setShowPicker}
                showAttachments={showAttachments}
                setShowAttachments={setShowAttachments}
                setReply={setReply}
                reply={reply}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default ChatContainer;
