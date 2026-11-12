import BookingForm from "./contact/BookingForm";
import ClinicCard from "./contact/ClinicCard";
import ClinicMap from "./contact/ClinicMap";
import LandmarkCard from "./contact/LandmarkCard";

// "Contact" section = booking form (left) + clinic details, map and landmark (right).
// Each piece lives in its own file under ./contact/
// The `delay` props stagger the scroll-in animation (milliseconds).
export default function Contact({ onBooked }) {
  return (
    <section id="contact" className="bg-[#bd99f76c] border-t border-black/5">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 lg:gap-12">
        <BookingForm onSuccess={onBooked} delay={0} />

        <div className="space-y-6">
          <ClinicCard delay={150} />
          <ClinicMap delay={300} />
          <LandmarkCard delay={450} />
        </div>
      </div>
    </section>
  );
}