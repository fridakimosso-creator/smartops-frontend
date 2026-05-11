import { useEffect, useState } from "react";

export default function AdminApproval() {

  // =====================================================
  // STATES
  // =====================================================

  const [pendingOrders, setPendingOrders] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [pendingSales, setPendingSales] = useState([]);

  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // FETCH ALL DATA
  // =====================================================

  const fetchAll = async () => {

    try {

      setError("");

      const [
        ordersRes,
        paymentsRes,
        salesRes
      ] = await Promise.all([

        fetch("http://localhost:5000/api/orders/pending-orders"),

        fetch("http://localhost:5000/api/orders/pending-payments"),

        fetch("http://localhost:5000/api/sales/pending")

      ]);

      if (!ordersRes.ok)
        throw new Error("Failed to fetch orders");

      if (!paymentsRes.ok)
        throw new Error("Failed to fetch payments");

      if (!salesRes.ok)
        throw new Error("Failed to fetch sales");

      const ordersData = await ordersRes.json();
      const paymentsData = await paymentsRes.json();
      const salesData = await salesRes.json();

      // SAFE ARRAY HANDLING

      setPendingOrders(
        Array.isArray(ordersData)
          ? ordersData
          : ordersData.data || []
      );

      setPendingPayments(
        Array.isArray(paymentsData)
          ? paymentsData
          : paymentsData.data || []
      );

      setPendingSales(
        Array.isArray(salesData)
          ? salesData
          : salesData.data || []
      );

    } catch (err) {

      console.error(err);
      setError("Failed to load approval data");

    }
  };

  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {

    fetchAll();

    const interval = setInterval(() => {
      fetchAll();
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  // =====================================================
  // APPROVE / REJECT ACTION
  // =====================================================

  const action = async (
    url,
    id,
    successMsg,
    setter
  ) => {

    try {

      setLoadingId(id);

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      // =====================================================
      // REMOVE ITEM IMMEDIATELY
      // =====================================================

      setter(prev =>
        prev.filter(item => {

          const itemId =
            item.id ||
            item.order_id ||
            item.payment_id ||
            item.sale_id;

          return Number(itemId) !== Number(id);
        })
      );

      setMessage(successMsg);

      // =====================================================
      // REFRESH DATA FROM DATABASE
      // =====================================================

      fetchAll();

      // AUTO CLEAR MESSAGE

      setTimeout(() => {
        setMessage("");
      }, 2000);

    } catch (err) {

      console.error(err);
      setError("Error occurred");

    } finally {

      setLoadingId(null);

    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div style={styles.page}>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div style={styles.header}>

        <h2 style={styles.title}>
          ⚡ Admin Approval Dashboard
        </h2>

        <button
          style={styles.refreshBtn}
          onClick={fetchAll}
        >
          🔄 Refresh
        </button>

      </div>

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {message && (
        <div style={styles.success}>
          {message}
        </div>
      )}

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* =====================================================
          GRID
      ===================================================== */}

      <div style={styles.grid}>

        {/* =====================================================
            ORDERS
        ===================================================== */}

        <div style={styles.card}>

          <div style={styles.cardHeader}>

            <h3>📦 Pending Orders</h3>

            <span style={styles.badge}>
              {pendingOrders.length}
            </span>

          </div>

          {Array.isArray(pendingOrders) &&
          pendingOrders.length > 0 ? (

            pendingOrders.map((o) => (

              <div
                key={o.id || o.order_id}
                style={styles.item}
              >

                <div>

                  <b>
                    {o.customer_name || "Unknown Customer"}
                  </b>

                  <p style={styles.small}>
                    {o.item || "No item"}
                  </p>

                  <p style={styles.price}>
                    Qty: {o.quantity || 0}
                  </p>

                </div>

                <div style={styles.actions}>

                  {/* APPROVE */}

                  <button
                    disabled={loadingId === o.id}
                    style={styles.approve}
                    onClick={() =>
                      action(
                        `http://localhost:5000/api/orders/approve-order/${o.id}`,
                        o.id,
                        "✅ Order approved",
                        setPendingOrders
                      )
                    }
                  >
                    {loadingId === o.id
                      ? "..."
                      : "✔"}
                  </button>

                  {/* REJECT */}

                  <button
                    disabled={loadingId === o.id}
                    style={styles.reject}
                    onClick={() =>
                      action(
                        `http://localhost:5000/api/orders/reject-order/${o.id}`,
                        o.id,
                        "❌ Order rejected",
                        setPendingOrders
                      )
                    }
                  >
                    ✖
                  </button>

                </div>

              </div>

            ))

          ) : (

            <p style={styles.empty}>
              No pending orders
            </p>

          )}

        </div>

        {/* =====================================================
            PAYMENTS
        ===================================================== */}

        <div style={styles.card}>

          <div style={styles.cardHeader}>

            <h3>💳 Pending Payments</h3>

            <span style={styles.badge}>
              {pendingPayments.length}
            </span>

          </div>

          {Array.isArray(pendingPayments) &&
          pendingPayments.length > 0 ? (

            pendingPayments.map((p) => (

              <div
                key={p.id || p.payment_id}
                style={styles.item}
              >

                <div>

                  <b>
                    Order #
                    {p.order_id || "N/A"}
                  </b>

                  <p style={styles.price}>
                    {p.amount || 0} TZS
                  </p>

                  <p style={styles.small}>
                    {p.payment_method || "cash"}
                  </p>

                </div>

                <div style={styles.actions}>

                  {/* APPROVE */}

                  <button
                    disabled={loadingId === p.id}
                    style={styles.approve}
                    onClick={() =>
                      action(
                        `http://localhost:5000/api/orders/approve-payment/${p.id}`,
                        p.id,
                        "✅ Payment approved",
                        setPendingPayments
                      )
                    }
                  >
                    {loadingId === p.id
                      ? "..."
                      : "✔"}
                  </button>

                  {/* REJECT */}

                  <button
                    disabled={loadingId === p.id}
                    style={styles.reject}
                    onClick={() =>
                      action(
                        `http://localhost:5000/api/orders/reject-payment/${p.id}`,
                        p.id,
                        "❌ Payment rejected",
                        setPendingPayments
                      )
                    }
                  >
                    ✖
                  </button>

                </div>

              </div>

            ))

          ) : (

            <p style={styles.empty}>
              No pending payments
            </p>

          )}

        </div>

        {/* =====================================================
            SALES
        ===================================================== */}

        <div style={styles.card}>

          <div style={styles.cardHeader}>

            <h3>🧾 Pending Sales</h3>

            <span style={styles.badge}>
              {pendingSales.length}
            </span>

          </div>

          {Array.isArray(pendingSales) &&
          pendingSales.length > 0 ? (

            pendingSales.map((s) => (

              <div
                key={s.id || s.sale_id}
                style={styles.item}
              >

                <div>

                  <b>
                    {s.product || "Unknown Product"}
                  </b>

                  <p style={styles.price}>
                    {s.total_price || 0} TZS
                  </p>

                  <p style={styles.small}>
                    Qty: {s.quantity || 0}
                  </p>

                </div>

                <div style={styles.actions}>

                  {/* APPROVE */}

                  <button
  disabled={loadingId === (s.id || s.sale_id)}
  style={styles.approve}
  onClick={() =>
    action(
      `http://localhost:5000/api/sales/approve/${s.id || s.sale_id}`,
      s.id || s.sale_id,
      "✅ Sale approved",
      setPendingSales
    )
  }
>
  {loadingId === (s.id || s.sale_id) ? "..." : "✔"}
</button>
<button
  disabled={loadingId === (s.id || s.sale_id)}
  style={styles.reject}
  onClick={() =>
    action(
      `http://localhost:5000/api/sales/reject/${s.id || s.sale_id}`,
      s.id || s.sale_id,
      "❌ Sale rejected",
      setPendingSales
    )
  }
>
  ✖
</button>

                </div>

              </div>

            ))

          ) : (

            <p style={styles.empty}>
              No pending sales
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = {

  page: {
    padding: 20,
    background: "#f4f6fb",
    minHeight: "100vh",
    fontFamily: "Arial"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },

  title: {
    margin: 0
  },

  refreshBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold"
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 20
  },

  card: {
    background: "#fff",
    borderRadius: 14,
    padding: 15,
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.06)"
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15
  },

  badge: {
    background: "#111827",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "bold"
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #eee",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },

  actions: {
    display: "flex",
    gap: 8
  },

  approve: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold"
  },

  reject: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold"
  },

  empty: {
    textAlign: "center",
    color: "#666",
    padding: 20
  },

  small: {
    margin: "4px 0",
    color: "#666",
    fontSize: 13
  },

  price: {
    margin: 0,
    color: "#2563eb",
    fontWeight: "bold"
  }

};