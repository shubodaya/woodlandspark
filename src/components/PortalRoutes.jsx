import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  FileImage,
  LayoutDashboard,
  LockKeyhole,
  Save,
  ShieldCheck,
  Ticket,
  Upload,
  Users,
  Utensils,
} from "lucide-react";
import { apiRequest } from "../lib/api.js";
import { AppLink } from "./Link.jsx";
import { FoodMenuBrowser } from "./FoodMenuBrowser.jsx";

const adminRoles = ["admin", "editor", "super_admin"];
const staffRoles = ["staff", "supervisor", "manager", "payroll_admin", "super_admin", "admin"];
const shiftRoles = ["staff", "supervisor", "manager", "super_admin", "admin"];

export function PortalRoute({ type, onNavigate }) {
  if (type === "foodorder") return <FoodorderPortal />;
  if (type === "shifts") return <ShiftsPortal />;
  if (type === "staff") return <StaffPortal onNavigate={onNavigate} />;
  return <AdminPortal />;
}

function isAllowed(user, roles) {
  return Boolean(user && roles.includes(user.role));
}

function PortalHero({ eyebrow, title, description, roles = [] }) {
  return (
    <section className="section-band bg-woodpink py-14 text-white">
      <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-sunshine">{eyebrow}</p>
        <h1 className="mt-3 font-display text-5xl font-black leading-tight sm:text-6xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-white/90">{description}</p>
        {roles.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {roles.map((role) => (
              <span key={role} className="rounded-lg bg-sunshine px-3 py-2 text-xs font-black uppercase tracking-wide text-ink">
                {role}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PortalLogin({ title, currentUser, allowedRoles, onAuthenticated }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      if (!allowedRoles.includes(data.user.role)) {
        setError("This account does not have access to this portal.");
        return;
      }
      onAuthenticated(data.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mx-auto max-w-xl rounded-lg border-2 border-sunshine bg-white p-6 shadow-lift" onSubmit={submit}>
      <p className="inline-flex items-center gap-2 rounded-lg bg-woodpink px-3 py-2 text-sm font-black uppercase tracking-wide text-white">
        <LockKeyhole aria-hidden="true" size={16} />
        {title}
      </p>
      {currentUser && (
        <p className="mt-4 rounded-lg bg-sunshine/30 p-3 text-sm font-bold text-ink">
          Signed in as {currentUser.email}. Use an account with the required role to continue.
        </p>
      )}
      <label className="mt-5 grid gap-2">
        <span className="text-sm font-extrabold text-ink">Email</span>
        <input className="focus-ring min-h-12 rounded-lg border border-slate-300 px-3" type="email" value={credentials.email} onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))} required />
      </label>
      <label className="mt-4 grid gap-2">
        <span className="text-sm font-extrabold text-ink">Password</span>
        <input className="focus-ring min-h-12 rounded-lg border border-slate-300 px-3" type="password" value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} required />
      </label>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
      <button className="focus-ring mt-5 inline-flex min-h-12 items-center justify-center rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Checking..." : "Login"}
      </button>
    </form>
  );
}

function PortalShell({ children }) {
  return <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">{children}</section>;
}

function AdminPortal() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("pages");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    counts: {},
    pages: [],
    events: [],
    faqs: [],
    openingTimes: [],
    media: [],
    documents: [],
    subscribers: [],
    ticketTypes: [],
    bookings: [],
  });
  const [saveMessage, setSaveMessage] = useState("");

  const loadAdmin = async () => {
    const [dashboard, pages, events, faqs, openingTimes, media, documents, subscribers, ticketTypes, bookings] = await Promise.all([
      apiRequest("/admin/dashboard"),
      apiRequest("/admin/pages"),
      apiRequest("/admin/events"),
      apiRequest("/admin/faqs"),
      apiRequest("/admin/opening-times"),
      apiRequest("/admin/media"),
      apiRequest("/admin/documents"),
      apiRequest("/admin/newsletter-subscribers"),
      apiRequest("/admin/ticket-types"),
      apiRequest("/admin/ticket-bookings"),
    ]);
    setData({
      counts: dashboard.counts,
      pages: pages.pages,
      events: events.events,
      faqs: faqs.faqs,
      openingTimes: openingTimes.openingTimes,
      media: media.media,
      documents: documents.documents,
      subscribers: subscribers.subscribers,
      ticketTypes: ticketTypes.ticketTypes,
      bookings: bookings.bookings,
    });
  };

  useEffect(() => {
    let isMounted = true;
    apiRequest("/auth/me")
      .then(async (auth) => {
        if (!isMounted) return;
        setUser(auth.user);
        if (isAllowed(auth.user, adminRoles)) await loadAdmin();
      })
      .catch(() => undefined)
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const reloadAfterLogin = async (nextUser) => {
    setUser(nextUser);
    setLoading(true);
    await loadAdmin();
    setLoading(false);
  };

  return (
    <>
      <PortalHero
        eyebrow="admin.woodlandspark.com"
        title="Admin Portal"
        description="Content and operations management for authorised Woodlands staff."
        roles={["admin", "editor", "super-admin"]}
      />
      <PortalShell>
        {loading ? (
          <LoadingCard label="Loading admin portal..." />
        ) : !isAllowed(user, adminRoles) ? (
          <PortalLogin title="Admin Login" currentUser={user} allowedRoles={adminRoles} onAuthenticated={reloadAfterLogin} />
        ) : (
          <div className="grid gap-8">
            <DashboardCounts counts={data.counts} />
            <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
            {saveMessage && <p className="rounded-lg bg-leaf/10 p-3 text-sm font-bold text-canopy">{saveMessage}</p>}
            {activeTab === "pages" && <PagesManager pages={data.pages} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "events" && <EventsManager events={data.events} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "opening" && <OpeningManager openingTimes={data.openingTimes} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "faqs" && <FaqManager faqs={data.faqs} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "media" && <MediaManager media={data.media} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "documents" && <DocumentsManager documents={data.documents} />}
            {activeTab === "newsletter" && <SubscriberManager subscribers={data.subscribers} />}
            {activeTab === "tickets" && <TicketAdmin ticketTypes={data.ticketTypes} bookings={data.bookings} setData={setData} setSaveMessage={setSaveMessage} />}
          </div>
        )}
      </PortalShell>
    </>
  );
}

function DashboardCounts({ counts }) {
  const cards = [
    ["Pages", counts.pages || 0, LayoutDashboard],
    ["Events", counts.events || 0, CalendarClock],
    ["FAQs", counts.faqs || 0, ShieldCheck],
    ["Bookings", counts.bookings || 0, Ticket],
    ["Subscribers", counts.subscribers || 0, Users],
    ["Menu Items", counts.menuItems || 0, Utensils],
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(([label, value, Icon]) => (
        <article key={label} className="rounded-lg border-2 border-sunshine bg-white p-5 text-ink shadow-sm">
          <Icon aria-hidden="true" className="text-berry" />
          <p className="mt-3 text-sm font-black uppercase tracking-wide text-slate-600">{label}</p>
          <p className="font-display text-4xl font-black">{value}</p>
        </article>
      ))}
    </div>
  );
}

