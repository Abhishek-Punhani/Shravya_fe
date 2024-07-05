import { useDispatch, useSelector } from "react-redux";
import {
  create_open_conversation,
  deleteMessage,
} from "../../../features/chatSlice";
import SocketContext from "../../../contexts/SocketContext";
function ContextMenu({
  contextMenuDirection,
  me,
  show,
  message,
  setedt,
  setReply,
  setShow,
  socket,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  const { token } = user;
  const handlePrivateReply = async () => {
    if (activeConversation.isGroup && !me) {
      const values = {
        token,
        reciever_id: message.sender._id,
        isGroup: false,
      };
      await dispatch(create_open_conversation(values));
      setReply(message);
    }
  };
  const handleDeleteMsg = async () => {
    const values = {
      token,
      id: message._id,
    };
    const msg = await dispatch(deleteMessage(values));
    console.log(msg);
    socket.emit("deleteMsg", msg.payload);
  };
  return (
    <div
      className={`absolute h-fit dark:bg-dark_bg_3 z-50 w-[150px] ${
        contextMenuDirection === "down"
          ? `bottom-[-192px] ${me ? "left-[-153px]" : "right-[-153px]"}`
          : `top-[-182px] ${me ? "left-[-153px]" : "right-[-153px]"}`
      } ${!(show === message._id) ? "hidden" : "block"}`}
      onClick={(event) => event.stopPropagation()}
    >
      <ul className=" flex flex-col items-start h-full">
        <li
          className="p-1 h-[40px] text-[15px] dark:text-dark_svg_1 border-b-white w-full hover:bg-dark_bg_5 cursor-pointer"
          onClick={() => {
            setReply(message);
            setShow(undefined);
          }}
        >
          Reply
        </li>
        <li
          className="p-1 h-[40px] text-[15px] dark:text-dark_svg_1  border-b-white w-full hover:bg-dark_bg_5 cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(message.message);
            setShow(undefined);
          }}
        >
          Copy
        </li>
        <li
          className="p-1 h-[40px] text-[15px] dark:text-dark_svg_1  border-b-white w-full hover:bg-dark_bg_5 cursor-pointer"
          onClick={() => {
            setedt(message);
            setShow(undefined);
          }}
        >
          Edit Message
        </li>
        <li className="p-1 h-[40px] text-[15px] dark:text-dark_svg_1  border-b-white w-full hover:bg-dark_bg_5 cursor-pointer">
          Forward
        </li>
        {message.conversation.isGroup && (
          <li
            className="p-1 h-[40px] text-[15px] dark:text-dark_svg_1  border-b-white w-full hover:bg-dark_bg_5 cursor-pointer"
            onClick={() => {
              setShow(undefined);
              handlePrivateReply();
            }}
          >
            Reply Privately
          </li>
        )}
        <li
          className="p-1 h-[40px] text-[15px] dark:text-dark_svg_1  border-b-white w-full hover:bg-dark_bg_5 cursor-pointer"
          onClick={() => {
            handleDeleteMsg();
            setShow(undefined);
          }}
        >
          Delete
        </li>
      </ul>
    </div>
  );
}

const ContextMenuWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ContextMenu {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ContextMenuWithSocket;
