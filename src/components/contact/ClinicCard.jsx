import { SITE } from "../../data/site";
import { Reveal, MaskLine, useInView, useTilt } from "./ContactMotion";
import { useRef } from "react";

// One info row: slides in on scroll, nudges right on hover while its icon spins.
function InfoRow({ icon, children, delay, shown }) {
  return (
    <div
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        shown
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-8 motion-reduce:opacity-100 motion-reduce:translate-x-0"
      }`}
    >
      <div className="group flex gap-3 cursor-default transition-transform duration-300 ease-out hover:translate-x-1.5">
        <span className="inline-block opacity-40 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-[360deg]">
          {icon}
        </span>
        <span className="transition-colors duration-300 group-hover:text-black">
          {children}
        </span>
      </div>
    </div>
  );
}

// White card with clinic name, address rows and Call / WhatsApp buttons.
export default function ClinicCard({ delay = 0 }) {
  const tilt = useTilt({ max: 6, lift: 6 });
  const inViewRef = useRef(null);
  const shown = useInView(inViewRef, 0.2);

  return (
    <Reveal from="right" delay={delay}>
      <style>{`
        @keyframes cc-wiggle {
          0%, 100% { transform: rotate(0); }
          20% { transform: rotate(-18deg); }
          40% { transform: rotate(16deg); }
          60% { transform: rotate(-12deg); }
          80% { transform: rotate(8deg); }
        }
        @keyframes cc-bounce {
          0%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
          70% { transform: translateY(1px); }
        }
        @keyframes cc-shine {
          0%   { transform: translateX(-150%) skewX(-20deg); }
          55%, 100% { transform: translateX(520%) skewX(-20deg); }
        }
        @keyframes cc-twinkle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        .cc-btn:hover .cc-wiggle { animation: cc-wiggle 0.7s ease-in-out; }
        .cc-btn:hover .cc-bounce { animation: cc-bounce 0.6s ease-out; }
        .cc-shine { animation: cc-shine 5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .cc-btn:hover .cc-wiggle, .cc-btn:hover .cc-bounce, .cc-shine { animation: none; }
        }
      `}</style>

      <div
        ref={(el) => {
          tilt.ref.current = el;
          inViewRef.current = el;
        }}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
        className="rounded-[2rem] bg-white border border-black/5 p-7 lg:p-8 will-change-transform transition-[transform,box-shadow] duration-300 ease-out hover:shadow-[0_28px_70px_rgba(0,0,0,0.10)]"
      >
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="serif text-[22px] leading-[1.15]">
              <MaskLine shown={shown} delay={100}>
                {SITE.name}
              </MaskLine>
            </div>
            <div
              style={{ transitionDelay: shown ? "300ms" : "0ms" }}
              className={`text-[12px] mt-1 tracking-[0.04em] transition-all duration-700 motion-reduce:transition-none ${
                shown
                  ? "opacity-60 translate-y-0"
                  : "opacity-0 translate-y-2 motion-reduce:opacity-60 motion-reduce:translate-y-0"
              }`}
            >
              {SITE.address.street}
            </div>
          </div>

          {/* Badge with a live, pulsing dot */}
          <div
            style={{ transitionDelay: shown ? "350ms" : "0ms" }}
            className={`inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase bg-[#b419b96e] text-[#0B0B0B] px-3 py-1 rounded-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none hover:scale-105 ${
              shown
                ? "opacity-100 scale-100"
                : "opacity-0 scale-50 motion-reduce:opacity-100 motion-reduce:scale-100"
            }`}
          >
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-emerald-600 opacity-75 animate-ping motion-reduce:hidden" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-700" />
            </span>
            Available Now
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 text-[13px]">
          <InfoRow icon="📍" delay={450} shown={shown}>
            {SITE.address.near}
          </InfoRow>
          <InfoRow icon="🕒" delay={560} shown={shown}>
            {SITE.hours}
          </InfoRow>
          <InfoRow icon="★" delay={670} shown={shown}>
            {SITE.rating.score} • {SITE.rating.count} Ratings • Claimed Business •
            Gentle Care
          </InfoRow>
        </div>

        <div
          style={{ transitionDelay: shown ? "800ms" : "0ms" }}
          className={`mt-6 flex gap-3 transition-all duration-700 ease-out motion-reduce:transition-none ${
            shown
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0"
          }`}
        >
          <a
            href={SITE.phoneHref}
            className="cc-btn group relative flex-1 h-12 overflow-hidden rounded-full bg-[#b419b96e] text-[#0B0B0B] flex items-center justify-center gap-2 text-[12px] tracking-[0.12em] uppercase transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(232,174,116,0.55)] active:translate-y-0 active:scale-95"
          >
            <span
              aria-hidden="true"
              className="cc-shine pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-white/40 blur-[2px]"
            />
            <span aria-hidden="true" className="cc-wiggle relative inline-block">
              📞
            </span>
            <span className="relative">Call Clinic</span>
          </a>
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="cc-btn group relative flex-1 h-12 overflow-hidden rounded-full bg-[#b419b96e] text-[#0B0B0B] flex items-center justify-center gap-2 text-[12px] tracking-[0.12em] uppercase transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(232,174,116,0.55)] active:translate-y-0 active:scale-95"
          >
            <span
              aria-hidden="true"
              className="cc-shine pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-white/40 blur-[2px]"
              style={{ animationDelay: "1.2s" }}
            />
            <span aria-hidden="true" className="cc-bounce relative inline-block">
              💬
            </span>
            <span className="relative">WhatsApp</span>
          </a>
        </div>
      </div>
    </Reveal>
  );
}