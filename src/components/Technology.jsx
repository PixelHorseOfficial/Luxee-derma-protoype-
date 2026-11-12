import { useEffect, useRef, useState } from "react";
import { TECH_FEATURES, TECH_PROCEDURES } from "../data/technology";
import technologyImage from "../assets/technology.webp";
import "./Technology.css";

// Scroll reveal. The starting position lives on a wrapper element so it
// never fights the hover transforms on the element inside.
function Reveal({ children, from = "up", delay = 0, className = "" }) {
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
      className={`tech-reveal tech-reveal--${from} ${shown ? "is-shown" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CORNERS = ["tl", "tr", "bl", "br"];

export default function Technology() {
  const imgRef = useRef(null);
  const captionRef = useRef(null);

  // Photo: the image drifts opposite to the cursor (parallax) and zooms in,
  // while the caption card shifts slightly the other way.
  const handlePhotoMove = (e) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (imgRef.current) {
      imgRef.current.style.transform = `scale(1.1) translate(${(-px * 18).toFixed(1)}px, ${(
        -py * 18
      ).toFixed(1)}px)`;
    }
    if (captionRef.current) {
      captionRef.current.style.transform = `translate(${(px * 10).toFixed(1)}px, -6px)`;
    }
  };

  const handlePhotoLeave = () => {
    if (imgRef.current) imgRef.current.style.transform = "";
    if (captionRef.current) captionRef.current.style.transform = "";
  };

  return (
    <section id="technology" className="tech">
      <div className="tech__container">
        <div className="tech__grid">
          {/* ---------- Photo with caption ---------- */}
          <Reveal from="left" className="tech-reveal--full-height">
            <div
              onPointerMove={handlePhotoMove}
              onPointerLeave={handlePhotoLeave}
              className="tech-photo"
            >
              <img
                ref={imgRef}
                src={technologyImage}
                alt="Advanced dermatology treatment"
                className="tech-photo__img"
              />

              {/* Gold scanning line (runs while hovering) */}
              <div aria-hidden="true" className="tech-photo__scan" />

              {/* Viewfinder corners that close in on hover */}
              {CORNERS.map((corner) => (
                <span
                  key={corner}
                  aria-hidden="true"
                  className={`tech-photo__corner tech-photo__corner--${corner}`}
                />
              ))}

              {/* Caption card */}
              <div ref={captionRef} className="tech-caption glass">
                <div className="tech-caption__text">
                  <span className="tech-caption__title serif">
                    Sterilized, Top-Notch
                  </span>
                  <br />
                  <span className="tech-caption__sub">
                    Infrastructure • USFDA Protocols
                  </span>
                </div>
                {/* Badge with a soft pulsing ring */}
                <div className="tech-badge">
                  <span aria-hidden="true" className="tech-badge__ping" />
                  <div className="tech-badge__icon">✓</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ---------- Copy + checklist ---------- */}
          <div>
            <Reveal from="right">
              <div className="tech__eyebrow">
                <span className="tech__eyebrow-line" />
                Why Luxee
              </div>
              <h2 className="tech__title serif">
                Technology That
                <br />
                Delivers Results
              </h2>
              <p className="tech__lead">
                We invest in devices that respect melanin-rich skin and deliver
                predictable outcomes — not trends.
              </p>
            </Reveal>

            <div className="tech__features">
              {TECH_FEATURES.map(({ title, desc }, i) => (
                <Reveal key={title} from="right" delay={150 + i * 120}>
                  <FeatureCard title={title} desc={desc} />
                </Reveal>
              ))}
            </div>

            <Reveal from="up" delay={200}>
              <div className="tech__divider" />
              <div className="tech__procedures">
                {TECH_PROCEDURES.map((name) => (
                  <span key={name} className="tech-procedure">
                    <span className="tech-procedure__dot">•</span> {name}
                    <span
                      aria-hidden="true"
                      className="tech-procedure__underline"
                    />
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, desc }) {
  // Cursor-following glow, written straight to the element for smoothness.
  const handleMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div onPointerMove={handleMove} className="tech-feature">
      {/* Cursor glow */}
      <div aria-hidden="true" className="tech-feature__glow" />

      {/* Bar that grows down the left edge */}
      <span aria-hidden="true" className="tech-feature__bar" />

      <div className="tech-feature__icon">✓</div>
      <div className="tech-feature__body">
        <div className="tech-feature__title">{title}</div>
        <div className="tech-feature__desc">{desc}</div>
      </div>
    </div>
  );
}