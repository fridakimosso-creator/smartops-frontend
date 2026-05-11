import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  // Save theme
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  // THEME OBJECT (IMPORTANT)
  const theme = darkMode
    ? {
        background: "#0f172a",
        card: "#111827",
        color: "#f9fafb",
        muted: "#94a3b8",
        border: "#1f2937",
      }
    : {
        background: "#f4f6f9",
        card: "#ffffff",
        color: "#111827",
        muted: "#6b7280",
        border: "#e5e7eb",
      };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, theme }}>
      <div style={{ background: theme.background, color: theme.color, minHeight: "100vh" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// HOOK
export const useTheme = () => useContext(ThemeContext);