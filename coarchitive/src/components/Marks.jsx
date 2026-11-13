import React from "react";

/* Small drawn marks, in the language of a drawing sheet: thin strokes,
   square ends, no fills. One per architectural idea. */

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "square",
};

const ICONS = [
  // filler slab — a slab with clay pots set into it
  <g key="0" {...S}>
    <path d="M3 17h30M3 13h30" />
    <path d="M7 13v4M12 13v4M17 13v4M22 13v4M27 13v4" />
    <path d="M5 21h26" strokeDasharray="2 3" />
  </g>,
  // courtyard — rooms around an open middle
  <g key="1" {...S}>
    <rect x="4" y="7" width="28" height="18" />
    <rect x="13" y="13" width="10" height="7" />
    <path d="M4 13h9M23 13h9M4 20h9M23 20h9" />
  </g>,
  // terrace garden — planters on a roof
  <g key="2" {...S}>
    <path d="M4 22h28" />
    <path d="M9 22v-6h5v6M20 22v-9h5v9" />
    <path d="M11.5 16v-4M22.5 13v-4" />
  </g>,
  // vertical garden — a planted wall
  <g key="3" {...S}>
    <path d="M10 26V7" />
    <path d="M10 11l6-3M10 16l6-3M10 21l6-3" />
    <path d="M24 26V9M24 13l-5-2M24 18l-5-2" />
  </g>,
  // landscape — a tree, a path and water
  <g key="4" {...S}>
    <circle cx="12" cy="11" r="4" />
    <path d="M12 15v8" />
    <path d="M3 25c6-4 10 2 16-1s9 1 12 0" />
    <path d="M24 8h6M27 5v6" />
  </g>,
  // jali — a perforated screen
  <g key="5" {...S}>
    <rect x="6" y="6" width="24" height="20" />
    <path d="M6 6l24 20M30 6L6 26" />
    <path d="M18 6v20M6 16h24" />
  </g>,
];

export function IdeaIcon({ n = 0 }) {
  return (
    <svg className="idea-icon" viewBox="0 0 36 32" width="36" height="32" aria-hidden="true">
      {ICONS[n % ICONS.length]}
    </svg>
  );
}

/* The mark, read three ways: as it stands, mirrored vertically, mirrored
   horizontally. The brackets hold an O at the centre. */
export function MarkDiagram() {
  const bracket = (
    <path d="M26 6 H10 V46 H26" fill="none" stroke="currentColor" strokeWidth="5" />
  );
  return (
    <div className="mark-diagram" aria-hidden="true">
      <svg viewBox="0 0 64 52" className="mark-main">
        <g className="mk-green">
          {bracket}
          <g transform="translate(64,0) scale(-1,1)">{bracket}</g>
          <circle cx="32" cy="26" r="11" fill="none" stroke="currentColor" strokeWidth="5" />
        </g>
      </svg>
      {[
        ["9", ""],
        ["e", "scaleY(-1)"],
        ["p", "scaleX(-1)"],
      ].map(([letter, tf]) => (
        <div className="mark-cell" key={letter}>
          <svg viewBox="0 0 36 52" style={{ transform: tf }}>
            <g className="mk-tan">
              <path d="M28 6 H12 V46 H28" fill="none" stroke="currentColor" strokeWidth="5" />
            </g>
          </svg>
          <span className="mono">{letter}</span>
        </div>
      ))}
    </div>
  );
}
