import { useDispatch } from "react-redux";
import { PhotoIcon } from "../../../../../svg";
import { addFiles } from "../../../../../features/chatSlice";
import { getFileType } from "../../../../../utils/file";
import { useRef } from "react";

function PhotoAttachment() {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const imageHandler = (e) => {
    let files = Array.from(e.target.files);
    files.forEach((file) => {
      if (
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
        return;
      } else if (file.size > 1024 * 1024 * 10) {
        files = files.filter((item) => item.name !== file.name);
        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          dispatch(
            addFiles({
              file: file,
              fileData: e.target.result,
              type: getFileType(file.type),
            })
          );
        };
      }
    });
  };
  return (
    <li>
      <button
        type="button"
        className="btn bg-[#BF59CF] mb-4"
        onClick={() => inputRef.current.click()}
      >
        <PhotoIcon />
      </button>
      <input
        type="file"
        hidden
        multiple
        ref={inputRef}
        accept="image/jpg,image/jpeg,image/png,image/webp,image/gif,video/mp4,video/mpeg,video/webm,video/quicktime,video/x-matroska,video/avi,video/x-ms-wmv,video/3gpp"
        onChange={imageHandler}
      />
    </li>
  );
}

export default PhotoAttachment;
