import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Plus, Minus, Check, Copy } from "lucide-react";
import { Link } from "../router.jsx";
import BuildSequence from "../sequence/BuildSequence.jsx";
import { Reveal } from "../components/Motion.jsx";
import Logo from "../components/Logo.jsx";
import { IdeaIcon, MarkDiagram } from "../components/Marks.jsx";
import {
  ABOUT_STORY,
  ARCH_IDEAS,
  CAREER_WAYS,
  CONTACT,
  DIRECTORS,
  HEAD_OFFICE,
  HELP_WITH,
  HOME_STATS,
  MARK,
  NOTES,
  PRACTICES,
  SAMPLE_PROJECTS,
  TEAM,
  WHY,
} from "../data.js";
import "../home.css";

/* The page tells the practice's story after the build:
   who we are → why we exist → what we do → how we think → what we have drawn
   → who we are made of → what we are writing → how to join → how to start. */

const Head = ({ eyebrow, lines, accent, className = "" }) => (
  <Reveal className={`sec-head ${className}`}>
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    <h2 className="d2">
      {lines.map((l) => (
        <span key={l}>{l} </span>
      ))}
      {accent && <em className="ac">{accent}</em>}
    </h2>
  </Reveal>
);

/* ------------------------------------------------------------ 01 · about */

