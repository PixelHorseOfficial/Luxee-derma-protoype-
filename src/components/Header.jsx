import { useState, useRef, useLayoutEffect, useEffect, useCallback } from "react";
import useScrolled from "../hooks/useScrolled";
import { NAV_ITEMS } from "../data/nav";
import { SITE } from "../data/site";
import "./Header.css";

// Sticky header: logo, desktop nav, "Book Consultation" button and mobile menu.
// All styling lives in Header.css (plain CSS, no Tailwind needed).
//
// Animations included (pure CSS + React, no extra dependencies):
//  - Entrance: header slides down, nav items fade in with a stagger
//  - Header compacts (72px -> 64px) on scroll
//  - Sliding gold underline that glides between the active nav items
//  - Logo hover: second line widens its letter-spacing, gold accent line draws in
//  - CTA: fill sweeps up on hover, arrow slides in, press-scale on click
//  - Hamburger morphs cleanly into an X
//  - Mobile menu: smooth height reveal + staggered item slide-in
//  - Respects prefers-reduced-motion
export default function Header({ activeSection, onNavigate, onLogoClick }) {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, show: false });
  const itemRefs = useRef({});

  const handleNav = (id) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  // Position the sliding underline under the active nav item.
  const measure = useCallback(() => {
    const el = itemRefs.current[activeSection];
    if (!el) {
      setIndicator((prev) => ({ ...prev, show: false }));
      return;
    }
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth, show: true });
  }, [activeSection]);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className={`hd-root hd-enter ${scrolled ? "is-scrolled" : ""}`}>
      <div className="hd-inner">
        {/* Logo */}
        <button onClick={onLogoClick} className="hd-logo">
          <img
            src="/images/logo1.png"
            alt={`${SITE.logo.line1} ${SITE.logo.line2} logo`}
            className="hd-logo-img"
          />
          <span className="hd-logo-text">
            <div className="serif hd-logo-line1">{SITE.logo.line1}</div>
            <div className="serif hd-logo-line2">{SITE.logo.line2}</div>
            <span className="hd-logo-line" />
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hd-nav">
          {NAV_ITEMS.map(({ label, id }, i) => (
            <button
              key={id}
              ref={(el) => (itemRefs.current[id] = el)}
              onClick={() => handleNav(id)}
              style={{ animationDelay: `${250 + i * 70}ms` }}
              className={`hd-anim-item hd-nav-item ${
                activeSection === id ? "is-active" : ""
              }`}
            >
              {label}
              {/* hover preview underline, grows from the left */}
              <span aria-hidden="true" className="hd-nav-underline" />
            </button>
          ))}

          {/* Sliding gold underline */}
          <span
            aria-hidden="true"
            className="hd-indicator"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.show ? 1 : 0,
            }}
          />
        </nav>

        {/* CTA + hamburger */}
        <div className="hd-actions">
          <button
            onClick={() => handleNav("contact")}
            style={{ animationDelay: `${250 + NAV_ITEMS.length * 70}ms` }}
            className="hd-anim-item hd-cta"
          >
            {/* deeper tan fill sweeping up */}
            <span aria-hidden="true" className="hd-cta-fill" />
            {/* light sheen */}
            <span aria-hidden="true" className="hd-cta-sheen" />
            <span className="hd-cta-label">Book Consultation</span>
            <span aria-hidden="true" className="hd-cta-arrow">→</span>
          </button>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className={`hd-burger ${menuOpen ? "is-open" : ""}`}
          >
            <span className="hd-burger-bar hd-burger-bar--top" />
            <span className="hd-burger-bar hd-burger-bar--mid" />
            <span className="hd-burger-bar hd-burger-bar--bottom" />
          </button>
        </div>
      </div>

      {/* Mobile menu: always mounted so it can animate open and closed */}
      <div
        className={`hd-mobile ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="hd-mobile-clip">
          <div className="hd-mobile-panel">
            {NAV_ITEMS.map(({ label, id }, i) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                style={{ transitionDelay: menuOpen ? `${120 + i * 60}ms` : "0ms" }}
                className={`hd-mobile-item ${activeSection === id ? "is-active" : ""}`}
              >
                <span className="hd-mobile-dot" />
                <span className="hd-mobile-label">{label}</span>
              </button>
            ))}
            <button
              onClick={() => handleNav("contact")}
              style={{
                transitionDelay: menuOpen ? `${120 + NAV_ITEMS.length * 60}ms` : "0ms",
              }}
              className="hd-mobile-cta"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}