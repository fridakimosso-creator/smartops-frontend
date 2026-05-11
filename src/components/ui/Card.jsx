import { useTheme } from "../../context/ThemeContext";

export default function Card({ title, value, color }) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        background: theme.card,
        color: theme.color,
        border: `1px solid ${theme.border}`,
        borderLeft: `5px solid ${color}`,
        padding: "15px",
        borderRadius: "10px",
      }}
    >
      <h4 style={{ color: theme.muted }}>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}