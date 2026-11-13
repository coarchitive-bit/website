import React from "react";
import { PageHero, SectionHead, Principles, ScrollStatement, ServiceGrid, ConsultPopup } from "../components/UI.jsx";
import { PLANNING_SERVICES, GIS_SERVICES, TRANSPORT_SERVICES, SOFTWARE } from "../data.js";

export default function Planning() {
  return (
    <>
      <PageHero
        eyebrow="Planning"
        title="Cities and regions planned *as one system.*"
        lede="Urban and regional planning, GIS and transportation brought together — so growth, land and movement are decided as one."
        img="https://images.unsplash.com/photo-1717700299581-c2fc3fad4ee8?auto=format&fit=crop&w=2200&q=85"
        meta={["Urban & regional planning", "GIS & spatial mapping", "Transportation"]}
      />

      <ScrollStatement
        kicker="Why planning"
        text="Good places are not accidents. They are *planned* — with people, nature and infrastructure in the same frame."
      />

      <section className="sec">
        <SectionHead kicker="Planning services" title="From local area *to region*" link="contact" linkLabel="Book a consultation" />
        <ServiceGrid items={PLANNING_SERVICES} />
      </section>

      <section className="sec grey">
        <SectionHead kicker="GIS & spatial" title="Decisions built *on the map*" />
        <ServiceGrid items={GIS_SERVICES} />
      </section>

      <section className="sec">
        <SectionHead kicker="Transportation services" title="Movement designed *as a network*" />
        <ServiceGrid items={TRANSPORT_SERVICES} />
        <ConsultPopup />
      </section>

      <section className="sec grey">
        <SectionHead kicker="Software expertise" title="Tools we *model with*" />
        <Principles items={SOFTWARE} />
      </section>
    </>
  );
}
