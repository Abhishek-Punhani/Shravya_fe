import { useDispatch } from "react-redux";
import { logout } from "../../../features/userSlice";
function Menu({ setShow, setShowMenu }) {
  const dispatch = useDispatch();
  return (
    <>
      <div
        className=" absolute right-1 z-50 dark:bg-dark_bg_2 dark:text-dark_text_1 shadow-md w-52 "
        onClick={(e) => e.stopPropagation()}
      >
        <ul>
          <li
            className="py-3 pl-5 cursor-pointer hover:dark:bg-dark_bg_3 mt-3"
            onClick={() => {
              setShowMenu(false);
              setShow(true);
            }}
          >
            <span>New group</span>
          </li>
          <li className="py-3 pl-5 cursor-pointer hover:dark:bg-dark_bg_3">
            <span>New community</span>
          </li>
          <li className="py-3 pl-5 cursor-pointer hover:dark:bg-dark_bg_3">
            <span>Starred messages</span>
          </li>
          <li className="py-3 pl-5 cursor-pointer hover:dark:bg-dark_bg_3">
            <span> Settings</span>
          </li>
          <li
            className="py-3 pl-5 cursor-pointer hover:dark:bg-dark_bg_3"
            onClick={() => dispatch(logout())}
          >
            <span> Logout</span>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Menu;
