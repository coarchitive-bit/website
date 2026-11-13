import React, { useEffect, useState } from "react";
import { reducedMotion } from "./Motion.jsx";

// Opening sequence, built from the logo itself:
//   1. the two brackets slide in (collaboration)
//   2. the "O" becomes a window cycling one photo per discipline
//   3. the O closes back into the mark and the wordmark rises
//   4. the panel lifts away and the page's own entrance plays
// Plays on every page load (including reloads); any click or key skips it.

const SLIDES = [
  ["Architecture", "1600585154340-be6161a56a0c"],
  ["Planning", "1477959858617-67f85cf4f1df"],
  ["Engineering", "1541888946425-d81bb19240f5"],
  ["Interiors", "1600210492486-724fe5c67fb0"],
].map(([label, id]) => ({
  label,
  src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=420&h=840&q=70`,
}));

const WORD = "CoArchitive";
const TAGLINE = "Planning · Architecture · Interior · Engineering";

// timeline, ms from mount
const T_FIRST_SLIDE = 650;
const T_SLIDE = 520;
const T_BRAND = T_FIRST_SLIDE + SLIDES.length * T_SLIDE + 120;
const T_EXIT = T_BRAND + 1000;
const T_EXIT_LEN = 950;

// Off for visitors who ask their system for reduced motion.
export function shouldPlayIntro() {
  return !reducedMotion();
}

export default function Preloader({ onReveal, onDone }) {
  const [slide, setSlide] = useState(-1);
  const [phase, setPhase] = useState("in"); // in → brand → exit

  useEffect(() => {
    SLIDES.forEach((s) => {
      new Image().src = s.src;
    });

    const root = document.documentElement;
    root.style.overflow = "hidden";

    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    let exiting = false;
    const exit = () => {
      if (exiting) return;
      exiting = true;
      setPhase("exit");
      onReveal();
      root.style.overflow = "";
      at(T_EXIT_LEN, onDone);
    };

    SLIDES.forEach((_, i) => at(T_FIRST_SLIDE + i * T_SLIDE, () => setSlide(i)));
    at(T_BRAND, () => setPhase("brand"));
    at(T_EXIT, exit);

    // skip on any deliberate input
    const skip = () => {
      timers.forEach(clearTimeout);
      exit();
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      root.style.overflow = "";
    };
  }, []);

  const capState = (i) => {
    if (phase !== "in" || i < slide) return "gone";
    return i === slide ? "on" : "";
  };

  return (
    <div className={`pre is-${phase}`} aria-hidden="true">
      <div className="pre-stage">
        <div className="pre-mark">
          <svg viewBox="0 0 540 660">
            <g className="pre-br pre-br-l">
              <path
                d="M170 58H115A50 50 0 0 0 65 108V555A50 50 0 0 0 115 605H170"
                fill="none"
                stroke="var(--pre-fg)"
                strokeWidth="60"
                strokeLinecap="round"
              />
            </g>
            <g className="pre-br pre-br-r">
              <path
                d="M365 58H420A50 50 0 0 1 470 108V560"
                fill="none"
                stroke="var(--pre-tan)"
                strokeWidth="60"
                strokeLinecap="round"
              />
              <path
                d="M440 470V490Q440 515 415 515H380Q320 515 320 575V580Q320 640 380 640H440Q500 640 500 580V470Z"
                fill="var(--pre-tan)"
              />
              <rect x="365" y="566" width="90" height="28" rx="14" fill="var(--pre-bg)" />
            </g>
            <g className="pre-o">
              <rect x="204" y="177" width="124" height="296" rx="62" fill="none" stroke="var(--pre-fg)" strokeWidth="42" />
              <rect x="262" y="440" width="9" height="60" fill="var(--pre-bg)" />
            </g>
          </svg>

          {/* the window inside the O */}
          <div className="pre-tile">
            {SLIDES.map((s, i) => (
              <img key={s.label} src={s.src} alt="" className={i <= slide ? "on" : ""} />
            ))}
          </div>
        </div>

        {/* captions and the wordmark share one slot beneath the mark */}
        <div className="pre-text">
          <div className="pre-cap">
            {SLIDES.map((s, i) => (
              <span key={s.label} className={capState(i)}>
                {s.label}
              </span>
            ))}
          </div>
          <div className="pre-word">
            {[...WORD].map((ch, i) => (
              <span key={i} style={{ "--i": i }}>
                {ch}
              </span>
            ))}
          </div>
        </div>
        <div className="pre-tag">{TAGLINE}</div>
      </div>
    </div>
  );
}
