import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Ban,
  CalendarClock,
  CalendarDays,
  FileImage,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  LogOut,
  Save,
  ShieldCheck,
  Ticket,
  Upload,
  UserCog,
  UserPlus,
  Users,
  Utensils,
} from "lucide-react";
import { apiRequest } from "../lib/api.js";
import { AppLink } from "./Link.jsx";
import { FoodMenuBrowser } from "./FoodMenuBrowser.jsx";

const adminRoles = ["admin", "editor", "super_admin"];
const userAdminRoles = ["admin", "super_admin"];
const staffRoles = ["staff", "supervisor", "manager", "payroll_admin", "super_admin", "admin"];
const shiftRoles = ["staff", "supervisor", "manager", "super_admin", "admin"];
const managedUserRoles = ["staff", "supervisor", "manager", "editor", "payroll_admin"];
const superAdminManagedUserRoles = [...managedUserRoles, "admin"];

export function PortalRoute({ type, path = "", onNavigate }) {
  if (type === "shiftRedirect") return <ShiftRedirect onNavigate={onNavigate} />;
  if (type === "adminLogin") return <AdminLoginPortal onNavigate={onNavigate} />;
  if (type === "adminSetup") return <AdminSetupPortal onNavigate={onNavigate} />;
  if (type === "staffLogin") return <StaffLoginPortal onNavigate={onNavigate} />;
  if (type === "foodorder") return <FoodorderPortal />;
  if (type === "staff") return <StaffPortal path={path} onNavigate={onNavigate} />;
  return <AdminPortal path={path} onNavigate={onNavigate} />;
}

function isAllowed(user, roles) {
  return Boolean(user && roles.includes(user.role));
}

function ShiftRedirect({ onNavigate }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onNavigate("/staff/rota"), 600);
    return () => window.clearTimeout(timer);
  }, [onNavigate]);

  return (
    <>
      <PortalHero
        eyebrow="staff.woodlandspark.com"
        title="Rota / Shifts"
        description="Rota is now inside the Staff Portal."
        roles={["staff", "supervisor", "manager"]}
      />
      <PortalShell>
        <div className="rounded-lg border-2 border-sunshine bg-white p-6 shadow-lift">
          <CalendarClock aria-hidden="true" className="text-berry" />
          <h2 className="mt-3 font-display text-3xl font-black text-ink">Rota is now inside the Staff Portal.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">You will be redirected to the staff rota area.</p>
          <AppLink href="/staff/rota" onNavigate={onNavigate} className="focus-ring mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button">
            Continue
            <ArrowRight aria-hidden="true" size={18} />
          </AppLink>
        </div>
      </PortalShell>
    </>
  );
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

function strongPasswordMessage(password, minLength = 14) {
  if (password.length < minLength) return `Use at least ${minLength} characters.`;
  if (!/[a-z]/.test(password)) return "Add a lowercase letter.";
  if (!/[A-Z]/.test(password)) return "Add an uppercase letter.";
  if (!/[0-9]/.test(password)) return "Add a number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Add a symbol.";
  return "";
}

function PortalRedirect({ title, message, to, onNavigate }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onNavigate(to), 250);
    return () => window.clearTimeout(timer);
  }, [onNavigate, to]);

  return (
    <div className="rounded-lg border-2 border-sunshine bg-white p-6 shadow-lift">
      <LockKeyhole aria-hidden="true" className="text-berry" />
      <h2 className="mt-3 font-display text-3xl font-black text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-700">{message}</p>
      <AppLink href={to} onNavigate={onNavigate} className="focus-ring mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button">
        Continue
        <ArrowRight aria-hidden="true" size={18} />
      </AppLink>
    </div>
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
        await apiRequest("/auth/logout", { method: "POST" }).catch(() => undefined);
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

function AdminLoginPortal({ onNavigate }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    apiRequest("/auth/me")
      .then((auth) => {
        if (!isMounted) return;
        setCurrentUser(auth.user);
        if (isAllowed(auth.user, adminRoles)) onNavigate("/admin");
      })
      .catch(() => undefined)
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [onNavigate]);

  return (
    <>
      <PortalHero eyebrow="admin.woodlandspark.com" title="Admin Login" description="Sign in with an authorised Woodlands admin, editor or super-admin account." roles={["admin", "editor", "super-admin"]} />
      <PortalShell>
        {loading ? (
          <LoadingCard label="Checking session..." />
        ) : (
          <PortalLogin title="Admin Login" currentUser={currentUser} allowedRoles={adminRoles} onAuthenticated={() => onNavigate("/admin")} />
        )}
      </PortalShell>
    </>
  );
}

