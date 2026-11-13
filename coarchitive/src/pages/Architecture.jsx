import React from "react";
import { PageHero, SectionHead, Principles, ServiceGrid, ConsultPopup } from "../components/UI.jsx";
import { Reveal } from "../components/Motion.jsx";
import { ARCH_SERVICES, ARCH_PHILOSOPHY, ARCH_IDEAS, RESIDENTIAL_PROJECTS, VASTU, INTERIOR } from "../data.js";

// Photo with the project's status revealed on hover (always shown on touch).
function Project({ title, location, status, body, img, delay }) {
  return (
    <Reveal as="article" className="proj" delay={delay}>
      <div className="proj-img">
        <img src={img} alt={title} loading="lazy" decoding="async" />
        <span className={status === "Completed" ? "proj-status done" : "proj-status"}>{status}</span>
      </div>
      <h3>{title}</h3>
      {location && <span className="proj-loc">{location}</span>}
      <p>{body}</p>
    </Reveal>
  );
}

function TwoCol({ kicker, title, children }) {
  return (
    <div className="two-col">
      <Reveal className="two-col-head">
        <span className="eyebrow">{kicker}</span>
        <h2>{title}</h2>
      </Reveal>
      <div className="prose">{children}</div>
    </div>
  );
}

export default function Architecture() {
  return (
    <>
      <PageHero
        eyebrow="Architecture"
        title="Spaces designed for people, *built for tomorrow.*"
        lede="Architecture that responds to climate, context and the people who use it — from a single home to a complete development."
        img="https://images.unsplash.com/photo-1789303225087-8307ece66da3?auto=format&fit=crop&w=2200&q=85"
        meta={["Residential · Vastu · Interior", "Climate-responsive design", "Concept → turnkey"]}
      />

      <section className="sec">
        <TwoCol
          kicker="What architecture means to us"
          title={
            <>
              Buildings that give back — to people, place <em>and climate.</em>
            </>
          }
        >
          {ARCH_PHILOSOPHY.map((para, i) => (
            <Reveal as="p" key={i} delay={i * 90}>
              {para}
            </Reveal>
          ))}
        </TwoCol>
      </section>

      <section className="sec grey">
        <SectionHead kicker="Ideas we build with" title="Sustainable by *design, not by add-on*" />
        <Principles items={ARCH_IDEAS} />
      </section>

      <section className="sec" id="residential">
        <SectionHead kicker="Residential" title="Homes we have *designed*" link="contact" linkLabel="Plan your home" />
        <div className="proj-grid">
          {RESIDENTIAL_PROJECTS.map((p, i) => (
            <Project key={p.title} {...p} delay={i * 90} />
          ))}
        </div>
      </section>

      <section className="sec grey" id="vastu">
        <TwoCol
          kicker="Vastu"
          title={
            <>
              Tradition and good design, <em>in the same plan.</em>
            </>
          }
        >
          {VASTU.intro.map((para, i) => (
            <Reveal as="p" key={i} delay={i * 90}>
              {para}
            </Reveal>
          ))}
        </TwoCol>
        <div className="arch-points">
          <Principles items={VASTU.points} />
        </div>
      </section>

      <section className="sec" id="interior">
        <TwoCol
          kicker="Interior"
          title={
            <>
              The building's idea, <em>carried inside.</em>
            </>
          }
        >
          <Reveal as="p">{INTERIOR.intro}</Reveal>
        </TwoCol>
        <div className="int-gallery">
          {INTERIOR.gallery.map((src, i) => (
            <Reveal key={src} variant="clip" delay={i * 90}>
              <img src={src} alt="" loading="lazy" decoding="async" />
            </Reveal>
          ))}
        </div>
        <Principles items={INTERIOR.points} />
      </section>

      <section className="sec grey">
        <SectionHead kicker="Architectural services" title="From first plan *to final render*" link="contact" linkLabel="Book a consultation" />
        <ServiceGrid items={ARCH_SERVICES} />
        <ConsultPopup />
      </section>
    </>
  );
}
