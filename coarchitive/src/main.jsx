import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { shouldPlayIntro } from "./components/Preloader.jsx";
import "./styles.css";
import "./legacy-layout.css";
import "./pages.css";
import "./pages-skin.css";
import "./preloader.css";

// decided before the first paint, so the page's entrance animations are held
// behind the intro rather than playing unseen
const intro = shouldPlayIntro();
if (intro) document.documentElement.classList.add("intro");

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App intro={intro} />
  </React.StrictMode>
);
