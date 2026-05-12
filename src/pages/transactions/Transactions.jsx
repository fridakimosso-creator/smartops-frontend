import { useEffect, useState } from "react";

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("month");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [tab, setTab] = useState("sales");

  // ===========================
  // LOAD DATA
  // ===========================
  useEffect(() => {
    fetchTransactions();
  }, [range]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://smartops-backend-1.onrender.com/api/transactions?range=${range}`
      );

      const data = await res.json();

      const formatted = (data || []).map((t) => ({
        id: t.id,
        customer_name: t.customer_name || "System",
        amount: Number(t.amount || 0),
        source: (t.source || "").toUpperCase(),
        description: t.description || "",
        created_at: t.created_at,
      }));

      setTransactions(formatted);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // FILTER (ONLY SALES + ORDERS)
  // ===========================
  const filteredByTab = transactions.filter((t) => {
    const desc = (t.description || "").toLowerCase();

    const isSale = t.source === "SALE";

    const isDeliveredOrder =
      t.source === "ORDER" && desc.includes("delivered");

    if (tab === "sales") return isSale;
    if (tab === "orders") return isDeliveredOrder;

    return true;
  });

  // ===========================
  // SEARCH FILTER
  // ===========================
  const filtered = filteredByTab.filter((t) => {
    const q = search.toLowerCase();

    return (
      (t.customer_name || "").toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q)
    );
  });

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2>💰 Transactions</h2>
          <p style={styles.sub}>
            Sales and Delivered Orders Overview
          </p>
        </div>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        <button
          onClick={() => setTab("sales")}
          style={tab === "sales" ? styles.activeTab : styles.tab}
        >
          📈 Sales
        </button>

        <button
          onClick={() => setTab("orders")}
          style={tab === "orders" ? styles.activeTab : styles.tab}
        >
          🚚 Delivered Orders
        </button>
      </div>

      {/* FILTER */}
      <div style={styles.filters}>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          style={styles.select}
        >
          <option value="day">Today</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>

        <input
          placeholder="Search customer or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
      </div>

      {/* LIST */}
      <div style={styles.table}>
        {loading ? (
          <p style={styles.center}>Loading transactions...</p>
        ) : filtered.length === 0 ? (
          <p style={styles.center}>No data found</p>
        ) : (
          filtered.map((t) => (
            <div key={t.id} style={styles.row}>

              {/* LEFT */}
              <div style={{ flex: 1 }}>
                <b>{t.customer_name}</b>

                <div style={styles.small}>
                  {t.description || "No description"}
                </div>

                <div style={styles.small}>
                  {new Date(t.created_at).toLocaleString()}
                </div>
              </div>

              {/* BADGE */}
              <span
                style={{
                  ...styles.badge,
                  background:
                    t.source === "SALE"
                      ? "#16a34a"
                      : "#0ea5e9",
                }}
              >
                {t.source === "SALE" ? "SALE" : "ORDER"}
              </span>

              {/* AMOUNT */}
              <div style={styles.amount}>
                Tsh {Number(t.amount).toLocaleString()}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: 20,
    background: "#f4f6fb",
    minHeight: "100vh",
    fontFamily: "Arial",
  },

  header: {
    marginBottom: 15,
  },

  sub: {
    color: "#666",
  },

  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
  },

  tab: {
    padding: "10px 15px",
    border: "1px solid #ddd",
    borderRadius: 8,
    background: "#fff",
    cursor: "pointer",
  },

  activeTab: {
    padding: "10px 15px",
    border: "1px solid #4f46e5",
    borderRadius: 8,
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
  },

  filters: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },

  select: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  search: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  table: {
    background: "#fff",
    borderRadius: 12,
    padding: 10,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottom: "1px solid #eee",
  },

  small: {
    fontSize: 12,
    color: "#666",
    marginTop: 3,
  },

  badge: {
    padding: "4px 8px",
    borderRadius: 6,
    color: "#fff",
    fontSize: 12,
  },

  amount: {
    fontWeight: "bold",
    minWidth: 120,
    textAlign: "right",
  },

  center: {
    textAlign: "center",
    color: "#666",
    padding: 20,
  },
};