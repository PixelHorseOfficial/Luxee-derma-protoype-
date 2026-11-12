import { useEffect, useRef, useState } from "react";
import { SERVICES } from "../data/services";
import "./Services.css";

// --- IMAGE MAPPING BY SERVICE TITLE ---
// Put these 6 images in public/images/services/ folder
// or import them: import pigmentationImg from "@/assets/pigmentation_correction.webp"
const SERVICE_IMAGES = {
  "Pigmentation Correction": "/images/pigmentation_correction.png",
  "Facial Rejuvenation & Hydrafacial": "/images/facial_rejuvenation_hydrafacial.png",
  "Hair Restoration PRP + Mesotherapy": "/images/hair_restoration_prp.png",
  "Pain-Free Laser Hair Removal": "/images/laser_hair_removal.png",
  "Scar & Keloid Therapy + MNRF": "/images/scar_keloid_mnrf.png",
  "Intimate Wellness": "/images/intimate_wellness.png",
  // fallback keyword matching
  "pigmentation": "/images/pigmentation_correction.png",
  "hydrafacial": "/images/facial_rejuvenation_hydrafacial.png",
  "facial": "/images/facial_rejuvenation_hydrafacial.png",
  "hair restoration": "/images/services/hair_restoration_prp.png",
  "prp": "/images/services/hair_restoration_prp.png",
  "laser hair": "/images/services/laser_hair_removal.png",
  "laser": "/images/services/laser_hair_removal.png",
  "scar": "/images/services/scar_keloid_mnrf.png",
  "keloid": "/images/services/scar_keloid_mnrf.png",
  "mnrf": "/images/services/scar_keloid_mnrf.png",
  "intimate": "/images/services/intimate_wellness.png",
};

function getServiceImage(title, fallbackImage) {
  if (fallbackImage) return fallbackImage;
  if (!title) return SERVICE_IMAGES["Pigmentation Correction"];

  // Exact match first
  if (SERVICE_IMAGES[title]) return SERVICE_IMAGES[title];

  // Keyword match
  const lower = title.toLowerCase();
  for (const key in SERVICE_IMAGES) {
    if (lower.includes(key.toLowerCase())) {
      return SERVICE_IMAGES[key];
    }
  }

  return SERVICE_IMAGES["Pigmentation Correction"];
}

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`sv-reveal ${shown ? "is-shown" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="sv-section">
      <div className="sv-panel">
        <div className="sv-inner">
          <div className="sv-header">
            <Reveal>
              <div className="sv-eyebrow">
                <span className="sv-eyebrow-line" />
                Bespoke Solutions
              </div>
              <h2 className="serif sv-title">Bespoke Dermatology Solutions</h2>
            </Reveal>
            <Reveal delay={150}>
              <div className="sv-subtitle">
                Clinical protocols curated for Indian skin tones — minimal downtime,
                maximal clarity, measured results.
              </div>
            </Reveal>
          </div>

          <div className="sv-grid">
            {SERVICES.map((service, i) => (
              <Reveal key={service.title} delay={(i % 3) * 110} className="sv-full-height">
                <ServiceCard {...service} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ title, desc, icon, tag, image }) {
  const [imgError, setImgError] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const imgSrc = getServiceImage(title, image);

  const toggle = () => setFlipped((f) => !f);
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      className={`sv-card ${flipped ? "is-flipped" : ""}`}
      onClick={toggle}
      onKeyDown={onKey}
      onBlur={() => setFlipped(false)}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${title} - flip card for details`}
    >
      <div className="sv-card-inner">
        {/* FRONT: image */}
        <div className="sv-face sv-front">
          {!imgError ? (
            <img
              src={imgSrc}
              alt={title}
              onError={() => setImgError(true)}
              className="sv-card-img"
              loading="lazy"
            />
          ) : (
            <div className="sv-card-img-fallback" />
          )}
          <div className="sv-card-shade" />
          {tag && <div className="sv-card-tag">{tag}</div>}
          <div className="sv-front-caption">
            <div className="sv-card-icon">{icon}</div>
            <h3 className="serif sv-front-title">{title}</h3>
          </div>
        </div>

        {/* BACK: info (with the image softly behind it) */}
        <div className="sv-face sv-back">
          {!imgError && (
            <img src={imgSrc} alt="" aria-hidden="true" className="sv-back-bg" />
          )}
          <div className="sv-back-content">
            <div className="sv-card-icon sv-back-icon">{icon}</div>
            <h3 className="serif sv-card-title">{title}</h3>
            <p className="sv-card-desc">{desc}</p>
            <div className="sv-card-cta">
              <span className="sv-card-cta-text">
                Explore Treatment
                <span className="sv-card-cta-underline" />
              </span>
              <span className="sv-card-cta-arrow">→</span>
            </div>
          </div>
          <div aria-hidden="true" className="sv-card-bar" />
        </div>
      </div>
    </div>
  );
}