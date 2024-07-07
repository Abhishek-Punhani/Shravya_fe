export const getDocumentName = (convo) => {
  let file = convo?.latestMessage?.file;
  if (!file) {
    return;
  }
  let originalName = file?.file?.original_filename;
  return `${
    originalName.length > 25
      ? `${originalName?.substring(0, 25)}...`
      : originalName
  }.${file?.file?.public_id?.split(".")[1]}`;
};

export const isImgVid = (convo) => {
  let file = convo?.latestMessage?.file;
  if (!file) {
    return;
  }
  return (
    file?.type?.toLowerCase() === "image" ||
    file?.type?.toLowerCase() === "video"
  );
};
