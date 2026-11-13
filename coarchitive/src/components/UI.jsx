import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { Link } from "../router.jsx";
import {
  Reveal,
  Counter,
  useScrollProgress,
  usePointerVars,
  finePointer,
  reducedMotion,
} from "./Motion.jsx";

const pad2 = (n) => String(n).padStart(2, "0");

// "*word*" in copy is set in the italic accent face
export const emphasise = (text) =>
  text.split(/(\*[^*]+\*)/).map((part, i) =>
    part.startsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : part
  );

const plain = (text) => text.replace(/\*/g, "");

// Splits copy into words, keeping track of which ones sit inside *…*.
function words(text) {
  const out = [];
  text.split(/(\*[^*]+\*)/).forEach((part) => {
    const em = part.startsWith("*");
    (em ? part.slice(1, -1) : part).split(/\s+/).filter(Boolean).forEach((w) => out.push({ w, em }));
  });
  return out;
}

// ---------- contour-line background ----------

export function Contours({ className = "", count = 10, cx = 1200, cy = 420, base = 70, step = 46, seed = 1.7 }) {
  const paths = useMemo(() => {
    const list = [];
    for (let k = 0; k < count; k++) {
      const r0 = base + k * step;
      const pts = [];
      for (let a = 0; a <= 64; a++) {
        const t = (a / 64) * Math.PI * 2;
        const wob = Math.sin(t * 3 + seed + k * 0.35) * 0.07 + Math.sin(t * 5 - seed * 0.6 + k * 0.2) * 0.035;
        const r = r0 * (1 + wob);
        pts.push(`${(cx + Math.cos(t) * r * 1.25).toFixed(1)},${(cy + Math.sin(t) * r).toFixed(1)}`);
      }
      list.push("M" + pts.join("L") + "Z");
    }
    return list;
  }, [count, cx, cy, base, step, seed]);

  return (
    <svg className={`contours ${className}`} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {paths.map((d, i) => (
        <path key={i} d={d} pathLength="1" style={{ "--i": i }} />
      ))}
    </svg>
  );
}

// ---------- page hero ----------

