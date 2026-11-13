import React from "react";

/* ---------------------------------------------------------------------------
   The two acts that happen on paper rather than in the model: a concept
   sketch that draws itself, and the working drawing it becomes.
   Both reveal along their own stroke length, driven by `p` (0 → 1).
   --------------------------------------------------------------------------- */

// plain 0 → 1 ramp between two points of the stage's local progress
const seg = (p, from, to) => Math.min(1, Math.max(0, (p - from) / (to - from)));

// a stroke that draws in between two points of the stage's local progress
const draw = (p, from, to) => {
  const t = Math.min(1, Math.max(0, (p - from) / (to - from)));
  return { strokeDasharray: 1, strokeDashoffset: 1 - t, opacity: t > 0 ? 1 : 0 };
};

export function ConceptSketch({ p = 1 }) {
  return (
    <svg className="bs-svg bs-sketch" viewBox="0 0 900 620" fill="none" aria-hidden="true">
      {/* the plot, drawn edge by edge — clipped rather than dash-offset, so
          the dashes themselves survive the reveal */}
      <defs>
        <clipPath id="sk-e1">
          <rect x="52" y="58" width={780 * seg(p, 0, 0.22)} height="24" />
        </clipPath>
        <clipPath id="sk-e2">
          <rect x="828" y="58" width="24" height={500 * seg(p, 0.18, 0.42)} />
        </clipPath>
        <clipPath id="sk-e3">
          <rect
            x={848 - 796 * seg(p, 0.38, 0.6)}
            y="538"
            width={796 * seg(p, 0.38, 0.6)}
            height="24"
          />
        </clipPath>
        <clipPath id="sk-e4">
          <rect
            x="48"
            y={562 - 504 * seg(p, 0.56, 0.74)}
            width="24"
            height={504 * seg(p, 0.56, 0.74)}
          />
        </clipPath>
      </defs>
      <g className="sk-dash">
        <path d="M60 70 H840" clipPath="url(#sk-e1)" />
        <path d="M840 70 V550" clipPath="url(#sk-e2)" />
        <path d="M840 550 H60" clipPath="url(#sk-e3)" />
        <path d="M60 550 V70" clipPath="url(#sk-e4)" />
      </g>

      <g className="sk-line">
        {/* the idea: a square of rooms around an open middle */}
        <path d="M250 190 H650 V430 H250 Z" pathLength="1" style={draw(p, 0.3, 0.58)} />
        <path d="M390 265 H510 V355 H390 Z" pathLength="1" style={draw(p, 0.45, 0.68)} />
        <path d="M250 265 H390 M510 265 H650 M250 355 H390 M510 355 H650" pathLength="1" style={draw(p, 0.55, 0.78)} />
      </g>

      <g className="sk-soft">
        {/* breeze through the courtyard, and the sun over it */}
        <path d="M120 470 C 230 430 300 500 400 455 S 600 400 700 445" pathLength="1" style={draw(p, 0.6, 0.86)} />
        <path d="M690 437 l22 8 -20 12" pathLength="1" style={draw(p, 0.78, 0.9)} />
        <path d="M300 150 A 160 160 0 0 1 620 150" pathLength="1" style={draw(p, 0.66, 0.92)} />
        <circle cx="460" cy="118" r="16" pathLength="1" style={draw(p, 0.84, 0.96)} />
        {/* a tree in the garden */}
        <path d="M740 470 v-44" pathLength="1" style={draw(p, 0.7, 0.86)} />
        <circle cx="740" cy="408" r="26" pathLength="1" style={draw(p, 0.78, 0.95)} />
      </g>

      <g className="sk-note" style={{ opacity: Math.min(1, Math.max(0, (p - 0.72) * 4)) }}>
        <text x="420" y="316" textAnchor="middle">COURTYARD</text>
        <text x="128" y="500">BREEZE</text>
        <text x="460" y="96" textAnchor="middle">SOUTH SUN</text>
      </g>
    </svg>
  );
}

/* --------------------------------------------------------------------------- */

const DIMS = [
  [150, 3500],
  [330, 3600],
  [510, 3300],
];

