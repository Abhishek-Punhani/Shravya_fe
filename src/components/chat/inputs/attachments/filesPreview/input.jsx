import React from "react";

function Input({ msg, setMsg }) {
  return (
    <div className="w-[80%] max-w-[60%] dark:bg-dark_hover_1 rounded-lg ">
      <input
        type="text"
        placeholder="Type a Message"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        className=" w-full bg-transparent h-11 pl-2 focus:outline-none border-none dark:text-dark_text_1"
      />
    </div>
  );
}

export default Input;
