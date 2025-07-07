import { useDispatch, useSelector } from "react-redux";
import ChatHeader from "./header/ChatHeader";
import ChatMessages from "./messages/ChatMessages";
import { useEffect, useState } from "react";
import { getCoversationMessages, uploadEncryptedPrivateKey } from "../../features/chatSlice";
import { ChatInput, EditMsgInput } from "./inputs";
import { checkOnline } from "../../utils/chat";
import FilesPreview from "./inputs/attachments/filesPreview/filesPreview";
import ForwardMessage from "./forward Message/ForwardMessage";
import AudioRecorder from "./inputs/AudioRecorder";
import ChatInfos from "./chatInfos/chatInfos";
import * as cryptoUtils from '../../utils/crypto';

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

  // --- E2EE: Upload encrypted RSA private key if needed ---
  useEffect(() => {
    if (!activeConversation || !activeConversation.keys || activeConversation.keys.length !== 2) return;
    const myId = user._id;
    const myKeyEntry = activeConversation.keys.find(k => k.userId === myId);
    const peerKeyEntry = activeConversation.keys.find(k => k.userId !== myId);
    if (!myKeyEntry || !peerKeyEntry || myKeyEntry.encryptedRsaPrivateKey) return;
    // Try to get private keys from sessionStorage
    const dhPrivateJwkStr = sessionStorage.getItem('dhPrivateKey');
    const rsaPrivateJwkStr = sessionStorage.getItem('rsaPrivateKey');
    if (!dhPrivateJwkStr || !rsaPrivateJwkStr) return;
    (async () => {
      const dhPrivateJwk = JSON.parse(dhPrivateJwkStr);
      const rsaPrivateJwk = JSON.parse(rsaPrivateJwkStr);
      const dhPrivateKey = await cryptoUtils.importDHPrivateKey(dhPrivateJwk);
      const peerDhPublicJwk = JSON.parse(peerKeyEntry.dhPublicKey);
      const peerDhPublicKey = await cryptoUtils.importDHPublicKey(peerDhPublicJwk);
      const aesKey = await cryptoUtils.deriveSharedSecret(dhPrivateKey, peerDhPublicKey);
      const rsaPrivateKeyStr = JSON.stringify(rsaPrivateJwk);
      const { ciphertext, iv } = await cryptoUtils.encryptWithAESGCM(aesKey, rsaPrivateKeyStr);
      const encryptedRsaPrivateKey = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
      const ivB64 = btoa(String.fromCharCode(...new Uint8Array(iv)));
      await dispatch(uploadEncryptedPrivateKey({
        token,
        conversationId: activeConversation._id,
        encryptedRsaPrivateKey,
        iv: ivB64
      }));
    })();
  }, [activeConversation, user, dispatch, token]);

  const [edt, setedt] = useState(undefined);
  const [reply, setReply] = useState(undefined);
  const [show, setShow] = useState(undefined);
  const [forward, setForward] = useState(undefined);
  const [showAudioRec, setShowAudioRec] = useState(false);
  const [showChatInfos, setShowChatInfos] = useState(false);
  return (
    <>
      <div
        className={`relative min-h-screen w-full flex flex-col  select-none border-l dark:border-l-dark_border_2 overflow-hidden`}
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
        <div className="flex-1 h-full">
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
              <div className="h-full flex-col">
                <div className="h-full">
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
                </div>
                <div>
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
                </div>
              </div>
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
