export default function TableWrapper({ children }) {
    return (
      <div
        style={{
          overflowX: "auto",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        }}
      >
        {children}
      </div>
    );
  }