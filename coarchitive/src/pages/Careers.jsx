import React from "react";
import { PageHero, SectionHead, Principles, HoverList } from "../components/UI.jsx";
import { Reveal } from "../components/Motion.jsx";
import { ROLES, VALUES, CONTACT, HIRING, EXPERTISE, WORK_WITH_US } from "../data.js";

// each role borrows the photograph of the discipline it sits in
const roleImg = (team) =>
  (EXPERTISE.find((e) => e.title === team) ?? EXPERTISE[0]).img.replace("w=1600", "w=900");

export default function Careers() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build across *boundaries.*"
        lede="If you want to work next to people whose training is nothing like yours, this is the right practice."
        img="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=85"
        meta={[`${ROLES.length} open roles`, "India · hybrid", "Jobs · internships · freelancing"]}
      />

      <section className="sec grey">
        <SectionHead kicker="Ways to join" title="Jobs, internships *and freelancing*" />
        <Principles items={WORK_WITH_US} />
        <Reveal as="p" className="note">
          To apply for an internship or freelance work, write to{" "}
          <span className="note-mail">{CONTACT.email}</span> with your CV and portfolio.
        </Reveal>
      </section>

      <section className="sec">
        <SectionHead kicker="Open roles" title="Where we're *hiring*" />
        <HoverList
          items={ROLES.map((r) => ({
            title: r.title,
            meta: `${r.team} · ${r.type} · ${r.loc}`,
            img: roleImg(r.team),
            href: `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Application: ${r.title}`)}`,
          }))}
        />
        <Reveal as="p" className="note">
          Don't see your discipline? Write to <span className="note-mail">{CONTACT.email}</span> — we
          read everything.
        </Reveal>
      </section>

      <section className="sec dark">
        <SectionHead kicker="How we hire" title="Four steps, *no surprises*" />
        <ol className="process">
          {HIRING.map(([t, d], i) => (
            <Reveal as="li" key={t} delay={i * 120}>
              <span className="process-no">{String(i + 1).padStart(2, "0")}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="sec grey">
        <SectionHead kicker="Working here" title="What you can *expect*" />
        <Principles items={VALUES} />
      </section>
    </>
  );
}
