import { useCallback, useEffect, useRef, useState } from "react";

// Shared animation helpers for the contact section components.
// Put this file in the same folder as BookingForm / ClinicCard / ClinicMap / LandmarkCard.

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// True once the referenced element has scrolled into view (fires once).
export function useInView(ref, threshold = 0.15) {
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

// Starting positions for the scroll reveal.
const FROM = {
  up: "opacity-0 translate-y-10",
  left: "opacity-0 -translate-x-12",
  right: "opacity-0 translate-x-12",
  scale: "opacity-0 translate-y-8 scale-[0.96]",
};

// Fades/slides children into view. Lives on a wrapper element so it never
// fights the hover/tilt transform of the element inside.
export function Reveal({ children, from = "up", delay = 0, className = "" }) {
  const ref = useRef(null);
  const shown = useInView(ref);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        shown
          ? "opacity-100 translate-x-0 translate-y-0 scale-100"
          : `${FROM[from]} motion-reduce:opacity-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:scale-100`
      } ${className}`}
    >
      {children}
    </div>
  );
}

// A line of text that slides up out of a mask once `shown` is true.
export function MaskLine({ children, shown, delay = 0 }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span
        style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
        className={`block transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          shown ? "translate-y-0" : "translate-y-[115%] motion-reduce:translate-y-0"
        }`}
      >
        {children}
      </span>
    </span>
  );
}

// 3D tilt that follows the mouse. Spread the returned props onto the card and
// give the card `transition-[transform,box-shadow] duration-300 ease-out`.
// Written straight to the element (no React state) so it stays smooth.
export function useTilt({ max = 8, lift = 6, scale = 1 } = {}) {
  const ref = useRef(null);

  const onPointerMove = useCallback(
    (e) => {
      if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(
        px * max
      ).toFixed(2)}deg) translateY(-${lift}px) scale(${scale})`;
    },
    [max, lift, scale]
  );

  const onPointerLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}