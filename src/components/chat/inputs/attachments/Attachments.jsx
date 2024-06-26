import { AttachmentIcon } from "../../../../svg";
import Menu from "./menu/Menu";

function Attachments({ showAttachments, setShowAttachments, setShowPicker }) {
  return (
    <li>
      <button
        className="btn"
        type="button"
        onClick={() => {
          setShowPicker(false);
          setShowAttachments((prev) => !prev);
        }}
      >
        <AttachmentIcon type="button" className="dark:fill-dark_svg_1" />
      </button>
      {/* menu */}
      {showAttachments ? <Menu /> : null}
    </li>
  );
}

export default Attachments;
