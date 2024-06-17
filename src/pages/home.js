import { useDispatch, useSelector } from "react-redux";
import { Sidebar } from "../components/sidebar";
import { useEffect } from "react";
import { getConversations } from "../features/chatSlice";
import { ChatContainer, WelcomeHome } from "../components/chat";

export default function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  // get conversations
  useEffect(() => {
    if (user?.token) dispatch(getConversations(user.token));
  }, [user, dispatch]);

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center">
      {/* container */}
      <div className="container h-screen flex py-[10px]">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Chat Component */}
        {activeConversation?._id ? <ChatContainer /> : <WelcomeHome />}
      </div>
    </div>
  );
}
