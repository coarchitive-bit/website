import React, { useEffect, useState } from "react";
import { MapPin, ArrowUpRight } from "lucide-react";
import { PageHero, Contours } from "../components/UI.jsx";
import { Reveal } from "../components/Motion.jsx";
import { OFFICES, HQ, CONTACT } from "../data.js";

// Local time at the head office, refreshed every half minute.
function useLocalTime(tz) {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 30000);
    return () => clearInterval(id);
  }, [tz]);
  return time;
}

export default function Offices() {
  const time = useLocalTime(HQ.tz);

  return (
    <>
      <PageHero
        eyebrow="Offices"
        title="Where we *work from.*"
        lede="A central studio, regional teams and project offices established close to the work."
        meta={["Head office · Telangana", "Project offices on site", `${HQ.lat} · ${HQ.lng}`]}
      />

      <section className="sec offices">
        <div className="office-list">
          {OFFICES.map((o, i) => (
            <Reveal as="article" key={o.city} className="office" delay={i * 100}>
              <span className="office-no">{String(i + 1).padStart(2, "0")}</span>
              <div className="office-city">
                <h3>{o.city}</h3>
                <span>{o.region}</span>
              </div>
              <p>{o.detail}</p>
              <a href={`mailto:${o.email}`}>
                {o.email} <ArrowUpRight size={15} />
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal variant="scale" delay={120} className="office-map" aria-label="Head office location">
          <Contours className="office-contours" count={8} cx={820} cy={520} base={60} step={58} seed={2.4} />
          <span className="office-grid" aria-hidden="true" />
          <div className="office-pin" aria-hidden="true">
            <i />
            <MapPin size={20} />
          </div>
          <div className="office-map-top">
            <span>Head office</span>
            <span>
              {time} {HQ.tzLabel}
            </span>
          </div>
          <div className="office-map-foot">
            <strong>Medchal Malkajgiri</strong>
            <span>
              {HQ.lat} · {HQ.lng}
            </span>
            <span className="office-map-mail">{CONTACT.email}</span>
          </div>
        </Reveal>
      </section>
    </>
  );
}
