import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, LockKeyhole, ShieldCheck, ShoppingBasket, Ticket } from "lucide-react";
import {
  ticketTypeSeedData as fallbackTicketTypes,
  ticketIntro,
  ticketSource,
  ticketTerms,
  wristbandInformation,
} from "../data/tickets/ticketing.js";
import { apiRequest } from "../lib/api.js";
import { CtaButton } from "./Button.jsx";
import { SectionHeading } from "./Sections.jsx";

function makeSelection(ticketTypes) {
  return {
    visitDate: "",
    quantities: Object.fromEntries(ticketTypes.map((ticket) => [String(ticket.id), 0])),
  };
}

function passwordStrengthMessage(password) {
  if (password.length < 10) return "Password must be at least 10 characters.";
  if (!/[a-z]/.test(password)) return "Password must include a lowercase letter.";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include a number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must include a symbol.";
  return "";
}

export function TicketingFlow({ mode = "overview", onNavigate, session, setSession }) {
  const [ticketTypes, setTicketTypes] = useState(fallbackTicketTypes);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [register, setRegister] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [selection, setSelection] = useState(session.selection || makeSelection(fallbackTicketTypes));
  const [authError, setAuthError] = useState("");
  const [flowError, setFlowError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    apiRequest("/tickets/types")
      .then((data) => {
        if (!isMounted || !data.ticketTypes?.length) return;
        setTicketTypes(data.ticketTypes);
        setSelection((current) => ({
          ...current,
          quantities: {
            ...Object.fromEntries(data.ticketTypes.map((ticket) => [String(ticket.id), 0])),
            ...(current.quantities || {}),
          },
        }));
      })
      .catch(() => setTicketTypes(fallbackTicketTypes));

    apiRequest("/auth/me")
      .then((data) => {
        if (isMounted && data.user) updateSession({ user: data.user });
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSession = (patch) => {
    setSession((current) => ({ ...current, ...patch }));
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setAuthError("");
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(login),
      });
      updateSession({ user: data.user });
      onNavigate("/tickets/select");
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitRegister = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setAuthError("");
    try {
      const firstName = register.firstName.trim();
      const lastName = register.lastName.trim();
      const email = register.email.trim().toLowerCase();
      if (!firstName || !lastName) throw new Error("First name and last name are required.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
      const passwordError = passwordStrengthMessage(register.password);
      if (passwordError) throw new Error(passwordError);
      if (register.password !== register.confirmPassword) throw new Error("Passwords do not match.");
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          password: register.password,
        }),
      });
      updateSession({ user: data.user });
      onNavigate("/tickets/select");
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitSelection = (event) => {
    event.preventDefault();
    const selectedCount = ticketTypes.reduce((total, ticketType) => total + Number(selection.quantities[String(ticketType.id)] || 0), 0);
    if (!selectedCount) {
      setFlowError("Select at least one ticket quantity.");
      return;
    }
    setFlowError("");
    updateSession({ selection });
    onNavigate("/tickets/checkout");
  };

  const confirmOrder = async () => {
    const currentSelection = session.selection || selection;
    const items = ticketTypes
      .map((ticketType) => ({
        ticketTypeId: ticketType.id,
        quantity: Number(currentSelection.quantities?.[String(ticketType.id)] || 0),
      }))
      .filter((item) => item.quantity > 0);

    setIsSubmitting(true);
    setFlowError("");
    try {
      // TODO: connect this reservation step to the approved production payment gateway.
      const data = await apiRequest("/tickets/bookings", {
        method: "POST",
        body: JSON.stringify({
          visitDate: currentSelection.visitDate,
          items,
        }),
      });
      updateSession({
        selection: currentSelection,
        booking: data.booking,
        confirmationRef: data.booking.reference,
      });
      onNavigate("/tickets/confirmation");
    } catch (error) {
      setFlowError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if ((mode === "select" || mode === "checkout") && !session.user) {
    return (
      <>
        <TicketHero mode={mode} onNavigate={onNavigate} />
        <AccountRequired onNavigate={onNavigate} />
      </>
    );
  }

  return (
    <>
      <TicketHero mode={mode} onNavigate={onNavigate} />
      {mode === "overview" && <TicketOverview onNavigate={onNavigate} />}
      {mode === "login" && (
        <TicketFormShell title="Login" icon={LockKeyhole}>
          <form className="grid gap-4" onSubmit={submitLogin}>
            <Field label="Email Address" type="email" value={login.email} onChange={(value) => setLogin((current) => ({ ...current, email: value }))} required />
            <Field label="Password" type="password" value={login.password} onChange={(value) => setLogin((current) => ({ ...current, password: value }))} required />
            {authError && <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{authError}</p>}
            <button className="focus-ring inline-flex min-h-12 items-center justify-center rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button transition hover:-translate-y-0.5" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging In..." : "Login And Continue"}
            </button>
          </form>
        </TicketFormShell>
      )}
      {mode === "register" && (
        <TicketFormShell title="Create Account" icon={ShieldCheck}>
          <form className="grid gap-4" onSubmit={submitRegister}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First Name" value={register.firstName} onChange={(value) => setRegister((current) => ({ ...current, firstName: value }))} required />
              <Field label="Last Name" value={register.lastName} onChange={(value) => setRegister((current) => ({ ...current, lastName: value }))} required />
            </div>
            <Field label="Email Address" type="email" value={register.email} onChange={(value) => setRegister((current) => ({ ...current, email: value }))} required />
            <Field label="Password" type="password" value={register.password} onChange={(value) => setRegister((current) => ({ ...current, password: value }))} required minLength={10} />
            <Field label="Confirm Password" type="password" value={register.confirmPassword} onChange={(value) => setRegister((current) => ({ ...current, confirmPassword: value }))} required minLength={10} />
            <p className="rounded-lg bg-sunshine/25 p-3 text-xs font-bold uppercase tracking-wide text-ink">
              Use 10+ characters with uppercase, lowercase, number and symbol. Do not use a real payment password; this site stores only reservation requests until payment integration is approved.
            </p>
            {authError && <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{authError}</p>}
            <button className="focus-ring inline-flex min-h-12 items-center justify-center rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button transition hover:-translate-y-0.5" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </TicketFormShell>
      )}
      {mode === "select" && (
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.45fr]">
            <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" onSubmit={submitSelection}>
              <SectionHeading eyebrow="Tickets" title="Select Tickets" text="Choose a visit date and ticket quantities. Final availability is confirmed before payment is requested." />
              <Field label="Visit Date" type="date" value={selection.visitDate} onChange={(value) => setSelection((current) => ({ ...current, visitDate: value }))} required />
              <div className="mt-6 grid gap-4">
                {ticketTypes.map((ticketType) => (
                  <article key={ticketType.id} className="rounded-lg border border-slate-200 bg-mist p-4">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <h2 className="font-display text-2xl font-black text-ink">{ticketType.name}</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-700">{ticketType.description}</p>
                        <p className="mt-2 text-sm font-black text-berry">{ticketType.priceLabel || ticketType.price_label}</p>
                      </div>
                      <label className="grid gap-2">
                        <span className="text-sm font-extrabold">Quantity</span>
                        <input
                          className="focus-ring min-h-12 w-28 rounded-lg border border-slate-300 px-3"
                          type="number"
                          min="0"
                          max="20"
                          value={selection.quantities[String(ticketType.id)] || 0}
                          onChange={(event) =>
                            setSelection((current) => ({
                              ...current,
                              quantities: { ...current.quantities, [String(ticketType.id)]: Number(event.target.value) },
                            }))
                          }
                        />
                      </label>
                    </div>
                  </article>
                ))}
              </div>
              {flowError && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{flowError}</p>}
              <button className="focus-ring mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-sunshine px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-ink shadow-button transition hover:-translate-y-0.5" type="submit">
                <ShoppingBasket aria-hidden="true" size={18} />
                Continue To Summary
              </button>
            </form>
            <TicketSummary selection={selection} ticketTypes={ticketTypes} />
          </div>
        </section>
      )}
      {mode === "checkout" && (
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.45fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <SectionHeading eyebrow="Checkout" title="Review Your Reservation" text="Check the details below before sending your ticket reservation request." />
              <div className="mt-6 grid gap-3">
                <p className="rounded-lg bg-sunshine/25 p-3 text-sm font-bold text-ink">
                  Payment is not requested on this step. Woodlands will confirm availability before any payment is taken.
                </p>
              </div>
              {flowError && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{flowError}</p>}
              <div className="mt-6 flex flex-wrap gap-3">
                <CtaButton href="/tickets/select" onNavigate={onNavigate} variant="secondary">
                  Edit Selection
                </CtaButton>
                <button className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button transition hover:-translate-y-0.5" type="button" onClick={confirmOrder} disabled={isSubmitting}>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  {isSubmitting ? "Sending Request..." : "Send Reservation Request"}
                </button>
              </div>
            </div>
            <TicketSummary selection={session.selection || selection} user={session.user} ticketTypes={ticketTypes} />
          </div>
        </section>
      )}
      {mode === "confirmation" && (
        <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <div className="rounded-lg border-2 border-sunshine bg-white p-6 shadow-lift">
            <p className="inline-flex items-center gap-2 rounded-lg bg-leaf px-3 py-2 text-sm font-black uppercase tracking-wide text-white">
              <CheckCircle2 aria-hidden="true" size={16} />
              Reservation Request
            </p>
            <h2 className="mt-4 font-display text-4xl font-black text-ink">Your reservation request has been received.</h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-700">
              Reference: {session.confirmationRef || session.booking?.reference || "WOOD"}. Please keep this reference for any ticket enquiries.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CtaButton href="/" onNavigate={onNavigate}>Home</CtaButton>
              <CtaButton href="/tickets/account" onNavigate={onNavigate} variant="secondary">Ticket Account</CtaButton>
              <CtaButton href="/visiting/faqs" onNavigate={onNavigate} variant="secondary">Ticket FAQs</CtaButton>
            </div>
          </div>
        </section>
      )}
      {mode === "account" && <TicketAccount session={session} onNavigate={onNavigate} />}
    </>
  );
}

function AccountRequired({ onNavigate }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <div className="rounded-lg border-2 border-sunshine bg-white p-6 shadow-lift">
        <p className="inline-flex items-center gap-2 rounded-lg bg-woodpink px-3 py-2 text-sm font-black uppercase tracking-wide text-white">
          <LockKeyhole aria-hidden="true" size={16} />
          Account Required
        </p>
        <h2 className="mt-4 font-display text-3xl font-black text-ink">Login or create an account first.</h2>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          Sign in before checkout so the ticket request can be linked to your account.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <CtaButton href="/tickets/login" onNavigate={onNavigate} icon="ticket">Login</CtaButton>
          <CtaButton href="/tickets/register" onNavigate={onNavigate} variant="secondary">Register</CtaButton>
        </div>
      </div>
    </section>
  );
}

