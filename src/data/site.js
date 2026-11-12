// Clinic-wide facts used in several places (top bar, contact card, footer, buttons).
// Edit here once and it updates everywhere.

export const SITE = {
  name: "DR D.Luxee Derma",
  logo: { line1: "", line2: "DR D.LUXEE DERMA" },
  tagline: "Gentle Care, Elite Results",

  rating: { score: "5.0", count: 176 },

  address: {
    topBar: "Plot No.3, Manikonda, Hyderabad — Above Domino's, Marrichettu Junction",
    street: "Plot No.3, 3rd Floor, Laxmi Nagar Colony, Manikonda",
    full: "Plot No.3, 3rd Floor, Laxmi Nagar Colony, Manikonda, Hyderabad-500089",
    near: "Near Marrichettu Junction, Above Domino's, Hyderabad-500089",
    landmark: "Above Domino's, Marrichettu Junction",
  },

  hours: "Mon - Sun • 10:00 AM - 8:30 PM • Consult by appointment",

  // NOTE: placeholder number from the original file — replace with the real one.
  phoneHref: "tel:+919000000000",
  whatsappHref: "https://wa.me/919000000000",
};

export const MAP = {
  // The original file pointed at a Meta-hosted style URL that only works inside their
  // artifact viewer:
  // "https://external.xx.fbcdn.net/maps/vt/style/canterbury_1_0/?locale=en_US&_nc_client_id=metaai_artifact&_nc_client_caller=MetaAI"
  // OpenFreeMap is a free, key-less MapLibre style. Swap in MapTiler/Stadia/etc. if you prefer.
  styleUrl: "https://tiles.openfreemap.org/styles/liberty",

  center: [78.38371, 17.40733], // [longitude, latitude]
  zoom: 15,
  bounds: [
    [78.38, 17.404],
    [78.387, 17.411],
  ],
  popupText: "DR D.Luxee Derma - Manikonda",
  googleMapsHref: "https://maps.google.com/?q=17.40733,78.38371",
};
