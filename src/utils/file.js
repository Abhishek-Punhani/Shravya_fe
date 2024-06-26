export const getFileType = (memType) => {
  switch (memType) {
    case "text/plain":
      return "TXT";
    case "application/pdf":
      return "PDF";
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "DOCX";
    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "PPTX";
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "XLSX ";
    case "application/vnd.rar":
      return "RAR";
    case "application/zip":
      return "ZIP";
    case "audio/mpeg":
    case "audio/wav":
      return "AUDIO";
    case "video/mp4":
    case "video/mpeg":
    case "video/webm":
    case "video/quicktime":
    case "video/x-matroska":
    case "video/avi":
    case ",video/x-ms-wmv":
    case "video/3gpp":
      return "VIDEO";
    case "image/jpg":
    case "image/jpeg":
    case "image/png":
    case "image/webp":
    case "image/gif":
      return "IMAGE";
    default:
      return "DEFAULT";
  }
};
