import { useSelector } from "react-redux";
import SocketContext from "../../../contexts/SocketContext";
import { useState, useRef, useEffect } from "react";

function Input({ msg, setMsg, textRef, socket }) {
  const { activeConversation } = useSelector((state) => state.chat);
  const [typing, setTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const onChangeHandler = (e) => {
    setMsg(e.target.value);

    if (!typing && e.target.value !== "") {
      setTyping(true);
      socket.emit("typing", activeConversation._id);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", activeConversation._id);
      setTyping(false);
    }, 1500);
  };

  return (
    <div className="w-full">
      <input
        type="text"
        className="w-full rounded-2xl dark:bg-dark_hover_1 dark:text-dark_text_1 outline-none flex-1 py-2 px-4"
        placeholder="type your message"
        onChange={onChangeHandler}
        value={msg}
        ref={textRef}
      />
    </div>
  );
}

const InputWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Input {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default InputWithSocket;
