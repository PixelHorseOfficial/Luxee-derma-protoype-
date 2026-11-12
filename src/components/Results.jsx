import { useEffect, useRef, useState } from "react";
import { RESULT_STATS } from "../data/results";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// True once the referenced element has scrolled into view (fires once).
function useInView(ref, threshold = 0.2) {
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
      { threshold, rootMargin: "0px 0px -30px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return shown;
}

// Fades and lifts children into view. Lives on a wrapper so it never fights
// the hover/tilt transform of the element inside.
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const shown = useInView(ref);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        shown
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-10 scale-[0.97] motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Counts the first number inside a value like "5.0/5", "176+" or "98%" up from
// zero, keeping any prefix, suffix, decimals and thousands separators.
function CountUp({ value, start, delay = 0 }) {
  const text = String(value);
  const match = text.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)([\s\S]*)$/);
  const [display, setDisplay] = useState(null);

  useEffect(() => {
    if (!match || !start) return;
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr.replace(/,/g, ""));
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
    const format = (n) =>
      prefix +
      n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: numStr.includes(","),
      }) +
      suffix;

    if (prefersReducedMotion()) {
      setDisplay(format(target));
      return;
    }

    let frame = 0;
    const timer = setTimeout(() => {
      const duration = 1800;
      const t0 = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(format(target * eased));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (frame) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  if (!match) return <>{text}</>;
  // Before counting starts, show zeros so the layout doesn't jump.
  const zero = text.replace(/\d/g, "0");
  return <>{display ?? zero}</>;
}

const HEADING_LINES = ["Results that look like", "you, only clearer."];

export default function Results() {
  const panelRef = useRef(null);
  const shown = useInView(panelRef, 0.25);

  return (
    <section id="results" className="bg-[#03271f] bg-[url('/images/bg-hero.png')] bg-cover bg-center bg-fixed bg-no-repeat">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-14 lg:py-20">
      <style>{`
        @keyframes rs-sheen {
          0%   { transform: translateX(-120%) skewX(-18deg); }
          100% { transform: translateX(520%)  skewX(-18deg); }
        }
        .rs-panel:hover .rs-sheen { animation: rs-sheen 1.4s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .rs-panel:hover .rs-sheen { animation: none; }
        }
      `}</style>

      <Reveal>
        <div
          ref={panelRef}
          className="rs-panel relative overflow-hidden rounded-[2rem] bg-white text-[#1a1a1a] border border-black/10 p-8 lg:p-10 flex flex-wrap justify-between gap-8 items-center transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#b419b9a6] hover:shadow-[0_28px_70px_rgba(0,0,0,0.35)]"
        >
          {/* Faint light streak sweeping across on hover */}
          <div
            aria-hidden="true"
            className="rs-sheen pointer-events-none absolute inset-y-0 left-0 w-1/6 -translate-x-full bg-gradient-to-r from-transparent via-[#b419b9]/10 to-transparent"
          />

          {/* Purple line drawing along the top edge when the panel appears */}
          <div
            aria-hidden="true"
            style={{ transitionDelay: shown ? "300ms" : "0ms" }}
            className={`pointer-events-none absolute top-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-[#b419b9a6] via-[#b419b9a6] to-transparent transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              shown ? "scale-x-100" : "scale-x-0 motion-reduce:scale-x-100"
            }`}
          />

          {/* Heading: each line slides up out of a mask */}
          <div className="relative serif text-[28px] lg:text-[36px] leading-[1.05]">
            {HEADING_LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <span
                  style={{ transitionDelay: shown ? `${200 + i * 160}ms` : "0ms" }}
                  className={`block transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    shown
                      ? "translate-y-0"
                      : "translate-y-[115%] motion-reduce:translate-y-0"
                  }`}
                >
                  {line}
                </span>
              </span>
            ))}
          </div>

          <div className="relative flex flex-wrap gap-10">
            {RESULT_STATS.map(({ value, label }, i) => (
              <Reveal key={value} delay={250 + i * 140}>
                <StatCard value={value} label={label} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
      </div>
    </section>
  );
}

function StatCard({ value, label, index }) {
  const ref = useRef(null);
  const shown = useInView(ref, 0.4);

  // Gentle 3D tilt that follows the mouse, written straight to the element.
  const handleMove = (e) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${(-py * 10).toFixed(2)}deg) rotateY(${(
      px * 10
    ).toFixed(2)}deg) translateY(-4px)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="group relative min-w-[184px] -m-3 cursor-default rounded-2xl border border-transparent p-[11px] transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform hover:border-[#b419b9a6] hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
    >
      <div className="serif text-[30px] tabular-nums origin-left transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:text-[#b419b9a6]">
        <CountUp value={value} start={shown} delay={index * 120} />
      </div>

      {/* Underline: draws in on scroll, stretches full width on hover */}
      <span
        aria-hidden="true"
        style={{ transitionDelay: shown ? `${400 + index * 120}ms` : "0ms" }}
        className={`mt-1.5 block h-[2px] w-full origin-left transition-transform duration-700 ease-out motion-reduce:transition-none ${
          shown ? "scale-x-100" : "scale-x-0 motion-reduce:scale-x-100"
        }`}
      >
        <span className="block h-full w-8 bg-[#b419b9a6] transition-[width] duration-500 ease-out group-hover:w-full" />
      </span>

      <div className="text-[11px] tracking-[0.1em] uppercase opacity-70 mt-2 max-w-[160px] leading-[1.4] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
        {label}
      </div>
    </div>
  );
}