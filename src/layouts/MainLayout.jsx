import { Outlet, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  const { darkMode, toggleTheme, theme } = useTheme();

  const location = useLocation();

  // ==========================================
  // AUTO CLOSE SIDEBAR ON ROUTE CHANGE
  // ==========================================
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // ==========================================
  // RESPONSIVE SIDEBAR WIDTH
  // ==========================================
  const sidebarWidth = 260;

  return (
    <div style={styles.wrapper(theme)}>

      {/* ======================================
          MOBILE OVERLAY
      ====================================== */}
      {open && (
        <div
          style={styles.overlay}
          onClick={() => setOpen(false)}
        />
      )}

      {/* ======================================
          SIDEBAR
      ====================================== */}
      <aside
        style={{
          ...styles.sidebar(theme),
          transform: open
            ? "translateX(0)"
            : "translateX(-100%)",
        }}
      >

        {/* LOGO */}
        <div style={styles.logoSection}>
          <h2 style={{ margin: 0 }}>
            GML 62 IT SOLUTIONS
          </h2>

          <button
            onClick={() => setOpen(false)}
            style={styles.closeBtn(theme)}
          >
            ✕
          </button>
        </div>

        {/* ======================================
            ERP SECTION
        ====================================== */}
        <p style={styles.sectionTitle}>
          WELCOME
        </p>

        <nav style={styles.nav}>

          <SidebarLink
            to="/"
            label="🏠 Dashboard"
            theme={theme}
          />

          <SidebarLink
            to="/customers"
            label="👥 Customers"
            theme={theme}
          />

          <SidebarLink
            to="/orders"
            label="📦 Orders"
            theme={theme}
          />

          <SidebarLink
            to="/sales"
            label="💰 Sales"
            theme={theme}
          />

          <SidebarLink
            to="/transactions"
            label="💳 Transactions"
            theme={theme}
          />

          <SidebarLink
            to="/reports"
            label="📊 Reports"
            theme={theme}
          />

          <SidebarLink
            to="/notifications"
            label="📩 SMS"
            theme={theme}
          />

        </nav>

        {/* DIVIDER */}
        <div style={styles.divider(theme)} />

        {/* ======================================
            ADMIN SECTION
        ====================================== */}
        <p style={styles.sectionTitle}>
          🛡️ ADMIN PANEL
        </p>

        <nav style={styles.nav}>

          <SidebarLink
            to="/admin"
            label="⚙️ Approval Dashboard"
            theme={theme}
          />

          <SidebarLink
            to="/admin/pending-orders"
            label="📦 Pending Orders"
            theme={theme}
          />

          <SidebarLink
            to="/admin/pending-payments"
            label="💳 Pending Payments"
            theme={theme}
          />

        </nav>

        {/* THEME BUTTON */}
        <button
          onClick={toggleTheme}
          style={styles.themeBtn(theme)}
        >
          {darkMode
            ? "☀ Light Mode"
            : "🌙 Dark Mode"}
        </button>

      </aside>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}
      <div style={styles.mainContent}>

        {/* TOPBAR */}
        <header style={styles.topbar(theme)}>

          <div style={styles.topbarLeft}>

            <button
              onClick={() => setOpen(true)}
              style={styles.menuBtn(theme)}
            >
              ☰
            </button>

            <h1 style={styles.title}>
              WELCOME TO GML 62 IT SOLUTIONS
            </h1>

          </div>

          <div style={styles.adminText(theme)}>
            Admin Panel
          </div>

        </header>

        {/* PAGE CONTENT */}
        <main style={styles.content}>
          <Outlet />
        </main>

      </div>

    </div>
  );
}

// ==========================================
// SIDEBAR LINK COMPONENT
// ==========================================
function SidebarLink({
  to,
  label,
  theme,
}) {
  const location = useLocation();

  const active =
    location.pathname === to;

  return (
    <Link
      to={to}
      style={{
        ...styles.link(theme),
        background: active
          ? theme.primary || "#2563eb"
          : theme.card,

        color: active
          ? "#fff"
          : theme.color,

        border: active
          ? "none"
          : `1px solid ${theme.border}`,
      }}
    >
      {label}
    </Link>
  );
}

// ==========================================
// STYLES
// ==========================================
const styles = {
  wrapper: (t) => ({
    display: "flex",
    minHeight: "100vh",
    background: t.background,
    color: t.color,
    overflow: "hidden",
  }),

  // ======================================
  // OVERLAY
  // ======================================
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 90,
  },

  // ======================================
  // SIDEBAR
  // ======================================
  sidebar: (t) => ({
    width: "260px",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    background: t.card,
    borderRight: `1px solid ${t.border}`,
    padding: "20px",
    zIndex: 100,
    overflowY: "auto",
    transition: "0.3s ease",
    display: "flex",
    flexDirection: "column",
  }),

  logoSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  closeBtn: (t) => ({
    border: "none",
    background: "transparent",
    color: t.color,
    fontSize: "20px",
    cursor: "pointer",
  }),

  // ======================================
  // NAV
  // ======================================
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  sectionTitle: {
    fontSize: "12px",
    opacity: 0.7,
    marginBottom: "10px",
    marginTop: "10px",
    letterSpacing: "1px",
    fontWeight: "bold",
  },

  divider: (t) => ({
    height: "1px",
    background: t.border,
    margin: "20px 0",
  }),

  link: (t) => ({
    textDecoration: "none",
    padding: "12px",
    borderRadius: "10px",
    transition: "0.2s",
    fontSize: "14px",
    fontWeight: "500",
  }),

  // ======================================
  // THEME BUTTON
  // ======================================
  themeBtn: (t) => ({
    marginTop: "auto",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    background: t.primary || "#2563eb",
    color: "#fff",
    fontWeight: "bold",
    marginBottom: "20px",
  }),

  // ======================================
  // MAIN CONTENT
  // ======================================
  mainContent: {
    flex: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },

  // ======================================
  // TOPBAR
  /// ======================================
// TOPBAR (MODERN PURPLE + GOLD)
// ======================================
topbar: (t) => ({
  height: "65px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 20px",

  // ✨ MODERN PURPLE + GOLD GRADIENT HEADER
  background: "linear-gradient(90deg, #1a103a, #3b1d6b, #6d28d9, #fbbf24)",

  borderBottom: "1px solid rgba(255, 215, 0, 0.25)",
  position: "sticky",
  top: 0,
  zIndex: 50,

  // ✨ GLASS EFFECT
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
}),

topbarLeft: {
  display: "flex",
  alignItems: "center",
  gap: "15px",
},

menuBtn: (t) => ({
  border: "none",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  fontSize: "22px",
  cursor: "pointer",
  padding: "6px 10px",
  borderRadius: "8px",
  transition: "0.2s",
}),

menuBtnHover: {
  background: "rgba(255,215,0,0.2)",
},

title: {
  margin: 0,
  fontSize: "18px",

  // ✨ GOLD GRADIENT TEXT
  background: "linear-gradient(90deg, #fbbf24, #ffffff, #a855f7)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: "bold",
  letterSpacing: "0.5px",
},

adminText: (t) => ({
  fontSize: "13px",
  color: "#fbbf24",
  fontWeight: "600",
  padding: "6px 12px",
  borderRadius: "20px",
  background: "rgba(255, 215, 0, 0.08)",
  border: "1px solid rgba(255, 215, 0, 0.2)",
}),
  // ======================================
  // CONTENT
  // ======================================
  content: {
    padding: "20px",
    width: "100%",
    overflowX: "auto",
  },
};