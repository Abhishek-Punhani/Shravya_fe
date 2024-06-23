import React, { useEffect, useRef } from "react";

import Message from "./Message";
import { useSelector } from "react-redux";
import Typing from "./typing";

function ChatMessages({ typing }) {
  const { user } = useSelector((state) => state.user);
  const { messages, activeConversation } = useSelector((state) => state.chat);
  const endRef = useRef(null);
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);
  const scrollToBottom = () => {
    endRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  return (
    <div className="mb-[60px] bg-[url('https://res.cloudinary.com/dmhcnhtng/image/upload/v1677358270/Untitled-1_copy_rpx8yb.jpg')] bg-cover bg-no-repeat">
      {/* Conatiner */}
      <div className="scrollbar overflow_scrollbar overflow-auto py-2 px-[4%]">
        {messages &&
          messages.map((message) => (
            <Message
              message={message}
              key={message?._id}
              me={user._id === message.sender._id}
            />
          ))}
        {typing === activeConversation._id ? <Typing /> : null}
        <div className="mt-2 h-[0.01px]" ref={endRef}></div>
      </div>
    </div>
  );
}

export default ChatMessages;
