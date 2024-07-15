import { useDispatch, useSelector } from "react-redux";
import ChatHeader from "./header/ChatHeader";
import ChatMessages from "./messages/ChatMessages";
import { useEffect, useState } from "react";
import { getCoversationMessages } from "../../features/chatSlice";
import { ChatInput, EditMsgInput } from "./inputs";
import { checkOnline } from "../../utils/chat";
import FilesPreview from "./inputs/attachments/filesPreview/filesPreview";
import ForwardMessage from "./forward Message/ForwardMessage";
import AudioRecorder from "./inputs/AudioRecorder";
import ChatInfos from "./chatInfos/chatInfos";

function ChatContainer({
  onlineUsers,
  typing,
  showPicker,
  showAttachments,
  setShowAttachments,
  setShowPicker,
}) {
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

  const [edt, setedt] = useState(undefined);
  const [reply, setReply] = useState(undefined);
  const [show, setShow] = useState(undefined);
  const [forward, setForward] = useState(undefined);
  const [showAudioRec, setShowAudioRec] = useState(false);
  const [showChatInfos, setShowChatInfos] = useState(false);
  return (
    <>
      <div
        className="relative h-full w-full flex flex-col  select-none border-l dark:border-l-dark_border_2 overflow-hidden"
        onClick={() => {
          setShow(false);
          if (showPicker) {
            setShowPicker(false);
          }
          if (showAttachments && files.length == 0) {
            setShowAttachments(false);
          }
        }}
      >
        {/* Chat Header */}

        <ChatHeader
          setShowChatInfos={setShowChatInfos}
          online={
            activeConversation.isGroup
              ? false
              : checkOnline(onlineUsers, user, activeConversation.users)
          }
        />
        <div className="flex-1">
          {files.length > 0 ? (
            <>
              {/* Files preview*/}
              <FilesPreview
                showPicker={showPicker}
                setShowPicker={setShowPicker}
                setShowAttachments={setShowAttachments}
              />
            </>
          ) : (
            <>
              {/* Chat Messages */}
              <ChatMessages
                typing={typing}
                setedt={setedt}
                setReply={setReply}
                reply={reply}
                show={show}
                setShow={setShow}
                setForward={setForward}
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
              ) : showAudioRec ? (
                <AudioRecorder setShowAudioRec={setShowAudioRec} />
              ) : (
                <ChatInput
                  showPicker={showPicker}
                  setShowPicker={setShowPicker}
                  showAttachments={showAttachments}
                  setShowAttachments={setShowAttachments}
                  setReply={setReply}
                  reply={reply}
                  showAudioRec={showAudioRec}
                  setShowAudioRec={setShowAudioRec}
                />
              )}
            </>
          )}
        </div>
        {/* Forward Message Container */}
        {forward && (
          <ForwardMessage setForward={setForward} forward={forward} />
        )}
        {/* Chat Infos */}
        {showChatInfos && (
          <ChatInfos
            online={
              activeConversation.isGroup
                ? false
                : checkOnline(onlineUsers, user, activeConversation.users)
            }
            setShowChatInfos={setShowChatInfos}
            convo={activeConversation}
          />
        )}
      </div>
    </>
  );
}

export default ChatContainer;
