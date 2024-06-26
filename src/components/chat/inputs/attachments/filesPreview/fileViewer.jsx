import { useEffect } from "react";
import { useSelector } from "react-redux";
function FileViewer({ activeIndex, setActiveIndex }) {
  const { files } = useSelector((state) => state.chat);

  return (
    <div className="w-full max-w-[60%] mb-4">
      {/* Container */}
      <div className=" flex justify-center items-center">
        {files[files[activeIndex] ? activeIndex : 0].type === "IMAGE" ? (
          <img
            src={files[files[activeIndex] ? activeIndex : 0].fileData}
            alt=""
            className="max-w-[80%] object-cover hview"
          />
        ) : files[files[activeIndex] ? activeIndex : 0].type === "VIDEO" ? (
          <video
            src={files[files[activeIndex] ? activeIndex : 0].fileData}
            alt=""
            className="max-w-[80%] object-cover hview"
            controls
          ></video>
        ) : (
          <div className="flex items-center justify-center mt-4 w-full">
            <div className=" min-w-full hview flex flex-col space-y-5 items-center justify-center dark:bg-dark_bg_3 p-4">
              {/* File Icon Image */}
              <img
                src={`/file/${
                  files[files[activeIndex] ? activeIndex : 0].type
                }.png`}
                alt=""
              />
              {/* No preview text */}
              <h1 className=" dark:text-dark_text_2 text-2xl">
                No preview available
              </h1>
              {/* File Size /Type */}
              <span className=" dark:text-dark_text_2">
                {files[files[activeIndex] ? activeIndex : 0]?.file?.size} kB -{" "}
                {files[files[activeIndex] ? activeIndex : 0]?.type}
              </span>
            </div>
          </div>
        )}
        ;
      </div>
    </div>
  );
}

export default FileViewer;
