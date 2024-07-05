import React, { useEffect, useRef } from "react";

import Message from "./Message";
import { useSelector } from "react-redux";
import Typing from "./typing";
import FileMessage from "./MessageFiles/FileMessage";

function ChatMessages({
  typing,
  setedt,
  setReply,
  reply,
  setDelMsg,
  show,
  setShow,
}) {
  const { user } = useSelector((state) => state.user);
  const { messages, activeConversation } = useSelector((state) => state.chat);
  const endRef = useRef(null);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100); // Adding a slight delay
    return () => clearTimeout(timeoutId);
  }, [messages, typing, reply]);
  const scrollToBottom = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className=" bg-[url('https://res.cloudinary.com/dmhcnhtng/image/upload/v1677358270/Untitled-1_copy_rpx8yb.jpg')] bg-cover bg-no-repeat">
      {/* Conatiner */}
      <div className="scrollbar overflow_scrollbar overflow-auto py-2 px-[4%]">
        {messages &&
          messages.map((message, i) => (
            <React.Fragment key={message._id}>
              {/* Message Files */}
              {message.files.length > 0 &&
                message.files.map((file) => (
                  <FileMessage
                    fileMessage={file}
                    message={message}
                    key={file?._id}
                    me={user._id === message.sender._id}
                  />
                ))}
              {/* Message text */}
              {message?.message.length > 0 && (
                <Message
                  message={message}
                  key={message._id}
                  i={i}
                  me={user._id === message.sender._id}
                  setedt={setedt}
                  setReply={setReply}
                  setDelMsg={setDelMsg}
                  show={show}
                  setShow={setShow}
                />
              )}
            </React.Fragment>
          ))}
        {typing === activeConversation._id ? <Typing /> : null}
        <div
          className={`mt-1 h-[0.01px] bg-none ${reply && "mt-9 h-5"}`}
          ref={endRef}
        ></div>
      </div>
    </div>
  );
}

export default ChatMessages;
