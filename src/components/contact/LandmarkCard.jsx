import { SITE } from "../../data/site";
import { Reveal, useTilt } from "./ContactMotion";

export default function LandmarkCard({ delay = 0 }) {
  const tilt = useTilt({ max: 7, lift: 5 });

  return (
    <Reveal from="right" delay={delay}>
      <style>{`
        @keyframes lm-sheen {
          0%   { transform: translateX(-120%) skewX(-18deg); }
          100% { transform: translateX(520%)  skewX(-18deg); }
        }
        .lm-card:hover .lm-sheen { animation: lm-sheen 1.2s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .lm-card:hover .lm-sheen { animation: none; }
        }
      `}</style>

      <div
        ref={tilt.ref}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
        className="lm-card group relative overflow-hidden cursor-default rounded-[1.6rem] bg-[#b419b96e] text-[#1a1a1a] p-6 flex items-center justify-between will-change-transform transition-[transform,box-shadow] duration-300 ease-out hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
      >
        {/* Light streak sweeping across on hover */}
        <div
          aria-hidden="true"
          className="lm-sheen pointer-events-none absolute inset-y-0 left-0 w-1/5 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        <div className="relative">
          <div className="text-[13px] tracking-[0.14em] uppercase opacity-70 transition-all duration-500 ease-out group-hover:tracking-[0.22em] group-hover:opacity-100">
            Landmark
          </div>
          <div className="serif text-[18px] mt-1 transition-transform duration-300 ease-out group-hover:translate-x-1.5">
            {SITE.address.landmark}
          </div>
        </div>

        {/* Arrow badge: soft pulsing ring, arrow exits top-right and re-enters from bottom-left on hover */}
        <div className="relative w-10 h-10 shrink-0">
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-[#094B3D]/40 animate-ping motion-reduce:hidden"
          />
          <div className="relative w-10 h-10 overflow-hidden rounded-full bg-black/10 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:rotate-[8deg]">
            <span className="inline-block transition-all duration-500 ease-out group-hover:translate-x-5 group-hover:-translate-y-5 group-hover:opacity-0">
              ↗
            </span>
            <span
              aria-hidden="true"
              className="absolute inline-block -translate-x-5 translate-y-5 opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
            >
              ↗
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}