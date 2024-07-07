import { useEffect, useState } from "react";
import { CrossIcon, SendIcon } from "../../../svg";
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
  reply,
  setReply,
}) {
  const dispatch = useDispatch();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const textRef = useRef();
  const { activeConversation, status } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  useEffect(() => {
    setReply(undefined);
  }, [activeConversation]);
  useEffect(() => {
    if (reply) {
      textRef.current.focus();
      console.log(reply);
    }
  }, [reply]);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    let isReply = undefined;
    if (reply) {
      isReply = {
        name: reply.conversation.isGroup
          ? `${reply?.sender.name} | ${reply.conversation.name}`
          : `${reply?.sender.name}`,
        message: reply?.message,
        id: reply?.sender._id,
        file: {
          name: `${reply?.file?.file.original_filename}.${
            reply?.file?.file.public_id.split(".")[1]
          }`,
          url: reply?.file?.file.secure_url,
          type: reply?.file?.type,
        },
      };
    }
    const values = {
      token,
      convo_id: activeConversation._id,
      message: msg,
      isReply: reply ? isReply : undefined,
      files: [],
      isForwarded: undefined,
    };
    setLoading(true);
    let newMsg = await dispatch(sendMessages(values));
    socket.emit("new_message", newMsg.payload);
    setLoading(false);
    setMsg("");
    setShowPicker(false);
    setReply(undefined);
  };
  return (
    <>
      <form
        className="w-full dark:bg-dark_bg_2 min-h-[50px] flex flex-col items-center absolute bottom-0 py-2 px-4 select-none"
        onSubmit={(e) => {
          onSubmitHandler(e);
        }}
      >
        {reply && (
          <div className=" flex justify-between items-center w-full pr-3 select-none pb-1 h-[65px]">
            <div className=" w-full top-0 h-[60px] flex">
              <div className="w-full bg-[#2c3840] pt-2 h-fit flex justify-between px-3 pb-2 ">
                <div className="flex flex-col w-full ">
                  <div className="flex items-center justify-start ml-[1%]">
                    {/* Sender Pic */}
                    <div className="">
                      <img
                        src={reply.sender.picture}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                    </div>
                    <h3
                      className={`text-purple-300 text-[15px] ml-3 block ${
                        reply.sender._id === user._id ? "text-yellow-200" : ""
                      }`}
                    >
                      {reply.sender._id === user._id
                        ? "You"
                        : `${reply.sender.name}`}
                      {reply.conversation.isGroup &&
                        ` | ${reply.conversation.name}`}
                    </h3>
                  </div>

                  <div className=" ml-[5%] w-full max-h-[70%]">
                    <p className="text-[12px] dark:text-gray-200 mr-[8%] break-words max-w-[80%]">
                      {reply.message.length > 0
                        ? reply.message.length > 120
                          ? `${reply.message.substring(0, 120)}...`
                          : `${reply.message}`
                        : `${reply?.file?.file?.original_filename}.${
                            reply?.file?.file?.public_id.split(".")[1]
                          }`}
                    </p>
                  </div>
                </div>
                {/* Reply Image  */}
                <div className="max-h-full">
                  <img
                    src={reply?.file?.file?.secure_url}
                    alt=""
                    className="max-h-10"
                  />
                </div>
              </div>
            </div>
            <div>
              <button type="button" onClick={() => setReply(undefined)}>
                <CrossIcon className="fill-white" />
              </button>
            </div>
          </div>
        )}
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
          <Input msg={msg} setMsg={setMsg} textRef={textRef} reply={reply} />
          {/* send icon */}
          <button className="btn" type="submit">
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
