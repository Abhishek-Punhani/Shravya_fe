import moment from "moment";
import TraingleIcon from "../../../../svg/triangle";
import FileOther from "./fileOther";
import { useSelector } from "react-redux";

function FileMessage({ fileMessage, message, me }) {
  const { activeConversation } = useSelector((state) => state.chat);
  const { file, type } = fileMessage;
  return (
    <>
      <div
        className={` w-full flex mt-2 space-x-3 max-w-xs ${
          me ? "ml-auto justify-end" : ""
        }`}
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
                <video src={file.data.secure_url} controls></video>
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
        </div>
      </div>
    </>
  );
}

export default FileMessage;
