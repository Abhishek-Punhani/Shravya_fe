import { useState } from "react";
import Header from "./Header";
import FileViewer from "./fileViewer";
import Input from "./input";
import HandleAndSend from "./handleAndSend";

function FilesPreview() {
  const [msg, setMsg] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className=" relative py-2 w-full flex items-center justify-center">
      {/* Container */}
      <div className="w-full flex flex-col items-center">
        {/* Header */}
        <Header activeIndex={activeIndex} />
        {/* File preview component */}
        <FileViewer activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        {/* Message input  */}
        <Input msg={msg} setMsg={setMsg} />
        {/* send and manipulate added files */}
        <HandleAndSend
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          msg={msg}
        />
      </div>
    </div>
  );
}

export default FilesPreview;
