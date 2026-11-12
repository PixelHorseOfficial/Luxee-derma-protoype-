# Livyoung Luxee Derma — React (Vite + Tailwind v3)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## Where to edit what

| I want to change…                          | Open                                   |
| ------------------------------------------ | -------------------------------------- |
| Phone, WhatsApp, address, hours, rating    | `src/data/site.js` → `SITE`            |
| Map style URL, coordinates, zoom           | `src/data/site.js` → `MAP`             |
| Header menu items                          | `src/data/nav.js`                      |
| Top black strip                            | `src/components/AnnouncementBar.jsx`   |
| Hero headline, buttons, floating cards     | `src/components/Hero.jsx` (+ `data/hero.js` for the 3 stats) |
| Treatment cards                            | `src/data/services.js`                 |
| Technology checklist                       | `src/data/technology.js`               |
| Doctors                                    | `src/data/doctors.js`                  |
| Review cards                               | `src/data/reviews.js`                  |
| Results numbers                            | `src/data/results.js`                  |
| Booking form fields / dropdown / submit    | `src/components/contact/BookingForm.jsx` (+ `data/booking.js`) |
| Clinic card / map / landmark               | `src/components/contact/*.jsx`         |
| Footer                                     | `src/components/Footer.jsx`            |
| Photos                                     | `src/assets/` (keep the file names, or update the imports) |
| Fonts, global CSS                          | `index.html`, `src/index.css`          |

Section order is set in `src/App.jsx` — reorder or remove sections there.
