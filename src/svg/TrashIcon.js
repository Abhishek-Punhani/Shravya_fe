import React from "react";

export default function TrashIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      height={24}
      width={24}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      enableBackground="new 0 0 24 24"
      xmlSpace="preserve"
    >
      <path d="M3 6h18v2H3V6zm2 3h14v12H5V9zm4-5v1h6V4h3v2H6V4h3z" />
    </svg>
  );
}
