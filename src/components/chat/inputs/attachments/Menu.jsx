import {
  CameraIcon,
  ContactIcon,
  DocumentIcon,
  PhotoIcon,
  PollIcon,
  StickerIcon,
} from "../../../../svg";

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
        <li>
          <button type="button" className="btn bg-[#5f66CD] mb-2">
            <DocumentIcon />
          </button>
        </li>
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
        <li>
          <button type="button" className="btn bg-[#BF59CF] mb-4">
            <PhotoIcon />
          </button>
        </li>
      </ul>
    </>
  );
}

export default Menu;
