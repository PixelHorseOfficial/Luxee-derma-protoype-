import { useState } from "react";
import useToast from "./hooks/useToast";
import { scrollToSection } from "./lib/navigation";
import { SITE } from "./data/site";

import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Before_and_after_image from "./components/Before_and_after_image";
import Technology from "./components/Technology";
import Doctors from "./components/Doctors";
import Reviews from "./components/Reviews";
import Results from "./components/Results";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Toast from "./components/Toast";
import Visiting_instagram from "./components/Visiting_instagram";
import ServicesMarquee from "./components/ServicesMarquee";


export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const { message, showToast } = useToast();

  const goTo = (id) => {
    setActiveSection(id);
    scrollToSection(id);
  };

  const goHome = () => {
    setActiveSection("hero");
    showToast(`Welcome to ${SITE.name} — ${SITE.tagline}`, 2500);
    try {
      window.history.pushState(null, "", window.location.pathname + "?top=" + Date.now());
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#0B0B0B] selection:bg-[#C8A97A]/30">
      <AnnouncementBar />
      <Header activeSection={activeSection} onNavigate={goTo} onLogoClick={goHome} />

      <main>
        <Hero onNavigate={goTo} />
        <ServicesMarquee  />
        <Services />
        <Before_and_after_image />
        <Technology />
        <Doctors />
        <Visiting_instagram />
        <Reviews />
        <Results />
        <Contact onBooked={showToast} />
      </main>

      <Footer />
      <WhatsAppButton />
      <Toast message={message} />
    </div>
  );
}
