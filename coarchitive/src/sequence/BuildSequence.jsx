import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { STAGES, LAST } from "./stages.js";
import { ConceptSketch, WorkingDrawing } from "./Drawings.jsx";
import { reducedMotion } from "../components/Motion.jsx";
import "./sequence.css";

const RAIL = STAGES.filter((s) => s.rail);

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function webglOK() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function BuildSequence() {
  const section = useRef(null);
  const canvas = useRef(null);
  const skyRefs = useRef([]);
  const copyRefs = useRef([]);
  const labelLayer = useRef(null);
  const labelEls = useRef([]);
  const railFill = useRef(null);
  const sketch = useRef(null);
  const plan = useRef(null);
  const frame = useRef(0);
  const worldRef = useRef(null);

  const [stage, setStage] = useState(0);
  const [flat, setFlat] = useState(false);
  const [p2d, setP2d] = useState({ sketch: 0, plan: 0 });

  const skip = useCallback(() => {
    const el = section.current;
    if (!el) return;
    window.scrollTo({ top: el.offsetTop + el.offsetHeight - window.innerHeight * 0.1, behavior: "smooth" });
  }, []);

  useEffect(() => {
    // The sequence itself is driven by the visitor's own scrolling, so it stays
    // on for everyone. "Reduce motion" turns off the motion they did not ask
    // for — the camera's idle drift and the pulsing scroll cue — rather than
    // replacing the page. Only a machine that cannot run WebGL falls back.
    if (!webglOK()) {
      setFlat(true);
      return;
    }
    const calm = reducedMotion();

    let world = null;
    let alive = true;
    let last = -1;
    let lastStage = -1;

    // three is pulled in on its own so the rest of the page paints first
    import("./world.js").then(({ createWorld }) => {
      if (!alive || !canvas.current) return;
      world = createWorld(canvas.current, { calm });
      worldRef.current = world;
      sizeIt();
      // one label element per projected point
      const layer = labelLayer.current;
      labelEls.current = world.labels.map((l) => {
        const d = document.createElement("span");
        d.className = "bs-label";
        d.textContent = l.text;
        layer.appendChild(d);
        return d;
      });
      tick();
    });

    function sizeIt() {
      if (!world || !canvas.current) return;
      const r = canvas.current.parentElement.getBoundingClientRect();
      world.resize(r.width, r.height, window.innerWidth < 760 ? 1.4 : 1.75);
    }

    function progress() {
      const el = section.current;
      if (!el) return 0;
      const travel = el.offsetHeight - window.innerHeight;
      const y = window.scrollY - el.offsetTop;
      return clamp(travel > 0 ? y / travel : 0, 0, 1);
    }

    function tick() {
      if (!alive) return;
      frame.current = requestAnimationFrame(tick);

      const p = progress();
      const s = p * LAST; // 0 … 7
      if (Math.abs(s - last) < 0.0006) return;
      last = s;

      // the model only exists from act three on
      if (world) world.update(s);
      if (canvas.current) canvas.current.style.opacity = String(clamp((s - 2.1) / 0.75, 0, 1));

      // sky layers
      skyRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = String(clamp(1 - Math.abs(s - i), 0, 1));
      });

      // the two paper acts draw themselves in
      const sk = clamp(s - 0.15, 0, 1);
      const pl = clamp(s - 1.1, 0, 1);
      if (sketch.current) sketch.current.style.opacity = String(clamp(1 - Math.abs(s - 1), 0, 1));
      if (plan.current) plan.current.style.opacity = String(clamp(1 - Math.abs(s - 2), 0, 1));
      setP2d((prev) =>
        Math.abs(prev.sketch - sk) > 0.02 || Math.abs(prev.plan - pl) > 0.02
          ? { sketch: sk, plan: pl }
          : prev
      );

      // copy blocks
      copyRefs.current.forEach((el, i) => {
        if (!el) return;
        const o = clamp(1 - Math.abs(s - i) * 2.6, 0, 1);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${(s - i) * -18}px, 0)`;
        el.style.pointerEvents = o > 0.6 ? "auto" : "none";
      });

      // labels riding on the model
      if (world) {
        world.labels.forEach((l, i) => {
          const el = labelEls.current[i];
          if (!el) return;
          if (!l.on || !l.o) {
            el.style.opacity = "0";
            return;
          }
          el.style.opacity = String(l.o);
          el.style.transform = `translate3d(${l.x}px, ${l.y}px, 0) translate(-50%, -50%)`;
        });
      }

      if (railFill.current) railFill.current.style.transform = `scaleX(${p})`;

      const ns = Math.round(s);
      if (ns !== lastStage) {
        lastStage = ns;
        setStage(ns);
      }
    }

    const onResize = () => sizeIt();
    window.addEventListener("resize", onResize, { passive: true });
    frame.current = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(frame.current);
      window.removeEventListener("resize", onResize);
      labelEls.current.forEach((d) => d.remove());
      labelEls.current = [];
      world?.dispose();
      worldRef.current = null;
    };
  }, []);

  const cur = STAGES[clamp(stage, 0, LAST)];

  /* ---------------- reduced motion / no WebGL: the same story, stacked --- */

  if (flat) {
    return (
      <section className="bs bs-flat">
        {STAGES.map((s, i) => (
          <div key={s.key} className={`bs-flat-row ${s.dark ? "dark" : ""}`}>
            <div className="wrap bs-flat-inner">
              <div className={s.hero ? "bs-copy bs-hero" : "bs-copy"}>
                {s.hero ? (
                  <>
                    <span className="eyebrow">{s.eyebrow}</span>
                    <h1 className="d1">
                      {s.title.map((t) => (
                        <span className="bs-l" key={t}>
                          {t}
                        </span>
                      ))}
                      <span className="bs-l">
                        <em className="ac">{s.accent}</em>
                      </span>
                    </h1>
                  </>
                ) : (
                  <>
                    <span className="eyebrow">{s.label}</span>
                    <h2 className="d2">
                      {s.title.map((t) => (
                        <span className="bs-l" key={t}>
                          {t}
                        </span>
                      ))}
                    </h2>
                  </>
                )}
                <p className="lede">{s.body}</p>
              </div>

              <div className="bs-flat-art">
                {i === 1 && <ConceptSketch p={1} />}
                {i === 2 && <WorkingDrawing p={1} />}
                {/* the remaining acts are 3D; their sheet stands in for them */}
                <div className={`bs-title bs-flat-title ${s.dark ? "on-dark" : ""}`}>
                  <div className="bs-title-head">
                    <span className="bs-title-name">CoArchitive</span>
                    <span>Pvt. Ltd.</span>
                  </div>
                  <div className="bs-title-grid">
                    <div>
                      <span>Project</span>
                      <b>Courtyard House</b>
                    </div>
                    <div>
                      <span>Sheet</span>
                      <b>{s.sheet}</b>
                    </div>
                    <div>
                      <span>Stage</span>
                      <b>{s.stage}</b>
                    </div>
                    <div>
                      <span>Scale</span>
                      <b>{s.scale}</b>
                      <i className="bs-bar" style={{ "--n": i / LAST }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    );
  }

  /* ---------------------------------------------------------- the sequence */

  return (
    <section className="bs" ref={section} style={{ "--acts": LAST + 1 }}>
      <div className="bs-stage">
        {/* sky */}
        <div className="bs-skies" aria-hidden="true">
          {STAGES.map((s, i) => (
            <div
              key={s.key}
              className={`bs-sky sky-${s.key}`}
              ref={(el) => (skyRefs.current[i] = el)}
              style={{ opacity: i === 0 ? 1 : 0 }}
            />
          ))}
          <div className="bs-grid-paper" />
        </div>

        {/* the model */}
        <canvas className="bs-canvas" ref={canvas} style={{ opacity: 0 }} aria-hidden="true" />

        {/* the two paper acts */}
        <div className="bs-2d" aria-hidden="true">
          <div className="bs-2d-slot" ref={sketch} style={{ opacity: 0 }}>
            <ConceptSketch p={p2d.sketch} />
          </div>
          <div className="bs-2d-slot" ref={plan} style={{ opacity: 0 }}>
            <WorkingDrawing p={p2d.plan} />
          </div>
        </div>

        {/* on a narrow screen the copy sits over the model, so it gets a scrim */}
        <div className={`bs-scrim ${cur.dark ? "on-dark" : ""}`} aria-hidden="true" />

        {/* labels pinned to points on the model */}
        <div className="bs-labels" ref={labelLayer} aria-hidden="true" />

        {/* copy */}
        <div className="bs-copy-wrap">
          {STAGES.map((s, i) => (
            <div
              key={s.key}
              ref={(el) => (copyRefs.current[i] = el)}
              className={`bs-copy ${s.hero ? "bs-hero" : ""} ${s.dark ? "on-dark" : ""}`}
              style={{ opacity: i === 0 ? 1 : 0 }}
              aria-hidden={stage !== i}
            >
              {s.hero ? (
                <>
                  <span className="eyebrow">{s.eyebrow}</span>
                  <h1 className="d1">
                    {s.title.map((t) => (
                      <span className="bs-l" key={t}>
                        {t}
                      </span>
                    ))}
                    <span className="bs-l">
                      <em className="ac">{s.accent}</em>
                    </span>
                  </h1>
                  <p className="lede">{s.body}</p>
                  <span className="bs-scroll mono">
                    <i /> Scroll to build
                  </span>
                </>
              ) : (
                <>
                  <span className="eyebrow">{s.label}</span>
                  <h2 className="d2">
                    {s.title.map((t) => (
                      <span className="bs-l" key={t}>
                        {t}
                      </span>
                    ))}
                  </h2>
                  <p className="lede">{s.body}</p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* drawing title block */}
        <div className={`bs-title ${cur.dark ? "on-dark" : ""}`} aria-hidden="true">
          <div className="bs-title-head">
            <span className="bs-title-name">CoArchitive</span>
            <span>Pvt. Ltd.</span>
          </div>
          <div className="bs-title-grid">
            <div>
              <span>Project</span>
              <b>Courtyard House</b>
            </div>
            <div>
              <span>Sheet</span>
              <b>{cur.sheet}</b>
            </div>
            <div>
              <span>Stage</span>
              <b>{cur.stage}</b>
            </div>
            <div>
              <span>Scale</span>
              <b>{cur.scale}</b>
              <i className="bs-bar" style={{ "--n": stage / LAST }} />
            </div>
            <div>
              <span>Drawn</span>
              <b>CoArchitive</b>
            </div>
            <div>
              <span>Date</span>
              <b>30.09.2026</b>
            </div>
          </div>
        </div>

        {/* act rail */}
        <div className={`bs-rail ${cur.dark ? "on-dark" : ""}`} aria-hidden="true">
          <div className="bs-rail-track">
            <i ref={railFill} />
          </div>
          <ol>
            {RAIL.map((s, i) => (
              <li key={s.key} className={stage === i + 1 ? "on" : ""}>
                <b>{s.no}</b>
                <span>{s.rail}</span>
              </li>
            ))}
          </ol>
        </div>

        <button type="button" className={`bs-skip ${cur.dark ? "on-dark" : ""}`} onClick={skip}>
          Skip the build <ArrowDown size={13} />
        </button>
      </div>
    </section>
  );
}
