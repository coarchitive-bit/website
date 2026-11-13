import React, { useState } from "react";
import { Mail, Phone, MapPin, Linkedin, ArrowRight, Check } from "lucide-react";
import { PageHero } from "../components/UI.jsx";
import { Reveal, Magnetic } from "../components/Motion.jsx";
import { EXPERTISE, CONTACT, HEAD_OFFICE } from "../data.js";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Start a *conversation.*"
        lede="Tell us what you're trying to solve. If it isn't our work, we'll say so and point you somewhere useful."
        meta={[CONTACT.email, CONTACT.phone, "Medchal Malkajgiri, Telangana"]}
      />

      <section className="sec contact-layout">
        <Reveal>
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" autoComplete="email" required />
            </div>
            <div className="field">
              <label htmlFor="org">Organisation</label>
              <input id="org" autoComplete="organization" />
            </div>
            <div className="field">
              <label htmlFor="topic">What is this about?</label>
              <select id="topic" defaultValue="">
                <option value="" disabled>
                  Select an area
                </option>
                {EXPERTISE.map((e) => (
                  <option key={e.slug} value={e.slug}>
                    {e.title}
                  </option>
                ))}
                <option value="other">Something else</option>
              </select>
            </div>
            <div className="field full">
              <label htmlFor="msg">Your message</label>
              <textarea id="msg" rows={6} required />
            </div>
            <div className="form-foot">
              <Magnetic>
                <button type="submit" className="btn-lg">
                  Send enquiry <ArrowRight size={18} />
                </button>
              </Magnetic>
              {sent && (
                <p className="sent" role="status">
                  <Check size={16} /> Thanks — this demo form doesn't submit anywhere yet. Wire it to
                  your inbox or CRM before launch.
                </p>
              )}
            </div>
          </form>
        </Reveal>

        <aside className="contact-side">
          <Reveal>
            <span className="eyebrow">General enquiries</span>
            <a href={`mailto:${CONTACT.email}`}>
              <Mail size={16} /> {CONTACT.email}
            </a>
          </Reveal>
          <Reveal delay={90}>
            <span className="eyebrow">Telephone</span>
            <a href={CONTACT.phoneHref}>
              <Phone size={16} /> {CONTACT.phone}
            </a>
          </Reveal>
          <Reveal delay={180}>
            <span className="eyebrow">{HEAD_OFFICE.label}</span>
            <address className="side-address">
              <MapPin size={16} />
              <span>
                {HEAD_OFFICE.lines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </span>
            </address>
          </Reveal>
          <Reveal delay={270}>
            <span className="eyebrow">Connect</span>
            <p>
              <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin size={16} /> LinkedIn · CoArchitive
              </a>
            </p>
          </Reveal>
        </aside>
      </section>
    </>
  );
}
