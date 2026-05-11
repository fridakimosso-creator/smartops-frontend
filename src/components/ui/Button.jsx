export default function Button({ children, type = "primary", onClick }) {
    const styles = {
      primary: {
        background: "#4f46e5",
        color: "#fff",
      },
      warning: {
        background: "#f59e0b",
        color: "#fff",
      },
      danger: {
        background: "#ef4444",
        color: "#fff",
      },
      success: {
        background: "#16a34a",
        color: "#fff",
      },
    };
  
    return (
      <button
        onClick={onClick}
        style={{
          padding: "10px 14px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginRight: "5px",
          ...styles[type],
        }}
      >
        {children}
      </button>
    );
  }