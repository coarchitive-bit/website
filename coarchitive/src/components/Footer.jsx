import React from "react";
import { Link } from "../router.jsx";
import Logo from "./Logo.jsx";
import { COMPANY, CONTACT, TAGLINE } from "../data.js";

const COLS = [
  {
    head: "Practice",
    links: [
      ["architecture", "Architecture"],
      ["planning", "Planning"],
      ["expertise", "Environment"],
    ],
  },
  {
    head: "Studio",
    links: [
      ["about", "About"],
      ["about", "People"],
      ["home", "Blogs"],
    ],
  },
  {
    head: "Join",
    links: [
      ["careers", "Career"],
      ["contact", "Contact"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-grid">
          <div className="ftr-brand">
            <Logo size={46} word={false} />
            <p className="ftr-tag">
              {TAGLINE}. Head office in Medchal Malkajgiri, Telangana.
            </p>
          </div>

          {COLS.map((c) => (
            <div key={c.head} className="ftr-col">
              <h4>{c.head}</h4>
              <ul>
                {c.links.map(([to, label]) => (
                  <li key={label}>
                    <Link to={to}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="ftr-col ftr-news">
            <h4>Newsletter</h4>
            <p>Project news and ideas, no more than once a month.</p>
            <form className="ftr-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email" aria-label="Your email" />
              <button type="submit" className="btn tan sm">
                Sign up
              </button>
            </form>
          </div>
        </div>

        <div className="ftr-base">
          <span>
            © {new Date().getFullYear()} {COMPANY}
          </span>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
