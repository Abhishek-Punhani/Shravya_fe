import moment from "moment";
import TraingleIcon from "../../../svg/triangle";
function Message({ message, me }) {
  return (
    <>
      <div
        className={`w-full flex mt-2 space-x-3 max-w-xs ${
          me ? "ml-auto justify-end" : ""
        }`}
      >
        {/* Message Conatiner */}
        <div
          className={`relative h-full dark:text-dark_text_1 p-1.5 rounded-lg ${
            me ? "bg-green_3" : "bg-dark_bg_2"
          }`}
        >
          {/* message */}
          <p className="float-left h-full text-sm pb-2 pr-8">
            {message.message}
          </p>
          {/* Message Date */}
          <span className="absolute right-1.5 bottom-1.5 text-xxs text-dark_text_5 leading-none">
            {moment(message.createdAt).format("HH:mm")}
          </span>
          {/* Triangle */}
          {!me && (
            <span>
              <TraingleIcon className="dark:fill-dark_bg_2 rotate-[60deg] absolute top-[-5px] -left-1.5" />
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default Message;
