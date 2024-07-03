import { useEffect, useState } from "react";
import { CrossIcon, TickIcon } from "../../../svg";
import EmojiPickerApp from "./EmojiPicker";
import { useDispatch, useSelector } from "react-redux";
import { editMessage } from "../../../features/chatSlice";
import { ClipLoader } from "react-spinners";
import { useRef } from "react";
import SocketContext from "../../../contexts/SocketContext";
function EditMsgInput({
  showPicker,
  setShowAttachments,
  setShowPicker,
  socket,
  edt,
  setedt,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { status } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const inputRef = useRef();
  const editMessageHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const values = {
      token,
      message: edt,
    };
    const res = await dispatch(editMessage(values));
    socket.emit("editMsg", { edt, user });
    setLoading(false);
    setShowPicker(false);
    setedt(undefined);
  };
  useEffect(() => {
    if (edt) {
      inputRef.current.focus();
      const messageLength = edt.message.length;
      // Set the selection range to the end of the message
      inputRef.current.setSelectionRange(messageLength, messageLength);
    }
  }, [edt]);
  return (
    <>
      {/* Container */}
      <div className="w-full flex items-center gap-x-2">
        <form
          className="w-full dark:bg-dark_bg_2 h-[60px] flex items-center absolute bottom-0 py-2 px-4 select-none"
          onSubmit={(e) => editMessageHandler(e)}
        >
          {/* Emojis and Attachments */}
          <ul className="flex gap-x-2">
            <EmojiPickerApp
              textRef={inputRef}
              showPicker={showPicker}
              setShowPicker={setShowPicker}
              setShowAttachments={setShowAttachments}
              edt={edt}
              setedt={setedt}
            />
          </ul>
          {/* Input */}
          <input
            type="text"
            className="w-full rounded-2xl dark:bg-dark_hover_1 dark:text-dark_text_1 outline-none flex-1 py-2 px-4"
            placeholder="type your message"
            onChange={(e) =>
              setedt({
                ...edt,
                message: e.target.value,
              })
            }
            value={edt.message}
            ref={inputRef}
          />
          {/* send icon */}
          <div className="w-20 flex items-center justify-between p-2">
            <button
              className="btn"
              type="button"
              onClick={() => setedt(undefined)}
            >
              <CrossIcon className="dark:fill-dark_svg_1  hover:bg-dark_hover_1 cursor-pointer " />
            </button>
            <button className="btn">
              {status === "loading" && loading ? (
                <ClipLoader />
              ) : (
                <TickIcon className="dark:fill-dark_svg_1  hover:bg-dark_hover_1 cursor-pointer " />
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

const EditMsgInputWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <EditMsgInput {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default EditMsgInputWithSocket;
