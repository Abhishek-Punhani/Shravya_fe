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
}) {
  const [cursorPosition, setCursorPosition] = useState();
  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition, textRef]);
  const handleEmoji = (emojiData, e) => {
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
      <li className="w-full">
        <button
          className="btn"
          type="button"
          onClick={() => {
            setShowAttachments(false);
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
          <div className="openEmojiAnimation w-[50%]  flex flex-col justify-start absolute bottom-[60px] left-[-0.5px]">
            <EmojiPicker theme="dark" onEmojiClick={handleEmoji} />
          </div>
        )}
      </li>
    </>
  );
}

export default EmojiPickerApp;
