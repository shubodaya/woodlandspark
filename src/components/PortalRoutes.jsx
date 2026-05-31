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
  Plus,
  Save,
  Send,
  ShieldCheck,
  Ticket,
  Trash2,
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
      <PortalShell>
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
            <DashboardCounts counts={data.counts} onSelectTab={setActiveTab} />
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

function DashboardCounts({ counts, onSelectTab }) {
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
        <button key={label} type="button" className="focus-ring rounded-lg border-2 border-sunshine bg-white p-5 text-left text-ink shadow-sm transition hover:-translate-y-1 hover:bg-sunshine/20" onClick={() => onSelectTab(tab)}>
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
  const [error, setError] = useState("");

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
              <th className="p-3">Invite</th>
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

      <div className="grid gap-5 lg:grid-cols-[0.38fr_0.62fr]">
        <aside className="max-h-[760px] overflow-auto rounded-lg border border-slate-200 bg-mist p-3">
          {pages.map((page) => (
            <button key={page.id} type="button" className={`focus-ring mb-2 block w-full rounded-lg p-3 text-left text-sm font-black ${String(selectedPage?.id) === String(page.id) ? "bg-woodpink text-white" : "bg-white text-ink hover:bg-sunshine"}`} onClick={() => setSelectedId(page.id)}>
              <span className="block">{page.title}</span>
              <span className="block truncate text-xs opacity-80">{page.path}</span>
            </button>
          ))}
        </aside>
        {selectedPage && (
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
              <div className="mt-4 grid gap-4 md:grid-cols-[1fr_2fr_0.4fr]">
                <AdminInput label="Section Title" value={newSection.title} onChange={(value) => setNewSection((current) => ({ ...current, title: value }))} required />
                <AdminTextarea label="Section Body" value={newSection.body} onChange={(value) => setNewSection((current) => ({ ...current, body: value }))} />
                <AdminInput label="Order" type="number" value={newSection.sort_order} onChange={(value) => setNewSection((current) => ({ ...current, sort_order: value }))} />
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
        <EditableCard key={event.id} title={event.source_url || "Event"}>
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
      ))}
    </ManagerPanel>
  );
}

function OpeningManager({ openingTimes, setData, setSaveMessage }) {
  const [form, setForm] = useState({ date: "", status: "closed", season_label: "Park Closed", open_time: "", close_time: "", notes: "" });
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
      {openingTimes.map((row) => (
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
          <AdminInput label="Season Label" value={row.season_label || ""} onChange={(value) => setData((current) => updateRecord(current, "openingTimes", row.id, { season_label: value }))} />
          <AdminTextarea label="Notes" value={row.notes || ""} onChange={(value) => setData((current) => updateRecord(current, "openingTimes", row.id, { notes: value }))} />
          <ActionRow>
            <SaveButton onClick={() => updateOpening(row)} />
            <DeleteButton onClick={() => deleteOpening(row)} />
          </ActionRow>
        </EditableCard>
      ))}
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
        <EditableCard key={faq.id} title={faq.group_title}>
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
      <div className="grid gap-4 md:grid-cols-3">
        {media.map((item) => (
          <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
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
      <div className="grid gap-4 md:grid-cols-2">
        {documents.map((document) => (
          <article key={document.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
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
      <div className="grid gap-4 md:grid-cols-2">
        {ticketTypes.map((ticketType) => (
          <EditableCard key={ticketType.id} title={ticketType.slug}>
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
        ) : user?.mustResetPassword ? (
          <PasswordResetRequired user={user} onComplete={(nextUser) => setUser(nextUser)} />
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
  const [newShift, setNewShift] = useState({ title: "", date: "", startTime: "", endTime: "", location: "", departmentId: "", employeeId: "", breakMinutes: 0, paidBreak: false });
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
      setNewShift({ title: "", date: "", startTime: "", endTime: "", location: "", departmentId: "", employeeId: "", breakMinutes: 0, paidBreak: false });
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
          breakMinutes: shift.break_minutes || 0,
          paidBreak: Boolean(shift.paid_break),
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
                <AdminInput label="Break Minutes" type="number" value={newShift.breakMinutes} onChange={(value) => setNewShift((current) => ({ ...current, breakMinutes: value }))} />
                <label className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 text-sm font-extrabold text-ink">
                  <input type="checkbox" checked={newShift.paidBreak} onChange={(event) => setNewShift((current) => ({ ...current, paidBreak: event.target.checked }))} />
                  Paid Break
                </label>
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
            <RotaShiftList data={data} assignmentsByShift={assignmentsByShift} onUpdate={updateShift} onDelete={deleteShift} />
          )}
        </>
      )}
    </div>
  );
}

function RotaShiftList({ data, assignmentsByShift, onUpdate, onDelete }) {
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
            <EditableShiftCard key={shift.id} shift={shift} assignments={assignmentsByShift.get(shift.id) || []} onSave={onUpdate} onDelete={onDelete} />
          ) : (
            <ReadOnlyShiftCard key={shift.id} shift={shift} assignments={assignmentsByShift.get(shift.id) || []} />
          )
        ))}
        {!data.shifts.length && <p className="rounded-lg bg-mist p-4 text-sm font-bold text-slate-700">No shifts are currently assigned.</p>}
      </div>
    </div>
  );
}

function EditableShiftCard({ shift, assignments, onSave, onDelete }) {
  const [draft, setDraft] = useState({
    title: shift.title,
    date: shift.date,
    startTime: shift.start_time,
    endTime: shift.end_time,
    location: shift.location || "",
    breakMinutes: shift.break_minutes || 0,
    paidBreak: Boolean(shift.paid_break),
  });

  useEffect(() => {
    setDraft({
      title: shift.title,
      date: shift.date,
      startTime: shift.start_time,
      endTime: shift.end_time,
      location: shift.location || "",
      breakMinutes: shift.break_minutes || 0,
      paidBreak: Boolean(shift.paid_break),
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
        <AdminInput label="Break Minutes" type="number" value={draft.breakMinutes} onChange={(value) => setDraft((current) => ({ ...current, breakMinutes: value }))} />
        <label className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 text-sm font-extrabold text-ink">
          <input type="checkbox" checked={draft.paidBreak} onChange={(event) => setDraft((current) => ({ ...current, paidBreak: event.target.checked }))} />
          Paid Break
        </label>
      </div>
      <AssignmentBadges shift={shift} assignments={assignments} />
      <ActionRow>
        <SaveButton onClick={() => onSave(shift, draft)} />
        <DeleteButton onClick={() => onDelete(shift)} />
      </ActionRow>
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
