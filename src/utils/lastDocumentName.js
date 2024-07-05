export const getDocumentName = (convo) => {
  let files = convo?.latestMessage?.files;
  if (!files) {
    return;
  }
  let file = files[files.length - 1]?.file;
  return `${file?.original_filename}.${file?.public_id?.split(".")[1]}`;
};

export const isImgVid = (convo) => {
  let files = convo?.latestMessage?.files;
  if (!files) {
    return;
  }
  let file = files[files.length - 1];
  return (
    file?.type?.toLowerCase() === "image" ||
    file?.type?.toLowerCase() === "video"
  );
};
