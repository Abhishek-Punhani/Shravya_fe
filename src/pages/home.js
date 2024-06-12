import { useDispatch, useSelector } from "react-redux";
import { Sidebar } from "../components/sidebar";
import { useEffect } from "react";
import { getConversations } from "../features/chatSlice";
import { WelcomeHome } from "../components/chat";

export default function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  // get conversations
  useEffect(() => {
    if (user?.token) dispatch(getConversations(user.token));
  }, [user, dispatch]);

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px]">
      {/* container */}
      <div className="container h-screen flex">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Chat Component */}
        {activeConversation._id ? "Home" : <WelcomeHome />}
      </div>
    </div>
  );
}
