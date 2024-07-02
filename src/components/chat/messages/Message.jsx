import moment from "moment";
import TraingleIcon from "../../../svg/triangle";
import { useDispatch, useSelector } from "react-redux";
import { editMessage } from "../../../features/chatSlice";
function Message({ message, me, i, setedt }) {
  const dispatch = useDispatch();
  const { activeConversation, messages } = useSelector((state) => state.chat);
  const handleEditMsg = async () => {
    // const edtMsg = await dispatch(editMessage(message));
    // console.log(edtMsg);
    setedt(message);
  };
  return (
    <>
      <div
        className={`w-full flex mt-2 space-x-3 max-w-xs ${
          me ? "ml-auto justify-end" : ""
        }`}
        onDoubleClick={() => handleEditMsg}
      >
        {/* Message Conatiner */}
        <div className="relative">
          {/* Sender Pic */}
          {activeConversation.isGroup &&
            (i == 0 || messages[i - 1].sender._id != message.sender._id) && (
              <div className="absolute top-0.5 left-[-37px]">
                <img
                  src={message.sender.picture}
                  alt=""
                  className="w-7 h-7 rounded-full"
                />
              </div>
            )}
          <div
            className={`relative h-full dark:text-dark_text_1 p-1.5 rounded-lg ${
              me ? "bg-green_3" : "bg-dark_bg_2"
            }`}
          >
            {/* Sender Name if group */}
            {activeConversation.isGroup && (
              <div>
                <h3 className=" text-purple-300 text-[13px]">
                  {message.sender.name}
                </h3>
              </div>
            )}
            {/* message */}
            <p className="float-left h-full text-sm pb-2 pr-8">
              {message.message}
            </p>
            {/* Message Date */}
            <span className="absolute right-1.5 bottom-1.5 text-xxs text-dark_text_5 leading-none">
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

export default Message;
