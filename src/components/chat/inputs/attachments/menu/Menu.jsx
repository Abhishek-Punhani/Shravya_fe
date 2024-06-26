import {
  CameraIcon,
  ContactIcon,
  DocumentIcon,
  PollIcon,
  StickerIcon,
} from "../../../../../svg";
import DocumentAttachment from "./documentAttachment";
import PhotoAttachment from "./photoAttachment";

function Menu() {
  return (
    <>
      <ul className=" absolute bottom-[60px] openEmojiAnimation dark:bg-dark_bg_3">
        <li>
          <button type="button" className="btn mb-2">
            <PollIcon />
          </button>
        </li>
        <li>
          <button type="button" className="btn bg-[#0EABF4] mb-2">
            <ContactIcon />
          </button>
        </li>
        <DocumentAttachment />
        <li>
          <button type="button" className="btn bg-[#D3396D] mb-2">
            <CameraIcon />
          </button>
        </li>
        <li>
          <button type="button" className="btn mb-2">
            <StickerIcon />
          </button>
        </li>
        <PhotoAttachment />
      </ul>
    </>
  );
}

export default Menu;
