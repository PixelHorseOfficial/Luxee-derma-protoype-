import "./ServicesMarquee.css";

const DEFAULT_SERVICES = [
  "Pigmentation Correction",
  "Facial Rejuvenation & Hydrafacial",
  "Hair Restoration PRP + Mesotherapy",
  "Pain-Free Laser Hair Removal",
  "Scar & Keloid Therapy + MNRF",
  "Intimate Wellness",
];

// Rendered twice inside the track so translating by -50% loops seamlessly.
function MarqueeGroup({ items, hidden = false }) {
  return (
    <ul className="svc-marquee__group" aria-hidden={hidden || undefined}>
      {items.map((label) => (
        <li key={label} className="svc-marquee__item">
          <span className="svc-marquee__label">{label}</span>
          <span className="svc-marquee__dot" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}

export default function ServicesMarquee({
  items = DEFAULT_SERVICES,
  speed = 40, // seconds per loop; higher = slower
}) {
  return (
    <section
      className="svc-marquee"
      aria-label="Our dermatology services"
      style={{ "--svc-marquee-speed": `${speed}s` }}
    >
      <div className="svc-marquee__band">
        <div className="svc-marquee__viewport">
          <div className="svc-marquee__track">
            <MarqueeGroup items={items} />
            <MarqueeGroup items={items} hidden />
          </div>
        </div>
      </div>
    </section>
  );
}