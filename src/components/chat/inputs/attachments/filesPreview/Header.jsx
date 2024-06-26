import { useDispatch, useSelector } from "react-redux";
import { CloseIcon } from "../../../../../svg";
import { clearFiles } from "../../../../../features/chatSlice";
function Header({ activeIndex }) {
  const dispatch = useDispatch();
  const { files } = useSelector((state) => state.chat);
  const clearFilesHandler = () => {
    dispatch(clearFiles());
  };
  return (
    <div className=" w-full mb-3">
      {/* Container */}
      <div className=" w-full flex items-center justify-between">
        {/* Close Icon */}
        <div
          className=" translate-x-4 cursor-pointer"
          onClick={() => clearFilesHandler()}
        >
          <CloseIcon className=" dark:fill-dark_svg_1" />
        </div>
        {/* File name */}
        <h1 className=" dark:text-dark_text_1 text-[15px] inline-block">
          {files[activeIndex]?.file?.name}
        </h1>
        {/* Empty span */}
        <span></span>
      </div>
    </div>
  );
}

export default Header;
