import EmojiPicker from "emoji-picker-react";
import { CloseIcon, EmojiIcon } from "../../../svg";
import { useEffect, useState } from "react";

function EmojiPickerApp({
  msg,
  setMsg,
  textRef,
  showPicker,
  setShowPicker,
  setShowAttachments,
  offset,
}) {
  const [cursorPosition, setCursorPosition] = useState();
  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition, textRef]);
  const handleEmoji = (emojiData, e) => {
    e.stopPropagation();
    const { emoji } = emojiData;
    const ref = textRef.current;
    ref.focus();
    const start = msg.substring(0, ref.selectionStart);
    const end = msg.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setMsg(newText);
    setCursorPosition(start.length + emoji.length);
  };

  return (
    <>
      <li className="w-full flex items-center justify-center">
        <button
          className="btn"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            if (setShowAttachments) {
              setShowAttachments(false);
            }
            setShowPicker((prev) => !prev);
          }}
        >
          {!showPicker ? (
            <EmojiIcon className="dark:fill-dark_svg_1" />
          ) : (
            <CloseIcon className="dark:fill-dark_svg_1" />
          )}
        </button>
        {/* Emoji picker */}
        {showPicker && (
          <div
            className={`openEmojiAnimation w-[50%]  flex flex-col justify-start absolute bottom-[60px] left-[-0.5px] ${
              offset ? " bottom-[170px]" : ""
            }`}
          >
            <EmojiPicker
              theme="dark"
              onEmojiClick={handleEmoji}
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        )}
      </li>
    </>
  );
}

export default EmojiPickerApp;
