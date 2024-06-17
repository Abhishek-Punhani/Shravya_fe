function Input({ msg, setMsg, textRef }) {
  const onChangeHandler = (e) => {
    setMsg(e.target.value);
  };
  return (
    <div className="w-full">
      <input
        type="text"
        className="w-full rounded-2xl dark:bg-dark_hover_1 dark:text-dark_text_1 outline-none flex-1 py-2 px-4 "
        placeholder="type your message"
        onChange={(e) => onChangeHandler(e)}
        value={msg}
        ref={textRef}
      />
    </div>
  );
}

export default Input;