function About() {
  return (
    <section className="section h-about" id="about">
      <span className="ghost">About</span>
      <div className="wrap h-about-grid">
        <div>
          <Reveal>
            <span className="eyebrow">About CoArchitive</span>
          </Reveal>
          <div className="h-story">
            {ABOUT_STORY.stanzas.map((lines, i) => (
              <Reveal as="p" key={i} delay={i * 60} className="body-serif">
                {lines.join(" ")}
              </Reveal>
            ))}
            <Reveal as="p" delay={240} className="body-serif h-motto">
              <em>{ABOUT_STORY.motto}</em> {ABOUT_STORY.closing}
            </Reveal>
          </div>
        </div>

        <Reveal className="h-mark" delay={120}>
          <span className="mono">Our mark</span>
          <MarkDiagram />
          <dl>
            {MARK.map(([glyph, title, body]) => (
              <div key={title}>
                <dt>
                  <i aria-hidden="true">{glyph}</i>
                  {title}
                </dt>
                <dd>{body}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- 02 · why */

function Why() {
  return (
    <section className="h-why">
      <Reveal variant="clip" className="h-why-img">
        <img src={WHY.img} alt="" loading="lazy" decoding="async" />
        <span className="mono h-why-cap">{WHY.caption}</span>
      </Reveal>
      <div className="h-why-copy on-green">
        <Reveal>
          <span className="eyebrow">{WHY.eyebrow}</span>
        </Reveal>
        <Reveal as="h2" className="d2" delay={60}>
          {WHY.head[0]} <em className="ac">{WHY.head[1]}</em>
        </Reveal>
        <Reveal as="p" className="lede" delay={120}>
          {WHY.body}
        </Reveal>
        <Reveal delay={180}>
          <a className="btn tan" href="#services" onClick={jump("services")}>
            Explore our services <ArrowRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

const jump = (id) => (e) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* --------------------------------------------------------- 03 · services */

function Services() {
  const [i, setI] = useState(0);
  const p = PRACTICES[i];
  const step = (d) => setI((v) => (v + d + PRACTICES.length) % PRACTICES.length);

  return (
    <section className="section h-services" id="services">
      <span className="ghost">Services</span>
      <div className="wrap">
        <Head eyebrow="What we do" lines={["Five practices,"]} accent="one team." />
        <Reveal as="p" className="lede h-services-lede" delay={80}>
          From a single home to a regional plan. Pick a practice to see the services and the
          tools we use.
        </Reveal>

        <div className="h-tabs" role="tablist" aria-label="Practices">
          {PRACTICES.map((t, n) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={n === i}
              className={n === i ? "on" : ""}
              onClick={() => setI(n)}
            >
              {t.tab}
            </button>
          ))}
        </div>

        <div className="h-practice" key={p.key}>
          <figure className="h-practice-img">
            <img src={p.img} alt="" loading="lazy" decoding="async" />
            <figcaption className="mono">{p.tab}</figcaption>
          </figure>

          <div className="h-practice-copy">
            <h3 className="d3">{p.title}</h3>
            <p className="lede">{p.body}</p>

            <span className="mono h-practice-label">Services</span>
            <ul className="h-service-list">
              {p.services.map((s) => {
                const name = typeof s === "string" ? s : s.name;
                const note = typeof s === "string" ? null : s.note;
                return (
                  <li key={name}>
                    <span>{name}</span>
                    {note && <i>{note}</i>}
                  </li>
                );
              })}
            </ul>

            <div className="h-practice-actions">
              <Link to="contact" className="btn">
                Book a consultation <ArrowRight size={16} />
              </Link>
              <a className="btn ghost-btn" href="#ideas" onClick={jump("ideas")}>
                Ideas we build with
              </a>
              <div className="h-arrows">
                <button onClick={() => step(-1)} aria-label="Previous practice">
                  <ArrowLeft size={16} />
                </button>
                <button onClick={() => step(1)} aria-label="Next practice">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ 04 · ideas */

function Ideas() {
  return (
    <section className="section tint h-ideas" id="ideas">
      <span className="ghost">Ideas</span>
      <div className="wrap">
        <Head
          eyebrow="What architecture means to us"
          lines={["Buildings that give back,"]}
          accent="to people, place and climate."
        />
        <Reveal as="p" className="lede h-ideas-lede" delay={80}>
          We design from climate and context first. Orientation, shade, air and local materials
          shape the plan before anything else, so comfort is built into the structure instead of
          added with machines.
        </Reveal>

        <div className="h-idea-grid">
          {ARCH_IDEAS.map(([title, body], n) => (
            <Reveal className="h-idea" key={title} delay={n * 50}>
              <IdeaIcon n={n} />
              <h3 className="d4">{title}</h3>
              <p>{body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- 05 · projects */

const FILTERS = ["All", "Completed", "Ongoing"];

function Projects() {
  const [f, setF] = useState("All");
  const list = SAMPLE_PROJECTS.filter((p) => f === "All" || p.status === f);

  return (
    <section className="section h-projects" id="projects">
      <span className="ghost">Projects</span>
      <div className="wrap">
        <Head eyebrow="Residential" lines={["Homes on the"]} accent="drawing board." />

        <div className="h-chips">
          {FILTERS.map((x) => (
            <button key={x} className={x === f ? "on" : ""} onClick={() => setF(x)}>
              {x}
            </button>
          ))}
        </div>

        <div className="h-proj-grid">
          {list.map((p, n) => (
            <Reveal className="h-proj" key={p.title} delay={n * 70}>
              <figure>
                <img src={p.img} alt="" loading="lazy" decoding="async" />
                <span className="h-sample mono">Sample</span>
                <span className={`h-status mono ${p.status.toLowerCase()}`}>{p.status}</span>
              </figure>
              <h3 className="d4">{p.title}</h3>
              <div className="h-proj-meta mono">
                <span>{p.kind}</span>
                <span>{p.size}</span>
              </div>
              <p>{p.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="h-demo">
          <span className="mono">Demo</span>
          <p>
            These cards are placeholders with stock images. Real projects, photographs and
            locations replace them.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ 06 · stats */

function Stats() {
  return (
    <section className="h-stats">
      <div className="wrap h-stat-grid">
        {HOME_STATS.map(([n, label, body], i) => (
          <Reveal className="h-stat" key={label} delay={i * 70}>
            <b>{n}</b>
            <span className="mono">{label}</span>
            <p>{body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- 07 · people */

function Person({ p }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal className="h-person">
      <div className="h-portrait">
        <img src={p.photo} alt="" loading="lazy" decoding="async" onError={fallback(p.fallback)} />
      </div>
      <h3 className="d4">{p.name}</h3>
      <span className="mono">{p.role}</span>
      <ul className="h-quals">
        {p.quals?.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>
      {p.bio && (
        <>
          <button className="h-read" onClick={() => setOpen(!open)} aria-expanded={open}>
            Read profile
            {open ? <Minus size={15} /> : <Plus size={15} />}
          </button>
          {open && (
            <div className="h-bio">
              {p.bio.map((b, i) => (
                <p key={i}>{b}</p>
              ))}
            </div>
          )}
        </>
      )}
    </Reveal>
  );
}

// the portrait file may not be dropped in yet; fall back to the placeholder
const fallback = (src) => (e) => {
  if (src && e.currentTarget.src !== src) e.currentTarget.src = src;
};

function People() {
  return (
    <section className="section h-people" id="people">
      <span className="ghost">People</span>
      <div className="wrap">
        <Head eyebrow="People" lines={["Different expertise,"]} accent="shared purpose." />
        <div className="h-people-grid">
          {DIRECTORS.map((p) => (
            <Person key={p.name} p={p} />
          ))}
        </div>

        <h3 className="d3 h-sub">Expert members</h3>
        <div className="h-members">
          {TEAM.map((m) => (
            <Reveal className="h-member" key={m.name}>
              <img src={m.photo} alt="" loading="lazy" decoding="async" onError={fallback(m.fallback)} />
              <div>
                <b>{m.name}</b>
                <span className="mono">{m.role} · profile to be added</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ 08 · notes */

function Notes() {
  return (
    <section className="section h-notes" id="blogs">
      <div className="wrap">
        <Head eyebrow="Blogs" lines={["Notes from the"]} accent="drawing table." />
        <div className="h-note-grid">
          {NOTES.map(([tag, title, body], i) => (
            <Reveal className="h-note" key={title} delay={i * 70}>
              <div className="h-note-top mono">
                <span>{tag}</span>
                <span>Planned</span>
              </div>
              <h3 className="d4">{title}</h3>
              <p>{body}</p>
              <span className="mono h-soon">Coming soon</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- 09 · careers */

const MOSAIC = [
  { img: DIRECTORS[1].photo, fb: DIRECTORS[1].fallback },
  { tone: "green" },
  { img: TEAM[1].photo, fb: TEAM[1].fallback },
  { tone: "sand" },
  { tone: "blue" },
  { img: DIRECTORS[0].photo, fb: DIRECTORS[0].fallback },
  { logo: true },
  { img: TEAM[0].photo, fb: TEAM[0].fallback },
  { tone: "green-dark" },
  { img: DIRECTORS[2].photo, fb: DIRECTORS[2].fallback },
  { tone: "sand" },
  { slot: true },
];

function Careers() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(CONTACT.email).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {}
    );
  };

  return (
    <section className="section tint h-careers" id="careers">
      <span className="ghost">Careers</span>
      <div className="wrap h-careers-grid">
        <Reveal className="h-mosaic" variant="scale">
          {MOSAIC.map((m, i) => (
            <div key={i} className={`h-tile ${m.tone || ""}`}>
              {m.img && <img src={m.img} alt="" loading="lazy" onError={fallback(m.fb)} />}
              {m.logo && <Logo size={40} word={false} />}
              {m.slot && <span className="mono">This could be you</span>}
            </div>
          ))}
        </Reveal>

        <div>
          <Head eyebrow="Career" lines={["Your place"]} accent="could be here." />
          <Reveal as="p" className="lede" delay={60}>
            We are a young, multidisciplinary practice. If you work across architecture, planning,
            environment or GIS, we would like to hear from you.
          </Reveal>

          <dl className="h-ways">
            {CAREER_WAYS.map(([title, body], i) => (
              <Reveal key={title} delay={i * 60}>
                <dt className="d4">{title}</dt>
                <dd>{body}</dd>
              </Reveal>
            ))}
          </dl>

          <Reveal className="h-copy-row" delay={200}>
            <span className="mono h-email">{CONTACT.email}</span>
            <button className="btn ghost-btn sm" onClick={copy}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied" : "Copy email"}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- 10 · contact */

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section className="h-contact on-green" id="contact">
      <div className="wrap h-contact-grid">
        <div>
          <Reveal>
            <span className="eyebrow">Start your journey with us</span>
          </Reveal>
          <Reveal as="h2" className="d2" delay={60}>
            Let&apos;s design <em className="ac">together.</em>
          </Reveal>

          <dl className="h-contact-list">
            <div>
              <dt className="mono">Email</dt>
              <dd>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </dd>
            </div>
            <div>
              <dt className="mono">Phone</dt>
              <dd>
                <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
              </dd>
            </div>
            <div>
              <dt className="mono">{HEAD_OFFICE.label}</dt>
              <dd>{HEAD_OFFICE.lines.join(", ")}</dd>
            </div>
            <div>
              <dt className="mono">Follow</dt>
              <dd>
                <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn · CoArchitive
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <Reveal as="form" className="h-form" delay={120} onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <div className="field">
            <label htmlFor="c-name">Name</label>
            <input id="c-name" name="name" required />
          </div>
          <div className="field">
            <label htmlFor="c-email">Email</label>
            <input id="c-email" name="email" type="email" required />
          </div>
          <div className="field">
            <label htmlFor="c-help">I need help with</label>
            <select id="c-help" name="help" defaultValue={HELP_WITH[0]}>
              {HELP_WITH.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="c-note">About the project</label>
            <textarea id="c-note" name="note" rows={3} />
          </div>
          <button type="submit" className="btn tan">
            {sent ? "Thank you — we will be in touch" : "Book a consultation"}
            {!sent && <ArrowRight size={16} />}
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- the page */

export default function Home() {
  return (
    <>
      <BuildSequence />
      <About />
      <Why />
      <Services />
      <Ideas />
      <Projects />
      <Stats />
      <People />
      <Notes />
      <Careers />
      <Contact />
    </>
  );
}
