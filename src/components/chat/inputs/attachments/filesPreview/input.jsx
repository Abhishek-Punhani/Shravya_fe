import React, { useEffect, useRef } from "react";
import { updateFileMessage } from "../../../../../features/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import EmojiPickerApp from "../../EmojiPicker";

function Input({
  msg,
  setMsg,
  activeIndex,
  showPicker,
  setShowPicker,
  setShowAttachments,
}) {
  const { files } = useSelector((state) => state.chat);
  const inputRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setMsg(files[activeIndex].message);
    inputRef.current.focus();
  }, [activeIndex]);

  const handleChange = (e) => {
    const newMsg = e.target.value;
    setMsg(newMsg);

    const values = {
      i: activeIndex,
      msg: newMsg,
    };

    dispatch(updateFileMessage(values));
  };

  return (
    <div className="w-[80%] max-w-[60%]   flex items-center gap-x-2 justify-center  ">
      <div className="my-auto">
        <EmojiPickerApp
          msg={msg}
          setMsg={setMsg}
          textRef={inputRef}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
          setShowAttachments={setShowAttachments}
          offset={true}
        />
      </div>
      <div className=" w-full dark:bg-dark_hover_1 rounded-lg">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a Message"
          value={msg}
          onChange={handleChange}
          className="w-full bg-transparent h-9 pl-2 focus:outline-none border-none dark:text-dark_text_1"
        />
      </div>
    </div>
  );
}

export default Input;
