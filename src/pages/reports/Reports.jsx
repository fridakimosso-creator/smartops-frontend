import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Reports() {
  const [filter, setFilter] = useState("monthly");

  // SAMPLE DATA (later comes from backend)
  const data = [
    { name: "Mon", income: 400, expense: 200 },
    { name: "Tue", income: 300, expense: 150 },
    { name: "Wed", income: 500, expense: 300 },
    { name: "Thu", income: 700, expense: 200 },
    { name: "Fri", income: 600, expense: 400 },
  ];

  const ordersData = [
    { name: "Completed", value: 60 },
    { name: "Pending", value: 25 },
    { name: "Processing", value: 15 },
  ];

  const COLORS = ["#16a34a", "#f59e0b", "#ef4444"];

  const totalIncome = data.reduce((a, b) => a + b.income, 0);
  const totalExpense = data.reduce((a, b) => a + b.expense, 0);
  const profit = totalIncome - totalExpense;

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>Reports Dashboard</h2>
          <p style={{ color: "#666", margin: 0 }}>
            Business analytics overview
          </p>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.select}
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* CARDS */}
      <div style={styles.grid}>
        <div style={{ ...styles.card, borderLeft: "5px solid #16a34a" }}>
          <h4>Total Income</h4>
          <h2>Tsh{totalIncome}</h2>
        </div>

        <div style={{ ...styles.card, borderLeft: "5px solid #ef4444" }}>
          <h4>Total Expense</h4>
          <h2>Tsh{totalExpense}</h2>
        </div>

        <div style={{ ...styles.card, borderLeft: "5px solid #4f46e5" }}>
          <h4>Profit</h4>
          <h2>Tsh{profit}</h2>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div style={styles.chartGrid}>

        {/* LINE CHART */}
        <div style={styles.chartCard}>
          <h4>Revenue Trend</h4>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="income" stroke="#16a34a" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div style={styles.chartCard}>
          <h4>Income vs Expense</h4>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#16a34a" />
              <Bar dataKey="expense" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div style={styles.chartCard}>
          <h4>Order Status</h4>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ordersData}
                dataKey="value"
                outerRadius={90}
                label
              >
                {ordersData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
  },

  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "15px",
  },

  chartCard: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
};