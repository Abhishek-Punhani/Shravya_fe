import { AddContactIcon, LockIcon, ReturnIcon } from "../../../svg";

function Header() {
  return (
    <>
      <header className=" absolute top-0 w-full z-50">
        {/* Container */}
        <div className=" p-1 flex items-center justify-between">
          {/* Return Button */}
          <button className="btn">
            <ReturnIcon className=" fill-white" />
          </button>
          {/* Encryption text */}
          <p className="flex items-center">
            <LockIcon className="fill-white scale-75" />
            <span className="text-xs dark:text-dark_text_1">
              End-To-end-Encrypted
            </span>
          </p>
          {/* Add contact */}
          <button className="btn">
            <AddContactIcon className="fill-white" />
          </button>
        </div>
      </header>
    </>
  );
}

export default Header;
