import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Ban,
  BarChart3,
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileImage,
  Home,
  LayoutDashboard,
  ListChecks,
  LockKeyhole,
  LogOut,
  MapPin,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Save,
  Send,
  Settings,
  ShieldCheck,
  Square,
  Ticket,
  Trash2,
  Upload,
  UserCog,
  UserCircle,
  UserPlus,
  Users,
  Utensils,
} from "lucide-react";
import { apiRequest } from "../lib/api.js";
import { AppLink } from "./Link.jsx";
import { FoodMenuBrowser } from "./FoodMenuBrowser.jsx";
import { mediaSource } from "../data/assets.js";

const adminRoles = ["admin", "editor", "super_admin"];
const userAdminRoles = ["admin", "super_admin"];
const staffRoles = ["staff", "supervisor", "manager", "payroll_admin", "super_admin", "admin"];
const shiftRoles = ["staff", "supervisor", "manager", "super_admin", "admin"];
const managedUserRoles = ["staff", "supervisor", "manager", "editor", "payroll_admin"];
const superAdminManagedUserRoles = [...managedUserRoles, "admin"];

export function PortalRoute({ type, path = "", token = "", onNavigate }) {
  if (type === "shiftRedirect") return <ShiftRedirect onNavigate={onNavigate} />;
  if (type === "adminLogin") return <AdminLoginPortal onNavigate={onNavigate} />;
  if (type === "adminSetup") return <AdminSetupPortal onNavigate={onNavigate} />;
  if (type === "staffLogin") return <StaffLoginPortal onNavigate={onNavigate} />;
  if (type === "staffInvite") return <StaffInvitePortal token={token} onNavigate={onNavigate} />;
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
      <PortalShell wide>
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
    <section className="section-band bg-woodpink py-7 text-white">
      <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sunshine">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-white/90">{description}</p>
        {roles.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {roles.map((role) => (
              <span key={role} className="rounded-md bg-sunshine px-2.5 py-1.5 text-[11px] font-black uppercase tracking-wide text-ink">
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

function PortalShell({ children, wide = false }) {
  return <section className={`mx-auto py-12 ${wide ? "max-w-[1680px] px-3 lg:px-5" : "max-w-7xl px-4 lg:px-6"}`}>{children}</section>;
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
      <PortalShell wide>
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

function StaffInvitePortal({ token, onNavigate }) {
  const [invite, setInvite] = useState(null);
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    apiRequest(`/auth/invites/${token}`)
      .then((data) => {
        if (isMounted) setInvite(data.invite);
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
  }, [token]);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const passwordError = strongPasswordMessage(form.password, 14);
      if (passwordError) throw new Error(passwordError);
      if (form.password !== form.confirmPassword) throw new Error("Passwords do not match.");
      await apiRequest(`/auth/invites/${token}/accept`, {
        method: "POST",
        body: JSON.stringify({ password: form.password }),
      });
      onNavigate("/staff");
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PortalHero eyebrow="staff.woodlandspark.com" title="Set Staff Password" description="Use your private invitation link to activate your Woodlands staff portal access." roles={["invite link required"]} />
      <PortalShell>
        {loading ? (
          <LoadingCard label="Checking invite..." />
        ) : error && !invite ? (
          <div className="mx-auto max-w-xl rounded-lg border-2 border-sunshine bg-white p-6 shadow-lift">
            <Ban aria-hidden="true" className="text-berry" />
            <h2 className="mt-3 font-display text-3xl font-black text-ink">Invite unavailable</h2>
            <p className="mt-2 text-sm font-bold text-red-700">{error}</p>
          </div>
        ) : (
          <form className="mx-auto max-w-xl rounded-lg border-2 border-sunshine bg-white p-6 shadow-lift" onSubmit={submit}>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-berry">{invite.email}</p>
            <h2 className="mt-2 font-display text-3xl font-black text-ink">Welcome, {invite.name}</h2>
            <p className="mt-2 rounded-lg bg-sunshine/25 p-3 text-xs font-bold uppercase tracking-wide text-ink">
              Role: {invite.role}. Choose a strong password before signing in.
            </p>
            <div className="mt-5 grid gap-4">
              <AdminInput label="Password" type="password" value={form.password} onChange={(value) => setForm((current) => ({ ...current, password: value }))} required />
              <AdminInput label="Confirm Password" type="password" value={form.confirmPassword} onChange={(value) => setForm((current) => ({ ...current, confirmPassword: value }))} required />
            </div>
            {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
            <button className="focus-ring mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button" type="submit" disabled={submitting}>
              <ShieldCheck aria-hidden="true" size={18} />
              {submitting ? "Saving..." : "Set Password"}
            </button>
          </form>
        )}
      </PortalShell>
    </>
  );
}

function PasswordResetRequired({ user, onComplete }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const passwordError = strongPasswordMessage(form.newPassword, 14);
      if (passwordError) throw new Error(passwordError);
      if (form.newPassword !== form.confirmPassword) throw new Error("Passwords do not match.");
      const data = await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      onComplete(data.user);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="mx-auto max-w-xl rounded-lg border-2 border-sunshine bg-white p-6 shadow-lift" onSubmit={submit}>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-berry">{user.email}</p>
      <h2 className="mt-2 font-display text-3xl font-black text-ink">Reset Your Password</h2>
      <p className="mt-2 text-sm leading-6 text-slate-700">A password change is required before this account can continue.</p>
      <div className="mt-5 grid gap-4">
        <AdminInput label="Current Password" type="password" value={form.currentPassword} onChange={(value) => setForm((current) => ({ ...current, currentPassword: value }))} required />
        <AdminInput label="New Password" type="password" value={form.newPassword} onChange={(value) => setForm((current) => ({ ...current, newPassword: value }))} required />
        <AdminInput label="Confirm New Password" type="password" value={form.confirmPassword} onChange={(value) => setForm((current) => ({ ...current, confirmPassword: value }))} required />
      </div>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
      <button className="focus-ring mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button" type="submit" disabled={submitting}>
        <Save aria-hidden="true" size={18} />
        {submitting ? "Saving..." : "Save Password"}
      </button>
    </form>
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
  const [activeTab, setActiveTab] = useState(path === "/admin/users" ? "users" : path === "/admin/rota" ? "rota" : "pages");
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
    if (path === "/admin/rota") setActiveTab("rota");
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
      <PortalShell wide>
        {loading ? (
          <LoadingCard label="Loading admin portal..." />
        ) : !isAllowed(user, adminRoles) ? (
          <PortalRedirect title="Admin Login Required" message="Admin access requires an authorised Woodlands admin, editor or super-admin account." to="/admin/login" onNavigate={onNavigate} />
        ) : user?.mustResetPassword ? (
          <PasswordResetRequired user={user} onComplete={(nextUser) => setUser(nextUser)} />
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
            <DashboardCounts counts={data.counts} onSelectTab={setActiveTab} onNavigate={onNavigate} />
            <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
            {saveMessage && <p className="rounded-lg bg-leaf/10 p-3 text-sm font-bold text-canopy">{saveMessage}</p>}
            {activeTab === "users" && <UsersManager users={data.users} departments={data.departments} setData={setData} setSaveMessage={setSaveMessage} currentUser={user} />}
            {activeTab === "pages" && <PagesManager pages={data.pages} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "events" && <EventsManager events={data.events} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "opening" && <OpeningManager openingTimes={data.openingTimes} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "faqs" && <FaqManager faqs={data.faqs} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "media" && <MediaManager media={data.media} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "documents" && <DocumentsManager documents={data.documents} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "newsletter" && <SubscriberManager subscribers={data.subscribers} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "tickets" && <TicketAdmin ticketTypes={data.ticketTypes} bookings={data.bookings} setData={setData} setSaveMessage={setSaveMessage} />}
            {activeTab === "rota" && <StaffRotaManager path="/staff/rota/shifts" user={user} onNavigate={onNavigate} />}
            {activeTab === "audit" && <AuditLogManager auditLogs={data.auditLogs} />}
          </div>
        )}
      </PortalShell>
    </>
  );
}

function DashboardCounts({ counts, onSelectTab, onNavigate }) {
  const cards = [
    ["Pages", counts.pages || 0, LayoutDashboard, "pages"],
    ["Users", counts.users || 0, Users, "users"],
    ["Rota / Shifts", counts.shifts || 0, CalendarClock, "rota"],
    ["Events", counts.events || 0, CalendarClock, "events"],
    ["FAQs", counts.faqs || 0, ShieldCheck, "faqs"],
    ["Bookings", counts.bookings || 0, Ticket, "tickets"],
    ["Subscribers", counts.subscribers || 0, Users, "newsletter"],
    ["Menu Items", counts.menuItems || 0, Utensils, "tickets"],
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(([label, value, Icon, tab]) => (
        <button key={label} type="button" className="focus-ring rounded-lg border-2 border-sunshine bg-white p-5 text-left text-ink shadow-sm transition hover:-translate-y-1 hover:bg-sunshine/20" onClick={() => (tab === "rota" ? onNavigate("/staff/rota") : onSelectTab(tab))}>
          <Icon aria-hidden="true" className="text-berry" />
          <p className="mt-3 text-sm font-black uppercase tracking-wide text-slate-600">{label}</p>
          <p className="font-display text-4xl font-black">{value}</p>
        </button>
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
    ["rota", "Rota / Shifts"],
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
  const [roleFilter, setRoleFilter] = useState("");
  const [error, setError] = useState("");
  const visibleUsers = roleFilter ? users.filter((user) => user.role === roleFilter) : users;
  const userRoleFilters = [...new Set(users.map((user) => user.role).filter(Boolean))].sort();

  const createUser = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (form.password) {
        const passwordError = strongPasswordMessage(form.password, 14);
        if (passwordError) throw new Error(passwordError);
      }
      const data = await apiRequest("/admin/users", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setData((current) => ({ ...current, users: [data.user, ...current.users] }));
      setSaveMessage(data.inviteUrl ? `Created user and queued invite: ${data.user.email}. Invite link: ${data.inviteUrl}` : `Created user: ${data.user.email}`);
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

  const resendInvite = async (user) => {
    setError("");
    try {
      const data = await apiRequest(`/admin/users/${user.id}/invite`, { method: "POST" });
      setData((current) => ({
        ...current,
        users: current.users.map((item) => (item.id === user.id ? { ...item, invite_sent_at: new Date().toISOString(), invite_accepted_at: null } : item)),
      }));
      setSaveMessage(`Invite queued for ${user.email}. Invite link: ${data.inviteUrl}`);
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
          <EditorPreviewGrid
            editor={(
              <form className="rounded-lg border border-slate-200 bg-mist p-4" onSubmit={createUser}>
                <div className="flex items-center gap-2">
                  <UserPlus aria-hidden="true" className="text-berry" />
                  <h3 className="font-display text-2xl font-black text-ink">Create User</h3>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <AdminInput label="Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} required />
                  <AdminInput label="Email" type="email" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} required />
                  <AdminInput label="Temporary Password (optional)" type="password" value={form.password} onChange={(value) => setForm((current) => ({ ...current, password: value }))} />
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
                  Leave the temporary password blank to send an invite link. Any temporary password must use 14+ characters with uppercase, lowercase, number and symbol.
                </p>
                <button className="focus-ring mt-4 inline-flex min-h-12 items-center gap-2 rounded-lg bg-woodpink px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button" type="submit">
                  <UserPlus aria-hidden="true" size={18} />
                  Create User
                </button>
              </form>
            )}
            preview={<AdminUserPreview form={form} departments={departments} />}
          />

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
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <label className="grid max-w-sm gap-2">
          <span className="text-sm font-extrabold text-ink">Filter users by role</span>
          <select className="focus-ring min-h-12 rounded-lg border border-slate-300 bg-white px-3" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            <option value="">All roles</option>
            {userRoleFilters.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
        </label>
      </div>
      <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-mist text-ink">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Department</th>
              <th className="p-3">Status</th>
              <th className="p-3">Invite</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleUsers.map((user) => (
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
                  {user.must_reset_password ? <p className="mt-1 text-xs font-bold text-berry">Password reset required</p> : null}
                </td>
                <td className="p-3">
                  <p className="text-xs font-bold text-slate-600">{user.invite_accepted_at ? "Accepted" : user.invite_sent_at ? "Sent" : "Not sent"}</p>
                  {canManageUsers && user.role !== "super_admin" && (
                    <button className="focus-ring mt-2 inline-flex min-h-9 items-center gap-2 rounded-lg bg-sunshine px-3 py-2 text-xs font-black uppercase tracking-wide text-ink" type="button" onClick={() => resendInvite(user)}>
                      <Send aria-hidden="true" size={15} />
                      Invite
                    </button>
                  )}
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
  const [selectedId, setSelectedId] = useState(pages[0]?.id || "");
  const [newPage, setNewPage] = useState({ path: "", title: "", summary: "", image: "", source_url: "", status: "draft" });
  const [newSection, setNewSection] = useState({ title: "", body: "", sort_order: 0 });
  const selectedPage = pages.find((page) => String(page.id) === String(selectedId)) || pages[0];

  useEffect(() => {
    if (!selectedId && pages[0]?.id) setSelectedId(pages[0].id);
  }, [pages, selectedId]);

  const createPage = async (event) => {
    event.preventDefault();
    const data = await apiRequest("/admin/pages", { method: "POST", body: JSON.stringify(newPage) });
    setData((current) => ({ ...current, pages: [data.page, ...current.pages] }));
    setSelectedId(data.page.id);
    setNewPage({ path: "", title: "", summary: "", image: "", source_url: "", status: "draft" });
    setSaveMessage(`Created page: ${data.page.title}`);
  };

  const updatePage = async (page) => {
    const data = await apiRequest(`/admin/pages/${page.id}`, {
      method: "PUT",
      body: JSON.stringify(page),
    });
    setData((current) => updateRecord(current, "pages", page.id, data.page));
    setSaveMessage(`Saved page: ${page.title}`);
  };

  const deletePage = async (page) => {
    if (!window.confirm(`Delete ${page.title}?`)) return;
    await apiRequest(`/admin/pages/${page.id}`, { method: "DELETE" });
    setData((current) => removeRecord(current, "pages", page.id));
    setSelectedId("");
    setSaveMessage(`Deleted page: ${page.title}`);
  };

  const createSection = async (event) => {
    event.preventDefault();
    if (!selectedPage) return;
    const data = await apiRequest(`/admin/pages/${selectedPage.id}/sections`, {
      method: "POST",
      body: JSON.stringify(newSection),
    });
    setData((current) => addPageSection(current, selectedPage.id, data.section));
    setNewSection({ title: "", body: "", sort_order: 0 });
    setSaveMessage(`Created section: ${data.section.title}`);
  };

  const updateSection = async (section) => {
    const data = await apiRequest(`/admin/page-sections/${section.id}`, {
      method: "PUT",
      body: JSON.stringify(section),
    });
    setData((current) => updatePageSectionRecord(current, selectedPage.id, section.id, data.section));
    setSaveMessage(`Saved section: ${section.title}`);
  };

  const deleteSection = async (section) => {
    if (!window.confirm(`Delete section ${section.title}?`)) return;
    await apiRequest(`/admin/page-sections/${section.id}`, { method: "DELETE" });
    setData((current) => removePageSection(current, selectedPage.id, section.id));
    setSaveMessage(`Deleted section: ${section.title}`);
  };

  return (
    <ManagerPanel title="Pages & Content">
      <form className="rounded-lg border border-slate-200 bg-sunshine/15 p-4" onSubmit={createPage}>
        <h3 className="font-display text-2xl font-black text-ink">Create Page</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <AdminInput label="Path" value={newPage.path} onChange={(value) => setNewPage((current) => ({ ...current, path: value }))} required />
          <AdminInput label="Title" value={newPage.title} onChange={(value) => setNewPage((current) => ({ ...current, title: value }))} required />
          <AdminInput label="Hero Image / Media Path" value={newPage.image} onChange={(value) => setNewPage((current) => ({ ...current, image: value }))} />
          <AdminTextarea label="Summary" value={newPage.summary} onChange={(value) => setNewPage((current) => ({ ...current, summary: value }))} />
          <AdminInput label="Source URL" value={newPage.source_url} onChange={(value) => setNewPage((current) => ({ ...current, source_url: value }))} />
          <AdminSelect label="Status" value={newPage.status} onChange={(value) => setNewPage((current) => ({ ...current, status: value }))} options={["draft", "published"]} />
        </div>
        <CreateButton label="Create Page" />
      </form>

      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="max-h-[760px] overflow-auto rounded-lg border border-slate-200 bg-mist p-3">
          {pages.map((page) => (
            <button key={page.id} type="button" className={`focus-ring mb-2 block w-full rounded-lg p-3 text-left text-sm font-black ${String(selectedPage?.id) === String(page.id) ? "bg-woodpink text-white" : "bg-white text-ink hover:bg-sunshine"}`} onClick={() => setSelectedId(page.id)}>
              <span className="block">{page.title}</span>
              <span className="block truncate text-xs opacity-80">{page.path}</span>
            </button>
          ))}
        </aside>
        {selectedPage && (
          <EditorPreviewGrid
            editor={(
              <div className="grid gap-4">
                <EditableCard title={selectedPage.path}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminInput label="Path" value={selectedPage.path} onChange={(value) => setData((current) => updateRecord(current, "pages", selectedPage.id, { path: value }))} />
                    <AdminInput label="Title" value={selectedPage.title} onChange={(value) => setData((current) => updateRecord(current, "pages", selectedPage.id, { title: value }))} />
                    <AdminInput label="Hero Image / Media Path" value={selectedPage.image || ""} onChange={(value) => setData((current) => updateRecord(current, "pages", selectedPage.id, { image: value }))} />
                    <AdminInput label="Source URL" value={selectedPage.source_url || ""} onChange={(value) => setData((current) => updateRecord(current, "pages", selectedPage.id, { source_url: value }))} />
                    <AdminSelect label="Status" value={selectedPage.status || "published"} onChange={(value) => setData((current) => updateRecord(current, "pages", selectedPage.id, { status: value }))} options={["draft", "published"]} />
                  </div>
                  <AdminTextarea label="Summary" value={selectedPage.summary || ""} onChange={(value) => setData((current) => updateRecord(current, "pages", selectedPage.id, { summary: value }))} />
                  <ActionRow>
                    <SaveButton onClick={() => updatePage(selectedPage)} />
                    <DeleteButton onClick={() => deletePage(selectedPage)} />
                  </ActionRow>
                </EditableCard>

                <form className="rounded-lg border border-slate-200 bg-white p-4" onSubmit={createSection}>
                  <h3 className="font-display text-2xl font-black text-ink">Add Content Section</h3>
                  <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.35fr]">
                    <AdminInput label="Section Title" value={newSection.title} onChange={(value) => setNewSection((current) => ({ ...current, title: value }))} required />
                    <AdminInput label="Order" type="number" value={newSection.sort_order} onChange={(value) => setNewSection((current) => ({ ...current, sort_order: value }))} />
                    <div className="lg:col-span-2">
                      <AdminTextarea label="Section Body" value={newSection.body} onChange={(value) => setNewSection((current) => ({ ...current, body: value }))} />
                    </div>
                  </div>
                  <CreateButton label="Add Section" />
                </form>

                {(selectedPage.sections || []).map((section) => (
                  <EditableCard key={section.id} title={`Section ${section.id}`}>
                    <div className="grid gap-4 md:grid-cols-[1fr_0.25fr]">
                      <AdminInput label="Section Title" value={section.title} onChange={(value) => setData((current) => updatePageSectionRecord(current, selectedPage.id, section.id, { title: value }))} />
                      <AdminInput label="Order" type="number" value={section.sort_order || 0} onChange={(value) => setData((current) => updatePageSectionRecord(current, selectedPage.id, section.id, { sort_order: value }))} />
                    </div>
                    <AdminTextarea label="Body Text" value={section.body || ""} onChange={(value) => setData((current) => updatePageSectionRecord(current, selectedPage.id, section.id, { body: value }))} />
                    <ActionRow>
                      <SaveButton onClick={() => updateSection(section)} />
                      <DeleteButton onClick={() => deleteSection(section)} />
                    </ActionRow>
                  </EditableCard>
                ))}
              </div>
            )}
            preview={<AdminPagePreview page={selectedPage} />}
          />
        )}
      </div>
    </ManagerPanel>
  );
}

function EventsManager({ events, setData, setSaveMessage }) {
  const [form, setForm] = useState({ path: "", title: "", event_date: "", summary: "", image: "", source_url: "", status: "draft" });
  const createEvent = async (event) => {
    event.preventDefault();
    const data = await apiRequest("/admin/events", { method: "POST", body: JSON.stringify(form) });
    setData((current) => ({ ...current, events: [data.event, ...current.events] }));
    setForm({ path: "", title: "", event_date: "", summary: "", image: "", source_url: "", status: "draft" });
    setSaveMessage(`Created event: ${data.event.title}`);
  };
  const updateEvent = async (event) => {
    const data = await apiRequest(`/admin/events/${event.id}`, {
      method: "PUT",
      body: JSON.stringify(event),
    });
    if (data.event) setData((current) => updateRecord(current, "events", event.id, data.event));
    setSaveMessage(`Saved event: ${event.title}`);
  };
  const deleteEvent = async (event) => {
    if (!window.confirm(`Delete ${event.title}?`)) return;
    await apiRequest(`/admin/events/${event.id}`, { method: "DELETE" });
    setData((current) => removeRecord(current, "events", event.id));
    setSaveMessage(`Deleted event: ${event.title}`);
  };
  return (
    <ManagerPanel title="Events Manager">
      <form className="rounded-lg border border-slate-200 bg-sunshine/15 p-4" onSubmit={createEvent}>
        <h3 className="font-display text-2xl font-black text-ink">Create Event</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <AdminInput label="Title" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} required />
          <AdminInput label="Path" value={form.path} onChange={(value) => setForm((current) => ({ ...current, path: value }))} />
          <AdminInput label="Date" value={form.event_date} onChange={(value) => setForm((current) => ({ ...current, event_date: value }))} />
          <AdminInput label="Image / Media Path" value={form.image} onChange={(value) => setForm((current) => ({ ...current, image: value }))} />
          <AdminInput label="Source URL" value={form.source_url} onChange={(value) => setForm((current) => ({ ...current, source_url: value }))} />
          <AdminSelect label="Status" value={form.status} onChange={(value) => setForm((current) => ({ ...current, status: value }))} options={["draft", "published"]} />
        </div>
        <AdminTextarea label="Summary" value={form.summary} onChange={(value) => setForm((current) => ({ ...current, summary: value }))} />
        <CreateButton label="Create Event" />
      </form>
      {events.map((event) => (
        <EditorPreviewGrid
          key={event.id}
          editor={(
            <EditableCard title={event.source_url || "Event"}>
              <div className="grid gap-4 md:grid-cols-3">
                <AdminInput label="Title" value={event.title} onChange={(value) => setData((current) => updateRecord(current, "events", event.id, { title: value }))} />
                <AdminInput label="Path" value={event.path || ""} onChange={(value) => setData((current) => updateRecord(current, "events", event.id, { path: value }))} />
                <AdminInput label="Date" value={event.event_date || ""} onChange={(value) => setData((current) => updateRecord(current, "events", event.id, { event_date: value }))} />
                <AdminInput label="Image / Media Path" value={event.image || ""} onChange={(value) => setData((current) => updateRecord(current, "events", event.id, { image: value }))} />
                <AdminInput label="Source URL" value={event.source_url || ""} onChange={(value) => setData((current) => updateRecord(current, "events", event.id, { source_url: value }))} />
                <AdminSelect label="Status" value={event.status || "published"} onChange={(value) => setData((current) => updateRecord(current, "events", event.id, { status: value }))} options={["draft", "published"]} />
              </div>
              <AdminTextarea label="Summary" value={event.summary || ""} onChange={(value) => setData((current) => updateRecord(current, "events", event.id, { summary: value }))} />
              <ActionRow>
                <SaveButton onClick={() => updateEvent(event)} />
                <DeleteButton onClick={() => deleteEvent(event)} />
              </ActionRow>
            </EditableCard>
          )}
          preview={<AdminEventPreview event={event} />}
        />
      ))}
    </ManagerPanel>
  );
}

function OpeningManager({ openingTimes, setData, setSaveMessage }) {
  const [form, setForm] = useState({ date: "", status: "closed", season_label: "Park Closed", open_time: "", close_time: "", notes: "" });
  const monthKeys = useMemo(() => [...new Set(openingTimes.map((row) => String(row.date || "").slice(0, 7)).filter(Boolean))].sort(), [openingTimes]);
  const [activeMonthKey, setActiveMonthKey] = useState(monthKeys[0] || "");
  const [selectedDate, setSelectedDate] = useState(openingTimes[0]?.date || "");
  useEffect(() => {
    if (!activeMonthKey && monthKeys[0]) setActiveMonthKey(monthKeys[0]);
  }, [activeMonthKey, monthKeys]);
  const monthRows = useMemo(() => openingTimes.filter((row) => String(row.date || "").startsWith(activeMonthKey)), [openingTimes, activeMonthKey]);
  const rowByDate = useMemo(() => new Map(monthRows.map((row) => [row.date, row])), [monthRows]);
  const selectedRow = openingTimes.find((row) => row.date === selectedDate) || monthRows[0] || openingTimes[0];
  const activeMonthDate = activeMonthKey ? new Date(`${activeMonthKey}-01T12:00:00`) : new Date();
  const openingCalendarDays = useMemo(() => buildMonthDays(activeMonthDate), [activeMonthKey]);
  const moveMonth = (direction) => {
    if (!monthKeys.length) return;
    const currentIndex = Math.max(0, monthKeys.indexOf(activeMonthKey));
    const nextKey = monthKeys[(currentIndex + direction + monthKeys.length) % monthKeys.length];
    setActiveMonthKey(nextKey);
    const nextRow = openingTimes.find((row) => String(row.date || "").startsWith(nextKey));
    if (nextRow) setSelectedDate(nextRow.date);
  };
  const createOpening = async (event) => {
    event.preventDefault();
    const data = await apiRequest("/admin/opening-times", { method: "POST", body: JSON.stringify(form) });
    setData((current) => ({ ...current, openingTimes: [...current.openingTimes, data.openingTime].sort((a, b) => a.date.localeCompare(b.date)) }));
    setForm({ date: "", status: "closed", season_label: "Park Closed", open_time: "", close_time: "", notes: "" });
    setSaveMessage(`Created opening date: ${data.openingTime.date}`);
  };
  const updateOpening = async (row) => {
    const data = await apiRequest(`/admin/opening-times/${row.id}`, {
      method: "PUT",
      body: JSON.stringify(row),
    });
    if (data.openingTime) setData((current) => updateRecord(current, "openingTimes", row.id, data.openingTime));
    setSaveMessage(`Saved opening time: ${row.date}`);
  };
  const deleteOpening = async (row) => {
    if (!window.confirm(`Delete opening date ${row.date}?`)) return;
    await apiRequest(`/admin/opening-times/${row.id}`, { method: "DELETE" });
    setData((current) => removeRecord(current, "openingTimes", row.id));
    setSaveMessage(`Deleted opening date: ${row.date}`);
  };
  return (
    <ManagerPanel title="Opening Times">
      <form className="rounded-lg border border-slate-200 bg-sunshine/15 p-4" onSubmit={createOpening}>
        <h3 className="font-display text-2xl font-black text-ink">Create Opening Date</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <AdminInput label="Date" type="date" value={form.date} onChange={(value) => setForm((current) => ({ ...current, date: value }))} required />
          <AdminSelect label="Status" value={form.status} onChange={(value) => setForm((current) => ({ ...current, status: value }))} options={["main", "off-peak", "winter", "closed"]} />
          <AdminInput label="Season Label" value={form.season_label} onChange={(value) => setForm((current) => ({ ...current, season_label: value }))} />
          <AdminInput label="Open Time" value={form.open_time} onChange={(value) => setForm((current) => ({ ...current, open_time: value }))} />
          <AdminInput label="Close Time" value={form.close_time} onChange={(value) => setForm((current) => ({ ...current, close_time: value }))} />
        </div>
        <AdminTextarea label="Notes" value={form.notes} onChange={(value) => setForm((current) => ({ ...current, notes: value }))} />
        <CreateButton label="Create Opening Date" />
      </form>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.55fr)]">
        <section className="rounded-lg border border-slate-200 bg-mist p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={() => moveMonth(-1)} className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-ink ring-1 ring-slate-200 hover:bg-sunshine" aria-label="Previous month">
              <ChevronLeft aria-hidden="true" size={18} />
            </button>
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-berry">Calendar Editor</p>
              <h3 className="font-display text-3xl font-black text-ink">{monthTitle(activeMonthDate)}</h3>
            </div>
            <button type="button" onClick={() => moveMonth(1)} className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-ink ring-1 ring-slate-200 hover:bg-sunshine" aria-label="Next month">
              <ChevronRight aria-hidden="true" size={18} />
            </button>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-black uppercase tracking-wide text-slate-600">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => <span key={label}>{label}</span>)}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {openingCalendarDays.map((day) => {
              const dateKey = toIsoDate(day);
              const row = rowByDate.get(dateKey);
              const isCurrentMonth = dateKey.startsWith(activeMonthKey);
              const active = row?.date === selectedRow?.date;
              return (
                <button
                  key={dateKey}
                  type="button"
                  disabled={!row}
                  onClick={() => row && setSelectedDate(row.date)}
                  className={`focus-ring flex aspect-square min-h-12 items-center justify-center rounded-full border-4 text-sm font-black transition ${row ? openingStatusClass(row.status) : "border-slate-100 bg-white text-slate-300"} ${active ? "scale-105 shadow-button ring-4 ring-woodpink/30" : ""} ${!isCurrentMonth ? "opacity-35" : ""}`}
                  aria-label={row ? `${row.date} ${openingStatusLabel(row.status)}` : dateKey}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Main Season", "main"],
              ["Off Peak", "off-peak"],
              ["Winter Fun", "winter"],
              ["Closed", "closed"],
            ].map(([label, status]) => (
              <span key={status} className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-ink">
                <span className={`inline-flex h-5 w-5 rounded-full border-2 ${openingStatusClass(status)}`} />
                {label}
              </span>
            ))}
          </div>
        </section>

        {selectedRow && (
          <div key={selectedRow.id} className="grid gap-4">
            <div>
            <EditableCard title={selectedRow.date}>
              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-ink">Status</span>
                <select
                  className="focus-ring min-h-12 rounded-lg border border-slate-300 px-3"
                  value={selectedRow.status}
                  onChange={(event) => setData((current) => updateRecord(current, "openingTimes", selectedRow.id, { status: event.target.value }))}
                >
                  <option value="main">Main Season</option>
                  <option value="off-peak">Off Peak Weekdays</option>
                  <option value="winter">Winter Fun</option>
                  <option value="closed">Park Closed</option>
                </select>
              </label>
              <AdminInput label="Open Time" value={selectedRow.open_time || ""} onChange={(value) => setData((current) => updateRecord(current, "openingTimes", selectedRow.id, { open_time: value }))} />
              <AdminInput label="Close Time" value={selectedRow.close_time || ""} onChange={(value) => setData((current) => updateRecord(current, "openingTimes", selectedRow.id, { close_time: value }))} />
              <AdminInput label="Season Label" value={selectedRow.season_label || ""} onChange={(value) => setData((current) => updateRecord(current, "openingTimes", selectedRow.id, { season_label: value }))} />
              <AdminTextarea label="Notes" value={selectedRow.notes || ""} onChange={(value) => setData((current) => updateRecord(current, "openingTimes", selectedRow.id, { notes: value }))} />
              <ActionRow>
                <SaveButton onClick={() => updateOpening(selectedRow)} />
                <DeleteButton onClick={() => deleteOpening(selectedRow)} />
              </ActionRow>
            </EditableCard>
            </div>
            <div className="admin-preview-window">
              <AdminOpeningPreview row={selectedRow} />
            </div>
          </div>
        )}
      </div>
    </ManagerPanel>
  );
}

function FaqManager({ faqs, setData, setSaveMessage }) {
  const [form, setForm] = useState({ group_title: "General", question: "", answer: "", sort_order: 0, active: true });
  const createFaq = async (event) => {
    event.preventDefault();
    const data = await apiRequest("/admin/faqs", { method: "POST", body: JSON.stringify(form) });
    setData((current) => ({ ...current, faqs: [...current.faqs, data.faq] }));
    setForm({ group_title: "General", question: "", answer: "", sort_order: 0, active: true });
    setSaveMessage(`Created FAQ: ${data.faq.question}`);
  };
  const updateFaq = async (faq) => {
    const data = await apiRequest(`/admin/faqs/${faq.id}`, {
      method: "PUT",
      body: JSON.stringify(faq),
    });
    if (data.faq) setData((current) => updateRecord(current, "faqs", faq.id, data.faq));
    setSaveMessage(`Saved FAQ: ${faq.question}`);
  };
  const deleteFaq = async (faq) => {
    if (!window.confirm(`Delete FAQ ${faq.question}?`)) return;
    await apiRequest(`/admin/faqs/${faq.id}`, { method: "DELETE" });
    setData((current) => removeRecord(current, "faqs", faq.id));
    setSaveMessage(`Deleted FAQ: ${faq.question}`);
  };
  return (
    <ManagerPanel title="FAQ Manager">
      <form className="rounded-lg border border-slate-200 bg-sunshine/15 p-4" onSubmit={createFaq}>
        <h3 className="font-display text-2xl font-black text-ink">Create FAQ</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-[0.8fr_1.2fr_0.4fr]">
          <AdminInput label="Group" value={form.group_title} onChange={(value) => setForm((current) => ({ ...current, group_title: value }))} />
          <AdminInput label="Question" value={form.question} onChange={(value) => setForm((current) => ({ ...current, question: value }))} required />
          <AdminInput label="Order" type="number" value={form.sort_order} onChange={(value) => setForm((current) => ({ ...current, sort_order: value }))} />
        </div>
        <AdminTextarea label="Answer" value={form.answer} onChange={(value) => setForm((current) => ({ ...current, answer: value }))} />
        <CreateButton label="Create FAQ" />
      </form>
      {faqs.map((faq) => (
        <EditorPreviewGrid
          key={faq.id}
          editor={(
            <EditableCard title={faq.group_title}>
              <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr_0.4fr]">
                <AdminInput label="Group" value={faq.group_title || ""} onChange={(value) => setData((current) => updateRecord(current, "faqs", faq.id, { group_title: value }))} />
                <AdminInput label="Question" value={faq.question} onChange={(value) => setData((current) => updateRecord(current, "faqs", faq.id, { question: value }))} />
                <AdminInput label="Order" type="number" value={faq.sort_order || 0} onChange={(value) => setData((current) => updateRecord(current, "faqs", faq.id, { sort_order: value }))} />
              </div>
              <AdminTextarea label="Answer" value={faq.answer} onChange={(value) => setData((current) => updateRecord(current, "faqs", faq.id, { answer: value }))} />
              <ActionRow>
                <SaveButton onClick={() => updateFaq(faq)} />
                <DeleteButton onClick={() => deleteFaq(faq)} />
              </ActionRow>
            </EditableCard>
          )}
          preview={<AdminFaqPreview faq={faq} />}
        />
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

  const updateMedia = async (item) => {
    const data = await apiRequest(`/admin/media/${item.id}`, {
      method: "PUT",
      body: JSON.stringify(item),
    });
    setData((current) => updateRecord(current, "media", item.id, data.media));
    setSaveMessage(`Saved media: ${data.media.title}`);
  };

  const deleteMedia = async (item) => {
    if (!window.confirm(`Delete media ${item.title}?`)) return;
    await apiRequest(`/admin/media/${item.id}`, { method: "DELETE" });
    setData((current) => removeRecord(current, "media", item.id));
    setSaveMessage(`Deleted media: ${item.title}`);
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
      <div className="grid gap-4">
        {media.map((item) => (
          <EditorPreviewGrid
            key={item.id}
            editor={(
              <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <FileImage aria-hidden="true" className="text-berry" />
                <div className="mt-3 grid gap-3">
                  <AdminInput label="Title" value={item.title || ""} onChange={(value) => setData((current) => updateRecord(current, "media", item.id, { title: value }))} />
                  <AdminInput label="Alt Text" value={item.alt_text || ""} onChange={(value) => setData((current) => updateRecord(current, "media", item.id, { alt_text: value }))} />
                  <AdminInput label="Usage" value={item.usage || ""} onChange={(value) => setData((current) => updateRecord(current, "media", item.id, { usage: value }))} />
                </div>
                <p className="mt-1 break-all text-xs font-bold text-slate-600">{item.path}</p>
                <ActionRow>
                  <SaveButton onClick={() => updateMedia(item)} />
                  <DeleteButton onClick={() => deleteMedia(item)} />
                </ActionRow>
              </article>
            )}
            preview={<AdminMediaPreview item={item} />}
          />
        ))}
      </div>
    </ManagerPanel>
  );
}

function DocumentsManager({ documents, setData, setSaveMessage }) {
  const [form, setForm] = useState({ title: "", description: "", local_path: "", source_url: "", page_paths: "" });
  const createDocument = async (event) => {
    event.preventDefault();
    const data = await apiRequest("/admin/documents", { method: "POST", body: JSON.stringify(form) });
    setData((current) => ({ ...current, documents: [...current.documents, data.document] }));
    setForm({ title: "", description: "", local_path: "", source_url: "", page_paths: "" });
    setSaveMessage(`Created document: ${data.document.title}`);
  };
  const updateDocument = async (document) => {
    const data = await apiRequest(`/admin/documents/${document.id}`, { method: "PUT", body: JSON.stringify(document) });
    setData((current) => updateRecord(current, "documents", document.id, data.document));
    setSaveMessage(`Saved document: ${data.document.title}`);
  };
  const deleteDocument = async (document) => {
    if (!window.confirm(`Delete document ${document.title}?`)) return;
    await apiRequest(`/admin/documents/${document.id}`, { method: "DELETE" });
    setData((current) => removeRecord(current, "documents", document.id));
    setSaveMessage(`Deleted document: ${document.title}`);
  };
  return (
    <ManagerPanel title="Documents">
      <form className="rounded-lg border border-slate-200 bg-sunshine/15 p-4" onSubmit={createDocument}>
        <h3 className="font-display text-2xl font-black text-ink">Create Document Link</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <AdminInput label="Title" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} required />
          <AdminInput label="Local Path" value={form.local_path} onChange={(value) => setForm((current) => ({ ...current, local_path: value }))} required />
          <AdminInput label="Page Paths" value={form.page_paths} onChange={(value) => setForm((current) => ({ ...current, page_paths: value }))} />
          <AdminInput label="Source URL" value={form.source_url} onChange={(value) => setForm((current) => ({ ...current, source_url: value }))} />
        </div>
        <AdminTextarea label="Description" value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} />
        <CreateButton label="Create Document" />
      </form>
      <div className="grid gap-4">
        {documents.map((document) => (
          <EditorPreviewGrid
            key={document.id}
            editor={(
              <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-3">
                  <AdminInput label="Title" value={document.title || ""} onChange={(value) => setData((current) => updateRecord(current, "documents", document.id, { title: value }))} />
                  <AdminInput label="Local Path" value={document.local_path || ""} onChange={(value) => setData((current) => updateRecord(current, "documents", document.id, { local_path: value }))} />
                  <AdminInput label="Page Paths" value={document.page_paths || ""} onChange={(value) => setData((current) => updateRecord(current, "documents", document.id, { page_paths: value }))} />
                  <AdminInput label="Source URL" value={document.source_url || ""} onChange={(value) => setData((current) => updateRecord(current, "documents", document.id, { source_url: value }))} />
                  <AdminTextarea label="Description" value={document.description || ""} onChange={(value) => setData((current) => updateRecord(current, "documents", document.id, { description: value }))} />
                </div>
                <a className="mt-3 inline-flex text-sm font-black text-berry underline" href={document.local_path} target="_blank" rel="noreferrer">
                  Open document
                </a>
                <ActionRow>
                  <SaveButton onClick={() => updateDocument(document)} />
                  <DeleteButton onClick={() => deleteDocument(document)} />
                </ActionRow>
              </article>
            )}
            preview={<AdminDocumentPreview document={document} />}
          />
        ))}
      </div>
    </ManagerPanel>
  );
}

function SubscriberManager({ subscribers, setData, setSaveMessage }) {
  const [form, setForm] = useState({ email: "", first_name: "", last_name: "", status: "subscribed" });
  const createSubscriber = async (event) => {
    event.preventDefault();
    const data = await apiRequest("/admin/newsletter-subscribers", { method: "POST", body: JSON.stringify(form) });
    setData((current) => ({ ...current, subscribers: [data.subscriber, ...current.subscribers] }));
    setForm({ email: "", first_name: "", last_name: "", status: "subscribed" });
    setSaveMessage(`Created subscriber: ${data.subscriber.email}`);
  };
  const updateSubscriber = async (subscriber) => {
    const data = await apiRequest(`/admin/newsletter-subscribers/${subscriber.id}`, { method: "PUT", body: JSON.stringify(subscriber) });
    setData((current) => updateRecord(current, "subscribers", subscriber.id, data.subscriber));
    setSaveMessage(`Saved subscriber: ${data.subscriber.email}`);
  };
  const deleteSubscriber = async (subscriber) => {
    if (!window.confirm(`Delete subscriber ${subscriber.email}?`)) return;
    await apiRequest(`/admin/newsletter-subscribers/${subscriber.id}`, { method: "DELETE" });
    setData((current) => removeRecord(current, "subscribers", subscriber.id));
    setSaveMessage(`Deleted subscriber: ${subscriber.email}`);
  };
  return (
    <ManagerPanel title="Newsletter Subscribers">
      <EditorPreviewGrid
        editor={(
          <form className="rounded-lg border border-slate-200 bg-sunshine/15 p-4" onSubmit={createSubscriber}>
            <h3 className="font-display text-2xl font-black text-ink">Create Subscriber</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <AdminInput label="Email" type="email" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} required />
              <AdminInput label="First Name" value={form.first_name} onChange={(value) => setForm((current) => ({ ...current, first_name: value }))} />
              <AdminInput label="Last Name" value={form.last_name} onChange={(value) => setForm((current) => ({ ...current, last_name: value }))} />
              <AdminSelect label="Status" value={form.status} onChange={(value) => setForm((current) => ({ ...current, status: value }))} options={["subscribed", "unsubscribed"]} />
            </div>
            <CreateButton label="Create Subscriber" />
          </form>
        )}
        preview={<AdminSubscriberPreview subscriber={form} />}
      />
      <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-mist text-ink">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">First Name</th>
              <th className="p-3">Last Name</th>
              <th className="p-3">Consent</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-t border-slate-200">
                <td className="p-3"><input className="focus-ring min-h-10 rounded-lg border border-slate-300 px-2 font-bold" value={subscriber.email || ""} onChange={(event) => setData((current) => updateRecord(current, "subscribers", subscriber.id, { email: event.target.value }))} /></td>
                <td className="p-3"><input className="focus-ring min-h-10 rounded-lg border border-slate-300 px-2" value={subscriber.first_name || ""} onChange={(event) => setData((current) => updateRecord(current, "subscribers", subscriber.id, { first_name: event.target.value }))} /></td>
                <td className="p-3"><input className="focus-ring min-h-10 rounded-lg border border-slate-300 px-2" value={subscriber.last_name || ""} onChange={(event) => setData((current) => updateRecord(current, "subscribers", subscriber.id, { last_name: event.target.value }))} /></td>
                <td className="p-3">{subscriber.consent ? "Yes" : "No"}</td>
                <td className="p-3">
                  <ActionRow>
                    <SaveButton onClick={() => updateSubscriber(subscriber)} />
                    <DeleteButton onClick={() => deleteSubscriber(subscriber)} />
                  </ActionRow>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ManagerPanel>
  );
}

function TicketAdmin({ ticketTypes, bookings, setData, setSaveMessage }) {
  const [form, setForm] = useState({ slug: "", name: "", description: "", price_label: "", sort_order: 0, active: true });
  const createTicketType = async (event) => {
    event.preventDefault();
    const data = await apiRequest("/admin/ticket-types", { method: "POST", body: JSON.stringify(form) });
    setData((current) => ({ ...current, ticketTypes: [...current.ticketTypes, data.ticketType] }));
    setForm({ slug: "", name: "", description: "", price_label: "", sort_order: 0, active: true });
    setSaveMessage(`Created ticket type: ${data.ticketType.name}`);
  };
  const updateTicketType = async (ticketType) => {
    const data = await apiRequest(`/admin/ticket-types/${ticketType.id}`, {
      method: "PUT",
      body: JSON.stringify(ticketType),
    });
    if (data.ticketType) setData((current) => updateRecord(current, "ticketTypes", ticketType.id, data.ticketType));
    setSaveMessage(`Saved ticket type: ${ticketType.name}`);
  };
  const deleteTicketType = async (ticketType) => {
    if (!window.confirm(`Delete ticket type ${ticketType.name}?`)) return;
    await apiRequest(`/admin/ticket-types/${ticketType.id}`, { method: "DELETE" });
    setData((current) => removeRecord(current, "ticketTypes", ticketType.id));
    setSaveMessage(`Deleted ticket type: ${ticketType.name}`);
  };
  return (
    <ManagerPanel title="Ticket Types & Bookings">
      <EditorPreviewGrid
        editor={(
          <form className="rounded-lg border border-slate-200 bg-sunshine/15 p-4" onSubmit={createTicketType}>
            <h3 className="font-display text-2xl font-black text-ink">Create Ticket Type</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <AdminInput label="Slug" value={form.slug} onChange={(value) => setForm((current) => ({ ...current, slug: value }))} />
              <AdminInput label="Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} required />
              <AdminInput label="Price Label" value={form.price_label} onChange={(value) => setForm((current) => ({ ...current, price_label: value }))} />
              <AdminInput label="Order" type="number" value={form.sort_order} onChange={(value) => setForm((current) => ({ ...current, sort_order: value }))} />
            </div>
            <AdminTextarea label="Description" value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} />
            <CreateButton label="Create Ticket Type" />
          </form>
        )}
        preview={<AdminTicketPreview ticketType={form} />}
      />
      <div className="grid gap-4">
        {ticketTypes.map((ticketType) => (
          <EditorPreviewGrid
            key={ticketType.id}
            editor={(
              <EditableCard title={ticketType.slug}>
                <AdminInput label="Slug" value={ticketType.slug || ""} onChange={(value) => setData((current) => updateRecord(current, "ticketTypes", ticketType.id, { slug: value }))} />
                <AdminInput label="Name" value={ticketType.name} onChange={(value) => setData((current) => updateRecord(current, "ticketTypes", ticketType.id, { name: value }))} />
                <AdminTextarea label="Description" value={ticketType.description || ""} onChange={(value) => setData((current) => updateRecord(current, "ticketTypes", ticketType.id, { description: value }))} />
                <AdminInput label="Price Label" value={ticketType.price_label || ""} onChange={(value) => setData((current) => updateRecord(current, "ticketTypes", ticketType.id, { price_label: value }))} />
                <AdminInput label="Order" type="number" value={ticketType.sort_order || 0} onChange={(value) => setData((current) => updateRecord(current, "ticketTypes", ticketType.id, { sort_order: value }))} />
                <ActionRow>
                  <SaveButton onClick={() => updateTicketType(ticketType)} />
                  <DeleteButton onClick={() => deleteTicketType(ticketType)} />
                </ActionRow>
              </EditableCard>
            )}
            preview={<AdminTicketPreview ticketType={ticketType} />}
          />
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
      {isRotaRoute && (
        <PortalHero
          eyebrow="staff.woodlandspark.com"
          title="Staff Portal"
          description="Secure staff area for rota links, announcements, documents and payroll access."
          roles={["employee", "supervisor", "manager", "payroll-admin", "super-admin"]}
        />
      )}
      <PortalShell wide={isRotaRoute || !loading}>
        {loading ? (
          <LoadingCard label="Loading staff portal..." />
        ) : !isAllowed(user, staffRoles) ? (
          <PortalRedirect title="Staff Login Required" message="Staff access requires an authorised Woodlands staff account." to="/staff/login" onNavigate={onNavigate} />
        ) : user?.mustResetPassword ? (
          <PasswordResetRequired user={user} onComplete={(nextUser) => setUser(nextUser)} />
        ) : isRotaRoute ? (
          <div className="grid gap-6">
            <StaffSessionBar user={user} onLogout={logout} />
            <StaffRotaManager path={path} user={user} onNavigate={onNavigate} />
          </div>
        ) : (
          <StaffDashboardHome
            dashboard={dashboard}
            path={path}
            user={user}
            onNavigate={onNavigate}
            onRefresh={loadStaff}
            onLogout={logout}
            setDashboard={setDashboard}
          />
        )}
      </PortalShell>
    </>
  );
}

function StaffDashboardHome({ dashboard, path, user, onNavigate, onRefresh, onLogout, setDashboard }) {
  const [nowValue, setNowValue] = useState(new Date());
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const pageMode = path?.endsWith("/time-clock") ? "time-clock" : path?.endsWith("/timesheets") ? "timesheets" : path?.endsWith("/more") ? "more" : "dashboard";

  useEffect(() => {
    const timer = window.setInterval(() => setNowValue(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const refresh = async () => {
    setError("");
    try {
      await onRefresh();
    } catch (error) {
      setError(error.message);
    }
  };

  const clockAction = async (action) => {
    setBusy(action);
    setError("");
    try {
      const position = await getCurrentPosition();
      const next = await apiRequest(`/staff/time-clock/${action}`, {
        method: "POST",
        body: JSON.stringify({
          latitude: position.latitude,
          longitude: position.longitude,
          accuracy: position.accuracy,
          shiftId: dashboard?.currentShift?.id || dashboard?.activeSession?.shift_id || "",
        }),
      });
      setDashboard(next);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="staff-mobile-shell mx-auto min-h-[760px] max-w-6xl overflow-hidden rounded-[1.6rem] bg-[#f3f1f6] pb-24 shadow-lift lg:pb-8">
      <header className="bg-[#24133d] px-5 py-5 text-white sm:px-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sunshine">Woodlands Staff</p>
            <h1 className="mt-1 font-display text-3xl font-black">{pageMode === "time-clock" ? "Time Clock" : pageMode === "timesheets" ? "Timesheets" : pageMode === "more" ? "More" : "Dashboard"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" onClick={refresh} aria-label="Refresh dashboard">
              <RefreshCw aria-hidden="true" size={18} />
            </button>
            <button type="button" className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Help">
              <ShieldCheck aria-hidden="true" size={18} />
            </button>
            <button type="button" className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#24133d]" aria-label="Profile">
              <UserCircle aria-hidden="true" size={24} />
            </button>
          </div>
        </div>
        <div className="mt-5 rounded-2xl bg-white/10 p-4">
          <p className="text-sm font-semibold text-white/80">Welcome back,</p>
          <p className="font-display text-2xl font-black">{user.name}</p>
          <p className="mt-1 text-sm font-semibold text-white/85">{formatStaffDate(nowValue)}</p>
        </div>
      </header>

      <main className="grid gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
        {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-black text-red-700 lg:col-span-2">{error}</p>}
        {(pageMode === "dashboard" || pageMode === "time-clock") && (
          <StaffClockCard dashboard={dashboard} nowValue={nowValue} busy={busy} onStart={() => clockAction("start")} onEnd={() => clockAction("end")} />
        )}
        {(pageMode === "dashboard" || pageMode === "timesheets") && (
          <StaffWeekCard dashboard={dashboard} onNavigate={onNavigate} />
        )}
        {(pageMode === "dashboard") && (
          <>
            <StaffScheduleOverview dashboard={dashboard} onNavigate={onNavigate} />
            <StaffAvailableShifts dashboard={dashboard} />
            <StaffLeaveCard dashboard={dashboard} />
            <StaffTimeOffCard dashboard={dashboard} />
          </>
        )}
        {pageMode === "time-clock" && (
          <StaffClockDetailCard dashboard={dashboard} />
        )}
        {pageMode === "timesheets" && (
          <StaffTimesheetDetail dashboard={dashboard} />
        )}
        {pageMode === "more" && (
          <StaffMorePanel dashboard={dashboard} user={user} onLogout={onLogout} onNavigate={onNavigate} />
        )}
      </main>

      <StaffBottomNav path={path} onNavigate={onNavigate} />
    </div>
  );
}

function StaffClockCard({ dashboard, nowValue, busy, onStart, onEnd }) {
  const session = dashboard?.activeSession;
  const status = session ? "In Progress" : dashboard?.lastSession ? "Finished" : "Not started";
  const timer = session?.clock_in_at ? formatElapsed(new Date(session.clock_in_at), nowValue) : "00:00:00";
  const shift = dashboard?.currentShift;
  return (
    <section className="staff-dashboard-card lg:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-berry">Shift Status</p>
          <h2 className="mt-1 font-display text-3xl font-black text-ink">{status}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-600">{shift ? `${shift.title} - ${formatDateLabel(shift.date)}` : "No scheduled shift selected"}</p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wide ${session ? "bg-leaf/15 text-canopy" : "bg-slate-100 text-slate-700"}`}>{status}</span>
      </div>
      <div className="mt-5 rounded-2xl bg-[#24133d] p-5 text-white">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-sunshine">Live Timer</p>
        <p className="mt-1 font-display text-5xl font-black tabular-nums">{timer}</p>
        <p className="mt-2 text-sm font-semibold text-white/80">
          {session?.clock_in_at ? `Clocked in at ${formatTimeStamp(session.clock_in_at)}` : "Clock in when you are at the approved work location."}
        </p>
      </div>
      <details className="mt-4 rounded-2xl bg-mist p-4">
        <summary className="cursor-pointer text-sm font-black uppercase tracking-wide text-ink">Break details</summary>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
          Scheduled break: {Number(shift?.break_minutes || 0)} minutes {shift?.paid_break ? "paid" : "unpaid"}.
        </p>
      </details>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={onStart} disabled={Boolean(session) || busy === "start"} className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-woodpink px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-button disabled:cursor-not-allowed disabled:opacity-55">
          <Play aria-hidden="true" size={18} />
          {busy === "start" ? "Starting..." : "Start Shift"}
        </button>
        <button type="button" onClick={onEnd} disabled={!session || busy === "end"} className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#24133d] px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-button disabled:cursor-not-allowed disabled:opacity-55">
          <Square aria-hidden="true" size={17} />
          {busy === "end" ? "Ending..." : "End Shift"}
        </button>
      </div>
    </section>
  );
}

function StaffWeekCard({ dashboard, onNavigate }) {
  const summary = dashboard?.weekSummary || {};
  return (
    <section className="staff-dashboard-card">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-black text-ink">My Current Week</h2>
        <CalendarClock aria-hidden="true" className="text-berry" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <StaffMetric label="Scheduled" value={`${summary.scheduledHours || 0}h`} />
        <StaffMetric label="Worked" value={`${summary.workedHours || 0}h`} />
        <StaffMetric label="Shifts" value={summary.shiftCount || 0} />
      </div>
      <AppLink href="/staff/rota/calendar" onNavigate={onNavigate} className="focus-ring mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-sunshine px-4 py-2 text-sm font-black uppercase tracking-wide text-ink">
        View Schedule
        <ArrowRight aria-hidden="true" size={17} />
      </AppLink>
    </section>
  );
}

function StaffScheduleOverview({ dashboard, onNavigate }) {
  const overview = dashboard?.scheduleOverview || {};
  return (
    <section className="staff-dashboard-card">
      <h2 className="font-display text-2xl font-black text-ink">Schedule Overview</h2>
      <p className="mt-1 text-sm font-bold text-slate-600">{overview.dateRange || "This week"}</p>
      <div className="mt-4 grid gap-3">
        <StaffRow label="Upcoming shifts" value={overview.upcomingShiftsCount || 0} />
        <StaffRow label="Unconfirmed shifts" value={overview.unconfirmedShiftsCount || 0} />
        <StaffRow label="Shift conflicts" value={overview.shiftConflictsCount || 0} />
      </div>
      <AppLink href="/staff/rota/calendar" onNavigate={onNavigate} className="focus-ring mt-5 inline-flex text-sm font-black text-berry underline">Open calendar</AppLink>
    </section>
  );
}

function StaffAvailableShifts({ dashboard }) {
  return (
    <section className="staff-dashboard-card">
      <h2 className="font-display text-2xl font-black text-ink">Available Shifts</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <StaffMetric label="Offers" value={dashboard?.availableShifts?.shiftOffersCount || 0} />
        <StaffMetric label="Open" value={dashboard?.availableShifts?.openShiftsCount || 0} />
      </div>
    </section>
  );
}

function StaffLeaveCard({ dashboard }) {
  const items = dashboard?.upcomingLeave || [];
  return (
    <section className="staff-dashboard-card">
      <h2 className="font-display text-2xl font-black text-ink">Upcoming Leave</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <article key={`${item.startDate}-${item.endDate}-${item.leaveType}`} className="rounded-xl bg-mist p-3">
            <p className="font-black text-ink">{item.leaveType}</p>
            <p className="text-sm font-semibold text-slate-600">{item.startDate} - {item.endDate}</p>
            <span className="mt-2 inline-flex rounded-lg bg-leaf/10 px-2 py-1 text-xs font-black uppercase text-canopy">{item.status}</span>
          </article>
        ))}
        {!items.length && <p className="rounded-xl bg-mist p-3 text-sm font-bold text-slate-600">No approved leave coming up.</p>}
      </div>
    </section>
  );
}

function StaffTimeOffCard({ dashboard }) {
  const summary = dashboard?.timeOffSummary || {};
  return (
    <section className="staff-dashboard-card">
      <h2 className="font-display text-2xl font-black text-ink">Time Off</h2>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <StaffMetric label="Unavailable" value={summary.unavailability || 0} />
        <StaffMetric label="Leave" value={summary.leave || 0} />
        <StaffMetric label="Absences" value={summary.absences || 0} />
      </div>
    </section>
  );
}

function StaffClockDetailCard({ dashboard }) {
  const location = dashboard?.activeSession?.work_location_name || dashboard?.workLocation?.name || "Approved work location";
  return (
    <section className="staff-dashboard-card lg:col-span-2">
      <h2 className="font-display text-2xl font-black text-ink">Location Check</h2>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
        Clock-in and clock-out requests are accepted only when the browser location is within the configured radius for {location}.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <StaffRow label="Work location" value={location} />
        <StaffRow label="Allowed radius" value={`${dashboard?.activeSession?.work_location_radius || dashboard?.workLocation?.radius_meters || 100}m`} />
      </div>
    </section>
  );
}

function StaffTimesheetDetail({ dashboard }) {
  return (
    <section className="staff-dashboard-card lg:col-span-2">
      <h2 className="font-display text-2xl font-black text-ink">Timesheet Summary</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <StaffMetric label="Scheduled" value={`${dashboard?.weekSummary?.scheduledHours || 0}h`} />
        <StaffMetric label="Worked" value={`${dashboard?.weekSummary?.workedHours || 0}h`} />
        <StaffMetric label="Shifts" value={dashboard?.weekSummary?.shiftCount || 0} />
      </div>
    </section>
  );
}

function StaffMorePanel({ dashboard, user, onLogout, onNavigate }) {
  return (
    <section className="staff-dashboard-card lg:col-span-2">
      <h2 className="font-display text-2xl font-black text-ink">More</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <AppLink href="/staff/rota" onNavigate={onNavigate} className="staff-more-link"><CalendarClock aria-hidden="true" size={18} /> Rota / Shifts</AppLink>
        <AppLink href="/staff/rota/reports" onNavigate={onNavigate} className="staff-more-link"><BarChart3 aria-hidden="true" size={18} /> Reports</AppLink>
        <button type="button" onClick={onLogout} className="staff-more-link text-left"><LogOut aria-hidden="true" size={18} /> Logout {user.email}</button>
      </div>
      <div className="mt-5 grid gap-3">
        {(dashboard?.announcements || []).slice(0, 3).map((announcement) => (
          <article key={announcement.title} className="rounded-xl bg-mist p-3">
            <h3 className="font-display text-xl font-black text-ink">{announcement.title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-700">{announcement.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function StaffMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-mist p-3">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-display text-2xl font-black text-ink">{value}</p>
    </div>
  );
}

function StaffRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-mist p-3 text-sm">
      <span className="font-bold text-slate-600">{label}</span>
      <span className="font-black text-ink">{value}</span>
    </div>
  );
}

function StaffBottomNav({ path, onNavigate }) {
  const items = [
    ["/staff/dashboard", "Home", Home],
    ["/staff/rota/calendar", "Schedule", CalendarDays],
    ["/staff/time-clock", "Time Clock", Clock3],
    ["/staff/timesheets", "Timesheets", ClipboardList],
    ["/staff/more", "More", MoreHorizontal],
  ];
  return (
    <nav className="sticky bottom-3 z-40 mx-auto mt-2 grid max-w-xl grid-cols-5 rounded-2xl bg-white p-2 shadow-lift ring-1 ring-slate-200" aria-label="Staff portal">
      {items.map(([href, label, Icon]) => {
        const active = path === href || (href === "/staff/dashboard" && (path === "/staff" || !path));
        return (
          <AppLink key={href} href={href} onNavigate={onNavigate} className={`focus-ring flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-black uppercase tracking-wide ${active ? "bg-woodpink text-white" : "text-slate-600 hover:bg-mist"}`}>
            <Icon aria-hidden="true" size={18} />
            {label}
          </AppLink>
        );
      })}
    </nav>
  );
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Location is not available in this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      }),
      () => reject(new Error("Allow location access to clock in or out.")),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  });
}

function formatElapsed(start, end) {
  const seconds = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000));
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${secs}`;
}

function formatTimeStamp(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function formatStaffDate(date) {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(date);
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

const rotaStatuses = ["scheduled", "completed", "missed", "cancelled"];
const initialDutyOrbitShiftForm = {
  employee_id: "",
  title: "",
  date: "",
  start_time: "",
  end_time: "",
  status: "scheduled",
  break_minutes: 30,
  paid_break: false,
  department_id: "",
  work_location_mode: "saved",
  work_location_id: "",
  custom_location: "",
};

function StaffRotaManager({ path, user, onNavigate }) {
  const [data, setData] = useState({ shifts: [], assignments: [], employees: [], departments: [], canManage: false, canCreate: false, canAssign: false, canEdit: false });
  const [loading, setLoading] = useState(true);
  const [createForm, setCreateForm] = useState(initialDutyOrbitShiftForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialDutyOrbitShiftForm);
  const [filters, setFilters] = useState({ query: "", departmentId: "", employeeId: "", status: "" });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const routeView = String(path || "").split("/").filter(Boolean).pop();
  const view = ["schedule", "calendar", "shifts", "assignments", "timesheets", "team", "employees", "reports", "settings"].includes(routeView) ? routeView : "overview";

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

  const workLocations = useMemo(() => buildWorkLocations(data.departments, data.shifts), [data.departments, data.shifts]);
  const shifts = useMemo(() => data.shifts.map((shift) => enrichShift(shift, assignmentsByShift)), [data.shifts, assignmentsByShift]);
  const filteredShifts = useMemo(() => filterRotaShifts(shifts, filters), [shifts, filters]);
  const stats = useMemo(() => ({
    total: shifts.length,
    scheduled: shifts.filter((shift) => shift.status === "scheduled").length,
    unassigned: shifts.filter((shift) => !shift.employee_id).length,
    staff: data.employees.length || new Set(data.assignments.map((assignment) => assignment.employeeId)).size,
  }), [shifts, data.employees, data.assignments]);

  const saveCreateForm = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await apiRequest("/staff/rota/shifts", {
        method: "POST",
        body: JSON.stringify(buildShiftPayload(createForm, workLocations)),
      });
      setCreateForm(initialDutyOrbitShiftForm);
      setMessage("Shift created.");
      await loadShifts();
    } catch (error) {
      setError(error.message);
    }
  };

  const startEdit = (shift) => {
    setEditingId(shift.id);
    setEditForm(shiftToDutyOrbitForm(shift, workLocations));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(initialDutyOrbitShiftForm);
  };

  const updateShift = async (shiftId) => {
    setError("");
    setMessage("");
    try {
      await apiRequest(`/staff/rota/shifts/${shiftId}`, {
        method: "PUT",
        body: JSON.stringify(buildShiftPayload(editForm, workLocations)),
      });
      setEditingId(null);
      setMessage("Shift updated.");
      await loadShifts();
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteShift = async (shift) => {
    if (!window.confirm(`Delete shift ${shift.title} on ${shift.date}?`)) return;
    setError("");
    setMessage("");
    try {
      await apiRequest(`/staff/rota/shifts/${shift.id}`, { method: "DELETE" });
      setMessage("Shift deleted.");
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
    <div className="woodlands-ops-shell grid gap-5 rounded-2xl p-3 sm:p-5">
      <div className="woodlands-glass-card rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-berry">Staff Portal</p>
            <h2 className="mt-2 font-display text-3xl font-black text-ink sm:text-4xl">Rota / Shifts</h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
              {data.canCreate ? "Create shifts, assign staff, filter departments and manage the live Woodlands rota." : data.canAssign ? "View team rota and assign staff where you have permission." : "View your assigned Woodlands rota."}
            </p>
          </div>
          <CalendarClock aria-hidden="true" className="text-berry" size={40} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            ["/staff/rota", "Overview", LayoutDashboard],
            ["/staff/rota/schedule", "Schedule", CalendarClock],
            ["/staff/rota/calendar", "Calendar", CalendarDays],
            ["/staff/rota/shifts", "Shifts", ListChecks],
            ["/staff/rota/assignments", "Assignments", UserCog],
            ["/staff/rota/timesheets", "Timesheets", ClipboardList],
            ["/staff/rota/team", "Team", Users],
            ["/staff/rota/employees", "Employees", Users],
            ["/staff/rota/reports", "Reports", BarChart3],
            ["/staff/rota/settings", "Settings", Settings],
          ].map(([href, label, Icon]) => (
            <AppLink key={href} href={href} onNavigate={onNavigate} className={`focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-black uppercase tracking-wide ${path === href || (view === "overview" && href === "/staff/rota") ? "bg-woodpink text-white shadow-button" : "bg-white text-ink ring-1 ring-slate-200 hover:bg-sunshine"}`}>
              <Icon aria-hidden="true" size={17} />
              {label}
            </AppLink>
          ))}
          <AppLink href="/staff" onNavigate={onNavigate} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black uppercase tracking-wide text-ink ring-1 ring-slate-200 hover:bg-sunshine">
            Staff Dashboard
          </AppLink>
        </div>
      </div>

      {loading ? (
        <LoadingCard label="Loading rota..." />
      ) : !isAllowed(user, shiftRoles) ? (
        <div className="woodlands-glass-card rounded-2xl p-5">
          <p className="font-bold text-ink">This staff account does not have rota access.</p>
        </div>
      ) : (
        <>
          {message && <p className="rounded-lg bg-leaf/10 p-3 text-sm font-bold text-canopy">{message}</p>}
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}

          <RotaStats stats={stats} />
          <RotaFilters filters={filters} setFilters={setFilters} employees={data.employees} departments={data.departments} canAssign={data.canAssign} />

          {view === "calendar" ? (
            <DutyOrbitCalendar shifts={filteredShifts} employees={data.employees} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} canAssign={data.canAssign} filters={filters} setFilters={setFilters} />
          ) : view === "schedule" ? (
            <DutyOrbitSchedulePlanner shifts={filteredShifts} employees={data.employees} departments={data.departments} assignmentsByShift={assignmentsByShift} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} canEdit={data.canEdit} onNavigate={onNavigate} />
          ) : view === "assignments" ? (
            <DutyOrbitAssignments data={{ ...data, shifts: filteredShifts }} assignmentsByShift={assignmentsByShift} onAssign={assignEmployee} onUnassign={unassignEmployee} />
          ) : view === "timesheets" ? (
            <DutyOrbitTimesheets shifts={filteredShifts} employees={data.employees} assignmentsByShift={assignmentsByShift} />
          ) : view === "team" ? (
            <DutyOrbitTeamPanel shifts={filteredShifts} employees={data.employees} departments={data.departments} workLocations={workLocations} onNavigate={onNavigate} />
          ) : view === "employees" ? (
            <DutyOrbitEmployeesPanel employees={data.employees} departments={data.departments} assignmentsByShift={assignmentsByShift} shifts={filteredShifts} />
          ) : view === "reports" ? (
            <DutyOrbitReports shifts={filteredShifts} employees={data.employees} departments={data.departments} assignmentsByShift={assignmentsByShift} />
          ) : view === "settings" ? (
            <DutyOrbitSettingsPanel canEdit={data.canEdit} departments={data.departments} workLocations={workLocations} />
          ) : (
            <div className="grid gap-5">
              {(view === "overview" || view === "shifts") && data.canCreate && (
                <DutyOrbitCreateShiftForm form={createForm} setForm={setCreateForm} employees={data.employees} departments={data.departments} workLocations={workLocations} onSubmit={saveCreateForm} loading={loading} />
              )}
              {view === "overview" && <DutyOrbitOverview shifts={filteredShifts} assignmentsByShift={assignmentsByShift} canEdit={data.canEdit} onNavigate={onNavigate} />}
              <DutyOrbitShiftTable
                shifts={filteredShifts}
                employees={data.employees}
                workLocations={workLocations}
                canEdit={data.canEdit}
                editingId={editingId}
                editForm={editForm}
                setEditForm={setEditForm}
                onStartEdit={startEdit}
                onCancelEdit={cancelEdit}
                onUpdate={updateShift}
                onDelete={deleteShift}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function RotaStats({ stats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {[
        ["Total Shifts", stats.total, CalendarClock],
        ["Scheduled", stats.scheduled, ListChecks],
        ["Unassigned", stats.unassigned, UserCog],
        ["Staff Visible", stats.staff, Users],
      ].map(([label, value, Icon]) => (
        <article key={label} className="woodlands-glass-card rounded-2xl p-4">
          <Icon aria-hidden="true" className="text-berry" size={24} />
          <p className="mt-2 text-xs font-black uppercase tracking-wide text-slate-600">{label}</p>
          <p className="font-display text-4xl font-black text-ink">{value}</p>
        </article>
      ))}
    </div>
  );
}

function RotaFilters({ filters, setFilters, employees, departments, canAssign }) {
  return (
    <section className="woodlands-glass-card rounded-2xl p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <RotaInput label="Search" value={filters.query} onChange={(value) => setFilters((current) => ({ ...current, query: value }))} placeholder="Title, location or staff" />
        <RotaSelect label="Department" value={filters.departmentId} onChange={(value) => setFilters((current) => ({ ...current, departmentId: value }))}>
          <option value="">All departments</option>
          {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
        </RotaSelect>
        {canAssign ? (
          <RotaSelect label="Employee" value={filters.employeeId} onChange={(value) => setFilters((current) => ({ ...current, employeeId: value }))}>
            <option value="">All employees</option>
            {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
          </RotaSelect>
        ) : null}
        <RotaSelect label="Status" value={filters.status} onChange={(value) => setFilters((current) => ({ ...current, status: value }))}>
          <option value="">All statuses</option>
          {rotaStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </RotaSelect>
      </div>
    </section>
  );
}

function DutyOrbitCreateShiftForm({ form, setForm, employees, departments, workLocations, onSubmit, loading }) {
  return (
    <section className="woodlands-glass-card rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-black text-ink">Create Shift</h3>
          <p className="mt-1 text-sm font-semibold text-slate-700">DutyOrbit-style shift creation with saved or custom locations.</p>
        </div>
        <Plus aria-hidden="true" className="text-berry" />
      </div>
      <form className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5" onSubmit={onSubmit}>
        <RotaSelect label="Employee" value={form.employee_id} onChange={(value) => setForm((current) => ({ ...current, employee_id: value }))}>
          <option value="">Unassigned</option>
          {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
        </RotaSelect>
        <RotaInput label="Shift Title" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} required />
        <RotaSelect label="Department" value={form.department_id} onChange={(value) => setForm((current) => ({ ...current, department_id: value }))}>
          <option value="">No department</option>
          {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
        </RotaSelect>
        <RotaSelect label="Location Mode" value={form.work_location_mode} onChange={(value) => setForm((current) => ({ ...current, work_location_mode: value === "custom" ? "custom" : "saved" }))}>
          <option value="saved">Saved location</option>
          <option value="custom">Custom location</option>
        </RotaSelect>
        {form.work_location_mode === "saved" ? (
          <RotaSelect label="Work Location" value={form.work_location_id} onChange={(value) => setForm((current) => ({ ...current, work_location_id: value }))}>
            <option value="">Select work location</option>
            {workLocations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
          </RotaSelect>
        ) : (
          <RotaInput label="Custom Location" value={form.custom_location} onChange={(value) => setForm((current) => ({ ...current, custom_location: value }))} />
        )}
        <RotaInput label="Date" type="date" value={form.date} onChange={(value) => setForm((current) => ({ ...current, date: value }))} required />
        <RotaInput label="Start Time" type="time" value={form.start_time} onChange={(value) => setForm((current) => ({ ...current, start_time: value }))} required />
        <RotaInput label="End Time" type="time" value={form.end_time} onChange={(value) => setForm((current) => ({ ...current, end_time: value }))} required />
        <RotaInput label="Break Minutes" type="number" min="0" max="240" step="5" value={form.break_minutes} onChange={(value) => setForm((current) => ({ ...current, break_minutes: numberOrZero(value) }))} required />
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-wide text-slate-600">Paid Break</span>
          <span className="flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-ink">
            <input type="checkbox" checked={Boolean(form.paid_break)} onChange={(event) => setForm((current) => ({ ...current, paid_break: event.target.checked }))} />
            Paid break
          </span>
        </label>
        <button className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-woodpink px-4 py-2 text-sm font-black uppercase tracking-wide text-white shadow-button xl:col-span-5 xl:w-fit" type="submit" disabled={loading}>
          <Save aria-hidden="true" size={18} />
          Create
        </button>
      </form>
    </section>
  );
}

function DutyOrbitOverview({ shifts, assignmentsByShift, onNavigate }) {
  const nextShifts = shifts.slice(0, 6);
  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="woodlands-glass-card rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-2xl font-black text-ink">Next Shifts</h3>
          <AppLink href="/staff/rota/calendar" onNavigate={onNavigate} className="focus-ring rounded-xl bg-sunshine px-3 py-2 text-xs font-black uppercase tracking-wide text-ink">Calendar</AppLink>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {nextShifts.map((shift) => (
            <article key={shift.id} className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-black uppercase tracking-wide text-berry">{formatDateLabel(shift.date)}</p>
              <h4 className="mt-1 font-display text-xl font-black text-ink">{shift.title}</h4>
              <p className="text-sm font-bold text-slate-700">{formatTimeLabel(shift.start_time)} - {formatTimeLabel(shift.end_time)}</p>
              <p className="text-sm text-slate-600">{getShiftLocationLabel(shift)}</p>
              <p className="mt-2 text-xs font-bold text-slate-500">{assignmentNames(assignmentsByShift.get(shift.id) || [])}</p>
            </article>
          ))}
          {!nextShifts.length && <p className="rounded-xl bg-mist p-4 text-sm font-bold text-slate-700">No shifts match the current filters.</p>}
        </div>
      </div>
      <div className="woodlands-glass-card rounded-2xl p-4 sm:p-5">
        <h3 className="font-display text-2xl font-black text-ink">Rota Tools</h3>
        <div className="mt-4 grid gap-3">
          <AppLink href="/staff/rota/shifts" onNavigate={onNavigate} className="focus-ring flex items-center justify-between rounded-xl bg-white p-4 font-black text-ink ring-1 ring-slate-200 hover:bg-sunshine">
            Manage shift list <ArrowRight aria-hidden="true" size={18} />
          </AppLink>
          <AppLink href="/staff/rota/assignments" onNavigate={onNavigate} className="focus-ring flex items-center justify-between rounded-xl bg-white p-4 font-black text-ink ring-1 ring-slate-200 hover:bg-sunshine">
            Assign staff <ArrowRight aria-hidden="true" size={18} />
          </AppLink>
        </div>
      </div>
    </section>
  );
}

function DutyOrbitSchedulePlanner({ shifts, employees, departments, assignmentsByShift, currentMonth, setCurrentMonth, canEdit, onNavigate }) {
  const [viewMode, setViewMode] = useState("week");
  const [selectedDate, setSelectedDate] = useState(toIsoDate(new Date()));
  const selected = new Date(`${selectedDate}T12:00:00`);
  const days = useMemo(() => {
    if (viewMode === "day") return [selected];
    if (viewMode === "month") return buildMonthDays(currentMonth).filter((day) => day.getMonth() === currentMonth.getMonth());
    const start = startOfWeek(selected);
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  }, [currentMonth, selectedDate, viewMode]);
  const shiftsByDate = useMemo(() => groupShiftsByDate(shifts), [shifts]);
  const assignmentCount = shifts.reduce((sum, shift) => sum + (assignmentsByShift.get(shift.id) || []).length, 0);

  return (
    <section className="grid gap-5 2xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
      <div className="woodlands-glass-card rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-berry">DutyOrbit Schedule</p>
            <h3 className="mt-1 font-display text-3xl font-black text-ink">Schedule Planner</h3>
            <p className="mt-1 max-w-3xl text-sm font-semibold leading-6 text-slate-700">Day, week and month planning with staff assignments, department filters and operational shift details.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["day", "week", "month"].map((mode) => (
              <button key={mode} type="button" onClick={() => setViewMode(mode)} className={`focus-ring rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wide ${viewMode === mode ? "bg-woodpink text-white shadow-button" : "bg-white text-ink ring-1 ring-slate-200 hover:bg-sunshine"}`}>
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[220px_1fr_auto] md:items-end">
          <RotaInput label="Planner Date" type="date" value={selectedDate} onChange={setSelectedDate} />
          <div className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-wide text-slate-600">Month Navigation</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} className="focus-ring inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-ink hover:bg-sunshine" aria-label="Previous month">
                <ChevronLeft aria-hidden="true" size={19} />
              </button>
              <span className="min-h-12 rounded-xl bg-white px-4 py-3 text-sm font-black text-ink ring-1 ring-slate-200">{monthTitle(currentMonth)}</span>
              <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="focus-ring inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-ink hover:bg-sunshine" aria-label="Next month">
                <ChevronRight aria-hidden="true" size={19} />
              </button>
            </div>
          </div>
          {canEdit ? (
            <AppLink href="/staff/rota/shifts" onNavigate={onNavigate} className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-woodpink px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-button">
              <Plus aria-hidden="true" size={18} />
              Create Shift
            </AppLink>
          ) : null}
        </div>

        <div className="mt-5 overflow-x-auto">
          <div className={`grid min-w-[900px] gap-3 ${viewMode === "day" ? "grid-cols-1" : viewMode === "week" ? "grid-cols-7" : "grid-cols-7"}`}>
            {days.map((day) => {
              const key = toIsoDate(day);
              const dayShifts = shiftsByDate.get(key) || [];
              return (
                <article key={key} className="min-h-56 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wide text-berry">{weekdayShort(day)}</p>
                      <h4 className="font-display text-2xl font-black text-ink">{day.getDate()}</h4>
                    </div>
                    <span className="rounded-lg bg-sunshine px-2 py-1 text-[11px] font-black uppercase text-ink">{monthShort(day)}</span>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {dayShifts.map((shift) => (
                      <section key={shift.id} className="rounded-xl border border-slate-100 bg-mist p-3">
                        <p className="truncate font-black text-ink">{shift.title}</p>
                        <p className="mt-1 text-xs font-bold text-slate-700">{formatTimeLabel(shift.start_time)} - {formatTimeLabel(shift.end_time)}</p>
                        <p className="truncate text-xs text-slate-600">{getShiftLocationLabel(shift)}</p>
                        <p className="mt-1 truncate text-xs font-black text-berry">{assignmentNames(assignmentsByShift.get(shift.id) || [])}</p>
                      </section>
                    ))}
                    {!dayShifts.length && <p className="rounded-xl bg-white p-3 text-xs font-bold text-slate-500 ring-1 ring-slate-100">No shifts scheduled.</p>}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="grid gap-4">
        <div className="woodlands-glass-card rounded-2xl p-4">
          <h3 className="font-display text-2xl font-black text-ink">Planner Parameters</h3>
          <div className="mt-4 grid gap-3">
            <PreviewLine label="Visible staff" value={employees.length || "Personal rota"} />
            <PreviewLine label="Departments" value={departments.length} />
            <PreviewLine label="Assignments" value={assignmentCount} />
            <PreviewLine label="View mode" value={viewMode} />
          </div>
        </div>
        <div className="woodlands-glass-card rounded-2xl p-4">
          <h3 className="font-display text-2xl font-black text-ink">Department Load</h3>
          <div className="mt-4 grid gap-2">
            {departmentLoad(departments, shifts).map((row) => (
              <div key={row.id || row.name} className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-black text-ink">{row.name}</span>
                  <span className="rounded-lg bg-woodpink px-2 py-1 text-xs font-black text-white">{row.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}

function DutyOrbitTimesheets({ shifts, employees, assignmentsByShift }) {
  const rows = buildTimesheetRows(shifts, employees, assignmentsByShift);
  const totalHours = rows.reduce((sum, row) => sum + row.hours, 0);
  return (
    <section className="woodlands-glass-card rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-berry">DutyOrbit Timesheets</p>
          <h3 className="mt-1 font-display text-3xl font-black text-ink">Timesheet Summary</h3>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">Planned rota hours grouped by employee, including unpaid break deductions.</p>
        </div>
        <div className="rounded-2xl bg-sunshine px-5 py-3 text-right text-ink">
          <p className="text-xs font-black uppercase tracking-wide">Planned Hours</p>
          <p className="font-display text-4xl font-black">{totalHours.toFixed(1)}</p>
        </div>
      </div>
      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-mist text-xs font-black uppercase tracking-wide text-slate-600">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Department</th>
              <th className="p-3">Shifts</th>
              <th className="p-3">Planned Hours</th>
              <th className="p-3">Next Shift</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id || row.name} className="border-t border-slate-100">
                <td className="p-3 font-black text-ink">{row.name}</td>
                <td className="p-3 text-slate-700">{row.department || "Not assigned"}</td>
                <td className="p-3 text-slate-700">{row.shiftCount}</td>
                <td className="p-3 font-black text-berry">{row.hours.toFixed(1)}</td>
                <td className="p-3 text-slate-700">{row.nextShift ? `${formatDateLabel(row.nextShift.date)} - ${row.nextShift.title}` : "No upcoming shift"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="p-4 text-sm font-bold text-slate-600">No rota hours match the current filters.</p>}
      </div>
    </section>
  );
}

function DutyOrbitTeamPanel({ shifts, employees, departments, workLocations, onNavigate }) {
  const load = departmentLoad(departments, shifts);
  return (
    <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
      <div className="woodlands-glass-card rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-berry">DutyOrbit Team</p>
            <h3 className="mt-1 font-display text-3xl font-black text-ink">Team Rota Board</h3>
          </div>
          <AppLink href="/staff/rota/assignments" onNavigate={onNavigate} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl bg-woodpink px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-button">
            Assign Staff
            <ArrowRight aria-hidden="true" size={17} />
          </AppLink>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {load.map((department) => {
            const team = employees.filter((employee) => String(employee.departmentId || "") === String(department.id || ""));
            return (
              <article key={department.id || department.name} className="rounded-2xl border border-slate-200 bg-white p-4">
                <h4 className="font-display text-2xl font-black text-ink">{department.name}</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  <PreviewBadge label={`${department.count} shifts`} />
                  <PreviewBadge label={`${team.length} staff`} variant="blue" />
                </div>
                <div className="mt-3 grid gap-2">
                  {team.slice(0, 5).map((employee) => (
                    <p key={employee.id} className="rounded-lg bg-mist px-3 py-2 text-sm font-bold text-slate-700">{employee.name} <span className="text-xs uppercase text-slate-500">({employee.role})</span></p>
                  ))}
                  {!team.length && <p className="rounded-lg bg-mist px-3 py-2 text-sm font-bold text-slate-600">No staff visible in this department.</p>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <aside className="woodlands-glass-card rounded-2xl p-4 sm:p-5">
        <h3 className="font-display text-2xl font-black text-ink">Work Locations</h3>
        <div className="mt-4 grid gap-3">
          {workLocations.map((location) => (
            <div key={location.id} className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
              <MapPin aria-hidden="true" className="text-berry" size={18} />
              <span className="font-bold text-slate-700">{location.name}</span>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}

function DutyOrbitEmployeesPanel({ employees, assignmentsByShift, shifts }) {
  const rows = employees.map((employee) => {
    const employeeShifts = shifts.filter((shift) => (assignmentsByShift.get(shift.id) || []).some((assignment) => String(assignment.employeeId) === String(employee.id)));
    return {
      ...employee,
      shiftCount: employeeShifts.length,
      nextShift: employeeShifts[0],
      hours: employeeShifts.reduce((sum, shift) => sum + shiftHours(shift), 0),
    };
  });
  return (
    <section className="woodlands-glass-card rounded-2xl p-4 sm:p-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-berry">DutyOrbit Employees</p>
        <h3 className="mt-1 font-display text-3xl font-black text-ink">Employee Rota Directory</h3>
      </div>
      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-mist text-xs font-black uppercase tracking-wide text-slate-600">
            <tr>
              <th className="p-3">Employee</th>
              <th className="p-3">Role</th>
              <th className="p-3">Department</th>
              <th className="p-3">Assigned Shifts</th>
              <th className="p-3">Planned Hours</th>
              <th className="p-3">Next Shift</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((employee) => (
              <tr key={employee.id} className="border-t border-slate-100">
                <td className="p-3 font-black text-ink">{employee.name}</td>
                <td className="p-3 text-slate-700">{employee.role}</td>
                <td className="p-3 text-slate-700">{employee.department || "Not assigned"}</td>
                <td className="p-3 text-slate-700">{employee.shiftCount}</td>
                <td className="p-3 font-black text-berry">{employee.hours.toFixed(1)}</td>
                <td className="p-3 text-slate-700">{employee.nextShift ? `${formatDateLabel(employee.nextShift.date)} - ${employee.nextShift.title}` : "No upcoming shift"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="p-4 text-sm font-bold text-slate-600">Employee directory is available to users with rota assignment access.</p>}
      </div>
    </section>
  );
}

function DutyOrbitReports({ shifts, employees, departments, assignmentsByShift }) {
  const assignedShiftCount = shifts.filter((shift) => (assignmentsByShift.get(shift.id) || []).length > 0).length;
  const hours = shifts.reduce((sum, shift) => sum + shiftHours(shift), 0);
  const byStatus = rotaStatuses.map((status) => ({ status, count: shifts.filter((shift) => shift.status === status).length }));
  const byDepartment = departmentLoad(departments, shifts);
  return (
    <section className="grid gap-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total shifts", shifts.length, CalendarClock],
          ["Assigned shifts", assignedShiftCount, UserCog],
          ["Visible staff", employees.length || "Personal", Users],
          ["Planned hours", hours.toFixed(1), BarChart3],
        ].map(([label, value, Icon]) => (
          <article key={label} className="woodlands-glass-card rounded-2xl p-4">
            <Icon aria-hidden="true" className="text-berry" />
            <p className="mt-2 text-xs font-black uppercase tracking-wide text-slate-600">{label}</p>
            <p className="font-display text-4xl font-black text-ink">{value}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="woodlands-glass-card rounded-2xl p-4 sm:p-5">
          <h3 className="font-display text-2xl font-black text-ink">Status Breakdown</h3>
          <div className="mt-4 grid gap-3">
            {byStatus.map((row) => <RotaProgress key={row.status} label={row.status} value={row.count} max={shifts.length} />)}
          </div>
        </div>
        <div className="woodlands-glass-card rounded-2xl p-4 sm:p-5">
          <h3 className="font-display text-2xl font-black text-ink">Department Breakdown</h3>
          <div className="mt-4 grid gap-3">
            {byDepartment.map((row) => <RotaProgress key={row.id || row.name} label={row.name} value={row.count} max={Math.max(1, shifts.length)} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function DutyOrbitSettingsPanel({ canEdit, departments, workLocations }) {
  const [settings, setSettings] = useState({
    weekStartsOn: "Monday",
    weekEndsOn: "Sunday",
    normalHours: "09:00 - 17:30",
    payRunDay: "Friday",
    shiftReminder: "24 hours before shift",
    tabletMode: "Staff PIN check-in",
  });
  return (
    <section className="woodlands-glass-card rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-berry">DutyOrbit Settings</p>
          <h3 className="mt-1 font-display text-3xl font-black text-ink">Rota Workspace Settings</h3>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">Operational parameters used by the rota screens.</p>
        </div>
        <Settings aria-hidden="true" className="text-berry" size={36} />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(settings).map(([key, value]) => (
          <RotaInput
            key={key}
            label={settingLabel(key)}
            value={value}
            onChange={(next) => setSettings((current) => ({ ...current, [key]: next }))}
          />
        ))}
        <PreviewLine label="Departments" value={departments.length} />
        <PreviewLine label="Work locations" value={workLocations.length} />
      </div>
      {canEdit ? (
        <p className="mt-4 rounded-xl bg-sunshine/25 p-3 text-sm font-bold text-ink">
          Changes here shape the local rota workspace. Production persistence can be connected to the rota settings table when the policy values are final.
        </p>
      ) : (
        <p className="mt-4 rounded-xl bg-mist p-3 text-sm font-bold text-slate-700">These settings are visible to staff with rota access.</p>
      )}
    </section>
  );
}

function RotaProgress({ label, value, max }) {
  const width = Math.max(4, Math.round((Number(value || 0) / Math.max(1, Number(max || 1))) * 100));
  return (
    <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-3 text-sm font-black text-ink">
        <span className="capitalize">{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-mist">
        <div className="h-full rounded-full bg-woodpink" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function DutyOrbitShiftTable({ shifts, employees, workLocations, canEdit, editingId, editForm, setEditForm, onStartEdit, onCancelEdit, onUpdate, onDelete }) {
  return (
    <section className="woodlands-glass-card rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-black text-ink">Shift List</h3>
          <p className="mt-1 text-sm font-semibold text-slate-700">Inline edit, delete and status controls match the DutyOrbit workflow.</p>
        </div>
        <ListChecks aria-hidden="true" className="text-berry" />
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[1160px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-wide text-slate-600">
              <th className="py-3 pr-4">Employee</th>
              <th className="py-3 pr-4">Title</th>
              <th className="py-3 pr-4">Location</th>
              <th className="py-3 pr-4">Date</th>
              <th className="py-3 pr-4">Time</th>
              <th className="py-3 pr-4">Break</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => {
              const isEditing = editingId === shift.id;
              return (
                <tr key={shift.id} className="border-b border-slate-100 align-top">
                  <td className="py-3 pr-4">
                    {isEditing ? (
                      <select value={editForm.employee_id} onChange={(event) => setEditForm((current) => ({ ...current, employee_id: event.target.value }))} className="rota-inline-control min-w-40">
                        <option value="">Unassigned</option>
                        {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
                      </select>
                    ) : (
                      <span className="font-black text-ink">{shift.employee_name || "Unassigned"}</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {isEditing ? <input value={editForm.title} onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))} className="rota-inline-control min-w-44" /> : <span className="font-bold text-slate-700">{shift.title}</span>}
                  </td>
                  <td className="py-3 pr-4">
                    {isEditing ? (
                      <div className="grid min-w-[240px] gap-2">
                        <select value={editForm.work_location_mode} onChange={(event) => setEditForm((current) => ({ ...current, work_location_mode: event.target.value === "custom" ? "custom" : "saved" }))} className="rota-inline-control">
                          <option value="saved">Saved</option>
                          <option value="custom">Custom</option>
                        </select>
                        {editForm.work_location_mode === "saved" ? (
                          <select value={editForm.work_location_id} onChange={(event) => setEditForm((current) => ({ ...current, work_location_id: event.target.value }))} className="rota-inline-control">
                            <option value="">Select work location</option>
                            {workLocations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
                          </select>
                        ) : (
                          <input value={editForm.custom_location} onChange={(event) => setEditForm((current) => ({ ...current, custom_location: event.target.value }))} className="rota-inline-control" />
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-700">{getShiftLocationLabel(shift)}</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">{isEditing ? <input type="date" value={editForm.date} onChange={(event) => setEditForm((current) => ({ ...current, date: event.target.value }))} className="rota-inline-control" /> : <span className="text-slate-700">{formatDateLabel(shift.date)}</span>}</td>
                  <td className="py-3 pr-4">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input type="time" value={editForm.start_time} onChange={(event) => setEditForm((current) => ({ ...current, start_time: event.target.value }))} className="rota-inline-control w-28" />
                        <input type="time" value={editForm.end_time} onChange={(event) => setEditForm((current) => ({ ...current, end_time: event.target.value }))} className="rota-inline-control w-28" />
                      </div>
                    ) : (
                      <span className="text-slate-700">{formatTimeLabel(shift.start_time)} - {formatTimeLabel(shift.end_time)}</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input type="number" min="0" max="240" step="5" value={editForm.break_minutes} onChange={(event) => setEditForm((current) => ({ ...current, break_minutes: numberOrZero(event.target.value) }))} className="rota-inline-control w-20" />
                        <label className="inline-flex items-center gap-1 text-xs font-bold text-slate-700">
                          <input type="checkbox" checked={Boolean(editForm.paid_break)} onChange={(event) => setEditForm((current) => ({ ...current, paid_break: event.target.checked }))} />
                          Paid
                        </label>
                      </div>
                    ) : (
                      <span className="text-slate-700">{Number(shift.break_minutes || 0)}m {shift.paid_break ? "paid" : "unpaid"}</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {isEditing ? (
                      <select value={editForm.status} onChange={(event) => setEditForm((current) => ({ ...current, status: event.target.value }))} className="rota-inline-control">
                        {rotaStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    ) : (
                      <span className={`rota-status-pill ${shift.status}`}>{shift.status}</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {canEdit && (isEditing ? (
                      <div className="flex gap-2">
                        <button type="button" onClick={() => onUpdate(shift.id)} className="rounded-lg bg-woodpink px-3 py-2 text-xs font-black uppercase tracking-wide text-white">Save</button>
                        <button type="button" onClick={onCancelEdit} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-ink">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button type="button" onClick={() => onStartEdit(shift)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-wide text-ink hover:bg-sunshine"><Pencil aria-hidden="true" size={14} />Edit</button>
                        <button type="button" onClick={() => onDelete(shift)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-black uppercase tracking-wide text-red-700">Delete</button>
                      </div>
                    ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!shifts.length && <p className="mt-4 rounded-xl bg-mist p-4 text-sm font-bold text-slate-700">No shifts match the current filters.</p>}
      </div>
    </section>
  );
}

function DutyOrbitCalendar({ shifts, employees, currentMonth, setCurrentMonth, canAssign, filters, setFilters }) {
  const days = useMemo(() => buildMonthDays(currentMonth), [currentMonth]);
  const shiftMap = useMemo(() => {
    const map = new Map();
    for (const shift of shifts) {
      const key = String(shift.date || "").slice(0, 10);
      const list = map.get(key) || [];
      list.push(shift);
      map.set(key, list);
    }
    return map;
  }, [shifts]);

  return (
    <section className="woodlands-glass-card rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-ink hover:bg-sunshine" aria-label="Previous month">
            <ChevronLeft aria-hidden="true" size={19} />
          </button>
          <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-ink hover:bg-sunshine" aria-label="Next month">
            <ChevronRight aria-hidden="true" size={19} />
          </button>
        </div>
        <h3 className="font-display text-3xl font-black text-ink">{monthTitle(currentMonth)}</h3>
        {canAssign ? (
          <select value={filters.employeeId} onChange={(event) => setFilters((current) => ({ ...current, employeeId: event.target.value }))} className="focus-ring min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-ink">
            <option value="">All employees</option>
            {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
          </select>
        ) : <span />}
      </div>
      <div className="mt-5 hidden grid-cols-7 gap-2 lg:grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
          <div key={label} className="text-center text-xs font-black uppercase tracking-wide text-slate-600">{label}</div>
        ))}
      </div>
      <div className="mobile-rail hide-scrollbar mt-2 flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-7">
        {days.map((day) => {
          const key = toIsoDate(day);
          const dayShifts = shiftMap.get(key) || [];
          const current = day.getMonth() === currentMonth.getMonth();
          return (
            <div key={key} className={`min-h-40 w-[260px] shrink-0 rounded-xl border p-3 sm:w-auto sm:shrink ${current ? "border-slate-200 bg-white" : "border-slate-100 bg-white/55"}`}>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">{weekdayShort(day)}</p>
              <p className="mt-1 text-base font-black text-ink">{day.getDate()} {monthShort(day)}</p>
              <div className="mt-2 grid gap-1.5">
                {dayShifts.slice(0, 4).map((shift) => (
                  <div key={shift.id} className="rounded-lg bg-sunshine/45 px-2 py-1 text-xs text-ink">
                    <p className="truncate font-black">{shift.title}</p>
                    <p>{formatTimeLabel(shift.start_time)} - {formatTimeLabel(shift.end_time)}</p>
                    <p className="truncate">{getShiftLocationLabel(shift)}</p>
                    {canAssign ? <p className="truncate font-bold">{shift.employee_name || "Unassigned"}</p> : null}
                  </div>
                ))}
                {dayShifts.length > 4 && <p className="text-xs font-bold text-berry">+{dayShifts.length - 4} more</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DutyOrbitAssignments({ data, assignmentsByShift, onAssign, onUnassign }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.65fr_1.35fr]">
      {data.canAssign && (
        <form className="woodlands-glass-card rounded-2xl p-4 sm:p-5" onSubmit={onAssign}>
          <h3 className="font-display text-2xl font-black text-ink">Assign Staff</h3>
          <RotaSelect label="Shift" name="shiftId" required>
            <option value="">Choose shift</option>
            {data.shifts.map((shift) => <option key={shift.id} value={shift.id}>{shift.date} - {shift.title}</option>)}
          </RotaSelect>
          <RotaSelect label="Employee" name="employeeId" required>
            <option value="">Choose employee</option>
            {data.employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name} - {employee.department}</option>)}
          </RotaSelect>
          <button className="focus-ring mt-4 inline-flex min-h-12 items-center gap-2 rounded-xl bg-woodpink px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-button" type="submit">
            <UserCog aria-hidden="true" size={18} />
            Assign
          </button>
        </form>
      )}
      <div className="woodlands-glass-card rounded-2xl p-4 sm:p-5">
        <h3 className="font-display text-2xl font-black text-ink">Current Assignments</h3>
        <div className="mt-4 grid gap-3">
          {data.shifts.map((shift) => (
            <section key={shift.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-berry">{formatDateLabel(shift.date)}</p>
                  <h4 className="mt-1 font-display text-xl font-black text-ink">{shift.title}</h4>
                  <p className="text-sm font-bold text-slate-700">{formatTimeLabel(shift.start_time)} - {formatTimeLabel(shift.end_time)} at {getShiftLocationLabel(shift)}</p>
                </div>
                <span className={`rota-status-pill ${shift.status}`}>{shift.status}</span>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {(assignmentsByShift.get(shift.id) || []).map((assignment) => (
                  <div key={`${shift.id}-${assignment.employeeId || assignment.name}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-mist p-3 text-sm">
                    <span className="font-bold text-slate-700">{assignment.name} - {assignment.jobTitle || assignment.role}</span>
                    {data.canAssign && assignment.employeeId && (
                      <button className="focus-ring rounded-lg bg-red-50 px-3 py-2 text-xs font-black uppercase tracking-wide text-red-700" type="button" onClick={() => onUnassign(shift.id, assignment.employeeId)}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {!(assignmentsByShift.get(shift.id) || []).length && <p className="rounded-lg bg-mist p-3 text-sm font-bold text-slate-600">Unassigned</p>}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function RotaInput({ label, value, onChange, type = "text", required = false, placeholder = "", min, max, step }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-wide text-slate-600">{label}</span>
      <input
        className="focus-ring min-h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-ink"
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
      />
    </label>
  );
}

function RotaSelect({ label, value, onChange, children, name, required = false }) {
  return (
    <label className="mt-3 grid gap-2 first:mt-0">
      <span className="text-xs font-black uppercase tracking-wide text-slate-600">{label}</span>
      <select
        className="focus-ring min-h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-ink"
        name={name}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        required={required}
      >
        {children}
      </select>
    </label>
  );
}

function buildWorkLocations(departments, shifts) {
  const locations = [];
  const seen = new Set();
  for (const department of departments || []) {
    const name = department.name || "";
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    locations.push({ id: `department-${department.id}`, name, departmentId: department.id });
  }
  for (const shift of shifts || []) {
    const name = String(shift.location || "").trim();
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    locations.push({ id: `location-${locations.length + 1}`, name, departmentId: "" });
  }
  return locations;
}

function enrichShift(shift, assignmentsByShift) {
  const assignments = assignmentsByShift.get(shift.id) || [];
  const primary = assignments[0] || {};
  return {
    ...shift,
    employee_id: primary.employeeId || "",
    employee_name: primary.name || "",
    employee_role: primary.role || "",
    employee_job_title: primary.jobTitle || "",
  };
}

function filterRotaShifts(shifts, filters) {
  const query = String(filters.query || "").trim().toLowerCase();
  return shifts.filter((shift) => {
    if (filters.departmentId && String(shift.department_id || "") !== String(filters.departmentId)) return false;
    if (filters.employeeId && String(shift.employee_id || "") !== String(filters.employeeId)) return false;
    if (filters.status && String(shift.status || "") !== filters.status) return false;
    if (!query) return true;
    return [
      shift.title,
      shift.location,
      shift.department_name,
      shift.employee_name,
      shift.date,
      shift.status,
    ].some((value) => String(value || "").toLowerCase().includes(query));
  });
}

function buildShiftPayload(form, workLocations) {
  const selectedLocation = workLocations.find((location) => String(location.id) === String(form.work_location_id));
  const location = form.work_location_mode === "custom" ? form.custom_location : selectedLocation?.name || "";
  const departmentId = form.department_id || selectedLocation?.departmentId || "";
  return {
    employeeId: form.employee_id || "",
    title: String(form.title || "").trim(),
    date: form.date,
    startTime: form.start_time,
    endTime: form.end_time,
    status: form.status || "scheduled",
    location,
    departmentId,
    breakMinutes: numberOrZero(form.break_minutes),
    paidBreak: Boolean(form.paid_break),
  };
}

function shiftToDutyOrbitForm(shift, workLocations) {
  const locationName = String(shift.location || "").trim();
  const selectedLocation = workLocations.find((location) => (
    String(location.name).toLowerCase() === locationName.toLowerCase()
    || (location.departmentId && String(location.departmentId) === String(shift.department_id))
  ));
  return {
    employee_id: shift.employee_id || "",
    title: shift.title || "",
    date: String(shift.date || "").slice(0, 10),
    start_time: formatTimeLabel(shift.start_time),
    end_time: formatTimeLabel(shift.end_time),
    status: shift.status || "scheduled",
    break_minutes: numberOrZero(shift.break_minutes),
    paid_break: Boolean(shift.paid_break),
    department_id: shift.department_id || "",
    work_location_mode: selectedLocation ? "saved" : "custom",
    work_location_id: selectedLocation?.id || "",
    custom_location: selectedLocation ? "" : locationName,
  };
}

function getShiftLocationLabel(shift) {
  return String(shift?.location || "").trim() || shift?.department_name || "Location not set";
}

function assignmentNames(assignments) {
  return assignments.length ? assignments.map((assignment) => assignment.name).join(", ") : "Unassigned";
}

function groupShiftsByDate(shifts) {
  const map = new Map();
  for (const shift of shifts || []) {
    const key = String(shift.date || "").slice(0, 10);
    if (!key) continue;
    const list = map.get(key) || [];
    list.push(shift);
    map.set(key, list);
  }
  return map;
}

function departmentLoad(departments, shifts) {
  const known = new Map((departments || []).map((department) => [String(department.id), { id: department.id, name: department.name, count: 0 }]));
  const unassigned = { id: "", name: "Unassigned Department", count: 0 };
  for (const shift of shifts || []) {
    const key = String(shift.department_id || "");
    if (key && known.has(key)) {
      known.get(key).count += 1;
    } else if (shift.department_name) {
      const generatedKey = `name-${shift.department_name}`;
      if (!known.has(generatedKey)) known.set(generatedKey, { id: generatedKey, name: shift.department_name, count: 0 });
      known.get(generatedKey).count += 1;
    } else {
      unassigned.count += 1;
    }
  }
  const rows = [...known.values()];
  if (unassigned.count) rows.push(unassigned);
  return rows.sort((a, b) => b.count - a.count || String(a.name).localeCompare(String(b.name)));
}

function buildTimesheetRows(shifts, employees, assignmentsByShift) {
  const rows = new Map();
  for (const employee of employees || []) {
    rows.set(String(employee.id), {
      id: employee.id,
      name: employee.name,
      department: employee.department,
      shiftCount: 0,
      hours: 0,
      nextShift: null,
    });
  }
  for (const shift of shifts || []) {
    const assignments = assignmentsByShift.get(shift.id) || [];
    for (const assignment of assignments) {
      const key = String(assignment.employeeId || assignment.name || "unassigned");
      const row = rows.get(key) || {
        id: assignment.employeeId || key,
        name: assignment.name || "Unassigned",
        department: assignment.department,
        shiftCount: 0,
        hours: 0,
        nextShift: null,
      };
      row.shiftCount += 1;
      row.hours += shiftHours(shift);
      if (!row.nextShift || String(shift.date || "") < String(row.nextShift.date || "")) row.nextShift = shift;
      rows.set(key, row);
    }
  }
  return [...rows.values()].filter((row) => row.shiftCount > 0 || employees?.length).sort((a, b) => String(a.name).localeCompare(String(b.name)));
}

function shiftHours(shift) {
  const start = minutesFromTime(shift?.start_time);
  const end = minutesFromTime(shift?.end_time);
  if (start === null || end === null) return 0;
  let total = end - start;
  if (total < 0) total += 24 * 60;
  if (!shift?.paid_break) total -= numberOrZero(shift?.break_minutes);
  return Math.max(0, total) / 60;
}

function minutesFromTime(value) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return (hours * 60) + minutes;
}

function numberOrZero(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function addDays(date, count) {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
}

function startOfWeek(date) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  return start;
}

function addMonths(date, count) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + count);
  return next;
}

function buildMonthDays(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const end = new Date(last);
  end.setDate(last.getDate() + (6 - last.getDay()));
  const days = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function monthTitle(date) {
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(date);
}

function weekdayShort(date) {
  return new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(date);
}

function monthShort(date) {
  return new Intl.DateTimeFormat("en-GB", { month: "short" }).format(date);
}

function settingLabel(key) {
  return String(key).replace(/([A-Z])/g, " $1").replace(/^./, (character) => character.toUpperCase());
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

function EditorPreviewGrid({ editor, preview }) {
  return (
    <div className="admin-editor-grid">
      <div className="admin-editor-pane">{editor}</div>
      <div className="admin-preview-window">{preview}</div>
    </div>
  );
}

function PreviewCard({ eyebrow = "Live Preview", title, children }) {
  return (
    <aside className="rounded-lg border-2 border-sunshine bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-berry">{eyebrow}</p>
      {title && <h3 className="mt-2 font-display text-2xl font-black text-ink">{title}</h3>}
      <div className="mt-4 grid gap-3">{children}</div>
    </aside>
  );
}

function AdminUserPreview({ form, departments }) {
  const department = departments.find((item) => String(item.id) === String(form.departmentId));
  return (
    <PreviewCard title={form.name || "New Staff User"}>
      <PreviewLine label="Email" value={form.email || "staff@example.com"} />
      <div className="flex flex-wrap gap-2">
        <PreviewBadge label={form.role || "staff"} />
        <PreviewBadge label={department?.name || "No department"} variant="blue" />
      </div>
      <PreviewLine label="Job title" value={form.jobTitle || "Ranger"} />
      <p className="rounded-lg bg-mist p-3 text-sm leading-6 text-slate-700">
        If no temporary password is set, an invitation link is queued and the user sets their own password before first login.
      </p>
    </PreviewCard>
  );
}

function AdminPagePreview({ page }) {
  return (
    <PreviewCard title={page.title || "Untitled Page"}>
      {page.image ? <PreviewImage src={page.image} alt={page.title || "Page preview"} /> : null}
      <PreviewBadge label={page.status || "draft"} />
      <PreviewLine label="Path" value={page.path} />
      <p className="rounded-lg bg-mist p-3 text-sm leading-6 text-slate-700">{page.summary || "No page summary yet."}</p>
      {(page.sections || []).slice().sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0)).map((section) => (
        <section key={section.id} className="rounded-lg border border-slate-200 bg-white p-3">
          <h4 className="font-display text-xl font-black text-ink">{section.title || "Untitled section"}</h4>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{section.body || "No body text."}</p>
        </section>
      ))}
    </PreviewCard>
  );
}

function AdminEventPreview({ event }) {
  return (
    <PreviewCard title={event.title || "Untitled Event"}>
      {event.image ? <PreviewImage src={event.image} alt={event.title || "Event preview"} /> : null}
      <div className="flex flex-wrap gap-2">
        <PreviewBadge label={event.status || "draft"} />
        {event.event_date ? <PreviewBadge label={formatDateLabel(event.event_date)} variant="blue" /> : null}
      </div>
      <PreviewLine label="Path" value={event.path || "No path set"} />
      <p className="rounded-lg bg-mist p-3 text-sm leading-6 text-slate-700">{event.summary || "No event summary yet."}</p>
    </PreviewCard>
  );
}

function AdminOpeningPreview({ row }) {
  const notes = cleanOpeningAdminNote(row.notes);
  return (
    <PreviewCard title={formatDateLabel(row.date) || row.date || "Opening Date"}>
      <div className="flex items-center gap-4 rounded-lg bg-mist p-4">
        <span className={`inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 text-lg font-black ${openingStatusClass(row.status)}`}>
          {row.date ? Number(String(row.date).slice(-2)) : "--"}
        </span>
        <div>
          <p className="font-display text-2xl font-black text-ink">{row.season_label || openingStatusLabel(row.status)}</p>
          <p className="mt-1 text-sm font-bold text-slate-700">
            {row.status === "closed" ? "Park Closed" : `${row.open_time || "Opening time"} - ${row.close_time || "Closing time"}`}
          </p>
        </div>
      </div>
      {notes ? <p className="rounded-lg bg-white p-3 text-sm leading-6 text-slate-700 ring-1 ring-slate-200">{notes}</p> : (
        <p className="rounded-lg bg-white p-3 text-sm font-bold leading-6 text-slate-600 ring-1 ring-slate-200">
          General off-peak and closed-date notes are shown once on the public Opening Times page, not repeated for every date.
        </p>
      )}
    </PreviewCard>
  );
}

function AdminFaqPreview({ faq }) {
  return (
    <PreviewCard title={faq.group_title || "FAQ"}>
      <details className="rounded-lg border border-slate-200 bg-mist p-4" open>
        <summary className="cursor-pointer font-display text-xl font-black text-ink">{faq.question || "Question"}</summary>
        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{faq.answer || "Answer text will appear here."}</p>
      </details>
      <PreviewLine label="Order" value={faq.sort_order ?? 0} />
    </PreviewCard>
  );
}

function AdminMediaPreview({ item }) {
  return (
    <PreviewCard title={item.title || "Media Asset"}>
      {item.path ? <PreviewImage src={item.path} alt={item.alt_text || item.title || "Media preview"} /> : <p className="rounded-lg bg-mist p-3 text-sm font-bold text-slate-700">No media path set.</p>}
      <PreviewLine label="Alt text" value={item.alt_text || "No alt text"} />
      <PreviewLine label="Usage" value={item.usage || "website"} />
      <PreviewLine label="Path" value={item.path || "-"} />
    </PreviewCard>
  );
}

function AdminDocumentPreview({ document }) {
  return (
    <PreviewCard title={document.title || "Document"}>
      <PreviewLine label="Local path" value={document.local_path || "No local path"} />
      <PreviewLine label="Used on" value={document.page_paths || "No page paths set"} />
      <p className="rounded-lg bg-mist p-3 text-sm leading-6 text-slate-700">{document.description || "No description yet."}</p>
      {document.local_path ? (
        <a className="focus-ring inline-flex min-h-11 w-fit items-center rounded-lg bg-woodpink px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-button" href={document.local_path} target="_blank" rel="noreferrer">
          Open Document
        </a>
      ) : null}
    </PreviewCard>
  );
}

function AdminSubscriberPreview({ subscriber }) {
  const name = [subscriber.first_name, subscriber.last_name].filter(Boolean).join(" ");
  return (
    <PreviewCard title={name || "Newsletter Subscriber"}>
      <PreviewLine label="Email" value={subscriber.email || "email@example.com"} />
      <PreviewBadge label={subscriber.status || "subscribed"} />
      <p className="rounded-lg bg-mist p-3 text-sm leading-6 text-slate-700">
        Subscriber records are used for newsletter consent exports and future email integrations.
      </p>
    </PreviewCard>
  );
}

function AdminTicketPreview({ ticketType }) {
  return (
    <PreviewCard title={ticketType.name || "Ticket Type"}>
      <div className="rounded-lg border-2 border-sunshine bg-gradient-to-br from-white to-sunshine/25 p-4">
        <p className="text-xs font-black uppercase tracking-wide text-berry">{ticketType.slug || "ticket-slug"}</p>
        <h4 className="mt-2 font-display text-3xl font-black text-ink">{ticketType.name || "Ticket Name"}</h4>
        <p className="mt-2 font-display text-2xl font-black text-woodpink">{ticketType.price_label || "Price label"}</p>
        <p className="mt-3 text-sm leading-6 text-slate-700">{ticketType.description || "Ticket description will appear here."}</p>
      </div>
      <PreviewLine label="Display order" value={ticketType.sort_order ?? 0} />
    </PreviewCard>
  );
}

function PreviewImage({ src, alt }) {
  const resolved = adminMediaSource(src);
  if (!resolved) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-lg bg-mist p-4 text-center text-sm font-bold text-slate-600 ring-1 ring-slate-200">
        No local image selected.
      </div>
    );
  }
  return <img className="h-48 w-full rounded-lg object-cover ring-1 ring-slate-200" src={resolved} alt={alt} loading="lazy" />;
}

function PreviewLine({ label, value }) {
  return (
    <p className="break-words rounded-lg bg-mist p-3 text-sm text-slate-700">
      <span className="block text-xs font-black uppercase tracking-wide text-berry">{label}</span>
      <span className="font-bold">{value || "-"}</span>
    </p>
  );
}

function PreviewBadge({ label, variant = "pink" }) {
  const classes = variant === "blue" ? "bg-sky-100 text-sky-800" : "bg-sunshine text-ink";
  return <span className={`inline-flex w-fit rounded-lg px-3 py-1 text-xs font-black uppercase tracking-wide ${classes}`}>{label}</span>;
}

function openingStatusLabel(status) {
  if (status === "main") return "Main Season";
  if (status === "off-peak") return "Off Peak Weekdays";
  if (status === "winter") return "Winter Fun";
  return "Park Closed";
}

function openingStatusClass(status) {
  if (status === "main") return "border-leaf bg-leaf text-white";
  if (status === "off-peak") return "border-sunshine bg-sunshine text-ink";
  if (status === "winter") return "border-sky-500 bg-sky-500 text-white";
  return "border-red-500 bg-white text-red-600";
}

function formatDateLabel(value) {
  if (!value) return "";
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(date);
}

function formatTimeLabel(value) {
  if (!value) return "";
  return String(value).slice(0, 5);
}

function adminMediaSource(value) {
  if (!value) return "";
  const raw = String(value).trim();
  if (!raw) return "";
  if (raw.startsWith("data:") || raw.startsWith("/") || raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  const normalized = raw
    .replace(/^src[\\/]+assets[\\/]+images[\\/]+/i, "")
    .replace(/^\.{0,2}[\\/]+assets[\\/]+images[\\/]+/i, "")
    .replaceAll("\\", "/");
  return mediaSource(normalized) || mediaSource(raw) || "";
}

function cleanOpeningAdminNote(value) {
  const note = String(value || "").trim();
  if (!note) return "";
  const genericFragments = [
    "For our full 2026 calendar",
    "Rides closed during",
    "Watercoasters, Pedal Boat",
    "Please note, some rides are closed during off-peak",
    "The Family Theme Park is not open",
  ];
  return genericFragments.some((fragment) => note.includes(fragment)) ? "" : note;
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

function AdminSelect({ label, value, onChange, options }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold text-ink">{label}</span>
      <select className="focus-ring min-h-12 rounded-lg border border-slate-300 bg-white px-3" value={value ?? ""} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function ActionRow({ children }) {
  return <div className="mt-4 flex flex-wrap items-center gap-3">{children}</div>;
}

function CreateButton({ label }) {
  return (
    <button className="focus-ring mt-4 inline-flex min-h-12 w-fit items-center gap-2 rounded-lg bg-leaf px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-button" type="submit">
      <Plus aria-hidden="true" size={18} />
      {label}
    </button>
  );
}

function SaveButton({ onClick }) {
  return (
    <button className="focus-ring inline-flex min-h-11 w-fit items-center gap-2 rounded-lg bg-woodpink px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white shadow-button" type="button" onClick={onClick}>
      <Save aria-hidden="true" size={18} />
      Save
    </button>
  );
}

function DeleteButton({ onClick }) {
  return (
    <button className="focus-ring inline-flex min-h-11 w-fit items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-white shadow-button" type="button" onClick={onClick}>
      <Trash2 aria-hidden="true" size={18} />
      Delete
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

function removeRecord(current, key, id) {
  return {
    ...current,
    [key]: current[key].filter((item) => item.id !== id),
  };
}

function addPageSection(current, pageId, section) {
  return {
    ...current,
    pages: current.pages.map((page) => (page.id === pageId ? { ...page, sections: [...(page.sections || []), section] } : page)),
  };
}

function updatePageSectionRecord(current, pageId, sectionId, patch) {
  return {
    ...current,
    pages: current.pages.map((page) => (
      page.id === pageId
        ? { ...page, sections: (page.sections || []).map((section) => (section.id === sectionId ? { ...section, ...patch } : section)) }
        : page
    )),
  };
}

function removePageSection(current, pageId, sectionId) {
  return {
    ...current,
    pages: current.pages.map((page) => (
      page.id === pageId
        ? { ...page, sections: (page.sections || []).filter((section) => section.id !== sectionId) }
        : page
    )),
  };
}
