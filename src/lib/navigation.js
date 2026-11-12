// Smooth-scrolls to a section by id and updates the URL hash.
export function scrollToSection(id) {
  try {
    const url = id === "hero" || id === "top" ? window.location.pathname : `#${id}`;
    window.history.pushState(null, "", url);
  } catch {
    /* pushState can fail in sandboxed iframes — safe to ignore */
  }

  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
