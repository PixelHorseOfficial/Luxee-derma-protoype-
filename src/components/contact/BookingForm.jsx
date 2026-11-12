import { useRef, useState } from "react";
import { CONCERN_OPTIONS } from "../../data/booking";
import { Reveal, MaskLine, useInView } from "./ContactMotion";
import "./BookingForm.css";

const EMPTY_FORM = { name: "", phone: "", concern: "", date: "", message: "" };

// Shared look for the pill-shaped fields (styles live in BookingForm.css).
const inputClass = (hasError) =>
  `bk-input ${hasError ? "bk-border-err" : "bk-border-ok"}`;

// One labelled field: rises in on scroll, label warms up on focus,
// shakes and shows a message when validation fails.
function Field({ label, error, shake, delay = 0, children }) {
  return (
    <Reveal delay={delay}>
      <label className="bk-field">
        <span className="bk-label">{label}</span>
        <div key={error ? shake : 0} className={error ? "bk-shake" : ""}>
          {children}
        </div>
        {error && <span className="bk-error">{error}</span>}
      </label>
    </Reveal>
  );
}

export default function BookingForm({ onSuccess, delay = 0 }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(0);

  const cardRef = useRef(null);
  const shown = useInView(cardRef, 0.2);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Required";
    if (!form.phone.trim() || form.phone.length < 10)
      next.phone = "Valid phone required";
    if (!form.concern) next.concern = "Select concern";
    setErrors(next);
    if (Object.keys(next).length) setShake((n) => n + 1);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // TODO: send `form` to your backend / WhatsApp / CRM here.
    onSuccess?.(
      "Consultation requested — our care coordinator will call you within 30 minutes."
    );
    setForm(EMPTY_FORM);
  };

  return (
    <Reveal from="left" delay={delay}>
      <div ref={cardRef} className="bk-card">
        <div
          style={{ transitionDelay: shown ? "100ms" : "0ms" }}
          className={`bk-eyebrow ${shown ? "is-shown" : ""}`}
        >
          Private Consultation
        </div>

        <h2 className="serif bk-title">
          <MaskLine shown={shown} delay={200}>
            Book Your
          </MaskLine>
          <MaskLine shown={shown} delay={340}>
            Skin Assessment
          </MaskLine>
        </h2>

        <p
          style={{ transitionDelay: shown ? "500ms" : "0ms" }}
          className={`bk-sub ${shown ? "is-shown" : ""}`}
        >
          Response within 30 minutes • 10:00 AM - 8:30 PM • All days
        </p>

        <form onSubmit={handleSubmit} className="bk-form">
          <div className="bk-grid">
            <Field label="Full Name" error={errors.name} shake={shake} delay={250}>
              <input
                value={form.name}
                onChange={update("name")}
                placeholder="Your name"
                className={inputClass(errors.name)}
              />
            </Field>

            <Field label="Phone" error={errors.phone} shake={shake} delay={340}>
              <input
                value={form.phone}
                onChange={update("phone")}
                placeholder="+91 • • • • •"
                className={inputClass(errors.phone)}
              />
            </Field>
          </div>

          <div className="bk-grid">
            <Field label="Concern" error={errors.concern} shake={shake} delay={430}>
              <select
                value={form.concern}
                onChange={update("concern")}
                className={inputClass(errors.concern)}
              >
                <option value="">Select concern</option>
                {CONCERN_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>

            <Field label="Preferred Date" shake={shake} delay={520}>
              <input
                type="date"
                value={form.date}
                onChange={update("date")}
                className={inputClass(false)}
              />
            </Field>
          </div>

          <Reveal delay={610}>
            <label className="bk-field">
              <span className="bk-label">Message (optional)</span>
              <textarea
                value={form.message}
                onChange={update("message")}
                placeholder="Tell us about previous treatments, skin type, etc."
                rows={3}
                className="bk-textarea"
              />
            </label>
          </Reveal>

          <Reveal delay={700}>
            <button type="submit" className="bk-submit">
              {/* light streak that passes across every few seconds */}
              <span aria-hidden="true" className="bk-shine" />
              <span className="bk-submit__label">
                Request Callback • Free Assessment
                <span aria-hidden="true" className="bk-arrow">
                  →
                </span>
              </span>
            </button>
          </Reveal>

          <div className="bk-note">
            By booking, you agree to gentle, honest care — no spam, no hard sell.
          </div>
        </form>
      </div>
    </Reveal>
  );
}