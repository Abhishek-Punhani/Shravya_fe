import { useEffect, useRef } from "react";
import { CloseIcon } from "../../../../../svg";
import { useDispatch, useSelector } from "react-redux";
import { addFiles } from "../../../../../features/chatSlice";
import { getFileType } from "../../../../../utils/file";

function Add({ setActiveIndex }) {
  const { files } = useSelector((state) => state.chat);
  const inputRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    setActiveIndex(files.length - 1);
  }, [files]);
  const filesHandler = (e) => {
    let files = Array.from(e.target.files);
    files.forEach((file) => {
      if (
        file.type !== "application/pdf" &&
        file.type !== "text/plain" &&
        file.type !== "application/msword" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
        file.type !== "application/vnd.ms-powerpoint" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" &&
        file.type !== "application/vnd.ms-excel" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        file.type !== "application/vnd.rar" &&
        file.type !== "application/zip" &&
        file.type !== "audio/mpeg" &&
        file.type !== "audio/wav" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/jpg" &&
        file.type !== "image/png" &&
        file.type !== "image/webp" &&
        file.type !== "image/gif" &&
        file.type !== "video/mp4" &&
        file.type !== "video/mpeg" &&
        file.type !== "video/webm" &&
        file.type !== "video/x-matroska" &&
        file.type !== "video/avi" &&
        file.type !== "video/x-ms-wmv" &&
        file.type !== "video/3gpp" &&
        file.type !== "video/quicktime"
      ) {
        files = files.filter((item) => item.name !== file.name);
        console.log(file.type);
        return;
      } else if (file.size > 1024 * 1024 * 1024) {
        files = files.filter((item) => item.name !== file.name);
        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          dispatch(
            addFiles({
              file: file,
              fileData:
                getFileType(file.type) === "IMAGE"
                  ? e.target.result
                  : getFileType(file.type) === "VIDEO"
                  ? e.target.result
                  : "",
              type: getFileType(file.type),
            })
          );
        };
      }
    });
  };
  return (
    <>
      <div
        className="bg-green_1 btn mt-2 flex items-center justify-center cursor-pointer border dark:!border-white !bg-transparent"
        onClick={() => inputRef.current.click()}
      >
        <span className="rotate-45">
          <CloseIcon className="fill-dark_svg_1" />
        </span>
        <input
          type="file"
          hidden
          multiple
          ref={inputRef}
          onChange={filesHandler}
        />
      </div>
    </>
  );
}

export default Add;
