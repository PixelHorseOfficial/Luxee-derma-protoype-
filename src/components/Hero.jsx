import { useEffect, useState } from "react";
import { HERO_STATS } from "../data/hero";
import { SITE } from "../data/site";
// Video lives in public/images/, so it is referenced by URL (no import needed).
const HERO_VIDEO = "/images/hero-sec-bg-3.mp4";

// Fades and lifts children in once the hero has mounted, with a stagger delay.
function Rise({ show, delay = 0, className = "", children }) {
  return (
    <div
      style={{ transitionDelay: show ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8 motion-reduce:opacity-100 motion-reduce:translate-y-0"
      } ${className}`}
    >
      {children}
    </div>
  )

  3333333333333333
}

export default function Hero({ onNavigate }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-screen items-center overflow-hidden bg-neutral-900 text-white"
    >
      {/* Background video (muted, looping) */}
      <video
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center]"
      />


      <div className="mx-auto w-full max-w-[1280px] px-6 pb-16 pt-32 lg:px-8 lg:pb-24 lg:pt-36">
        <div className="max-w-[620px]">
    
        </div>
      </div>
    </section>
  );
}