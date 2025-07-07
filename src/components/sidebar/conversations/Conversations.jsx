import { useSelector } from "react-redux";
import Conversation from "./Conversation";
import { useEffect } from "react";
import { checkOnline } from "../../../utils/chat";

function Conversations({ onlineUsers, typing, show, setShow, onlyActive }) {
  const { user } = useSelector((state) => state.user);
  const { conversations, activeConversation } = useSelector(
    (state) => state.chat
  );
  useEffect(() => {}, [activeConversation]);
  // Show all conversations (not just those with latestMessage)
  let filteredConvos = conversations;
  if (onlyActive && activeConversation?._id) {
    filteredConvos = filteredConvos.filter(c => c._id === activeConversation._id);
  }
  return (
    <div className="convos scrollbar">
      {filteredConvos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <img src="/default.svg" alt="No friends" className="w-20 h-20 mb-2 opacity-60" />
          <span className="text-lg font-semibold">No friends yet</span>
          <span className="text-sm">Send invites to start chatting!</span>
        </div>
      ) : (
        <ul className="space-y-2 px-2">
          {filteredConvos.map((convo) => (
            <li key={convo._id} className="bg-dark_bg_2 rounded-xl shadow flex items-center p-2 hover:bg-dark_bg_3 transition">
              <Conversation
                show={show}
                setShow={setShow}
                convo={convo}
                online={
                  convo.isGroup
                    ? false
                    : checkOnline(onlineUsers, user, convo.users)
                }
                typing={typing}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Conversations;