export function WorkingDrawing({ p = 1 }) {
  const grid = ["A", "B", "C", "D"];
  const rows = ["1", "2", "3", "4"];
  return (
    <svg className="bs-svg bs-plan" viewBox="0 0 900 620" fill="none" aria-hidden="true">
      {/* sheet boundary */}
      <g className="pl-dash">
        <rect x="56" y="48" width="788" height="500" pathLength="1" style={draw(p, 0, 0.18)} />
      </g>

      {/* grid bubbles */}
      <g className="pl-grid">
        {grid.map((g, i) => (
          <g key={g} style={draw(p, 0.08 + i * 0.03, 0.3 + i * 0.03)}>
            <circle cx={200 + i * 180} cy="72" r="18" pathLength="1" />
            <path d={`M${200 + i * 180} 90 V 148`} pathLength="1" />
          </g>
        ))}
        {rows.map((r, i) => (
          <g key={r} style={draw(p, 0.12 + i * 0.03, 0.34 + i * 0.03)}>
            <circle cx="96" cy={170 + i * 110} r="18" pathLength="1" />
            <path d={`M114 ${170 + i * 110} H 180`} pathLength="1" />
          </g>
        ))}
      </g>
      <g className="pl-tag">
        {grid.map((g, i) => (
          <text key={g} x={200 + i * 180} y="78" textAnchor="middle">{g}</text>
        ))}
        {rows.map((r, i) => (
          <text key={r} x="96" y={176 + i * 110} textAnchor="middle">{r}</text>
        ))}
      </g>

      {/* walls — the thick lines of the plan */}
      <g className="pl-wall">
        <path d="M180 148 H740 V500 H180 Z" pathLength="1" style={draw(p, 0.2, 0.5)} />
        <path d="M180 170 H740 M180 478 H740 M202 148 V500 M718 148 V500" pathLength="1" style={draw(p, 0.28, 0.58)} />
        {/* partitions */}
        <path
          d="M400 170 V300 M400 300 H202 M560 170 V260 M560 260 H718 M330 478 V380 M330 380 H202 M600 478 V360 M600 360 H718"
          pathLength="1"
          style={draw(p, 0.4, 0.68)}
        />
        {/* courtyard */}
        <path d="M400 300 H560 V390 H400 Z" pathLength="1" style={draw(p, 0.5, 0.74)} />
        {/* stair */}
        <g style={draw(p, 0.58, 0.8)}>
          <path d="M498 392 H580 V478 H498 Z" pathLength="1" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M498 ${400 + i * 13} H580`} pathLength="1" />
          ))}
        </g>
      </g>

      {/* dimension strings */}
      <g className="pl-dim" style={{ opacity: Math.min(1, Math.max(0, (p - 0.58) * 3)) }}>
        <path d="M202 118 H400 M400 118 H560 M560 118 H718" pathLength="1" />
        {[202, 400, 560, 718].map((x) => (
          <path key={x} d={`M${x} 110 V 126`} pathLength="1" />
        ))}
        <text x="300" y="104" textAnchor="middle">3500</text>
        <text x="480" y="104" textAnchor="middle">3600</text>
        <text x="640" y="104" textAnchor="middle">3300</text>
        {DIMS.map(([y, v], i) => (
          <g key={y}>
            <path d={`M150 ${y} V ${y + 110}`} pathLength="1" />
            <text x="142" y={y + 60} textAnchor="middle" transform={`rotate(-90 142 ${y + 60})`}>
              {v}
            </text>
          </g>
        ))}
      </g>

      {/* room names */}
      <g className="pl-room" style={{ opacity: Math.min(1, Math.max(0, (p - 0.62) * 3)) }}>
        <text x="300" y="232" textAnchor="middle">KITCHEN + DINING</text>
        <text x="300" y="250" textAnchor="middle" className="pl-area">18.0 m²</text>
        <text x="470" y="232" textAnchor="middle">LIVING</text>
        <text x="470" y="250" textAnchor="middle" className="pl-area">26.4 m²</text>
        <text x="640" y="232" textAnchor="middle">STUDY</text>
        <text x="640" y="250" textAnchor="middle" className="pl-area">11.0 m²</text>
        <text x="265" y="432" textAnchor="middle">BEDROOM 1</text>
        <text x="265" y="450" textAnchor="middle" className="pl-area">13.6 m²</text>
        <text x="659" y="420" textAnchor="middle">BEDROOM 2</text>
        <text x="659" y="438" textAnchor="middle" className="pl-area">11.9 m²</text>
        <text x="480" y="340" textAnchor="middle">COURTYARD</text>
        <text x="480" y="358" textAnchor="middle" className="pl-area">9.6 m²</text>
        <text x="420" y="462" textAnchor="middle">ENTRANCE</text>
      </g>

      {/* trees as circles on the plot, drawing-office convention */}
      <g className="pl-tree" style={{ opacity: Math.min(1, Math.max(0, (p - 0.7) * 3)) }}>
        {[
          [120, 110],
          [136, 520],
          [806, 112],
          [798, 300],
          [812, 500],
          [300, 86],
          [660, 86],
          [250, 530],
          [540, 534],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 34 : 24} pathLength="1" />
        ))}
      </g>

      <g className="pl-title" style={{ opacity: Math.min(1, Math.max(0, (p - 0.76) * 4)) }}>
        <text x="400" y="586" textAnchor="middle">GROUND FLOOR PLAN</text>
        <text x="640" y="586">SCALE 1:100</text>
      </g>
    </svg>
  );
}
