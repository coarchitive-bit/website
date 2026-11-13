import React, { useEffect, useRef } from "react";

// Small motion toolkit shared by the home page. Everything writes CSS custom
// properties or classes straight onto the element, so scrolling never causes a
// React re-render, and every effect stands down under prefers-reduced-motion.

export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// ---------- reveal on enter ----------

let io;
const observer = () => {
  if (!io) {
    io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0 }
    );
  }
  return io;
};

// variant: up | fade | clip | scale. `delay` is in ms and staggers siblings.
export function Reveal({ as: Tag = "div", variant = "up", delay = 0, className = "", style, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    observer().observe(el);
    return () => observer().unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref}
      className={`rv rv-${variant} ${className}`}
      style={{ "--d": `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// ---------- scroll progress ----------

// One passive scroll listener and one rAF per frame for every subscriber.
const subs = new Set();
let ticking = false;
const frame = () => {
  ticking = false;
  subs.forEach((fn) => fn());
};
const schedule = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(frame);
  }
};

export function useScrollFrame(fn) {
  const latest = useRef(fn);
  latest.current = fn;

  useEffect(() => {
    const run = () => latest.current();
    subs.add(run);
    if (subs.size === 1) {
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
    }
    run();
    return () => {
      subs.delete(run);
      if (!subs.size) {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      }
    };
  }, []);
}

const clamp01 = (n) => Math.min(1, Math.max(0, n));

// Writes --p (0 → 1) onto the element.
//   "through": 0 as the top enters the viewport, 1 as the bottom leaves it.
//   "pinned":  0 when the top reaches the viewport top, 1 when the bottom
//              reaches the viewport bottom — for tall sections with a sticky child.
export function useScrollProgress(ref, mode = "through", onProgress) {
  useScrollFrame(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const p =
      mode === "pinned"
        ? clamp01(-r.top / Math.max(1, r.height - vh))
        : clamp01((vh - r.top) / (vh + r.height));
    el.style.setProperty("--p", p.toFixed(4));
    onProgress?.(p);
  });
}

// ---------- count up ----------

// `pad` keeps leading zeros, so "08" counts up as 00 → 08
export function Counter({ to, decimals = 0, prefix = "", suffix = "", pad = 0, duration = 1800 }) {
  const ref = useRef(null);
  const fmt = (n) => prefix + n.toFixed(decimals).padStart(pad, "0") + suffix;

  useEffect(() => {
    const el = ref.current;
    if (reducedMotion() || !("IntersectionObserver" in window)) return;
    el.textContent = fmt(0);
    let raf;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = fmt(to * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  // final value is in the markup, so no-JS and reduced-motion readers see it
  return <span ref={ref}>{fmt(to)}</span>;
}

// ---------- pointer effects (mouse only) ----------

// Drifts the element toward the cursor while hovered.
export function useMagnetic(ref, strength = 0.28) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || reducedMotion()) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const leave = () => (el.style.transform = "");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
}

// Sets --rx / --ry (degrees) and --mx / --my (%) for a gentle 3D tilt.
export function useTilt(ref, max = 5) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || reducedMotion()) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`);
      el.style.setProperty("--rx", `${(0.5 - py) * max * 2}deg`);
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
    };
    const leave = () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [max]);
}

// Sets --cx / --cy (px, relative to the element) while the pointer is over it,
// for labels that follow the cursor.
export function usePointerVars(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer()) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--cx", `${e.clientX - r.left}px`);
      el.style.setProperty("--cy", `${e.clientY - r.top}px`);
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);
}

export function Magnetic({ as: Tag = "span", className = "", children, strength }) {
  const ref = useRef(null);
  useMagnetic(ref, strength);
  return (
    <Tag ref={ref} className={`magnetic ${className}`}>
      {children}
    </Tag>
  );
}
