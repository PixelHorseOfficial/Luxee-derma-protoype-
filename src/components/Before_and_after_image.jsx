import { useCallback, useRef, useState } from "react";
import "./Before_and_after_image.css";

// ✏️ ADD YOUR IMAGE PATHS HERE
// Put your images in the same folder as this file (or in /public) and update the names below.
const BEFORE_IMAGE = "./images/before_image.png"; // <-- your "before" image
const AFTER_IMAGE = "./images/after_image.png";   // <-- your "after" image

/**
 * Before / After image slider.
 * - Full-width track; the image sits centered and is revealed by a vertical divider.
 * - Left of the divider = "before", right = "after".
 * - Drag the round handle (mouse, touch, pen) or use ← → keys.
 */
export default function BeforeAndAfterImage({
  beforeImage = BEFORE_IMAGE,
  afterImage = AFTER_IMAGE,
  beforeLabel = "Before",
  afterLabel = "After",
  initialPosition = 50, // percent of the track
  alt = "Before and after comparison",
  aspectRatio = "1150 / 650", // width / height of the card on desktop, e.g. "16 / 9"
  objectPosition = "center", // e.g. "center top" to keep the face in view
  // Nudge one photo so the faces line up. x / y are % of the card, scale is a multiplier.
  beforeAdjust = { x: 0, y: 0, scale: 1 },
  afterAdjust = { x: 0, y: 0, scale: 1 },
  calibrate = false, // true = show sliders under the card to find the right numbers
}) {
  const frameRef = useRef(null);
  const [pos, setPos] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const [tune, setTune] = useState({ x: 0, y: 0, scale: 1 });
  const after = calibrate ? tune : afterAdjust;
  const imgStyle = (a) => ({
    transform: `translate(${a.x}%, ${a.y}%) scale(${a.scale})`,
  });

  const update = useCallback((clientX) => {
    const rect = frameRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    update(e.clientX);
  };
  const onPointerMove = (e) => dragging && update(e.clientX);
  const onPointerUp = () => setDragging(false);

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 2));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 2));
  };

  return (
    <>
    <section
      className={`ba ${dragging ? "is-dragging" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ "--pos": `${pos}%`, "--ratio": aspectRatio, "--obj-pos": objectPosition }}
    >
      <div className="ba__frame" ref={frameRef}>
        <div className="ba__media">
          {/* After image: always full, sits underneath */}
          <img className="ba__img" src={afterImage} alt={alt} draggable={false} style={imgStyle(after)} />

          {/* Before image: identical box, clipped to the left of the divider */}
          <div className="ba__before">
            <img className="ba__img" src={beforeImage} alt="" draggable={false} style={imgStyle(beforeAdjust)} />
          </div>

          <div className="ba__line" />
          <span className="ba__label ba__label--before">{beforeLabel}</span>
          <span className="ba__label ba__label--after">{afterLabel}</span>
        </div>

        <button
          type="button"
          className="ba__handle"
          role="slider"
          aria-label="Drag to compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={onKeyDown}
        >
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M5 3 1.5 7 5 11M9 3l3.5 4L9 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>

    {calibrate && (
      <div className="ba__tune">
        {[
          ["x", "Move left / right (%)", -15, 15, 0.1],
          ["y", "Move up / down (%)", -15, 15, 0.1],
          ["scale", "Zoom", 0.8, 1.3, 0.005],
        ].map(([key, label, min, max, step]) => (
          <label key={key}>
            <span>{label}: {Number(tune[key]).toFixed(key === "scale" ? 3 : 1)}</span>
            <input
              type="range" min={min} max={max} step={step} value={tune[key]}
              onChange={(e) => setTune((t) => ({ ...t, [key]: parseFloat(e.target.value) }))}
            />
          </label>
        ))}
        <code>
          afterAdjust={"{{ x: " + tune.x.toFixed(1) + ", y: " + tune.y.toFixed(1) + ", scale: " + tune.scale.toFixed(3) + " }}"}
        </code>
      </div>
    )}
    </>
  );
}