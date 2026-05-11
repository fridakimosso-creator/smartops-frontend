import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import Card from "../../components/ui/Card";
import { useEffect, useState } from "react";

export default function Dashboard() {

  const [stats, setStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dashboard");
      const data = await res.json();

      setStats([
        {
          title: "Total Customers",
          value: data?.stats?.totalCustomers || 0,
          color: "#4f46e5",
        },
        {
          title: "Orders",
          value: data?.stats?.totalOrders || 0,
          color: "#16a34a",
        },
        {
          title: "Revenue",
          value: `TZS ${(data?.stats?.totalRevenue || 0).toLocaleString()}`, // ✅ FIXED HERE
          color: "#f59e0b",
        },
        {
          title: "Pending Orders",
          value: data?.stats?.pendingOrders || 0,
          color: "#ef4444",
        },
      ]);

      setRevenueData(data?.revenueData || []);
      setOrderData(data?.orderData || []);
      setRecentOrders(data?.recentOrders || []);

    } catch (error) {
      console.log("Dashboard error:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#16a34a";
      case "Completed":
        return "#16a34a";
      case "Processing":
        return "#f59e0b";
      default:
        return "#ef4444";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* HEADER */}
      <div>
        <h2 style={{ margin: 0 }}>Dashboard Analytics</h2>
        <p style={{ color: "#666" }}>Real-time business overview</p>
      </div>

      {/* KPI CARDS */}
      <div style={styles.grid}>
        {stats.map((item, i) => (
          <Card
            key={i}
            title={item.title}
            value={item.value}
            color={item.color}
          />
        ))}
      </div>

      {/* CHARTS */}
      <div style={styles.grid2}>

        {/* REVENUE CHART */}
        <div style={styles.box}>
          <h3>Revenue Overview (TZS)</h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  `TZS ${Number(value).toLocaleString()}`
                }
              />
              <Line type="monotone" dataKey="revenue" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ORDERS CHART */}
        <div style={styles.box}>
          <h3>Weekly Orders</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* RECENT ORDERS */}
      <div style={styles.box}>
        <h3>Recent Orders</h3>

        {recentOrders?.length === 0 ? (
          <p style={{ color: "#888" }}>No recent orders</p>
        ) : (
          recentOrders.map((o) => (
            <div key={o.id} style={styles.row}>

              <div>
                <strong>{o.product}</strong>

                <div style={{ fontSize: "12px", color: "#666" }}>
                  Qty: {o.quantity ?? 0} •{" "}
                  {o.created_at
                    ? new Date(o.created_at).toLocaleString()
                    : "No date"}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "bold" }}>
                  TZS {Number(o.total_price || 0).toLocaleString()}
                </div>

                <span
                  style={{
                    color: "#fff",
                    background: getStatusColor(o.status),
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    display: "inline-block",
                    marginTop: "4px",
                  }}
                >
                  {o.status}
                </span>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

/* STYLES */
const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
  },

  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },

  box: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
};