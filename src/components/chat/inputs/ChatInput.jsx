import { useState } from "react";
import { SendIcon } from "../../../svg";
import Attachments from "./Attachments";
import EmojiPicker from "./EmojiPicker";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { sendMessages } from "../../../features/chatSlice";
import { ClipLoader } from "react-spinners";
function ChatInput() {
  const dispacth = useDispatch();
  const [msg, setMsg] = useState("");
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
    await dispacth(sendMessages(values));
    setMsg("");
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
            <EmojiPicker />
            <Attachments />
          </ul>
          {/* Input */}
          <Input msg={msg} setMsg={setMsg} />
          {/* send icon */}
          <button className="btn">
            {status === "loading" ? (
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

export default ChatInput;
