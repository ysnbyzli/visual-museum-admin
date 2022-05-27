import React from "react";

function Tag({ color, text }) {
  return (
    <div
      style={{
        background: `${color}25`,
        color: `${color}`,
        border: `1px solid ${color}80`,
      }}
      className="py-1 px-2 text-xs"
    >
      {text}
    </div>
  );
}

export default Tag;
