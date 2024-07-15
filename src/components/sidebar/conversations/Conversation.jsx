import { useDispatch, useSelector } from "react-redux";
import { dateHandler } from "../../../utils/date";
import {
  getConversationId,
  getConversationName,
  getConversationPicture,
} from "../../../utils/chat";
import { create_open_conversation } from "../../../features/chatSlice";
import { capitalize } from "../../../utils/string";
import SocketContext from "../../../contexts/SocketContext";
import { DocumentIcon, PhotoIcon } from "../../../svg";
import { getDocumentName, isImgVid } from "../../../utils/lastDocumentName";
import ConvoContextMenu from "./ConvoContextMenu";

function Conversation({ convo, socket, online, typing, show, setShow }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  const { token } = user;
  const values = {
    reciever_id: convo.isGroup ? "" : getConversationId(user, convo.users),
    isGroup: convo.isGroup ? convo._id : false,
    token: token,
  };
  const openConversation = async () => {
    let newConvo = await dispatch(create_open_conversation(values));
    socket.emit("join_conversation", newConvo.payload._id);
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
                    <p className="font-bold text-green_1">Typing...</p>
                  ) : convo?.latestMessage?.message?.length > 0 ? (
                    <p>
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
                    <p className="font-bold flex items-start">
                      {convo?.latestMessage && (
                        <span className="flex items-start justify-start mb-3">
                          {isImgVid(convo) ? (
                            <PhotoIcon size={30} />
                          ) : (
                            <DocumentIcon size={30} />
                          )}
                        </span>
                      )}
                      {getDocumentName(convo)}
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
          <ConvoContextMenu setShow={setShow} show={show} />
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
