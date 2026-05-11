import { useTheme } from "../../context/ThemeContext";

export default function Modal({ isOpen, onClose, title, children }) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal(theme)}>
        
        {/* HEADER */}
        <div style={styles.header(theme)}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={styles.closeBtn}>✖</button>
        </div>

        {/* BODY */}
        <div style={styles.body}>
          {children}
        </div>

      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },

  modal: (t) => ({
    width: "400px",
    maxWidth: "90%",
    background: t.card,
    color: t.color,
    borderRadius: "10px",
    border: `1px solid ${t.border}`,
    padding: "15px",
  }),

  header: (t) => ({
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    borderBottom: `1px solid ${t.border}`,
    paddingBottom: "10px",
  }),

  body: {
    marginTop: "10px",
  },

  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
};