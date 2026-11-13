import React, { useEffect, useState } from "react";
import { Mail, Copy, Check, X } from "lucide-react";
import { PageHero, SectionHead, Principles, HoverList } from "../components/UI.jsx";
import { Reveal } from "../components/Motion.jsx";
import { ROLES, VALUES, CONTACT, HIRING, EXPERTISE, WORK_WITH_US } from "../data.js";

// each role borrows the photograph of the discipline it sits in
const roleImg = (team) =>
  (EXPERTISE.find((e) => e.title === team) ?? EXPERTISE[0]).img.replace("w=1600", "w=900");

const mailtoFor = (role) =>
  `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Application: ${role.title}`)}&body=${encodeURIComponent(
    `Hello CoArchitive team,\n\nI'd like to apply for the ${role.title} role (${role.team} · ${role.type} · ${role.loc}).\nMy CV and portfolio are attached.\n\nThank you,\n`
  )}`;

// Clicking a role opens this panel instead of jumping straight to a mail
// client: it shows the address, opens a pre-filled draft and confirms once
// the draft has been handed to the mail app.
function ApplyDialog({ role, onClose }) {
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copy = () => {
    navigator.clipboard?.writeText(CONTACT.email).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {}
    );
  };

  const openMail = () => {
    window.location.href = mailtoFor(role);
    setOpened(true);
  };

  return (
    <div className="apply-veil" onClick={onClose}>
      <div
        className="apply-card"
        role="dialog"
        aria-modal="true"
        aria-label={`Apply for ${role.title}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="apply-x" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <span className="eyebrow">Apply by email</span>
        <h3 className="apply-title">{role.title}</h3>
        <p className="apply-meta">{`${role.team} · ${role.type} · ${role.loc}`}</p>
        <p className="apply-body">
          Applications for this role are read by email. We will open a draft addressed to{" "}
          <span className="note-mail">{CONTACT.email}</span> with the subject already filled in —
          attach your CV and portfolio before sending.
        </p>

        <div className="apply-actions">
          <button type="button" className="btn-md" onClick={openMail}>
            <Mail size={16} />
            {opened ? "Open the draft again" : "Send email"}
          </button>
          <button type="button" className="btn ghost-btn sm" onClick={copy}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy email"}
          </button>
        </div>

        <p className="apply-status" role="status" aria-live="polite">
          {opened
            ? "Email draft opened in your mail app — attach your CV and hit send."
            : copied
              ? "Address copied to your clipboard."
              : ""}
        </p>
      </div>
    </div>
  );
}

export default function Careers() {
  const [role, setRole] = useState(null);

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
            onSelect: () => setRole(r),
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

      {role && <ApplyDialog role={role} onClose={() => setRole(null)} />}
    </>
  );
}
