import { SITE } from "../data/site";

// Floating round button, bottom-right of the screen.
export default function WhatsAppButton() {
  return (
    <a
      href={SITE.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#0B0B0B] text-white shadow-[0_16px_40px_rgba(0,0,0,0.25)] flex items-center justify-center hover:scale-105 transition"
    >
      <span className="text-[20px]">💬</span>
    </a>
  );
}
