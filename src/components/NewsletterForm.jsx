import { useState } from "react";
import { Mail } from "lucide-react";
import { apiRequest } from "../lib/api.js";

const initial = { email: "", firstName: "", lastName: "" };

export function NewsletterForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setSubmitted(false);
    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = "Enter a valid email address.";
    if (!values.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!values.lastName.trim()) nextErrors.lastName = "Last name is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setIsSubmitting(true);
      setServerError("");
      try {
        await apiRequest("/newsletter/subscribe", {
          method: "POST",
          body: JSON.stringify({
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
          }),
        });
        // TODO: connect subscriber consent records to the approved email platform.
        setSubmitted(true);
        setValues(initial);
      } catch (error) {
        setServerError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section id="newsletter" className="section-band bg-berry py-14 text-white">
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:px-6">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sunshine">Newsletter</p>
          <h2 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl">
            Get Woodlands news, offers and event updates
          </h2>
          <p className="mt-3 max-w-xl leading-7 text-white/90">
            Join the mailing list for family offers, seasonal events and park news.
          </p>
        </div>
        <form className="rounded-lg border border-white/20 bg-white p-5 text-ink shadow-lift" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-extrabold">Email Address *</span>
              <input
                className="focus-ring min-h-12 rounded-lg border border-slate-300 px-3"
                type="email"
                name="EMAIL"
                value={values.email}
                onChange={(event) => setField("email", event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && <span id="email-error" className="text-sm font-bold text-berry">{errors.email}</span>}
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold">First Name *</span>
              <input
                className="focus-ring min-h-12 rounded-lg border border-slate-300 px-3"
                type="text"
                name="FNAME"
                value={values.firstName}
                onChange={(event) => setField("firstName", event.target.value)}
                aria-invalid={Boolean(errors.firstName)}
              />
              {errors.firstName && <span className="text-sm font-bold text-berry">{errors.firstName}</span>}
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-extrabold">Last Name *</span>
              <input
                className="focus-ring min-h-12 rounded-lg border border-slate-300 px-3"
                type="text"
                name="LNAME"
                value={values.lastName}
                onChange={(event) => setField("lastName", event.target.value)}
                aria-invalid={Boolean(errors.lastName)}
              />
              {errors.lastName && <span className="text-sm font-bold text-berry">{errors.lastName}</span>}
            </label>
          </div>
          <button
            className="focus-ring mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg bg-sunshine px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-ink shadow-button transition hover:-translate-y-0.5 hover:bg-ember hover:text-white"
            type="submit"
          >
            <Mail aria-hidden="true" size={18} />
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
          {serverError && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
              {serverError}
            </p>
          )}
          {submitted && (
            <p className="mt-4 rounded-lg border border-leaf/30 bg-leaf/10 px-3 py-2 text-sm font-bold text-canopy">
              Thank you for signing up.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
