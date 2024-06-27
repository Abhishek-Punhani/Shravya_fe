import { DownloadIcon } from "../../../../svg";
function FileOther({ file, type }) {
  return (
    <>
      <div className=" bg-green_4 p-2">
        {/* Container */}
        <div className=" flex justify-center gap-x-8 ">
          {/* File Infos */}
          <div className="flex items-center gap-2">
            <img
              src={`/file/${type}.png`}
              alt=""
              className="h-7 w-7 rounded-lg  object-contain"
            />
            <div className="flex flex-col gap-2">
              <h1 className=" inline-block">
                {file.original_filename}.{file.public_id.split(".")[1]}
              </h1>
              <span className=" text-xs">
                {type} . {file.bytes} B
              </span>
            </div>
          </div>
          {/* Download Button */}
          <a href={file.secure_url} target="_blank" download>
            <DownloadIcon />
          </a>
        </div>
      </div>
    </>
  );
}

export default FileOther;
