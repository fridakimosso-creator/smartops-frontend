import { useEffect, useState } from "react";

export default function PendingPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const res = await fetch(
      "https://smartops-backend-1.onrender.com/api/orders/pending-payments"
    );
    const data = await res.json();
    setPayments(data);
  };

  // ==========================
  // APPROVE PAYMENT
  // ==========================
  const approve = async (id) => {
    await fetch(
      `https://smartops-backend-1.onrender.com/api/orders/approve-payment/${id}`,
      { method: "PUT" }
    );

    fetchPayments();
  };

  // ==========================
  // REJECT PAYMENT
  // ==========================
  const reject = async (id) => {
    await fetch(
      `https://smartops-backend-1.onrender.com/api/orders/reject-payment/${id}`,
      { method: "PUT" }
    );

    fetchPayments();
  };

  return (
    <div style={styles.container}>
      <h2>💳 Pending Payments</h2>

      {payments.map((p) => (
        <div key={p.id} style={styles.card}>
          <p><b>Order ID:</b> {p.order_id}</p>
          <p><b>Amount:</b> {p.amount}</p>
          <p><b>Method:</b> {p.method}</p>
          <p><b>Reference:</b> {p.reference}</p>

          <div style={styles.actions}>
            <button onClick={() => approve(p.id)} style={styles.approve}>
              ✅ Approve
            </button>

            <button onClick={() => reject(p.id)} style={styles.reject}>
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