import { useEffect, useRef, useState } from "react";
import { REVIEWS } from "../data/reviews";
import "./Reviews.css";

// Build the review sequence: text reviews only
function buildItems() {
  const items = [];
  REVIEWS.forEach((review, i) => {
    items.push({ kind: "text", key: `t${i}`, review });
  });
  return items;
}

/* ---------- small scroll-reveal for the heading ---------- */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`rv-reveal ${shown ? "is-shown" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

const InstagramIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
  </svg>
);

const Stars = () => (
  <div className="rv-stars" aria-label="5 out of 5 stars">
    {[0, 1, 2, 3, 4].map((n) => (
      <svg key={n} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9L12 2.5z" />
      </svg>
    ))}
  </div>
);

const initials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/* ---------- cards ---------- */
function TextCard({ review }) {
  return (
    <div className="rv-card">
      <div>
        <Stars />
        <p className="rv-card__text serif">"{review.text}"</p>
      </div>

      <div className="rv-card__footer">
        <span className="rv-card__avatar">{initials(review.name)}</span>
        <div className="rv-card__info">
          <div className="rv-card__name">{review.name}</div>
          <div className="rv-card__tag">{review.tag}</div>
        </div>
        <InstagramIcon className="rv-card__ig" />
      </div>
    </div>
  );
}

/* ---------- section ---------- */
export default function Reviews() {
  const items = buildItems();
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - (trackRef.current?.offsetLeft || 0));
    setScrollLeft(trackRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - (trackRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5; // Adjust speed of drag
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  // Rendered twice so the -50% translate loops seamlessly.
  const renderTrack = (suffix) =>
    items.map((item) => (
      <div key={`${item.key}-${suffix}`} className="rv-item" aria-hidden={suffix === "b"}>
        <TextCard review={item.review} />
      </div>
    ));

  return (
    <section id="reviews" className="rv">
      <div className="rv__container">
        <div className="rv__panel">
          {/* Heading */}
          <div className="rv__head">
            <Reveal>
              <h2 className="rv__title serif">Loved By Thousands</h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="rv__lead">
                Discover why thousands trust us as part of their everyday skincare ritual and
                routine.
              </p>
            </Reveal>
          </div>

          {/* Draggable scrolling row */}
          <Reveal delay={240} className="rv-row">
            <div
              className={`rv-marquee ${isDragging ? "is-dragging" : ""}`}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              <div
                ref={trackRef}
                className={`rv-track ${isDragging ? "dragging" : ""}`}
                style={{ cursor: isDragging ? "grabbing" : "grab" }}
              >
                {renderTrack("a")}
                {renderTrack("b")}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}