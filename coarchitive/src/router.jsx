import React, { useState, useEffect, useCallback } from "react";

const read = () => {
  const raw = window.location.hash.replace(/^#\/?/, "");
  return raw.split("?")[0] || "home";
};

export function useRoute() {
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => {
      setRoute(read());
      window.scrollTo({ top: 0, behavior: "instant" in document.documentElement.style ? "instant" : "auto" });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

export function navigate(to) {
  window.location.hash = "/" + to;
}

// `anchor` lets a nav item point at a section of a page (Blogs lives on Home).
const jump = (anchor) => {
  const go = () =>
    document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
  // give the page a frame to mount before measuring
  requestAnimationFrame(() => requestAnimationFrame(go));
};

export function Link({ to, anchor, children, className, onClick, ...rest }) {
  const handle = useCallback(
    (e) => {
      e.preventDefault();
      onClick?.();
      const here = read() === to;
      if (here && anchor) jump(anchor);
      else if (here) window.scrollTo({ top: 0, behavior: "smooth" });
      else {
        navigate(to);
        if (anchor) setTimeout(() => jump(anchor), 120);
      }
    },
    [to, anchor, onClick]
  );

  return (
    <a href={"#/" + to} className={className} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
