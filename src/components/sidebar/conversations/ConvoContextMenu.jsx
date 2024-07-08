import { useDispatch, useSelector } from "react-redux";
import { deleteConversation } from "../../../features/chatSlice";
import { ClipLoader } from "react-spinners";

export function ConvoContextMenu({ setShow, show }) {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const handleDeleteConvo = async () => {
    let values = {
      token,
      id: show,
    };
    let delConvo = await dispatch(deleteConversation(values));
    console.log(delConvo);
    setShow(undefined);
  };
  return (
    <div
      className={`absolute h-fit dark:bg-dark_bg_3 w-[150px] z-[100]  right-[-5px] bottom-[-60px] `}
      onClick={(event) => event.stopPropagation()}
    >
      <ul className=" flex flex-col items-start h-full">
        <li
          className="p-1 h-[40px] text-[15px] dark:text-dark_svg_1 border-b-white w-full hover:bg-dark_bg_5 cursor-pointer"
          onClick={() => {
            setShow(undefined);
          }}
        >
          Archieve
        </li>
        <li
          className="p-1 h-[40px] text-[15px] dark:text-dark_svg_1 border-b-white w-full hover:bg-dark_bg_5 cursor-pointer flex items-center justify-start"
          onClick={() => handleDeleteConvo()}
        >
          Delete Chat{" "}
          {status === "pending" ? (
            <span className="flex items-center justify-start">
              {" "}
              &nbsp; &nbsp; <ClipLoader size={18} color="#AEBAC1" />
            </span>
          ) : null}
        </li>
      </ul>
    </div>
  );
}

export default ConvoContextMenu;
