import React, { useEffect, useRef, useState } from "react";

import Message from "./Message";
import { useSelector } from "react-redux";
import Typing from "./typing";

function ChatMessages({
  typing,
  setedt,
  setReply,
  reply,
  setDelMsg,
  show,
  setShow,
  setForward,
}) {
  const { user } = useSelector((state) => state.user);
  const { messages, activeConversation } = useSelector((state) => state.chat);
  const endRef = useRef(null);
  const [displayMessages, setDisplayMessages] = useState(messages);

  // Merge sent plaintext messages from localStorage (immutably)
  useEffect(() => {
    if (!activeConversation?._id) return;
    const localKey = `sentMsgs_${activeConversation._id}_${user._id}`;
    let sentMsgs = JSON.parse(localStorage.getItem(localKey) || '[]');
    if (sentMsgs.length > 0) {
      // Create a new array with merged messages
      const newMessages = messages.map(m => {
        if (m.sender._id === user._id) {
          const sent = sentMsgs.find(s => s._id === m._id);
          if (sent && m.message !== sent.message) {
            return { ...m, message: sent.message };
          }
        }
        return m;
      });
      setDisplayMessages(newMessages);
    } else {
      setDisplayMessages(messages);
    }
  }, [activeConversation, messages, user]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 300); // Adding a slight delay
    return () => clearTimeout(timeoutId);
  }, [displayMessages, typing, reply]);
  const scrollToBottom = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar px-4 py-2">
      {displayMessages.map((msg, idx) => (
        <Message
          key={msg._id || idx}
          message={msg}
          me={msg.sender._id === user._id}
          setedt={setedt}
          setReply={setReply}
          setShow={setShow}
          show={show}
          setDelMsg={setDelMsg}
          setForward={setForward}
        />
      ))}
      {typing && <Typing />}
      <div ref={endRef} />
    </div>
  );
}

export default ChatMessages;
