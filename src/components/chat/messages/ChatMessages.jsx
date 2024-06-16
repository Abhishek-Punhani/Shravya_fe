import Message from "./Message";
import { useSelector } from "react-redux";

function ChatMessages() {
  const { user } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.chat);
  console.log(messages);
  return (
    <>
      <div className="mb-[60px] bg-[url('https://res.cloudinary.com/dmhcnhtng/image/upload/v1677358270/Untitled-1_copy_rpx8yb.jpg')] bg-cover bg-no-repeat">
        {/* Conatiner */}
        <div className="scrollbar overflow_scrollbar overflow-auto py-2 px-[4%]">
          {messages &&
            messages.map((message) => {
              return (
                console.log(message),
                (
                  <Message
                    message={message}
                    key={message?._id}
                    me={user._id === message.sender._id}
                  />
                )
              );
            })}
        </div>
      </div>
    </>
  );
}

export default ChatMessages;
