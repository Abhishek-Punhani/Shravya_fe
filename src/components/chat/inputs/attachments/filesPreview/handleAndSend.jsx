import { useDispatch, useSelector } from "react-redux";
import { SendIcon, TrashIcon } from "../../../../../svg";
import Add from "./add";
import { uploadFiles } from "../../../../../utils/upload";
import { useState } from "react";
import { removeFile, sendMessages } from "../../../../../features/chatSlice";
import SocketContext from "../../../../../contexts/SocketContext";
import ClipLoader from "react-spinners/ClipLoader";
import VideoThumbnail from "react-video-thumbnail";

function HandleAndSend({ activeIndex, setActiveIndex, msg, socket }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { files } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const { activeConversation } = useSelector((state) => state.chat);
  const sendMessageHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Upload Files
    const uploaded_files = await uploadFiles(files);
    for (const file of uploaded_files) {
      let values = {
        token,
        message: file.message,
        convo_id: activeConversation._id,
        file: file,
      };
      let newMsg = await dispatch(sendMessages(values));
      console.log(newMsg);
      socket.emit("new_message", newMsg);
    }
    setLoading(false);
  };
  const RemoveFileHandler = (index) => {
    dispatch(removeFile(index));
  };

  return (
    <>
      <div className=" w-[97%] flex items-center justify-between mt-2 border-t dark:border-dark_bg_2 ">
        {/* Empty */}
        <span></span>
        {/* List Files */}
        <div className="flex gap-x-3 p-3">
          {files.map((file, i) => {
            return (
              <div
                key={i}
                className={`fileThumbnail relative w-14 h-14 border border-gray-400 rounded-md overflow-hidden cursor-pointer ${
                  activeIndex === i ? "border-[3px] !border-green_1" : ""
                }`}
                onClick={() => setActiveIndex(i)}
              >
                {file.type === "IMAGE" ? (
                  <img
                    src={file.fileData}
                    alt=""
                    className=" w-full h-full object-cover"
                  />
                ) : file.type === "VIDEO" ? (
                  <VideoThumbnail videoUrl={file.fileData} />
                ) : (
                  <img
                    src={`/file/${file.type}.png`}
                    alt=""
                    className=" w-8 h-10 mt-1.5 ml-2.5"
                  />
                )}
                {/* Remove files */}
                <div
                  className="removeFileIcon absolute top-0 right-0 bg-[rgba(0,0,0,0.4)] hidden "
                  onClick={() => RemoveFileHandler(i)}
                >
                  <TrashIcon className=" dark:fill-white top-0 right-0 h-5 w-5" />
                </div>
              </div>
            );
          })}
          {/* Add More files */}
          <Add setActiveIndex={setActiveIndex} />
        </div>
        {/* Send Button */}
        <div
          className=" bg-green_1 btn mt-2 flex items-center justify-center cursor-pointer"
          onClick={(e) => sendMessageHandler(e)}
        >
          {loading ? (
            <ClipLoader color="#E9EDEF" size={25} />
          ) : (
            <SendIcon className="fill-white" />
          )}
        </div>
      </div>
    </>
  );
}
const HandleAndSendWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <HandleAndSend {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default HandleAndSendWithSocket;