function TabButtons({ activeTab, setActiveTab }) {
  const tabs = [
    ["pages", "Pages"],
    ["events", "Events"],
    ["opening", "Opening Times"],
    ["faqs", "FAQs"],
    ["media", "Media"],
    ["documents", "Documents"],
    ["newsletter", "Newsletter"],
    ["tickets", "Tickets"],
  ];
  return (
    <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      {tabs.map(([id, label]) => (
        <button
          key={id}
          className={`focus-ring rounded-lg px-4 py-3 text-sm font-extrabold uppercase tracking-wide ${
            activeTab === id ? "bg-woodpink text-white" : "bg-mist text-ink hover:bg-sunshine"
          }`}
          type="button"
          onClick={() => setActiveTab(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function PagesManager({ pages, setData, setSaveMessage }) {
  const updatePage = async (page) => {
    await apiRequest(`/admin/pages/${page.id}`, {
      method: "PUT",
      body: JSON.stringify(page),
    });
    setSaveMessage(`Saved page: ${page.title}`);
  };
  return (
    <ManagerPanel title="Pages & Content">
      {pages.slice(0, 12).map((page) => (
        <EditableCard key={page.id} title={page.path}>
          <AdminInput label="Title" value={page.title} onChange={(value) => setData((current) => updateRecord(current, "pages", page.id, { title: value }))} />
          <AdminTextarea label="Summary" value={page.summary || ""} onChange={(value) => setData((current) => updateRecord(current, "pages", page.id, { summary: value }))} />
          <SaveButton onClick={() => updatePage(page)} />
        </EditableCard>
      ))}
    </ManagerPanel>
  );
}

function EventsManager({ events, setData, setSaveMessage }) {
  const updateEvent = async (event) => {
    await apiRequest(`/admin/events/${event.id}`, {
      method: "PUT",
      body: JSON.stringify(event),
    });
    setSaveMessage(`Saved event: ${event.title}`);
  };
  return (
    <ManagerPanel title="Events Manager">
      {events.slice(0, 12).map((event) => (
        <EditableCard key={event.id} title={event.source_url || "Event"}>
          <AdminInput label="Title" value={event.title} onChange={(value) => setData((current) => updateRecord(current, "events", event.id, { title: value }))} />
          <AdminInput label="Date" value={event.event_date || ""} onChange={(value) => setData((current) => updateRecord(current, "events", event.id, { event_date: value }))} />
          <AdminTextarea label="Summary" value={event.summary || ""} onChange={(value) => setData((current) => updateRecord(current, "events", event.id, { summary: value }))} />
          <SaveButton onClick={() => updateEvent(event)} />
        </EditableCard>
      ))}
    </ManagerPanel>
  );
}

function OpeningManager({ openingTimes, setData, setSaveMessage }) {
  const updateOpening = async (row) => {
    await apiRequest(`/admin/opening-times/${row.id}`, {
      method: "PUT",
      body: JSON.stringify(row),
    });
    setSaveMessage(`Saved opening time: ${row.date}`);
  };
  return (
    <ManagerPanel title="Opening Times">
      {openingTimes.slice(0, 28).map((row) => (
        <EditableCard key={row.id} title={row.date}>
          <label className="grid gap-2">
            <span className="text-sm font-extrabold text-ink">Status</span>
            <select
              className="focus-ring min-h-12 rounded-lg border border-slate-300 px-3"
              value={row.status}
              onChange={(event) => setData((current) => updateRecord(current, "openingTimes", row.id, { status: event.target.value }))}
            >
              <option value="main">Main Season</option>
              <option value="off-peak">Off Peak Weekdays</option>
              <option value="winter">Winter Fun</option>
              <option value="closed">Park Closed</option>
            </select>
          </label>
          <AdminInput label="Open Time" value={row.open_time || ""} onChange={(value) => setData((current) => updateRecord(current, "openingTimes", row.id, { open_time: value }))} />
          <AdminInput label="Close Time" value={row.close_time || ""} onChange={(value) => setData((current) => updateRecord(current, "openingTimes", row.id, { close_time: value }))} />
          <AdminTextarea label="Notes" value={row.notes || ""} onChange={(value) => setData((current) => updateRecord(current, "openingTimes", row.id, { notes: value }))} />
          <SaveButton onClick={() => updateOpening(row)} />
        </EditableCard>
      ))}
    </ManagerPanel>
  );
}

function FaqManager({ faqs, setData, setSaveMessage }) {
  const updateFaq = async (faq) => {
    await apiRequest(`/admin/faqs/${faq.id}`, {
      method: "PUT",
      body: JSON.stringify(faq),
    });
    setSaveMessage(`Saved FAQ: ${faq.question}`);
  };
  return (
    <ManagerPanel title="FAQ Manager">
      {faqs.slice(0, 16).map((faq) => (
        <EditableCard key={faq.id} title={faq.group_title}>
          <AdminInput label="Question" value={faq.question} onChange={(value) => setData((current) => updateRecord(current, "faqs", faq.id, { question: value }))} />
          <AdminTextarea label="Answer" value={faq.answer} onChange={(value) => setData((current) => updateRecord(current, "faqs", faq.id, { answer: value }))} />
          <SaveButton onClick={() => updateFaq(faq)} />
        </EditableCard>
      ))}
    </ManagerPanel>
  );
}

function MediaManager({ media, setData, setSaveMessage }) {
  const [upload, setUpload] = useState({ title: "", altText: "", usage: "website" });
  const [file, setFile] = useState(null);

  const submitUpload = async (event) => {
    event.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", upload.title);
    formData.append("altText", upload.altText);
    formData.append("usage", upload.usage);
    const response = await fetch("/api/admin/media", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error || "Upload failed.");
    setData((current) => ({ ...current, media: [payload.data.media, ...current.media] }));
    setSaveMessage(`Uploaded media: ${payload.data.media.title}`);
    setUpload({ title: "", altText: "", usage: "website" });
    setFile(null);
  };

  return (
    <ManagerPanel title="Media Manager">
      <form className="rounded-lg border border-slate-200 bg-mist p-4" onSubmit={submitUpload}>
        <div className="grid gap-4 md:grid-cols-3">
          <AdminInput label="Title" value={upload.title} onChange={(value) => setUpload((current) => ({ ...current, title: value }))} />
          <AdminInput label="Alt Text" value={upload.altText} onChange={(value) => setUpload((current) => ({ ...current, altText: value }))} />
          <AdminInput label="Usage" value={upload.usage} onChange={(value) => setUpload((current) => ({ ...current, usage: value }))} />
        </div>
        <input className="mt-4 block w-full rounded-lg border border-slate-300 bg-white p-3 text-sm" type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        <button className="focus-ring mt-4 inline-flex min-h-12 items-center gap-2 rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button" type="submit">
          <Upload aria-hidden="true" size={18} />
          Upload Media
        </button>
      </form>
      <div className="grid gap-4 md:grid-cols-3">
        {media.slice(0, 24).map((item) => (
          <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <FileImage aria-hidden="true" className="text-berry" />
            <h3 className="mt-2 font-display text-xl font-black text-ink">{item.title}</h3>
            <p className="mt-1 break-all text-xs font-bold text-slate-600">{item.path}</p>
          </article>
        ))}
      </div>
    </ManagerPanel>
  );
}

function DocumentsManager({ documents }) {
  return (
    <ManagerPanel title="Documents">
      <div className="grid gap-4 md:grid-cols-2">
        {documents.map((document) => (
          <article key={document.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="font-display text-xl font-black text-ink">{document.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{document.description}</p>
            <a className="mt-3 inline-flex text-sm font-black text-berry underline" href={document.local_path} target="_blank" rel="noreferrer">
              Open document
            </a>
          </article>
        ))}
      </div>
    </ManagerPanel>
  );
}

function SubscriberManager({ subscribers }) {
  return (
    <ManagerPanel title="Newsletter Subscribers">
      <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-mist text-ink">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">First Name</th>
              <th className="p-3">Last Name</th>
              <th className="p-3">Consent</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-t border-slate-200">
                <td className="p-3 font-bold">{subscriber.email}</td>
                <td className="p-3">{subscriber.first_name}</td>
                <td className="p-3">{subscriber.last_name}</td>
                <td className="p-3">{subscriber.consent ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ManagerPanel>
  );
}

function TicketAdmin({ ticketTypes, bookings, setData, setSaveMessage }) {
  const updateTicketType = async (ticketType) => {
    await apiRequest(`/admin/ticket-types/${ticketType.id}`, {
      method: "PUT",
      body: JSON.stringify(ticketType),
    });
    setSaveMessage(`Saved ticket type: ${ticketType.name}`);
  };
  return (
    <ManagerPanel title="Ticket Types & Bookings">
      <div className="grid gap-4 md:grid-cols-2">
        {ticketTypes.map((ticketType) => (
          <EditableCard key={ticketType.id} title={ticketType.slug}>
            <AdminInput label="Name" value={ticketType.name} onChange={(value) => setData((current) => updateRecord(current, "ticketTypes", ticketType.id, { name: value }))} />
            <AdminTextarea label="Description" value={ticketType.description || ""} onChange={(value) => setData((current) => updateRecord(current, "ticketTypes", ticketType.id, { description: value }))} />
            <AdminInput label="Price Label" value={ticketType.price_label || ""} onChange={(value) => setData((current) => updateRecord(current, "ticketTypes", ticketType.id, { price_label: value }))} />
            <SaveButton onClick={() => updateTicketType(ticketType)} />
          </EditableCard>
        ))}
      </div>
      <div className="mt-6 overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-mist text-ink">
            <tr>
              <th className="p-3">Reference</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Visit Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-slate-200">
                <td className="p-3 font-black">{booking.reference}</td>
                <td className="p-3">{booking.user_name || booking.user_email}</td>
                <td className="p-3">{booking.visit_date}</td>
                <td className="p-3">{booking.status}</td>
                <td className="p-3">{booking.payment_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ManagerPanel>
  );
}

function StaffPortal({ onNavigate }) {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStaff = async () => {
    const data = await apiRequest("/staff/dashboard");
    setDashboard(data);
  };

  useEffect(() => {
    let isMounted = true;
    apiRequest("/auth/me")
      .then(async (auth) => {
        if (!isMounted) return;
        setUser(auth.user);
        if (isAllowed(auth.user, staffRoles)) await loadStaff();
      })
      .catch(() => undefined)
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const reloadAfterLogin = async (nextUser) => {
    setUser(nextUser);
    setLoading(true);
    await loadStaff();
    setLoading(false);
  };

  return (
    <>
      <PortalHero
        eyebrow="staff.woodlandspark.com"
        title="Staff Portal"
        description="Secure staff area for rota links, announcements, documents and payroll access."
        roles={["employee", "supervisor", "manager", "payroll-admin", "super-admin"]}
      />
      <PortalShell>
        {loading ? (
          <LoadingCard label="Loading staff portal..." />
        ) : !isAllowed(user, staffRoles) ? (
          <PortalLogin title="Staff Login" currentUser={user} allowedRoles={staffRoles} onAuthenticated={reloadAfterLogin} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            <aside className="rounded-lg border-2 border-sunshine bg-white p-5 shadow-sm">
              <ShieldCheck aria-hidden="true" className="text-berry" />
              <h2 className="mt-3 font-display text-3xl font-black text-ink">Hello, {user.name}</h2>
              <p className="mt-2 text-sm font-bold text-slate-700">Role: {user.role}</p>
              {dashboard?.employee && (
                <p className="mt-2 text-sm font-bold text-slate-700">
                  {dashboard.employee.job_title} - {dashboard.employee.department_name}
                </p>
              )}
              <AppLink href="/shifts" onNavigate={onNavigate} className="focus-ring mt-5 inline-flex min-h-12 items-center rounded-lg bg-sunshine px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-ink shadow-button">
                View Shifts
              </AppLink>
            </aside>
            <div className="grid gap-5">
              <StaffSection title="Announcements">
                {dashboard?.announcements?.map((announcement) => (
                  <article key={announcement.title} className="rounded-lg bg-mist p-4">
                    <h3 className="font-display text-xl font-black text-ink">{announcement.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{announcement.body}</p>
                  </article>
                ))}
              </StaffSection>
              <StaffSection title="Documents & Payslips">
                <div className="grid gap-3 md:grid-cols-2">
                  {dashboard?.documents?.map((document) => (
                    <article key={document.title} className="rounded-lg bg-mist p-4">
                      <p className="text-sm font-black uppercase tracking-wide text-berry">{document.documentType}</p>
                      <h3 className="mt-2 font-display text-xl font-black text-ink">{document.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{document.description}</p>
                    </article>
                  ))}
                </div>
                <p className="mt-4 rounded-lg bg-sunshine/30 p-3 text-sm font-bold text-ink">
                  Payslip access requires secure payroll integration, private storage and audit logging.
                </p>
              </StaffSection>
              {dashboard?.managerView?.length > 0 && (
                <StaffSection title="Manager View">
                  <div className="grid gap-3 md:grid-cols-2">
                    {dashboard.managerView.map((employee) => (
                      <article key={employee.id} className="rounded-lg bg-mist p-4">
                        <h3 className="font-display text-xl font-black text-ink">{employee.name}</h3>
                        <p className="mt-1 text-sm font-bold text-slate-700">{employee.role} - {employee.department}</p>
                      </article>
                    ))}
                  </div>
                </StaffSection>
              )}
            </div>
          </div>
        )}
      </PortalShell>
    </>
  );
}

function ShiftsPortal() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ shifts: [], assignments: [], employees: [], canManage: false });
  const [loading, setLoading] = useState(true);
  const [newShift, setNewShift] = useState({ title: "", date: "", startTime: "", endTime: "", location: "", employeeId: "" });

  const loadShifts = async () => {
    const next = await apiRequest("/shifts");
    setData(next);
  };

  useEffect(() => {
    let isMounted = true;
    apiRequest("/auth/me")
      .then(async (auth) => {
        if (!isMounted) return;
        setUser(auth.user);
        if (isAllowed(auth.user, shiftRoles)) await loadShifts();
      })
      .catch(() => undefined)
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const reloadAfterLogin = async (nextUser) => {
    setUser(nextUser);
    setLoading(true);
    await loadShifts();
    setLoading(false);
  };

  const assignmentsByShift = useMemo(() => {
    const map = new Map();
    for (const assignment of data.assignments) {
      const list = map.get(assignment.shiftId) || [];
      list.push(assignment);
      map.set(assignment.shiftId, list);
    }
    return map;
  }, [data.assignments]);

  const createShift = async (event) => {
    event.preventDefault();
    await apiRequest("/shifts", {
      method: "POST",
      body: JSON.stringify(newShift),
    });
    setNewShift({ title: "", date: "", startTime: "", endTime: "", location: "", employeeId: "" });
    await loadShifts();
  };

  return (
    <>
      <PortalHero
        eyebrow="shifts.woodlandspark.com"
        title="Shifts Portal"
        description="Woodlands-branded shift and rota management for rangers and staff."
        roles={["employee", "supervisor", "manager"]}
      />
      <PortalShell>
        {loading ? (
          <LoadingCard label="Loading shifts..." />
        ) : !isAllowed(user, shiftRoles) ? (
          <PortalLogin title="Shifts Login" currentUser={user} allowedRoles={shiftRoles} onAuthenticated={reloadAfterLogin} />
        ) : (
          <div className="grid gap-6">
            {data.canManage && (
              <form className="rounded-lg border-2 border-sunshine bg-white p-5 shadow-lift" onSubmit={createShift}>
                <h2 className="font-display text-3xl font-black text-ink">Create Shift</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <AdminInput label="Title" value={newShift.title} onChange={(value) => setNewShift((current) => ({ ...current, title: value }))} required />
                  <AdminInput label="Date" type="date" value={newShift.date} onChange={(value) => setNewShift((current) => ({ ...current, date: value }))} required />
                  <AdminInput label="Location" value={newShift.location} onChange={(value) => setNewShift((current) => ({ ...current, location: value }))} />
                  <AdminInput label="Start Time" type="time" value={newShift.startTime} onChange={(value) => setNewShift((current) => ({ ...current, startTime: value }))} required />
                  <AdminInput label="End Time" type="time" value={newShift.endTime} onChange={(value) => setNewShift((current) => ({ ...current, endTime: value }))} required />
                  <label className="grid gap-2">
                    <span className="text-sm font-extrabold text-ink">Assign Employee</span>
                    <select className="focus-ring min-h-12 rounded-lg border border-slate-300 px-3" value={newShift.employeeId} onChange={(event) => setNewShift((current) => ({ ...current, employeeId: event.target.value }))}>
                      <option value="">Unassigned</option>
                      {data.employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>{employee.name}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <button className="focus-ring mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button" type="submit">
                  <Save aria-hidden="true" size={18} />
                  Save Shift
                </button>
              </form>
            )}
            <div className="rounded-lg border-2 border-sunshine bg-white p-5 shadow-lift">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl font-black text-ink">Rota</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-700">View scheduled shifts and ranger cover across Woodlands.</p>
                </div>
                <CalendarClock aria-hidden="true" className="text-berry" size={42} />
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {data.shifts.map((shift) => (
                  <article key={shift.id} className="rounded-lg border border-slate-200 bg-mist p-4">
                    <p className="text-sm font-black uppercase tracking-wide text-berry">{shift.date}</p>
                    <h3 className="mt-2 font-display text-2xl font-black text-ink">{shift.title}</h3>
                    <p className="mt-2 text-sm font-bold text-slate-700">{shift.start_time} - {shift.end_time}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{shift.location || shift.department_name}</p>
                    <div className="mt-3 grid gap-2">
                      {(assignmentsByShift.get(shift.id) || []).map((assignment) => (
                        <p key={`${shift.id}-${assignment.name}`} className="rounded-lg bg-white p-2 text-xs font-bold text-slate-700">
                          {assignment.name} - {assignment.jobTitle || assignment.role}
                        </p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </PortalShell>
    </>
  );
}

function FoodorderPortal() {
  return (
    <>
      <PortalHero
        eyebrow="foodorder.woodlandspark.com"
        title="Foodorder Portal"
        description="Woodlands cafe menu browsing for visitors and catering teams."
        roles={["menu-browser", "food-manager"]}
      />
      <FoodMenuBrowser />
      <PortalShell>
        <div className="rounded-lg border-2 border-sunshine bg-white p-5 text-ink shadow-lift">
          <Utensils aria-hidden="true" className="text-berry" />
          <h2 className="mt-3 font-display text-3xl font-black">Menu browsing</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Customers can browse cafe menus before and during their visit. Ordering and payments are not available from this website.
          </p>
        </div>
      </PortalShell>
    </>
  );
}

function ManagerPanel({ title, children }) {
  return (
    <section className="rounded-lg border-2 border-sunshine bg-white p-5 shadow-lift">
      <h2 className="font-display text-3xl font-black text-ink">{title}</h2>
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}

function EditableCard({ title, children }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-mist p-4">
      <p className="text-xs font-black uppercase tracking-wide text-berry">{title}</p>
      <div className="mt-4 grid gap-3">{children}</div>
    </article>
  );
}

function AdminInput({ label, value, onChange, type = "text", required = false }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold text-ink">{label}</span>
      <input className="focus-ring min-h-12 rounded-lg border border-slate-300 bg-white px-3" type={type} value={value ?? ""} onChange={(event) => onChange(event.target.value)} required={required} />
    </label>
  );
}

function AdminTextarea({ label, value, onChange }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold text-ink">{label}</span>
      <textarea className="focus-ring min-h-28 rounded-lg border border-slate-300 bg-white p-3" value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SaveButton({ onClick }) {
  return (
    <button className="focus-ring inline-flex min-h-12 w-fit items-center gap-2 rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button" type="button" onClick={onClick}>
      <Save aria-hidden="true" size={18} />
      Save
    </button>
  );
}

function StaffSection({ title, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-display text-2xl font-black text-ink">{title}</h3>
      <div className="mt-4 grid gap-3">{children}</div>
    </section>
  );
}

function LoadingCard({ label }) {
  return (
    <div className="rounded-lg border-2 border-sunshine bg-white p-6 text-center font-display text-2xl font-black text-ink shadow-lift">
      {label}
    </div>
  );
}

function updateRecord(current, key, id, patch) {
  return {
    ...current,
    [key]: current[key].map((item) => (item.id === id ? { ...item, ...patch } : item)),
  };
}
