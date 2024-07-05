import moment from "moment";
import TraingleIcon from "../../../svg/triangle";
import { useSelector } from "react-redux";
import { useState, useRef } from "react";
import ContextMenu from "./ContextMenu";

function Message({ message, me, i, setedt, setReply, show, setShow }) {
  const { user } = useSelector((state) => state.user);
  const { activeConversation, messages } = useSelector((state) => state.chat);

  const messageRef = useRef(null);
  const [contextMenuDirection, setContextMenuDirection] = useState("down");

  const handleContextMenu = () => {
    const messageBounds = messageRef.current.getBoundingClientRect();
    const availableSpaceBelow = window.innerHeight - messageBounds.bottom;
    const menuHeight = 210;
    if (availableSpaceBelow < menuHeight) {
      setContextMenuDirection("up");
    } else {
      setContextMenuDirection("down");
    }
    setShow(message._id);
  };

  return (
    <>
      <div
        ref={messageRef}
        className={`relative flex mt-2 w-fit space-x-3 max-w-[20rem] h-fit ${
          me ? "ml-auto justify-end" : ""
        }`}
        onContextMenu={(e) => {
          e.preventDefault();
          handleContextMenu();
        }}
      >
        {/* Message Container */}
        <div className="relative">
          {/* Sender Pic */}
          {activeConversation.isGroup &&
            (i === 0 || messages[i - 1].sender._id !== message.sender._id) && (
              <div className="absolute top-0.5 left-[-37px]">
                <img
                  src={message.sender.picture}
                  alt=""
                  className="w-7 h-7 rounded-full"
                />
              </div>
            )}
          <div
            className={`relative h-full dark:text-dark_text_1 p-1.5 rounded-lg max-w-xs ${
              me ? "bg-green_3" : "bg-dark_bg_2"
            }`}
          >
            {/* Sender Name if group */}
            {activeConversation.isGroup &&
              (i === 0 ||
                messages[i - 1].sender._id !== message.sender._id) && (
                <div>
                  <h3
                    className={`text-purple-300 text-[13px] ${
                      message.sender._id === user._id ? "text-yellow-200" : ""
                    }`}
                  >
                    {message.sender._id === user._id
                      ? "You"
                      : `${message.sender.name}`}
                  </h3>
                </div>
              )}
            {/* message */}
            {/* Reply Container */}
            {message.isReply?.name.length > 0 && (
              <div
                className={`min-h-[40px] ${
                  me ? "bg-[#1b4e49d4]" : "bg-[#2c3840]"
                }`}
              >
                <h3
                  className={`text-purple-300 text-[13px] ml-1 block ${
                    message.isReply?.id === user._id ? "text-yellow-200" : ""
                  }`}
                >
                  {message.isReply?.id === user._id
                    ? "You"
                    : `${message.isReply?.name}`}
                </h3>
                <div className=" ml-[4px] w-full">
                  <p className="text-[11px] dark:text-gray-200 mr-[2] break-words max-w-[85%] mb-2">
                    {message.isReply?.message.length > 120
                      ? `${message.isReply?.message.substring(0, 160)}...`
                      : `${message.isReply?.message}`}
                  </p>
                </div>
              </div>
            )}
            <div
              className={`max-w-[18rem] float-left h-full text-sm pr-8 break-words pl-2 ${
                message?.isEdited ? "pb-6" : "pb-4"
              }`}
            >
              {message.message}
            </div>
            {/* Message Date */}
            <div className="absolute right-1.5 bottom-1.5 text-xxs text-dark_text_5 leading-none">
              {message?.isEdited && "Edited  "}
              {moment(message.createdAt).format("HH:mm")}
            </div>

            {/* Triangle */}
            <span>
              <TraingleIcon
                className={`absolute ${
                  me
                    ? "bottom-[-8px] -right-2 rotate-[135deg] scale-[60%] fill-green_3"
                    : "top-[-5px] -left-1.5 rotate-[60deg] dark:fill-dark_bg_2"
                }`}
              />
            </span>
          </div>
        </div>
        {/* Context Menu */}
        <ContextMenu
          contextMenuDirection={contextMenuDirection}
          show={show}
          me={me}
          message={message}
          setedt={setedt}
          setReply={setReply}
          setShow={setShow}
        />
      </div>
    </>
  );
}

export default Message;
