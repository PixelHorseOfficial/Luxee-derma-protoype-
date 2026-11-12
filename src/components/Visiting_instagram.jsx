import { useEffect, useRef, useState } from "react";
import "./Visiting_instagram.css";

// ✏️ ADD YOUR IMAGES HERE
// Put the files in public/images/ and keep these names (or change the paths).
// The 3rd one is the big centre picture; the others are the small side pictures.
const IMAGES = [
  { src: "/images/instagram_6.png", alt: "Glowing skin close-up" },
  { src: "/images/instagram_7.png", alt: "Hydrated, radiant skin" },
  { src: "/images/instagram_8.png", alt: "Skincare routine", large: true },
  { src: "/images/instagram_9.png", alt: "Neck and collarbone care" },
  { src: "/images/instagram_10.png", alt: "Applying moisturiser" },
];

// Your clinic's Instagram page. Used by the button and the pictures.
const INSTAGRAM_URL = "https://www.instagram.com/dr.dluxeederma/";

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
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return shown;
}

export default function VisitingInstagram({
  images = IMAGES,
  href = INSTAGRAM_URL,
  title = ["Follow Us On Instagram", "For SkinCare Solutions"],
  buttonLabel = "Visit Instagram",
}) {
  const ref = useRef(null);
  const shown = useInView(ref);

  return (
    <section ref={ref} className={`ig ${shown ? "is-in" : ""}`} aria-labelledby="ig-title">
      <h2 id="ig-title" className="ig__title serif">
        {title.map((line) => (
          <span key={line} className="ig__line">
            {line}
          </span>
        ))}
      </h2>

      <div className="ig__row">
        {images.map(({ src, alt, large }, i) => (
          <a
            key={src}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`ig__tile ${large ? "ig__tile--lg" : ""}`}
            style={{ "--i": i }}
            aria-label={`${alt} — open Instagram`}
          >
            <img
              src={src}
              alt={alt}
              loading="lazy"
              draggable={false}
              onError={(e) => (e.currentTarget.style.visibility = "hidden")}
            />
          </a>
        ))}
      </div>

      <a
        className="ig__btn"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {buttonLabel}
      </a>
    </section>
  );
}