function TicketHero({ mode, onNavigate }) {
  return (
    <section className="section-band bg-woodpink py-14 text-white">
      <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
        <p className="inline-flex items-center gap-2 rounded-lg bg-sunshine px-3 py-2 text-sm font-black uppercase tracking-wide text-ink">
          <Ticket aria-hidden="true" size={18} />
          Tickets
        </p>
        <h1 className="mt-5 font-display text-5xl font-black leading-tight sm:text-6xl">
          {mode === "overview" ? ticketSource.title : "Woodlands Ticketing"}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-white/90">{ticketIntro[1]}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <CtaButton href="/tickets/login" onNavigate={onNavigate} icon="ticket">Login</CtaButton>
          <CtaButton href="/tickets/register" onNavigate={onNavigate} variant="secondary">Register</CtaButton>
          <CtaButton href="/tickets/account" onNavigate={onNavigate} variant="secondary">Ticket Account</CtaButton>
        </div>
      </div>
    </section>
  );
}

function TicketOverview({ onNavigate }) {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Ticketing Information" title={ticketIntro[0]} text={ticketIntro[1]} />
            <div className="mt-6 flex flex-wrap gap-3">
              <CtaButton href="/tickets/select" onNavigate={onNavigate} icon="ticket">Select Tickets</CtaButton>
              <CtaButton href="/visiting/opening-times" onNavigate={onNavigate} variant="secondary" icon="calendar">Opening Times</CtaButton>
            </div>
          </div>
          <article className="rounded-lg border-2 border-sunshine bg-white p-5 shadow-sm">
            <p className="inline-flex items-center gap-2 rounded-lg bg-woodpink px-3 py-2 text-sm font-black uppercase tracking-wide text-white">
              <CalendarDays aria-hidden="true" size={16} />
              7-Day Wristbands Information
            </p>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
              {wristbandInformation.slice(1).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section-band bg-plum py-12 text-white">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <div className="[&_.text-berry]:text-sunshine [&_.text-ink]:text-white [&_.text-slate-700]:text-white/85">
            <SectionHeading eyebrow="Terms" title="ONLINE TICKET TERMS AND CONDITIONS" />
          </div>
          <div className="mt-6 grid gap-3">
            {ticketTerms.map((term) => (
              <details key={term.title} className="rounded-lg border border-white/20 bg-white p-4 text-ink shadow-sm">
                <summary className="cursor-pointer font-display text-xl font-black">{term.title}</summary>
                <div className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{term.body}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function TicketFormShell({ title, icon: Icon, children }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <div className="rounded-lg border-2 border-sunshine bg-white p-6 shadow-lift">
        <p className="inline-flex items-center gap-2 rounded-lg bg-woodpink px-3 py-2 text-sm font-black uppercase tracking-wide text-white">
          <Icon aria-hidden="true" size={16} />
          {title}
        </p>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

function Field({ label, type = "text", value, onChange, required = false, minLength }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold text-ink">{label}{required ? " *" : ""}</span>
      <input
        id={id}
        className="focus-ring min-h-12 rounded-lg border border-slate-300 px-3"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        minLength={minLength}
      />
    </label>
  );
}

function TicketSummary({ selection, user, ticketTypes }) {
  const entries = useMemo(
    () =>
      ticketTypes
        .map((ticketType) => ({ ...ticketType, quantity: Number(selection.quantities?.[String(ticketType.id)] || 0) }))
        .filter((ticketType) => ticketType.quantity > 0),
    [selection.quantities, ticketTypes],
  );

  return (
    <aside className="rounded-lg border-2 border-sunshine bg-white p-5 shadow-sm">
      <h2 className="font-display text-2xl font-black text-ink">Summary</h2>
      {user && <p className="mt-2 text-sm font-bold text-slate-700">Account: {user.name || user.email}</p>}
      <p className="mt-3 text-sm leading-6 text-slate-700">Visit date: {selection.visitDate || "Not selected"}</p>
      <div className="mt-4 grid gap-3">
        {entries.length ? (
          entries.map((entry) => (
            <div key={entry.id} className="rounded-lg bg-mist p-3 text-sm">
              <p className="font-black text-ink">{entry.quantity} x {entry.name}</p>
              <p className="mt-1 text-slate-700">{entry.priceLabel || entry.price_label}</p>
            </div>
          ))
        ) : (
          <p className="rounded-lg bg-mist p-3 text-sm font-bold text-slate-700">No tickets selected yet.</p>
        )}
      </div>
      <p className="mt-4 rounded-lg bg-sunshine/30 p-3 text-xs font-bold uppercase tracking-wide text-ink">
        Payment is requested only after your reservation details are confirmed.
      </p>
    </aside>
  );
}

function TicketAccount({ session, onNavigate }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <article className="rounded-lg border-2 border-sunshine bg-white p-6 shadow-lift">
          <p className="inline-flex items-center gap-2 rounded-lg bg-woodpink px-3 py-2 text-sm font-black uppercase tracking-wide text-white">
            <ShieldCheck aria-hidden="true" size={16} />
            Ticket Account
          </p>
          <h2 className="mt-4 font-display text-4xl font-black text-ink">
            {session.user ? `Hello, ${session.user.name || session.user.email}` : "Sign in to view ticket requests."}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Use your account to keep ticket reservation details together before your visit.
          </p>
          {!session.user && (
            <div className="mt-5 flex flex-wrap gap-3">
              <CtaButton href="/tickets/login" onNavigate={onNavigate} icon="ticket">Login</CtaButton>
              <CtaButton href="/tickets/register" onNavigate={onNavigate} variant="secondary">Register</CtaButton>
            </div>
          )}
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-display text-3xl font-black text-ink">Latest Request</h3>
          {session.booking ? (
            <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
              <p><strong>Reference:</strong> {session.booking.reference}</p>
              <p><strong>Visit date:</strong> {session.booking.visit_date || session.selection?.visitDate}</p>
              <p><strong>Status:</strong> {session.booking.status || "reservation_requested"}</p>
            </div>
          ) : (
            <p className="mt-4 rounded-lg bg-mist p-4 text-sm font-bold text-slate-700">
              No ticket reservation requests are linked to this browser session yet.
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <CtaButton href="/tickets/select" onNavigate={onNavigate}>Select Tickets</CtaButton>
            <CtaButton href="/visiting/faqs" onNavigate={onNavigate} variant="secondary">Ticket FAQs</CtaButton>
          </div>
        </article>
      </div>
    </section>
  );
}
