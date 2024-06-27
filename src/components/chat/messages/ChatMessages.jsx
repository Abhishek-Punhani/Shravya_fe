import React, { useEffect, useRef } from "react";

import Message from "./Message";
import { useSelector } from "react-redux";
import Typing from "./typing";
import FileMessage from "./MessageFiles/FileMessage";

function ChatMessages({ typing }) {
  const { user } = useSelector((state) => state.user);
  const { messages, activeConversation } = useSelector((state) => state.chat);
  const endRef = useRef(null);
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);
  const scrollToBottom = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mb-[60px] bg-[url('https://res.cloudinary.com/dmhcnhtng/image/upload/v1677358270/Untitled-1_copy_rpx8yb.jpg')] bg-cover bg-no-repeat">
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
                />
              )}
            </React.Fragment>
          ))}
        {typing === activeConversation._id ? <Typing /> : null}
        <div className="mt-2 h-[1px]" ref={endRef}></div>
      </div>
    </div>
  );
}

export default ChatMessages;
