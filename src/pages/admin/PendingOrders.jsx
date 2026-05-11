import { useEffect, useState } from "react";

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================
  // LOAD PENDING ORDERS
  // ==========================
  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/orders/pending-orders"
      );
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // APPROVE ORDER
  // ==========================
  const approve = async (id) => {
    setLoading(true);

    try {
      await fetch(
        `http://localhost:5000/api/orders/approve-order/${id}`,
        { method: "PUT" }
      );

      fetchPending();
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  // ==========================
  // REJECT ORDER
  // ==========================
  const reject = async (id) => {
    setLoading(true);

    try {
      await fetch(
        `http://localhost:5000/api/orders/reject-order/${id}`,
        { method: "PUT" }
      );

      fetchPending();
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>📦 Pending Orders</h2>

      {orders.map((o) => (
        <div key={o.id} style={styles.card}>
          <p><b>Customer:</b> {o.customer_name}</p>
          <p><b>Item:</b> {o.item}</p>
          <p><b>Qty:</b> {o.quantity}</p>
          <p><b>Total:</b> {o.total_price}</p>

          <div style={styles.actions}>
            <button onClick={() => approve(o.id)} style={styles.approve}>
              ✅ Approve
            </button>

            <button onClick={() => reject(o.id)} style={styles.reject}>
              ❌ Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { padding: 20 },
  card: {
    border: "1px solid #ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  actions: { display: "flex", gap: 10 },
  approve: { background: "green", color: "#fff", padding: 8 },
  reject: { background: "red", color: "#fff", padding: 8 },
};