function StaffLoginPortal({ onNavigate }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    apiRequest("/auth/me")
      .then((auth) => {
        if (!isMounted) return;
        setCurrentUser(auth.user);
        if (isAllowed(auth.user, staffRoles)) onNavigate("/staff");
      })
      .catch(() => undefined)
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [onNavigate]);

  return (
    <>
      <PortalHero eyebrow="staff.woodlandspark.com" title="Staff Login" description="Sign in with an authorised Woodlands staff account." roles={["staff", "supervisor", "manager", "payroll-admin"]} />
      <PortalShell>
        {loading ? (
          <LoadingCard label="Checking session..." />
        ) : (
          <PortalLogin title="Staff Login" currentUser={currentUser} allowedRoles={staffRoles} onAuthenticated={() => onNavigate("/staff")} />
        )}
      </PortalShell>
    </>
  );
}

function AdminSetupPortal({ onNavigate }) {
  const [form, setForm] = useState({ token: "", name: "", email: "", password: "", confirmPassword: "" });
  const [setupComplete, setSetupComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    apiRequest("/setup/status")
      .then((data) => {
        if (isMounted) setSetupComplete(Boolean(data.complete));
      })
      .catch((error) => {
        if (isMounted) setError(error.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    try {
      if (form.password !== form.confirmPassword) throw new Error("Passwords do not match.");
      const passwordError = strongPasswordMessage(form.password, 14);
      if (passwordError) throw new Error(passwordError);
      await apiRequest("/setup/first-admin", {
        method: "POST",
        headers: { "X-Bootstrap-Token": form.token },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      setMessage("Admin account created. Redirecting to admin login.");
      setForm({ token: "", name: "", email: "", password: "", confirmPassword: "" });
      setSetupComplete(true);
      window.setTimeout(() => onNavigate("/admin/login"), 650);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PortalHero
        eyebrow="admin.woodlandspark.com"
        title="Admin Setup"
        description="Create the first administrator only when no admin account exists."
        roles={["bootstrap token required"]}
      />
      <PortalShell>
        {loading ? (
          <LoadingCard label="Checking setup status..." />
        ) : setupComplete ? (
          <div className="mx-auto max-w-2xl rounded-lg border-2 border-sunshine bg-white p-6 shadow-lift">
            <ShieldCheck aria-hidden="true" className="text-leaf" />
            <h2 className="mt-3 font-display text-3xl font-black text-ink">Admin setup is already complete</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              The first administrator has already been created. Use the admin login page to continue.
            </p>
            <AppLink href="/admin/login" onNavigate={onNavigate} className="focus-ring mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button">
              Admin Login
              <ArrowRight aria-hidden="true" size={18} />
            </AppLink>
          </div>
        ) : (
        <form className="mx-auto max-w-2xl rounded-lg border-2 border-sunshine bg-white p-6 shadow-lift" onSubmit={submit}>
          <p className="rounded-lg bg-sunshine/30 p-3 text-sm font-bold text-ink">
            This setup route requires the private ADMIN_BOOTSTRAP_TOKEN. Do not store that token in the frontend or repository.
          </p>
          <div className="mt-5 grid gap-4">
            <AdminInput label="Bootstrap Token" type="password" value={form.token} onChange={(value) => setForm((current) => ({ ...current, token: value }))} required />
            <AdminInput label="Admin Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} required />
            <AdminInput label="Admin Email" type="email" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} required />
            <AdminInput label="Admin Password" type="password" value={form.password} onChange={(value) => setForm((current) => ({ ...current, password: value }))} required />
            <AdminInput label="Confirm Password" type="password" value={form.confirmPassword} onChange={(value) => setForm((current) => ({ ...current, confirmPassword: value }))} required />
            <p className="rounded-lg bg-sunshine/25 p-3 text-xs font-bold uppercase tracking-wide text-ink">
              Use 14+ characters with uppercase, lowercase, number and symbol.
            </p>
          </div>
          {message && <p className="mt-4 rounded-lg bg-leaf/10 p-3 text-sm font-bold text-canopy">{message}</p>}
          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
          <button className="focus-ring mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button" type="submit" disabled={submitting}>
            <ShieldCheck aria-hidden="true" size={18} />
            {submitting ? "Creating..." : "Create First Admin"}
          </button>
        </form>
        )}
      </PortalShell>
    </>
  );
}

function AdminPortal({ path, onNavigate }) {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(path === "/admin/users" ? "users" : "pages");
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
    users: [],
    departments: [],
    auditLogs: [],
  });
  const [saveMessage, setSaveMessage] = useState("");

  const loadAdmin = async () => {
    const [dashboard, users, auditLogs, pages, events, faqs, openingTimes, media, documents, subscribers, ticketTypes, bookings] = await Promise.all([
      apiRequest("/admin/dashboard"),
      apiRequest("/admin/users"),
      apiRequest("/admin/audit-logs"),
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
      users: users.users,
      departments: users.departments,
      auditLogs: auditLogs.auditLogs,
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

  useEffect(() => {
    if (path === "/admin/users") setActiveTab("users");
  }, [path]);

  const reloadAfterLogin = async (nextUser) => {
    setUser(nextUser);
    setLoading(true);
    await loadAdmin();
    setLoading(false);
  };

  const logout = async () => {
    await apiRequest("/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
    onNavigate("/admin/login");
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
          <PortalRedirect title="Admin Login Required" message="Admin access requires an authorised Woodlands admin, editor or super-admin account." to="/admin/login" onNavigate={onNavigate} />
        ) : (
          <div className="grid gap-8">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-bold text-slate-700">
                Signed in as <span className="font-black text-ink">{user.email}</span> ({user.role})
              </p>
              <button className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg bg-mist px-4 py-2 text-xs font-black uppercase tracking-wide text-ink hover:bg-sunshine" type="button" onClick={logout}>
                <LogOut aria-hidden="true" size={16} />
                Logout
              </button>
            </div>
            <DashboardCounts counts={data.counts} />
            <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
            {saveMessage && <p className="rounded-lg bg-leaf/10 p-3 text-sm font-bold text-canopy">{saveMessage}</p>}
            {activeTab === "users" && <UsersManager users={data.users} departments={data.departments} setData={setData} setSaveMessage={setSaveMessage} currentUser={user} />}
            {activeTab === "pages" && <PagesManager pages={data.pages} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "events" && <EventsManager events={data.events} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "opening" && <OpeningManager openingTimes={data.openingTimes} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "faqs" && <FaqManager faqs={data.faqs} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "media" && <MediaManager media={data.media} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "documents" && <DocumentsManager documents={data.documents} />}
            {activeTab === "newsletter" && <SubscriberManager subscribers={data.subscribers} />}
            {activeTab === "tickets" && <TicketAdmin ticketTypes={data.ticketTypes} bookings={data.bookings} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "audit" && <AuditLogManager auditLogs={data.auditLogs} />}
          </div>
        )}
      </PortalShell>
    </>
  );
}

function DashboardCounts({ counts }) {
  const cards = [
    ["Pages", counts.pages || 0, LayoutDashboard],
    ["Users", counts.users || 0, Users],
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
    ["users", "Users"],
    ["pages", "Pages"],
    ["events", "Events"],
    ["opening", "Opening Times"],
    ["faqs", "FAQs"],
    ["media", "Media"],
    ["documents", "Documents"],
    ["newsletter", "Newsletter"],
    ["tickets", "Tickets"],
    ["audit", "Audit"],
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

function UsersManager({ users, departments, setData, setSaveMessage, currentUser }) {
  const canManageUsers = isAllowed(currentUser, userAdminRoles);
  const roleOptions = currentUser?.role === "super_admin" ? superAdminManagedUserRoles : managedUserRoles;
  const resettableUsers = users.filter((user) => {
    if (user.role === "super_admin") return false;
    if (user.role === "admin" && currentUser?.role !== "super_admin") return false;
    return true;
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    departmentId: departments[0]?.id || "",
    jobTitle: "Ranger",
  });
  const [resetForm, setResetForm] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");

  const createUser = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const passwordError = strongPasswordMessage(form.password, 14);
      if (passwordError) throw new Error(passwordError);
      const data = await apiRequest("/admin/users", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setData((current) => ({ ...current, users: [data.user, ...current.users] }));
      setSaveMessage(`Created user: ${data.user.email}`);
      setForm({ name: "", email: "", password: "", role: "staff", departmentId: departments[0]?.id || "", jobTitle: "Ranger" });
    } catch (error) {
      setError(error.message);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (!resetForm.userId) throw new Error("Choose a user.");
      const passwordError = strongPasswordMessage(resetForm.password, 14);
      if (passwordError) throw new Error(passwordError);
      await apiRequest(`/admin/users/${resetForm.userId}/reset-password`, {
        method: "POST",
        body: JSON.stringify({ password: resetForm.password }),
      });
      const target = users.find((user) => String(user.id) === String(resetForm.userId));
      setResetForm({ userId: "", password: "" });
      setSaveMessage(`Password reset for: ${target?.email || "selected user"}`);
    } catch (error) {
      setError(error.message);
    }
  };

  const updateUser = async (user, patch) => {
    setError("");
    try {
      const payload = {
        name: user.name,
        role: user.role,
        departmentId: user.departmentId ?? user.department_id ?? "",
        jobTitle: user.job_title || "",
        disabled: Boolean(user.disabled_at),
        ...patch,
      };
      const data = await apiRequest(`/admin/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setData((current) => ({
        ...current,
        users: current.users.map((item) => (item.id === user.id ? { ...item, ...data.user } : item)),
      }));
      setSaveMessage(`Updated user: ${data.user.email}`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ManagerPanel title="User Management">
      {!canManageUsers && (
        <p className="rounded-lg bg-sunshine/30 p-3 text-sm font-bold text-ink">
          User creation and role changes require an admin or super-admin account.
        </p>
      )}
      {canManageUsers && (
        <div className="grid gap-4">
          <form className="rounded-lg border border-slate-200 bg-mist p-4" onSubmit={createUser}>
            <div className="flex items-center gap-2">
              <UserPlus aria-hidden="true" className="text-berry" />
              <h3 className="font-display text-2xl font-black text-ink">Create User</h3>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <AdminInput label="Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} required />
              <AdminInput label="Email" type="email" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} required />
              <AdminInput label="Temporary Password" type="password" value={form.password} onChange={(value) => setForm((current) => ({ ...current, password: value }))} required />
              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-ink">Role</span>
                <select className="focus-ring min-h-12 rounded-lg border border-slate-300 bg-white px-3" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}>
                  {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-ink">Department</span>
                <select className="focus-ring min-h-12 rounded-lg border border-slate-300 bg-white px-3" value={form.departmentId} onChange={(event) => setForm((current) => ({ ...current, departmentId: event.target.value }))}>
                  <option value="">No department</option>
                  {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
                </select>
              </label>
              <AdminInput label="Job Title" value={form.jobTitle} onChange={(value) => setForm((current) => ({ ...current, jobTitle: value }))} />
            </div>
            <p className="mt-3 rounded-lg bg-sunshine/25 p-3 text-xs font-bold uppercase tracking-wide text-ink">
              Temporary passwords must use 14+ characters with uppercase, lowercase, number and symbol.
            </p>
            <button className="focus-ring mt-4 inline-flex min-h-12 items-center gap-2 rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button" type="submit">
              <UserPlus aria-hidden="true" size={18} />
              Create User
            </button>
          </form>

          <form className="rounded-lg border border-slate-200 bg-white p-4" onSubmit={resetPassword}>
            <div className="flex items-center gap-2">
              <LockKeyhole aria-hidden="true" className="text-berry" />
              <h3 className="font-display text-2xl font-black text-ink">Reset User Password</h3>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-ink">User</span>
                <select className="focus-ring min-h-12 rounded-lg border border-slate-300 bg-white px-3" value={resetForm.userId} onChange={(event) => setResetForm((current) => ({ ...current, userId: event.target.value }))}>
                  <option value="">Choose user</option>
                  {resettableUsers.map((user) => <option key={user.id} value={user.id}>{user.name} - {user.role}</option>)}
                </select>
              </label>
              <AdminInput label="New Temporary Password" type="password" value={resetForm.password} onChange={(value) => setResetForm((current) => ({ ...current, password: value }))} required />
              <button className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-lg bg-plum px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button" type="submit">
                <LockKeyhole aria-hidden="true" size={18} />
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
      <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-mist text-ink">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Department</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-200">
                <td className="p-3">
                  <p className="font-black text-ink">{user.name}</p>
                  <p className="text-xs font-bold text-slate-600">{user.email}</p>
                </td>
                <td className="p-3">
                  <select
                    className="focus-ring min-h-10 rounded-lg border border-slate-300 px-2"
                    value={user.role}
                    disabled={!canManageUsers || user.role === "super_admin" || (user.role === "admin" && currentUser?.role !== "super_admin")}
                    onChange={(event) => updateUser(user, { role: event.target.value })}
                  >
                    {[...new Set([user.role, ...roleOptions])].map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </td>
                <td className="p-3">{user.department_name || "Not assigned"}</td>
                <td className="p-3">
                  <span className={`rounded-lg px-2 py-1 text-xs font-black uppercase ${user.disabled_at ? "bg-red-100 text-red-700" : "bg-leaf/10 text-canopy"}`}>
                    {user.disabled_at ? "Disabled" : "Active"}
                  </span>
                </td>
                <td className="p-3">
                  {canManageUsers && (
                    <button
                      className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg bg-mist px-3 py-2 text-xs font-black uppercase tracking-wide text-ink hover:bg-sunshine"
                      type="button"
                      disabled={user.id === currentUser?.id || (user.role === "admin" && currentUser?.role !== "super_admin") || user.role === "super_admin"}
                      onClick={() => updateUser(user, { disabled: !user.disabled_at })}
                    >
                      {user.disabled_at ? <ShieldCheck aria-hidden="true" size={16} /> : <Ban aria-hidden="true" size={16} />}
                      {user.disabled_at ? "Enable" : "Disable"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ManagerPanel>
  );
}

function AuditLogManager({ auditLogs }) {
  return (
    <ManagerPanel title="Audit Log">
      <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-mist text-ink">
            <tr>
              <th className="p-3">Time</th>
              <th className="p-3">User</th>
              <th className="p-3">Action</th>
              <th className="p-3">Entity</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-t border-slate-200">
                <td className="p-3">{log.created_at}</td>
                <td className="p-3">{log.user_name || log.user_email || "System"}</td>
                <td className="p-3 font-black text-ink">{log.action}</td>
                <td className="p-3">{log.entity_type || "-"} {log.entity_id ? `#${log.entity_id}` : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ManagerPanel>
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

function StaffPortal({ path, onNavigate }) {
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

  const logout = async () => {
    await apiRequest("/auth/logout", { method: "POST" }).catch(() => undefined);
    setUser(null);
    onNavigate("/staff/login");
  };

  const isRotaRoute = path?.startsWith("/staff/rota");

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
          <PortalRedirect title="Staff Login Required" message="Staff access requires an authorised Woodlands staff account." to="/staff/login" onNavigate={onNavigate} />
        ) : isRotaRoute ? (
          <div className="grid gap-6">
            <StaffSessionBar user={user} onLogout={logout} />
            <StaffRotaManager path={path} user={user} onNavigate={onNavigate} />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            <aside className="rounded-lg border-2 border-sunshine bg-white p-5 shadow-sm">
              <ShieldCheck aria-hidden="true" className="text-berry" />
              <h2 className="mt-3 font-display text-3xl font-black text-ink">Hello, {user.name}</h2>
              <p className="mt-2 text-sm font-bold text-slate-700">Role: {user.role}</p>
              <button className="focus-ring mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-mist px-4 py-2 text-xs font-black uppercase tracking-wide text-ink hover:bg-sunshine" type="button" onClick={logout}>
                <LogOut aria-hidden="true" size={16} />
                Logout
              </button>
              {dashboard?.employee && (
                <p className="mt-2 text-sm font-bold text-slate-700">
                  {dashboard.employee.job_title} - {dashboard.employee.department_name}
                </p>
              )}
              <AppLink href="/staff/rota" onNavigate={onNavigate} className="focus-ring mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg bg-sunshine px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-ink shadow-button">
                <CalendarClock aria-hidden="true" size={18} />
                Rota / Shifts
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

function StaffSessionBar({ user, onLogout }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-bold text-slate-700">
        Signed in as <span className="font-black text-ink">{user.email}</span> ({user.role})
      </p>
      <button className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg bg-mist px-4 py-2 text-xs font-black uppercase tracking-wide text-ink hover:bg-sunshine" type="button" onClick={onLogout}>
        <LogOut aria-hidden="true" size={16} />
        Logout
      </button>
    </div>
  );
}

function StaffRotaManager({ path, user, onNavigate }) {
  const [data, setData] = useState({ shifts: [], assignments: [], employees: [], departments: [], canManage: false, canCreate: false, canAssign: false, canEdit: false });
  const [loading, setLoading] = useState(true);
  const [newShift, setNewShift] = useState({ title: "", date: "", startTime: "", endTime: "", location: "", departmentId: "", employeeId: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const view = path.endsWith("/calendar") ? "calendar" : path.endsWith("/shifts") ? "shifts" : path.endsWith("/assignments") ? "assignments" : "overview";

  const loadShifts = async () => {
    const next = await apiRequest("/staff/rota");
    setData(next);
  };

  useEffect(() => {
    let isMounted = true;
    loadShifts()
      .catch((error) => {
        if (isMounted) setError(error.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

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
    setError("");
    setMessage("");
    try {
      await apiRequest("/staff/rota/shifts", {
        method: "POST",
        body: JSON.stringify(newShift),
      });
      setNewShift({ title: "", date: "", startTime: "", endTime: "", location: "", departmentId: "", employeeId: "" });
      setMessage("Shift created.");
      await loadShifts();
    } catch (error) {
      setError(error.message);
    }
  };

  const updateShift = async (shift, patch) => {
    setError("");
    setMessage("");
    try {
      await apiRequest(`/staff/rota/shifts/${shift.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: shift.title,
          date: shift.date,
          startTime: shift.start_time,
          endTime: shift.end_time,
          location: shift.location || "",
          departmentId: shift.department_id || "",
          status: shift.status,
          ...patch,
        }),
      });
      setMessage("Shift updated.");
      await loadShifts();
    } catch (error) {
      setError(error.message);
    }
  };

  const assignEmployee = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const shiftId = form.get("shiftId");
    const employeeId = form.get("employeeId");
    setError("");
    setMessage("");
    try {
      await apiRequest(`/staff/rota/shifts/${shiftId}/assignments`, {
        method: "POST",
        body: JSON.stringify({ employeeId }),
      });
      event.currentTarget.reset();
      setMessage("Employee assigned.");
      await loadShifts();
    } catch (error) {
      setError(error.message);
    }
  };

  const unassignEmployee = async (shiftId, employeeId) => {
    setError("");
    setMessage("");
    try {
      await apiRequest(`/staff/rota/shifts/${shiftId}/assignments/${employeeId}`, { method: "DELETE" });
      setMessage("Assignment removed.");
      await loadShifts();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border-2 border-sunshine bg-white p-5 shadow-lift">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-berry">Staff Portal</p>
            <h2 className="mt-2 font-display text-4xl font-black text-ink">Rota / Shifts</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              {data.canCreate ? "Create, edit and assign Woodlands shifts." : data.canAssign ? "View the team rota and assign staff in your department." : "View your assigned Woodlands rota."}
            </p>
          </div>
          <CalendarClock aria-hidden="true" className="text-berry" size={46} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            ["/staff/rota", "Overview", LayoutDashboard],
            ["/staff/rota/calendar", "Calendar", CalendarDays],
            ["/staff/rota/shifts", "Shifts", ListChecks],
            ["/staff/rota/assignments", "Assignments", UserCog],
          ].map(([href, label, Icon]) => (
            <AppLink key={href} href={href} onNavigate={onNavigate} className={`focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-black uppercase tracking-wide ${path === href ? "bg-woodpink text-white" : "bg-mist text-ink hover:bg-sunshine"}`}>
              <Icon aria-hidden="true" size={17} />
              {label}
            </AppLink>
          ))}
          <AppLink href="/staff" onNavigate={onNavigate} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-black uppercase tracking-wide text-ink ring-1 ring-slate-200 hover:bg-sunshine">
            Staff Dashboard
          </AppLink>
        </div>
      </div>

      {loading ? (
        <LoadingCard label="Loading rota..." />
      ) : !isAllowed(user, shiftRoles) ? (
        <div className="rounded-lg border-2 border-sunshine bg-white p-5 shadow-sm">
          <p className="font-bold text-ink">This staff account does not have rota access.</p>
        </div>
      ) : (
        <>
          {message && <p className="rounded-lg bg-leaf/10 p-3 text-sm font-bold text-canopy">{message}</p>}
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
          {(view === "overview" || view === "shifts") && data.canCreate && (
            <form className="rounded-lg border-2 border-sunshine bg-white p-5 shadow-lift" onSubmit={createShift}>
              <h3 className="font-display text-3xl font-black text-ink">Create Shift</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <AdminInput label="Title" value={newShift.title} onChange={(value) => setNewShift((current) => ({ ...current, title: value }))} required />
                <AdminInput label="Date" type="date" value={newShift.date} onChange={(value) => setNewShift((current) => ({ ...current, date: value }))} required />
                <AdminInput label="Location" value={newShift.location} onChange={(value) => setNewShift((current) => ({ ...current, location: value }))} />
                <AdminInput label="Start Time" type="time" value={newShift.startTime} onChange={(value) => setNewShift((current) => ({ ...current, startTime: value }))} required />
                <AdminInput label="End Time" type="time" value={newShift.endTime} onChange={(value) => setNewShift((current) => ({ ...current, endTime: value }))} required />
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold text-ink">Department</span>
                  <select className="focus-ring min-h-12 rounded-lg border border-slate-300 bg-white px-3" value={newShift.departmentId} onChange={(event) => setNewShift((current) => ({ ...current, departmentId: event.target.value }))}>
                    <option value="">No department</option>
                    {data.departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-extrabold text-ink">Assign Employee</span>
                  <select className="focus-ring min-h-12 rounded-lg border border-slate-300 bg-white px-3" value={newShift.employeeId} onChange={(event) => setNewShift((current) => ({ ...current, employeeId: event.target.value }))}>
                    <option value="">Unassigned</option>
                    {data.employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name} - {employee.department}</option>)}
                  </select>
                </label>
              </div>
              <button className="focus-ring mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button" type="submit">
                <Save aria-hidden="true" size={18} />
                Save Shift
              </button>
            </form>
          )}

          {view === "calendar" ? (
            <RotaCalendar shifts={data.shifts} assignmentsByShift={assignmentsByShift} />
          ) : view === "assignments" ? (
            <RotaAssignments data={data} assignmentsByShift={assignmentsByShift} onAssign={assignEmployee} onUnassign={unassignEmployee} />
          ) : (
            <RotaShiftList data={data} assignmentsByShift={assignmentsByShift} onUpdate={updateShift} />
          )}
        </>
      )}
    </div>
  );
}

function RotaShiftList({ data, assignmentsByShift, onUpdate }) {
  return (
    <div className="rounded-lg border-2 border-sunshine bg-white p-5 shadow-lift">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl font-black text-ink">Scheduled Shifts</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">Calendar and list information is stored in the Woodlands SQL database.</p>
        </div>
        <ListChecks aria-hidden="true" className="text-berry" size={42} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.shifts.map((shift) => (
          data.canEdit ? (
            <EditableShiftCard key={shift.id} shift={shift} assignments={assignmentsByShift.get(shift.id) || []} onSave={onUpdate} />
          ) : (
            <ReadOnlyShiftCard key={shift.id} shift={shift} assignments={assignmentsByShift.get(shift.id) || []} />
          )
        ))}
        {!data.shifts.length && <p className="rounded-lg bg-mist p-4 text-sm font-bold text-slate-700">No shifts are currently assigned.</p>}
      </div>
    </div>
  );
}

function EditableShiftCard({ shift, assignments, onSave }) {
  const [draft, setDraft] = useState({
    title: shift.title,
    date: shift.date,
    startTime: shift.start_time,
    endTime: shift.end_time,
    location: shift.location || "",
  });

  useEffect(() => {
    setDraft({
      title: shift.title,
      date: shift.date,
      startTime: shift.start_time,
      endTime: shift.end_time,
      location: shift.location || "",
    });
  }, [shift]);

  return (
    <article className="rounded-lg border border-slate-200 bg-mist p-4">
      <AdminInput label="Date" type="date" value={draft.date} onChange={(value) => setDraft((current) => ({ ...current, date: value }))} />
      <div className="mt-3 grid gap-3">
        <AdminInput label="Title" value={draft.title} onChange={(value) => setDraft((current) => ({ ...current, title: value }))} />
        <div className="grid gap-3 sm:grid-cols-2">
          <AdminInput label="Start" type="time" value={draft.startTime} onChange={(value) => setDraft((current) => ({ ...current, startTime: value }))} />
          <AdminInput label="End" type="time" value={draft.endTime} onChange={(value) => setDraft((current) => ({ ...current, endTime: value }))} />
        </div>
        <AdminInput label="Location" value={draft.location} onChange={(value) => setDraft((current) => ({ ...current, location: value }))} />
      </div>
      <AssignmentBadges shift={shift} assignments={assignments} />
      <button className="focus-ring mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-woodpink px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-button" type="button" onClick={() => onSave(shift, draft)}>
        <Save aria-hidden="true" size={16} />
        Save Changes
      </button>
    </article>
  );
}

function ReadOnlyShiftCard({ shift, assignments }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-mist p-4">
      <p className="text-sm font-black uppercase tracking-wide text-berry">{shift.date}</p>
      <h4 className="mt-2 font-display text-2xl font-black text-ink">{shift.title}</h4>
      <p className="mt-2 text-sm font-bold text-slate-700">{shift.start_time} - {shift.end_time}</p>
      <p className="mt-1 text-sm leading-6 text-slate-700">{shift.location || shift.department_name}</p>
      <AssignmentBadges shift={shift} assignments={assignments} />
    </article>
  );
}

function AssignmentBadges({ shift, assignments }) {
  return (
    <div className="mt-3 grid gap-2">
      {assignments.map((assignment) => (
        <p key={`${shift.id}-${assignment.employeeId || assignment.name}`} className="rounded-lg bg-white p-2 text-xs font-bold text-slate-700">
          {assignment.name} - {assignment.jobTitle || assignment.role}
        </p>
      ))}
    </div>
  );
}

function RotaCalendar({ shifts, assignmentsByShift }) {
  const grouped = useMemo(() => {
    const map = new Map();
    for (const shift of shifts) {
      const list = map.get(shift.date) || [];
      list.push(shift);
      map.set(shift.date, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [shifts]);

  return (
    <div className="rounded-lg border-2 border-sunshine bg-white p-5 shadow-lift">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl font-black text-ink">Calendar View</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">Grouped by shift date for fast rota scanning.</p>
        </div>
        <CalendarDays aria-hidden="true" className="text-berry" size={42} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {grouped.map(([date, dateShifts]) => (
          <section key={date} className="rounded-lg border border-slate-200 bg-mist p-4">
            <h4 className="font-display text-2xl font-black text-ink">{date}</h4>
            <div className="mt-3 grid gap-3">
              {dateShifts.map((shift) => (
                <article key={shift.id} className="rounded-lg bg-white p-3 text-sm shadow-sm">
                  <p className="font-black text-berry">{shift.start_time} - {shift.end_time}</p>
                  <p className="mt-1 font-black text-ink">{shift.title}</p>
                  <p className="text-slate-700">{shift.location || shift.department_name}</p>
                  <p className="mt-2 text-xs font-bold text-slate-600">
                    {(assignmentsByShift.get(shift.id) || []).map((assignment) => assignment.name).join(", ") || "Unassigned"}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
        {!grouped.length && <p className="rounded-lg bg-mist p-4 text-sm font-bold text-slate-700">No shifts to show.</p>}
      </div>
    </div>
  );
}

function RotaAssignments({ data, assignmentsByShift, onAssign, onUnassign }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      {data.canAssign && (
        <form className="rounded-lg border-2 border-sunshine bg-white p-5 shadow-lift" onSubmit={onAssign}>
          <h3 className="font-display text-3xl font-black text-ink">Assign Staff</h3>
          <label className="mt-5 grid gap-2">
            <span className="text-sm font-extrabold text-ink">Shift</span>
            <select name="shiftId" className="focus-ring min-h-12 rounded-lg border border-slate-300 bg-white px-3" required>
              <option value="">Choose shift</option>
              {data.shifts.map((shift) => <option key={shift.id} value={shift.id}>{shift.date} - {shift.title}</option>)}
            </select>
          </label>
          <label className="mt-4 grid gap-2">
            <span className="text-sm font-extrabold text-ink">Employee</span>
            <select name="employeeId" className="focus-ring min-h-12 rounded-lg border border-slate-300 bg-white px-3" required>
              <option value="">Choose employee</option>
              {data.employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name} - {employee.department}</option>)}
            </select>
          </label>
          <button className="focus-ring mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button" type="submit">
            <UserCog aria-hidden="true" size={18} />
            Assign
          </button>
        </form>
      )}
      <div className="rounded-lg border-2 border-sunshine bg-white p-5 shadow-lift">
        <h3 className="font-display text-3xl font-black text-ink">Current Assignments</h3>
        <div className="mt-5 grid gap-4">
          {data.shifts.map((shift) => (
            <section key={shift.id} className="rounded-lg bg-mist p-4">
              <p className="text-sm font-black uppercase tracking-wide text-berry">{shift.date}</p>
              <h4 className="mt-1 font-display text-2xl font-black text-ink">{shift.title}</h4>
              <div className="mt-3 grid gap-2">
                {(assignmentsByShift.get(shift.id) || []).map((assignment) => (
                  <div key={`${shift.id}-${assignment.employeeId || assignment.name}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white p-3 text-sm">
                    <span className="font-bold text-slate-700">{assignment.name} - {assignment.jobTitle || assignment.role}</span>
                    {data.canAssign && assignment.employeeId && (
                      <button className="focus-ring rounded-lg bg-red-50 px-3 py-2 text-xs font-black uppercase tracking-wide text-red-700" type="button" onClick={() => onUnassign(shift.id, assignment.employeeId)}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {!(assignmentsByShift.get(shift.id) || []).length && <p className="rounded-lg bg-white p-3 text-sm font-bold text-slate-600">Unassigned</p>}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
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
