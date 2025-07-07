import { useDispatch, useSelector } from "react-redux";
import { dateHandler } from "../../../utils/date";
import {
  getConversationId,
  getConversationName,
  getConversationPicture,
} from "../../../utils/chat";
import { create_open_conversation, uploadEncryptedPrivateKey } from "../../../features/chatSlice";
import { capitalize } from "../../../utils/string";
import SocketContext from "../../../contexts/SocketContext";
import { DocumentIcon, PhotoIcon } from "../../../svg";
import { getDocumentName, isImgVid } from "../../../utils/lastDocumentName";
import ConvoContextMenu from "./ConvoContextMenu";
import * as cryptoUtils from '../../../utils/crypto';

function Conversation({ convo, socket, online, typing, show, setShow }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation, conversations } = useSelector((state) => state.chat);
  const { token } = user;
  const values = {
    reciever_id: convo.isGroup ? "" : getConversationId(user, convo.users),
    isGroup: convo.isGroup ? convo._id : false,
    token: token,
  };
  const openConversation = async () => {
    // Check if conversation already exists
    const isGroup = convo.isGroup;
    let existingConvo;
    if (isGroup) {
      existingConvo = conversations.find(c => c._id === convo._id);
    } else {
      // For 1-1, check if both users are present
      existingConvo = conversations.find(
        c =>
          c.users.length === 2 &&
          c.users.some(u => u._id === user._id) &&
          c.users.some(u => u._id === values.reciever_id)
      );
    }
    if (existingConvo) {
      dispatch({ type: 'chat/setActiveConversation', payload: existingConvo });
      socket.emit("join_conversation", existingConvo._id);
      return;
    }
    // 1. Generate DH and RSA key pairs
    const dhKeyPair = await cryptoUtils.generateDHKeyPair();
    const rsaKeyPair = await cryptoUtils.generateRSAKeyPair();
    // 2. Export public keys
    const dhPublicJwk = await cryptoUtils.exportDHPublicKey(dhKeyPair.publicKey);
    const rsaPublicJwk = await cryptoUtils.exportRSAPublicKey(rsaKeyPair.publicKey);
    // 3. Export private keys (for later use)
    const dhPrivateJwk = await window.crypto.subtle.exportKey('jwk', dhKeyPair.privateKey);
    const rsaPrivateJwk = await cryptoUtils.exportRSAPrivateKey(rsaKeyPair.privateKey);
    // 4. Store private keys using the new key management utility
    // Note: We'll store with a temporary ID until we get the actual conversation ID
    const tempKey = `temp_${values.reciever_id}`;
    cryptoUtils.storeKeys(tempKey, dhPrivateJwk, rsaPrivateJwk);
    console.log('🔐 Stored keys with temp ID:', tempKey);
    // 5. Prepare values for conversation creation
    let valuesWithKeys = {
      ...values,
      dhPublicKey: JSON.stringify(dhPublicJwk),
      rsaPublicKey: JSON.stringify(rsaPublicJwk)
    };
    let newConvo = await dispatch(create_open_conversation(valuesWithKeys));
    socket.emit("join_conversation", newConvo.payload._id);

    // --- E2EE: Upload encrypted RSA private key after DH exchange ---
    // Wait for both users' DH public keys to be present
    const conversation = newConvo.payload;
    if (conversation && conversation.keys && conversation.keys.length === 2) {
      // Find peer's DH public key
      const myId = user._id;
      const myKeyEntry = conversation.keys.find(k => k.userId === myId);
      const peerKeyEntry = conversation.keys.find(k => k.userId !== myId);
      if (myKeyEntry && peerKeyEntry && !myKeyEntry.encryptedRsaPrivateKey) {
        // Import keys
        const dhPrivateKey = await cryptoUtils.importDHPrivateKey(dhPrivateJwk); // correct: import user's DH private key
        const peerDhPublicJwk = JSON.parse(peerKeyEntry.dhPublicKey);
        const peerDhPublicKey = await cryptoUtils.importDHPublicKey(peerDhPublicJwk);
        // Derive shared secret
        const aesKey = await cryptoUtils.deriveSharedSecret(dhPrivateKey, peerDhPublicKey);
        // Encrypt RSA private key
        const rsaPrivateKeyStr = JSON.stringify(rsaPrivateJwk);
        const { ciphertext, iv } = await cryptoUtils.encryptWithAESGCM(aesKey, rsaPrivateKeyStr);
        // Convert to base64
        const encryptedRsaPrivateKey = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
        const ivB64 = btoa(String.fromCharCode(...new Uint8Array(iv)));
        // Upload to backend
        await dispatch(uploadEncryptedPrivateKey({
          token,
          conversationId: conversation._id,
          encryptedRsaPrivateKey,
          iv: ivB64
        }));
      }
    }
  };
  return (
    <li
      onContextMenu={(e) => {
        e.preventDefault();
        setShow(convo._id);
      }}
      onClick={() => openConversation()}
      className={`relative list-none h-[72px] w-full dark:bg-dark_bg_1 ${
        convo._id === activeConversation?._id ? " " : "dark:hover:bg-dark_bg_2"
      } cursor-pointer dark:text-dark_text_1 px-[10px] ${
        convo._id === activeConversation?._id ? "dark:bg-dark_hover_1" : ""
      }`}
    >
      {/* Container */}
      <div className="relative flex w-full items-center justify-between py-[10px]">
        {/* left */}
        <div className="flex items-center gap-x-3">
          {/* Conversation user picture */}
          <div
            className={`relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden ${
              online ? "online" : ""
            }`}
          >
            <img
              src={
                convo.isGroup
                  ? convo.picture
                  : getConversationPicture(user, convo?.users)
              }
              alt={
                convo.isGroup
                  ? convo.name
                  : getConversationName(user, convo?.users)
              }
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            {/* Conversation name and latest msg */}
            <div className="w-full flex flex-col">
              {/* convo name */}
              <h1 className="font-bold flex items-center gap-x-2">
                {convo.isGroup
                  ? convo.name
                  : capitalize(getConversationName(user, convo?.users))}
              </h1>
              {/* conversation message */}
              <div className="flex items-center gap-x-1 dark:text-dark_text_2">
                <div className="flex-1 items-center gap-x-1  dark:text-dark_text_2">
                  {typing === convo._id ? (
                    <p className="font-bold text-green_1 ">Typing...</p>
                  ) : convo?.latestMessage?.message?.length > 0 ? (
                    <p className="flex break-words">
                      {convo.isGroup && (
                        <span className="font-bold">
                          {`${convo?.latestMessage?.sender?.name} :  `}
                        </span>
                      )}
                      {convo?.latestMessage
                        ? ""
                        : convo?.latestMessage?.message.length > 25
                        ? `${convo.latestMessage?.message.substring(0, 25)}...`
                        : convo.latestMessage?.message}
                    </p>
                  ) : (
                    <p className="font-bold flex items-center text-[14px]">
                      {convo?.latestMessage && (
                        <span className="flex items-end justify-center">
                          {isImgVid(convo) ? (
                            <PhotoIcon size={30} className="flex items-end" />
                          ) : (
                            <DocumentIcon
                              size={30}
                              className="flex items-end"
                            />
                          )}
                        </span>
                      )}
                      <span className="flex items-end justify-center text-[0.90rem]">
                        {getDocumentName(convo)}
                      </span>
                    </p>
                  )}
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
        {/* context menu */}
        {show === convo._id && (
          <ConvoContextMenu setShow={setShow} show={show} convo={convo} />
        )}
      </div>
      {/* Border */}
      <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
    </li>
  );
}

const ConversationWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Conversation {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default ConversationWithSocket;
