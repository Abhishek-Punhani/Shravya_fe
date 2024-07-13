import React from "react";

function MicIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="35"
      className={className}
    >
      <path d="M12 1a5 5 0 0 0-5 5v6a5 5 0 0 0 10 0V6a5 5 0 0 0-5-5zm3 11a3 3 0 0 1-6 0V6a3 3 0 0 1 6 0v6zm-3 7c-3.86 0-7-3.14-7-7H4c0 4.42 3.58 8 8 8s8-3.58 8-8h-1c0 3.86-3.14 7-7 7zm0 4v-3h2v3h-2z" />
    </svg>
  );
}

export default MicIcon;
