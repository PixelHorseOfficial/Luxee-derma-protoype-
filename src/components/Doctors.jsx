import { useEffect, useRef, useState } from "react";
import { DOCTORS } from "../data/doctors";
import "./Doctors.css";

const TAGLINE = ["Gentle Care", "Detailed Consultations", "Effective Treatments"];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// True once the referenced element has scrolled into view (fires once).
function useInView(ref, threshold = 0.15) {
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
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return shown;
}

// Fades and lifts children into view. Lives on a wrapper so it never fights
// the card's own hover/tilt transform.
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const shown = useInView(ref);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`dr-reveal ${shown ? "is-shown" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// Dark section. Reviews.jsx continues the same black background right below it.
export default function Doctors() {
  const taglineRef = useRef(null);
  const taglineShown = useInView(taglineRef, 0.5);

  // Big soft spotlight that follows the cursor across the whole section.
  const handleSectionMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--sx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--sy", `${e.clientY - rect.top}px`);
  };

  return (
    <section id="doctors" onPointerMove={handleSectionMove} className="dr">
      {/* Cursor spotlight */}
      <div aria-hidden="true" className="dr__spotlight" />

      {/* Ambient floating gold glows */}
      <div aria-hidden="true" className="dr-orb dr-orb--top" />
      <div aria-hidden="true" className="dr-orb dr-orb--bottom" />

      <div className="dr__container">
        <div className="dr__header">
          <div>
            <h2 className="dr-heading serif">Meet The Experts</h2>
            <Reveal delay={350}>
              <span className="dr-heading__rule" />
            </Reveal>
          </div>

          {/* Tagline: each phrase drops in, and warms to gold on hover */}
          <div ref={taglineRef} className="dr-tagline">
            {TAGLINE.map((item, i) => (
              <span key={item} className="dr-tagline__group">
                <span
                  style={{ transitionDelay: taglineShown ? `${300 + i * 130}ms` : "0ms" }}
                  className={`dr-tagline__item ${taglineShown ? "is-shown" : ""}`}
                >
                  {item}
                </span>
                {i < TAGLINE.length - 1 && (
                  <span
                    aria-hidden="true"
                    style={{ transitionDelay: taglineShown ? `${380 + i * 130}ms` : "0ms" }}
                    className={`dr-tagline__dot ${taglineShown ? "is-shown" : ""}`}
                  >
                    •
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="dr-grid">
          {DOCTORS.map((doctor, i) => (
            <Reveal
              key={doctor.name}
              delay={200 + i * 150}
              className="dr-reveal--full-height"
            >
              <DoctorCard {...doctor} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DoctorCard({ name, initials, role, quote, index }) {
  const cardRef = useRef(null);
  const shown = useInView(cardRef, 0.3);

  // 3D tilt + cursor-following glow, written straight to the element
  // (no React state) so it stays smooth while the mouse moves.
  const handleMove = (e) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.transform = `perspective(900px) rotateX(${(-py * 9).toFixed(2)}deg) rotateY(${(
      px * 9
    ).toFixed(2)}deg) translateY(-10px) scale(1.02)`;
  };

  const handleLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="dr-card"
    >
      {/* Travelling gold border: a spinning gradient with an opaque face on top */}
      <div aria-hidden="true" className="dr-card__border">
        <div className="dr-card__border-box">
          <div className="dr-spin" />
        </div>
        <div className="dr-card__border-face" />
      </div>

      {/* Cursor-following gold glow */}
      <div aria-hidden="true" className="dr-card__glow" />

      {/* Diagonal sheen sweeping across */}
      <div aria-hidden="true" className="dr-card__sheen" />

      {/* Decorative quote mark that grows and tilts */}
      <span aria-hidden="true" className="dr-card__mark serif">
        “
      </span>

      <div className="dr-card__content">
        <div className="dr-card__head">
          {/* Avatar: pops in on scroll, pulses, and gets a spinning ring on hover */}
          <div
            style={{ transitionDelay: shown ? `${350 + index * 150}ms` : "0ms" }}
            className={`dr-avatar ${shown ? "is-shown" : ""}`}
          >
            <span aria-hidden="true" className="dr-avatar__pulse" />
            <span aria-hidden="true" className="dr-ring" />
            <div className="dr-avatar__face serif">{initials}</div>
          </div>

          <div>
            <div className="dr-card__name serif">{name}</div>
            <div className="dr-card__role">{role}</div>
          </div>
        </div>

        <div className="dr-card__quote">“{quote}”</div>

        {/* Stars: pop in one by one on scroll, ripple again on hover */}
        <div className="dr-stars" aria-label="5 out of 5 stars">
          {[0, 1, 2, 3, 4].map((n) => (
            <span
              key={n}
              aria-hidden="true"
              style={{
                transitionDelay: shown ? `${600 + index * 150 + n * 90}ms` : "0ms",
              }}
              className={`dr-star ${shown ? "is-shown" : ""}`}
            >
              <span
                style={{ transitionDelay: `${n * 70}ms` }}
                className="dr-star__glyph"
              >
                ★
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Line drawing along the bottom edge */}
      <div aria-hidden="true" className="dr-card__line" />
    </div>
  );
}