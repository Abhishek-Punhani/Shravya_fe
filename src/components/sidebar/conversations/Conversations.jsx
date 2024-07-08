import { useSelector } from "react-redux";
import Conversation from "./Conversation";
import { useEffect } from "react";
import { checkOnline } from "../../../utils/chat";

function Conversations({ onlineUsers, typing, show, setShow }) {
  const { user } = useSelector((state) => state.user);
  const { conversations, activeConversation } = useSelector(
    (state) => state.chat
  );
  useEffect(() => {}, [activeConversation]);
  return (
    <div className="convos scrollbar">
      <ul>
        {conversations &&
          conversations
            .filter(
              (c) =>
                c.latestMessage ||
                c._id === activeConversation._id ||
                c.isGroup === true
            )
            .map((convo) => {
              return (
                <Conversation
                  show={show}
                  setShow={setShow}
                  convo={convo}
                  key={convo._id}
                  online={
                    convo.isGroup
                      ? false
                      : checkOnline(onlineUsers, user, convo.users)
                  }
                  typing={typing}
                />
              );
            })}
      </ul>
    </div>
  );
}

export default Conversations;
