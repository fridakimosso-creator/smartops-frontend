import { useTheme } from "../../context/ThemeContext";

export default function Table({ columns, data }) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: "10px",
        overflowX: "auto",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: theme.background }}>
            {columns.map((col, i) => (
              <th key={i} style={{ padding: "12px", color: theme.color }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, ri) => (
            <tr key={ri}>
              {columns.map((col, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: "12px",
                    color: theme.color,
                    borderBottom: `1px solid ${theme.border}`,
                  }}
                >
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}