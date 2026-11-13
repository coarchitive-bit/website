import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "../router.jsx";
import { PageHero, SectionHead, Stats, Principles, HoverList, AboutStory } from "../components/UI.jsx";
import { Reveal } from "../components/Motion.jsx";
import { STATS, VALUES, SECTORS, DIRECTORS, TEAM, ABOUT_STORY } from "../data.js";

// People and About are one page: the story first, then who carries it.

// Portrait stacks the real photo over a placeholder. If public/team/<slug>.jpg
// is missing the browser just paints the layer beneath it.
function Person({ name, role, quals, bio, photo, fallback, delay }) {
  return (
    <Reveal as="article" variant="clip" className="person" delay={delay}>
      <div
        className="person-img"
        role="img"
        aria-label={name}
        style={{ backgroundImage: `url(${photo}), url(${fallback})` }}
      />
      <h3>{name}</h3>
      {role && <span>{role}</span>}
      {quals && (
        <ul className="person-quals">
          {quals.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      )}
      {bio && (
        <details className="person-bio">
          <summary>Read profile</summary>
          {bio.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </details>
      )}
    </Reveal>
  );
}

function PeopleGroup({ index, label, blurb, people, children }) {
  return (
    <div className="people-group">
      <Reveal as="header" className="people-group-head">
        <span className="people-group-index">{index}</span>
        <h3>{label}</h3>
        <p>{blurb}</p>
      </Reveal>
      <div className="people-grid three">
        {people.map((p, i) => (
          <Person key={p.name} {...p} delay={i * 110} />
        ))}
        {children && (
          <Reveal variant="clip" delay={people.length * 110}>
            {children}
          </Reveal>
        )}
      </div>
    </div>
  );
}

const LOGO_MEANING = [
  ["[ ]  Collaboration", "The outer brackets are a universal symbol of inclusion — working together across disciplines, with clients, communities and partners."],
  ["O  People at the centre", "Every plan, space and structure we design is created for and around human life."],
  ["9  Architecture", "The right bracket as it is — the forward form of creation, design and built form."],
  ["6  Engineering", "Mirrored vertically it becomes an “e” — the logic, structure and systems that build our designs."],
  ["p  Planning", "Mirrored horizontally it becomes a “p” — the vision, strategy and organisation behind every project."],
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="We connect disciplines to solve *complex challenges.*"
        lede="Innovative. Sustainable. Data-driven. CoArchitive was built for projects where the problem crosses conventional boundaries."
        img="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=2200&q=85"
        meta={["Est. Telangana, India", "8 disciplines", "One integrated team"]}
      />

      <AboutStory story={ABOUT_STORY} />

      <section className="sec">
        <SectionHead kicker="Directors & team" title="Different expertise. *Shared purpose.*" />
        <PeopleGroup
          index="01"
          label="Directors"
          blurb="Setting the direction of the practice and leading every engagement."
          people={DIRECTORS}
        />
        <PeopleGroup
          index="02"
          label="Our team"
          blurb="Expert members who carry the work from first brief to delivery."
          people={TEAM}
        >
          <Link to="careers" className="person-join">
            <span className="eyebrow">Careers</span>
            <strong>Your place could be here.</strong>
            <em>
              See open roles <ArrowRight size={15} />
            </em>
          </Link>
        </PeopleGroup>
      </section>

      <section className="sec grey">
        <SectionHead kicker="Our mark" title="The meaning *behind the logo*" />
        <Principles items={LOGO_MEANING} />
      </section>

      <section className="sec dark">
        <SectionHead kicker="In numbers" title="The practice *at a glance*" />
        <Stats items={STATS} />
      </section>

      <section className="sec">
        <SectionHead kicker="Who we work with" title="Four kinds of client, *one way of working*" link="contact" linkLabel="Start a conversation" />
        <HoverList items={SECTORS.map((s) => ({ ...s, to: "contact" }))} />
      </section>

      <section className="sec grey">
        <SectionHead kicker="Guiding principles" title="What we hold to" />
        <Principles items={VALUES} />
      </section>
    </>
  );
}
