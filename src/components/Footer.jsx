import { useEffect, useRef, useState } from "react";
import { FOOTER_LINKS } from "../data/nav";
import { SITE } from "../data/site";

// Background image behind the big "LUXEE DERMA" lettering (in /public/images).
const WORDMARK_BG = "/images/bg-hero.png";

const SOCIAL = [
  { label: "Instagram", short: "IG" },
  { label: "Google", short: "G" },
  { label: "Justdial", short: "JD" },
];

const OTHER_PAGES = ["Treatments", "Results", "Our Doctors", "Contact"];
const INFORMATION = ["Privacy policy", "Terms & conditions", "Refund policy"];

// True once the element has scrolled into view (fires once).
function useInView(ref, threshold = 0.15) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -20px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return shown;
}

// Fades and lifts children into view, with an optional stagger delay.
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const shown = useInView(ref);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        shown
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function FooterLink({ children }) {
  return (
    <a
      href="#"
      className="group relative inline-block text-[14px] text-[#5b5b5b] transition-colors duration-300 hover:text-[#b419b96e]"
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#b419b96e] transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
    </a>
  );
}

function LinkColumn({ title, links, baseDelay = 0 }) {
  return (
    <div>
      <Reveal delay={baseDelay}>
        <h4 className="text-[16px] font-medium text-[#0B0B0B]">{title}</h4>
      </Reveal>
      <ul className="mt-6 space-y-5">
        {links.map((label, i) => (
          <li key={label}>
            <Reveal delay={baseDelay + 80 + i * 60}>
              <FooterLink>{label}</FooterLink>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const wordmarkRef = useRef(null);
  const wordmarkShown = useInView(wordmarkRef, 0.2);

  return (
    <footer className="bg-[#bd99f76c] text-[#0B0B0B]">
      {/* Main row */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-12 lg:pt-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Reveal>
              <div className="leading-[1.15]">
                <div className="serif text-[20px] tracking-[0.14em] text-[#b419b96e]">
                  {SITE.logo.line1}
                </div>
                <div className="serif text-[20px] tracking-[0.28em] font-light mt-1 text-[#b419b96e]">
                  {SITE.logo.line2}
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-6 max-w-[340px] text-[16px] leading-[1.6] text-[#4a4a4a]">
                {SITE.tagline}. Advanced dermatology rooted in safety, hygiene
                and honest consultations.
              </p>
            </Reveal>

            <div className="mt-5 flex gap-2.5">
              {SOCIAL.map((s, i) => (
                <Reveal key={s.label} delay={220 + i * 90}>
                  <a
                    href="#"
                    aria-label={s.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#0B0B0B]/15 text-[11px] font-medium text-[#0B0B0B] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:scale-110 hover:border-[#b419b96e] hover:bg-[#b419b96e] hover:text-white hover:shadow-[0_8px_20px_rgba(201,138,79,0.35)]"
                  >
                    {s.short}
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          <LinkColumn title="Main Pages" links={FOOTER_LINKS} baseDelay={0} />
          <LinkColumn title="Other Pages" links={OTHER_PAGES} baseDelay={100} />
          <LinkColumn title="Information" links={INFORMATION} baseDelay={200} />
        </div>

        {/* Divider + copyright row */}
        <div className="mt-14 border-t border-black/10 pt-6">
          <div className="flex flex-col gap-2 text-[14px] sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[#0B0B0B]">
              © {new Date().getFullYear()} {SITE.name}. All rights reserved.
            </span>
            <span className="text-[#0B0B0B]">
              {SITE.address.full}
              {SITE.address.landmark ? ` · ${SITE.address.landmark}` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Big wordmark: gold text on a bg-service.png band, fading down with a soft reflection */}
      <div
        ref={wordmarkRef}
        className="relative mt-4 overflow-hidden px-4 pb-4 pt-6 lg:px-8 lg:pt-10"
      >
        {/* Background image on its own layer so its opacity can be lowered without dimming the text */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${WORDMARK_BG}')` }}
        />
        <div
          className={`relative mx-auto max-w-[1280px] select-none transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            wordmarkShown
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 motion-reduce:opacity-100 motion-reduce:translate-y-0"
          }`}
        >
          <svg
            viewBox="0 0 1280 300"
            className="block h-auto w-full"
            role="img"
            aria-label="Luxee Derma"
          >
            <defs>
              {/* Letters fade out towards the baseline */}
              <linearGradient id="lx-fade" gradientUnits="userSpaceOnUse" x1="0" y1="70" x2="0" y2="190">
                <stop offset="0" stopColor="#fff" stopOpacity="1" />
                <stop offset="0.45" stopColor="#fff" stopOpacity="0.85" />
                <stop offset="1" stopColor="#fff" stopOpacity="0.06" />
              </linearGradient>
              <mask id="lx-fade-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1280" height="300">
                <rect width="1280" height="300" fill="url(#lx-fade)" />
              </mask>

              {/* Reflection (drawn in the flipped space, so y=190 is the baseline) */}
              <linearGradient id="lx-ref" gradientUnits="userSpaceOnUse" x1="0" y1="190" x2="0" y2="95">
                <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <mask id="lx-ref-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1280" height="300">
                <rect width="1280" height="300" fill="url(#lx-ref)" />
              </mask>
              <filter id="lx-blur" x="-5%" y="-5%" width="110%" height="110%">
                <feGaussianBlur stdDeviation="1.6" />
              </filter>

              {/* One text definition, reused for the letters and the reflection */}
              <text
                id="lx-text"
                x="40"
                y="190"
                fontSize="168"
                fontWeight="700"
                textLength="1200"
                lengthAdjust="spacingAndGlyphs"
                fill="#050000"
                className="serif"
                fontFamily="'Playfair Display','Times New Roman',serif"
              >
                LUXEE DERMA
              </text>
            </defs>

            {/* Reflection */}
            <g transform="translate(0 380) scale(1 -1)">
              <g mask="url(#lx-ref-mask)" filter="url(#lx-blur)">
                <use href="#lx-text" />
              </g>
            </g>

            {/* Main lettering */}
            <g mask="url(#lx-fade-mask)">
              <use href="#lx-text" />
            </g>
          </svg>
        </div>
      </div>
    </footer>
  );
}