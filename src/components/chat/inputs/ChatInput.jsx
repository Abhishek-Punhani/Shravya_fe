import { useState } from "react";
import { SendIcon } from "../../../svg";
import Attachments from "./attachments/Attachments";
import EmojiPickerApp from "./EmojiPicker";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { sendMessages } from "../../../features/chatSlice";
import { ClipLoader } from "react-spinners";
import { useRef } from "react";
import SocketContext from "../../../contexts/SocketContext";
function ChatInput({
  showAttachments,
  showPicker,
  setShowAttachments,
  setShowPicker,
  socket,
  edt,
  setedt,
}) {
  const dispacth = useDispatch();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const textRef = useRef();
  const { activeConversation, status } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const values = {
    token,
    convo_id: activeConversation._id,
    message: msg,
    files: [],
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    let newMsg = await dispacth(sendMessages(values));
    socket.emit("new_message", newMsg.payload);
    setLoading(false);
    setMsg("");
    setShowPicker(false);
    setShowPicker(false);
  };

  return (
    <>
      <form
        className="w-full dark:bg-dark_bg_2 h-[60px] flex items-center absolute bottom-0 py-2 px-4 select-none"
        onSubmit={(e) => onSubmitHandler(e)}
      >
        {/* Container */}
        <div className="w-full flex items-center gap-x-2">
          {/* Emojis and Attachments */}
          <ul className="flex gap-x-2">
            <EmojiPickerApp
              msg={msg}
              setMsg={setMsg}
              textRef={textRef}
              showPicker={showPicker}
              setShowPicker={setShowPicker}
              setShowAttachments={setShowAttachments}
            />
            <Attachments
              showAttachments={showAttachments}
              setShowAttachments={setShowAttachments}
              setShowPicker={setShowPicker}
            />
          </ul>
          {/* Input */}
          <Input
            msg={msg}
            setMsg={setMsg}
            textRef={textRef}
            edt={edt}
            setedt={setedt}
          />
          {/* send icon */}
          <button className="btn">
            {status === "loading" && loading ? (
              <ClipLoader />
            ) : (
              <SendIcon className="dark:fill-dark_svg_1  hover:bg-dark_hover_1 cursor-pointer" />
            )}
          </button>
        </div>
      </form>
    </>
  );
}

const ChatInputWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatInput {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ChatInputWithSocket;
