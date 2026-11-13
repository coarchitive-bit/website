import React, { useMemo, useState } from "react";

// Interactive mock of the spatial platform: toggle map layers and scrub a
// growth scenario. All data is generated from a fixed seed, so it is sample
// data only and renders identically every time.

const LAYERS = [
  { key: "land", label: "Land use", swatch: "var(--green)" },
  { key: "transit", label: "Transit", swatch: "var(--ink)" },
  { key: "flood", label: "Flood risk", swatch: "var(--atlas-water)" },
  { key: "green", label: "Green cover", swatch: "var(--atlas-park)" },
];

const YEARS = [2026, 2031, 2036, 2041, 2046];
const CELL = 50;
const COLS = 12;
const ROWS = 8;
const ROADS_X = [200, 400];
const ROADS_Y = [150, 300];
const STATIONS = [
  [60, 106],
  [200, 158],
  [320, 194],
  [460, 234],
  [560, 242],
];

function seeded(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const inFlood = (x, y) => x < 262 && y > 232 + x * 0.34;

function buildParcels() {
  const rand = seeded(20260925);
  const parcels = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * CELL;
      const y = r * CELL;
      // keep a margin where a road runs along the cell edge
      const l = ROADS_X.includes(x) ? 7 : 3;
      const t = ROADS_Y.includes(y) ? 7 : 3;
      const rr = ROADS_X.includes(x + CELL) ? 7 : 3;
      const b = ROADS_Y.includes(y + CELL) ? 7 : 3;
      const cx = x + CELL / 2;
      const cy = y + CELL / 2;
      const park = rand() < 0.13;
      const flood = inFlood(cx, cy);
      const roll = rand();
      const year = roll < 0.42 ? 2026 : YEARS[1 + Math.floor(rand() * 4)];
      const nearTransit = STATIONS.some(([sx, sy]) => Math.hypot(sx - cx, sy - cy) < 95);
      parcels.push({ id: `${r}-${c}`, x: x + l, y: y + t, w: CELL - l - rr, h: CELL - t - b, park, flood, year, nearTransit });
    }
  }
  return parcels;
}

export default function AtlasDemo() {
  const parcels = useMemo(buildParcels, []);
  const [on, setOn] = useState({ land: true, transit: true, flood: false, green: true });
  const [yearIdx, setYearIdx] = useState(0);
  const year = YEARS[yearIdx];

  const built = parcels.filter((p) => !p.park && p.year <= year);
  const buildable = parcels.filter((p) => !p.park).length;
  const kpis = [
    [`${Math.round((built.length / buildable) * 100)}%`, "Built-up area"],
    [`${((built.length * 1850) / 1000).toFixed(0)}k`, "Residents (est.)"],
    [`${Math.round((built.filter((p) => p.nearTransit).length / Math.max(1, built.length)) * 100)}%`, "Near a station"],
    [`${built.filter((p) => p.flood).length * 120}`, "Homes at flood risk"],
  ];

  const fill = (p) => {
    if (p.park) return on.green ? "var(--atlas-park)" : "var(--atlas-empty)";
    if (!on.land) return p.year <= year ? "var(--atlas-muted)" : "var(--atlas-empty)";
    return p.year <= year ? "var(--green)" : "var(--atlas-plot)";
  };

  return (
    <div className="atlas" aria-label="Interactive sample of the Atlas planning platform">
      <div className="atlas-bar">
        <strong>Atlas</strong>
        <span>Riverbend District · sample data</span>
        <em>
          <i /> Live
        </em>
      </div>

      <div className="atlas-body">
        <aside className="atlas-side">
          <p className="atlas-label">Layers</p>
          {LAYERS.map((l) => (
            <button
              key={l.key}
              type="button"
              className={on[l.key] ? "atlas-toggle on" : "atlas-toggle"}
              aria-pressed={on[l.key]}
              onClick={() => setOn({ ...on, [l.key]: !on[l.key] })}
            >
              <span className="atlas-swatch" style={{ background: l.swatch }} />
              {l.label}
              <span className="atlas-switch" />
            </button>
          ))}

          <label className="atlas-label" htmlFor="atlas-year">
            Growth scenario <b>{year}</b>
          </label>
          <input
            id="atlas-year"
            className="atlas-range"
            type="range"
            min="0"
            max={YEARS.length - 1}
            step="1"
            value={yearIdx}
            onChange={(e) => setYearIdx(Number(e.target.value))}
          />
          <div className="atlas-ticks" aria-hidden="true">
            {YEARS.map((y) => (
              <span key={y}>{String(y).slice(2)}</span>
            ))}
          </div>
        </aside>

        <div className="atlas-map">
          <svg viewBox="0 0 600 400" role="img" aria-label={`Sample district map for ${year}`}>
            <rect width="600" height="400" fill="var(--atlas-ground)" />
            {parcels.map((p) => (
              <rect key={p.id} x={p.x} y={p.y} width={p.w} height={p.h} fill={fill(p)} className="atlas-parcel" />
            ))}
            {ROADS_X.map((x) => (
              <rect key={x} x={x - 3} y="0" width="6" height="400" fill="var(--atlas-road)" />
            ))}
            {ROADS_Y.map((y) => (
              <rect key={y} x="0" y={y - 3} width="600" height="6" fill="var(--atlas-road)" />
            ))}
            <path
              d="M0 232 Q140 250 262 322 L262 400 L0 400 Z"
              fill="var(--atlas-water)"
              className="atlas-layer"
              style={{ opacity: on.flood ? 0.55 : 0 }}
            />
            <g className="atlas-layer" style={{ opacity: on.transit ? 1 : 0 }}>
              <path
                d="M0 110 C120 100 180 180 300 190 S480 250 600 240"
                fill="none"
                stroke="var(--ink)"
                strokeWidth="3"
              />
              {STATIONS.map(([x, y]) => (
                <g key={x}>
                  {/* walking catchment */}
                  <circle cx={x} cy={y} r="95" fill="none" stroke="var(--ink)" strokeOpacity="0.3" strokeDasharray="3 5" />
                  <circle cx={x} cy={y} r="6" fill="#fff" stroke="var(--ink)" strokeWidth="3" />
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>

      <dl className="atlas-kpis">
        {kpis.map(([v, k]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
