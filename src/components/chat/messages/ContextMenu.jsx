import { useDispatch, useSelector } from "react-redux";
import {
  create_open_conversation,
  deleteMessage,
} from "../../../features/chatSlice";
import SocketContext from "../../../contexts/SocketContext";
import * as cryptoUtils from '../../../utils/crypto';

export function ContextMenu({
  contextMenuDirection,
  me,
  messageBounds,
  message,
  setedt,
  setReply,
  setShow,
  socket,
  setForward,
  file,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation, messages, conversations } = useSelector((state) => state.chat);
  const { token } = user;

  const handlePrivateReply = async () => {
    if (activeConversation.isGroup && !me) {
      // Check if conversation already exists
      const existingConvo = conversations.find(
        c =>
          c.users.length === 2 &&
          c.users.some(u => u._id === user._id) &&
          c.users.some(u => u._id === message.sender._id)
      );
      if (existingConvo) {
        dispatch({ type: 'chat/setActiveConversation', payload: existingConvo });
        socket.emit("join_conversation", existingConvo._id);
        setReply(message);
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
      // 4. Store private keys temporarily in memory (or session/local storage if needed)
      sessionStorage.setItem('dhPrivateKey', JSON.stringify(dhPrivateJwk));
      sessionStorage.setItem('rsaPrivateKey', JSON.stringify(rsaPrivateJwk));
      // 5. Prepare values for conversation creation
      const values = {
        token,
        reciever_id: message.sender._id,
        isGroup: false,
      };
      let valuesWithKeys = {
        ...values,
        dhPublicKey: JSON.stringify(dhPublicJwk),
        rsaPublicKey: JSON.stringify(rsaPublicJwk)
      };
      await dispatch(create_open_conversation(valuesWithKeys));
      setReply(message);
    }
  };

  const handleDeleteMsg = async () => {
    let lastMessage = undefined;
    if (
      !activeConversation.latestMessage ||
      activeConversation?.latestMessage?._id === message._id
    ) {
      lastMessage = messages[messages.length - 2];
    }
    const values = {
      token,
      id: message._id,
      LastMessage: lastMessage,
    };
    const msg = await dispatch(deleteMessage(values));
    socket.emit("deleteMsg", msg.payload);
  };

  const contextMenuPosition = () => {
    const basePosition = me ? "left-[-153px]" : "right-[-153px]";
    const distance = me
      ? file
        ? `${messageBounds.height > 210 ? "bottom-[45px]" : "bottom-[-52px]"}`
        : "bottom-[-192px]"
      : file
      ? "bottom-[45px]"
      : "bottom-[-152px]";
    const verticalDistance = me
      ? file
        ? `${messageBounds.height > 210 ? "top-[45px]" : "top-[-52px]"}`
        : "top-[-182px]"
      : file
      ? "top-[50px]"
      : "top-[-122px]";
    return `${basePosition} ${
      contextMenuDirection === "down" ? distance : verticalDistance
    }`;
  };

  return (
    <div
      className={`absolute h-fit dark:bg-dark_bg_3 w-[150px] z-[100] ${contextMenuPosition()}`}
      onClick={(event) => event.stopPropagation()}
    >
      <ul className=" flex flex-col items-start h-full">
        <li
          className="p-1 h-[40px] text-[15px] dark:text-dark_svg_1 border-b-white w-full hover:bg-dark_bg_5 cursor-pointer"
          onClick={() => {
            setReply(message);
            setShow(undefined);
          }}
        >
          Reply
        </li>
        <li
          className="p-1 h-[40px] text-[15px] dark:text-dark_svg_1  border-b-white w-full hover:bg-dark_bg_5 cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(message.message);
            setShow(undefined);
          }}
        >
          Copy
        </li>
        {me && message.message.length > 0 && (
          <li
            className="p-1 h-[40px] text-[15px] dark:text-dark_svg_1  border-b-white w-full hover:bg-dark_bg_5 cursor-pointer"
            onClick={() => {
              setedt(message);
              setShow(undefined);
            }}
          >
            Edit Message
          </li>
        )}
        <li
          className="p-1 h-[40px] text-[15px] dark:text-dark_svg_1  border-b-white w-full hover:bg-dark_bg_5 cursor-pointer"
          onClick={() => {
            setForward(message);
            setShow(undefined);
          }}
        >
          Forward
        </li>
        {message.conversation.isGroup && !me && (
          <li
            className="p-1 h-[40px] text-[15px] dark:text-dark_svg_1  border-b-white w-full hover:bg-dark_bg_5 cursor-pointer"
            onClick={() => {
              setShow(undefined);
              handlePrivateReply();
            }}
          >
            Reply Privately
          </li>
        )}
        <li
          className="p-1 h-[40px] text-[15px] dark:text-dark_svg_1  border-b-white w-full hover:bg-dark_bg_5 cursor-pointer"
          onClick={() => {
            handleDeleteMsg();
            setShow(undefined);
          }}
        >
          Delete
        </li>
      </ul>
    </div>
  );
}

const ContextMenuWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ContextMenu {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ContextMenuWithSocket;