// Dark band with the header floating over it. With `img` the copy sits on a
// photograph (`half` keeps it shorter); without, drawn contour lines fill it.
// `meta` is an optional row of short facts along the bottom edge.
export function PageHero({ eyebrow, title, lede, img, half, meta }) {
  const ref = useRef(null);
  useScrollProgress(ref);
  const list = words(title);
  const cls = ["phero", img ? "has-img" : "plain", half && "half"].filter(Boolean).join(" ");

  return (
    <section className={cls} ref={ref}>
      {img ? (
        <>
          <div className="phero-img">
            <img src={img} alt="" fetchpriority="high" decoding="async" />
          </div>
          <div className="phero-scrim" />
        </>
      ) : (
        <Contours className="phero-contours" cx={1260} cy={380} count={9} seed={eyebrow.length * 0.7} />
      )}

      <div className="phero-body">
        <span className="eyebrow in-up" style={{ "--d": "60ms" }}>
          {eyebrow}
        </span>
        <h1 aria-label={plain(title)}>
          {list.map(({ w, em }, i) => (
            <React.Fragment key={i}>
              {i > 0 && " "}
              <span className="word" aria-hidden="true">
                <span style={{ "--d": `${140 + i * 55}ms` }}>{em ? <em>{w}</em> : w}</span>
              </span>
            </React.Fragment>
          ))}
        </h1>
        {lede && (
          <p className="in-up" style={{ "--d": `${320 + list.length * 55}ms` }}>
            {lede}
          </p>
        )}
      </div>

      {meta && (
        <div className="phero-meta in-up" style={{ "--d": `${480 + list.length * 55}ms` }}>
          {meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      )}
    </section>
  );
}

// ---------- section heading ----------

export function SectionHead({ kicker, title, link, linkLabel }) {
  return (
    <div className="shead">
      <Reveal>
        {kicker && <span className="eyebrow">{kicker}</span>}
        <h2>{emphasise(title)}</h2>
      </Reveal>
      {link && (
        <Reveal delay={120}>
          <Link to={link} className="text-link">
            {linkLabel} <ArrowRight size={16} />
          </Link>
        </Reveal>
      )}
    </div>
  );
}

// ---------- card ----------

// The photo settles in as the card enters, and a "View" label trails the
// cursor over it on mouse devices.
export function Card({ to, img, category, meta, title, blurb, size = "", delay = 0 }) {
  const media = useRef(null);
  usePointerVars(media);
  return (
    <Reveal className={`card-cell ${size}`} delay={delay}>
      <Link to={to} className="card">
        <div className="card-media" ref={media}>
          <img className="card-img" src={img} alt="" loading="lazy" decoding="async" />
          <span className="card-cursor" aria-hidden="true">
            View
          </span>
        </div>
        <div className="card-body">
          <span className="card-cat">
            {category}
            {meta ? <em>{meta}</em> : null}
          </span>
          <h3>{title}</h3>
          {blurb && <p>{blurb}</p>}
          <span className="card-go">
            Learn more <ArrowUpRight size={16} />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

// Dark tile that fills the last slot of a three-column feed when the final
// row would otherwise have one card missing.
export function FeedCta({ count, kicker, title, to, label, delay = 0 }) {
  if (count % 3 !== 2) return null;
  return (
    <Reveal className="card-cell feed-cta-cell" delay={delay}>
      <Link to={to} className="feed-cta">
        <span className="eyebrow">{kicker}</span>
        <strong>{emphasise(title)}</strong>
        <em>
          {label} <ArrowUpRight size={16} />
        </em>
      </Link>
    </Reveal>
  );
}

// ---------- stats ----------

// Whole numbers (optionally with a trailing +) count up; anything else, such
// as a symbol, is shown as written.
export function Stats({ items }) {
  return (
    <div className="stats">
      {items.map(([n, label], i) => {
        const m = /^(\d+)(\+?)$/.exec(n);
        return (
          <Reveal key={label} delay={i * 90}>
            <b>{m ? <Counter to={Number(m[1])} pad={m[1].length} suffix={m[2]} /> : n}</b>
            <span>{label}</span>
          </Reveal>
        );
      })}
    </div>
  );
}

// ---------- principles ----------

export function Principles({ items }) {
  return (
    <div className="values">
      {items.map(([t, d], i) => (
        <Reveal key={t} className="value" delay={i * 90}>
          <span className="value-no">{pad2(i + 1)}</span>
          <h4>{t}</h4>
          <p>{d}</p>
        </Reveal>
      ))}
    </div>
  );
}

// ---------- service cards ----------

// Photo, number, name and one line for each service.
export function ServiceGrid({ items }) {
  return (
    <div className="svc-grid">
      {items.map((it, i) => (
        <Reveal as="article" key={it.title} className="svc" delay={(i % 3) * 90}>
          <div className="svc-img">
            <img src={it.img} alt="" loading="lazy" decoding="async" />
          </div>
          <span className="svc-no">{pad2(i + 1)}</span>
          <h3>{it.title}</h3>
          <p>{it.body}</p>
        </Reveal>
      ))}
    </div>
  );
}

// ---------- consultation pop-up ----------

// Drop <ConsultPopup /> after a page's services: once that point scrolls into
// view a card slides in inviting a consultation. Closing it keeps it closed for
// the rest of the visit.
const POPUP_KEY = "consult-popup-closed";

export function ConsultPopup() {
  const mark = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let closed = false;
    try {
      closed = sessionStorage.getItem(POPUP_KEY) === "1";
    } catch {}
    const el = mark.current;
    if (closed || !el || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setOpen(true);
        obs.disconnect();
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(POPUP_KEY, "1");
    } catch {}
  };

  return (
    <>
      <div ref={mark} aria-hidden="true" />
      <aside className={open ? "consult on" : "consult"} aria-hidden={!open} aria-label="Book a consultation">
        <button type="button" className="consult-x" aria-label="Close" onClick={close} tabIndex={open ? 0 : -1}>
          <X size={16} />
        </button>
        <span className="eyebrow">Start your journey with us</span>
        <strong>
          Let’s design <em>together.</em>
        </strong>
        <Link to="contact" className="btn-lg" onClick={close} tabIndex={open ? 0 : -1}>
          Book a consultation <ArrowRight size={18} />
        </Link>
      </aside>
    </>
  );
}

// ---------- about story ----------

// The client's About Us text, kept line for line. `link` adds a "read more"
// under it (used on Home, where the full About page is one click away).
export function AboutStory({ story, link }) {
  return (
    <section className="sec two-col story">
      <Reveal className="two-col-head">
        <span className="eyebrow">About us</span>
        <h2>
          To bring cities, systems, people and ideas <em>closer together.</em>
        </h2>
      </Reveal>
      <div className="prose">
        {story.stanzas.map((lines, i) => (
          <Reveal as="p" key={i} delay={i * 90}>
            {lines.map((l, j) => (
              <React.Fragment key={j}>
                {j > 0 && <br />}
                {l}
              </React.Fragment>
            ))}
          </Reveal>
        ))}
        <Reveal as="p" className="story-motto">{story.motto}</Reveal>
        <Reveal as="p">{story.closing}</Reveal>
        {link && (
          <Reveal>
            <Link to={link} className="text-link">
              More about us <ArrowRight size={16} />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}

// ---------- scroll statement ----------

// A pinned sentence whose words brighten one by one as the page scrolls.
export function ScrollStatement({ id, kicker, text, dark }) {
  const ref = useRef(null);
  useScrollProgress(ref, "pinned");
  const list = words(text);
  return (
    <section id={id} className={dark ? "stmt dark" : "stmt"} ref={ref} style={{ "--n": list.length }}>
      <div className="stmt-stage">
        <div className="stmt-inner">
          <span className="eyebrow">{kicker}</span>
          <p className="stmt-text">
            {list.map(({ w, em }, i) => (
              <span key={i} style={{ "--i": i }}>
                {em ? <em>{w}</em> : w}{" "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

// ---------- hover list ----------

// Rows that reveal a photograph trailing the cursor (mouse only). Each item:
// { title, meta, img, to } for an internal link or { …, href } for mailto etc.
export function HoverList({ items }) {
  const wrap = useRef(null);
  const float = useRef(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const el = wrap.current;
    const f = float.current;
    if (!finePointer() || reducedMotion()) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0, started = false;
    // eased follow, so the image lags the cursor slightly
    const loop = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      f.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!started) {
        x = tx;
        y = ty;
        started = true;
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => (started = false);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hlist" ref={wrap} onPointerLeave={() => setActive(-1)}>
      <div className="hlist-float" ref={float} aria-hidden="true">
        <div className={active >= 0 ? "hlist-frame on" : "hlist-frame"}>
          {items.map((it, i) => (
            <img key={it.title} src={it.img} alt="" loading="lazy" decoding="async" className={i === active ? "on" : ""} />
          ))}
        </div>
      </div>

      {items.map((it, i) => {
        const inner = (
          <>
            <span className="hlist-no">{pad2(i + 1)}</span>
            <h3>{it.title}</h3>
            <span className="hlist-meta">{it.meta}</span>
            <ArrowUpRight className="hlist-go" size={20} />
          </>
        );
        const props = { className: "hlist-row", onPointerEnter: () => setActive(i) };
        return (
          <Reveal key={it.title} delay={i * 70}>
            {it.href ? (
              <a href={it.href} {...props}>
                {inner}
              </a>
            ) : (
              <Link to={it.to} {...props}>
                {inner}
              </Link>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}

// ---------- filter chips ----------

export function Filters({ options, value, onChange, count }) {
  return (
    <div className="filters" role="group" aria-label="Filter">
      {options.map((f) => (
        <button key={f} type="button" className={value === f ? "chip on" : "chip"} aria-pressed={value === f} onClick={() => onChange(f)}>
          {f}
        </button>
      ))}
      <span className="count" aria-live="polite">
        {count}
      </span>
    </div>
  );
}
