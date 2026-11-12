import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP } from "../../data/site";
import posterImage from "../../assets/map-poster.png";

// Interactive MapLibre map. The static poster image sits on top until the map has
// loaded (and stays as the fallback if the style URL can't be reached).
// Map settings (style URL, coordinates, zoom) live in src/data/site.js → MAP.
export default function ClinicMap() {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    // Vector map styles can't load from a file:// page — keep the poster instead.
    if (window.location.protocol === "file:") return;

    let map = null;
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP.styleUrl,
        center: MAP.center,
        zoom: MAP.zoom,
        attributionControl: true,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      map.on("error", () => {});

      map.on("load", () => {
        setLoaded(true);

        // Black dot with popup
        const dot = document.createElement("div");
        dot.className =
          "w-3 h-3 rounded-full bg-[#0B0B0B] border-2 border-white shadow-lg";
        new maplibregl.Marker({ element: dot })
          .setLngLat(MAP.center)
          .setPopup(new maplibregl.Popup({ offset: 16 }).setText(MAP.popupText))
          .addTo(map);

        // Gold "LUXEE DERMA" label above the dot
        const label = document.createElement("div");
        label.innerHTML =
          '<div style="background:#b419b96e;color:white;padding:6px 10px;border-radius:9999px;font-size:10px;letter-spacing:0.1em;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,0.15)">LUXEE DERMA</div>';
        new maplibregl.Marker({ element: label, anchor: "bottom" })
          .setLngLat(MAP.center)
          .addTo(map);

        try {
          map.fitBounds(MAP.bounds, { padding: 60, duration: 800 });
        } catch {
          /* ignore */
        }
      });
    } catch {
      /* WebGL unavailable etc. — poster stays visible */
    }

    return () => {
      try {
        map?.remove();
      } catch {
        /* ignore */
      }
    };
  }, []);

  return (
    <div className="rounded-[2rem] overflow-hidden border border-black/5 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
      <div className="relative h-[360px] w-full">
        <div ref={containerRef} className="h-full w-full" />
        <img
          src={posterImage}
          alt="Map fallback - Livyoung Luxee Derma Manikonda"
          className={`absolute inset-0 z-[1] w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
            loaded ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      <div className="p-4 flex items-center justify-between text-[11px] tracking-[0.12em] uppercase opacity-60">
        <span>Interactive Map • Pan & Zoom</span>
        <a
          href={MAP.googleMapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
