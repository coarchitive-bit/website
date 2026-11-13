import React from "react";

// The approved app-icon logo (dark green tile, white bracket and O, tan "9").
// Source: public/brand/coarchitive-logo.png
const LOGO_SRC = "/brand/coarchitive-logo.png";

export default function Logo({ size = 38, stacked = false, word = true }) {
  return (
    <span className={stacked ? "logo stacked" : "logo"}>
      <img className="mark" src={LOGO_SRC} width={size} height={size} alt="" />
      {word && <span className="logo-word">CoArchitive</span>}
    </span>
  );
}
