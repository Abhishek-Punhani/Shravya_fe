import moment from "moment";
import TraingleIcon from "../../../../svg/triangle";
import FileOther from "./fileOther";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import ContextMenu from "../ContextMenu";

function FileMessage({
  fileMessage,
  message,
  me,
  show,
  setShow,
  setForward,
  setReply,
  setedt,
}) {
  const { activeConversation } = useSelector((state) => state.chat);
  const { file, type } = fileMessage;
  const messageRef = useRef(null);
  const [contextMenuDirection, setContextMenuDirection] = useState("down");
  const handleContextMenu = () => {
    const messageBounds = messageRef.current.getBoundingClientRect();
    const availableSpaceBelow = window.innerHeight - messageBounds.bottom;
    const menuHeight = 210;
    if (availableSpaceBelow < menuHeight) {
      setContextMenuDirection("up");
    } else {
      setContextMenuDirection("down");
    }
    setShow(message._id);
    console.log(message);
  };
  return (
    <>
      <div
        ref={messageRef}
        className={` w-full flex mt-2 space-x-3 max-w-xs ${
          me ? "ml-auto justify-end" : ""
        }`}
        onContextMenu={(e) => {
          e.preventDefault();
          handleContextMenu();
        }}
      >
        {/* Message Conatiner */}
        <div className="relative">
          {/* Sender Pic */}
          {!me && activeConversation.isGroup && (
            <div className="absolute top-0.5 left-[-37px]">
              <img
                src={message.sender.picture}
                alt=""
                className="w-7 h-7 rounded-full"
              />
            </div>
          )}
          <div
            className={`relative h-full dark:text-dark_text_1 rounded-lg p-1 flex flex-col ${
              me ? "bg-green_3" : "bg-dark_bg_2"
            }`}
          >
            {/* message */}
            <p className="h-full text-sm select-none cursor-pointer">
              {type === "IMAGE" ? (
                <img src={file.secure_url} alt="" />
              ) : type === "VIDEO" ? (
                <video src={file.data.secure_url} controls playsInline></video>
              ) : (
                <FileOther file={file} type={type} message={message} />
              )}
            </p>
            {/* Message Date */}
            <span className="ml-auto mt-1 text-xxs text-dark_text_5 leading-none mr-1">
              {moment(message.createdAt).format("HH:mm")}
            </span>
            {/* Triangle */}
            {!me && (
              <span>
                <TraingleIcon className="dark:fill-dark_bg_2 rotate-[60deg] absolute top-[-5px] -left-1.5" />
              </span>
            )}
          </div>
          {/* Context Menu */}
          {show === message._id && (
            <ContextMenu
              contextMenuDirection={contextMenuDirection}
              show={show}
              me={me}
              message={message}
              setedt={setedt}
              setReply={setReply}
              setShow={setShow}
              setForward={setForward}
              file={fileMessage}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default FileMessage;
