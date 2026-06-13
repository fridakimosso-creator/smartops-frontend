import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";

export default function Orders() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [payForm, setPayForm] = useState({});
  const [confirmPayment, setConfirmPayment] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ORDERS
  // ==========================================
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://smartops-backend-1.onrender.com/api/orders"
      );

      const data = await res.json();

      if (!Array.isArray(data)) {
        setOrders([]);
        return;
      }

      // remove delivered
      const activeOrders = data.filter(
        (o) => o.status !== "Delivered"
      );

      setOrders(activeOrders);

    } catch (err) {
      console.log(err);
      setError("❌ Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PAYMENT VALIDATION
  // ==========================================
  const openPaymentConfirm = (order) => {
    const payment = payForm[order.id];

    const balance =
      Number(order.total_price || 0) -
      Number(order.paid_amount || 0);

    const amount = Number(payment?.amount);

    if (!payment || payment.amount === "") {
      setError("❌ Enter payment amount");
      return;
    }

    if (isNaN(amount)) {
      setError("❌ Invalid payment amount");
      return;
    }

    if (amount <= 0) {
      setError("❌ Amount must be greater than 0");
      return;
    }

    if (amount > balance) {
      setError(
        "❌ Amount exceeds remaining balance"
      );
      return;
    }

    setError("");
    setSuccess("");
    setConfirmPayment(order);
  };

  // ==========================================
  // CONFIRM PAYMENT
  // ==========================================
  const confirmPaymentSubmit = async () => {
    try {
      if (!confirmPayment) return;

      const order = confirmPayment;
      const payment = payForm[order.id];

      if (!payment?.amount) {
        setError("❌ Enter payment amount");
        return;
      }

      const res = await fetch(
        "https://smartops-backend-1.onrender.com/api/orders/payment",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            order_id: order.id,
            amount: Number(payment.amount),
            method:
              payment.method || "cash",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.message ||
            "❌ Payment failed"
        );
        return;
      }

      setSuccess(
        data.message ||
          "✅ Payment sent for approval"
      );

      // reset payment input
      setPayForm((prev) => ({
        ...prev,
        [order.id]: {
          amount: "",
          method: "cash",
        },
      }));

      setConfirmPayment(null);

      fetchOrders();

    } catch (err) {
      console.log(err);
      setError("❌ Payment failed");
    }
  };

  // ==========================================
  // DELIVER ORDER
  // ==========================================
  const handleDeliver = async (order) => {
    const balance =
      Number(order.total_price || 0) -
      Number(order.paid_amount || 0);

    if (balance > 0) {
      setError(
        "❌ Cannot deliver unpaid order"
      );
      return;
    }

    const confirmDeliver =
      window.confirm(
        "Mark order as DELIVERED?"
      );

    if (!confirmDeliver) return;

    try {
      const res = await fetch(
        `https://smartops-backend-1.onrender.com/api/orders/${order.id}/delivered`,
        {
          method: "PUT",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setSuccess(
        data.message ||
          "✅ Order delivered"
      );

      // remove delivered order from UI
      setOrders((prev) =>
        prev.filter(
          (o) => o.id !== order.id
        )
      );

    } catch (err) {
      console.log(err);
      setError("❌ Delivery failed");
    }
  };

  // ==========================================
  // FILTER
  // ==========================================
  const filtered = orders.filter(
    (o) =>
      o.customer_name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      o.phone?.includes(search) ||
      o.item
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  // ==========================================
  // TABLE COLUMNS
  // ==========================================
  const columns = [
    {
      header: "Customer",
      accessor: "customer_name",
    },

    {
      header: "Phone",
      accessor: "phone",
    },

    {
      header: "Item",
      accessor: "item",
    },

    {
      header: "Qty",
      accessor: "quantity",
    },

    {
      header: "Total",
      render: (row) => (
        <span style={styles.money}>
          Tsh{" "}
          {Number(
            row.total_price || 0
          ).toLocaleString()}
        </span>
      ),
    },

    {
      header: "Paid",
      render: (row) => (
        <span style={styles.paid}>
          Tsh{" "}
          {Number(
            row.paid_amount || 0
          ).toLocaleString()}
        </span>
      ),
    },

    {
      header: "Balance",
      render: (row) => {
        const balance =
          Number(
            row.total_price || 0
          ) -
          Number(
            row.paid_amount || 0
          );

        return (
          <span
            style={{
              ...styles.balance,
              color:
                balance > 0
                  ? "#dc2626"
                  : "#16a34a",
            }}
          >
            Tsh{" "}
            {balance.toLocaleString()}
          </span>
        );
      },
    },

    {
      header: "Status",
      render: (row) => (
        <span
          style={{
            ...styles.status,
            background:
              row.status ===
              "Completed"
                ? "#16a34a"
                : "#f59e0b",
          }}
        >
          {row.status}
        </span>
      ),
    },

    {
      header: "Payment",
      render: (row) => {
        const balance =
          Number(
            row.total_price || 0
          ) -
          Number(
            row.paid_amount || 0
          );

        return (
          <div
            style={styles.paymentBox}
          >
            <input
              type="number"
              placeholder="Amount"
              value={
                payForm[row.id]
                  ?.amount || ""
              }
              onChange={(e) =>
                setPayForm((prev) => ({
                  ...prev,
                  [row.id]: {
                    ...prev[row.id],
                    amount:
                      e.target.value,
                  },
                }))
              }
              style={styles.input}
            />

            <button
              disabled={
                balance <= 0
              }
              onClick={() =>
                openPaymentConfirm(
                  row
                )
              }
              style={{
                ...styles.payBtn,
                background:
                  balance <= 0
                    ? "#cbd5e1"
                    : "#16a34a",
              }}
            >
              💳 Send Approval
            </button>
          </div>
        );
      },
    },

    {
      header: "Delivery",
      render: (row) => {
        const balance =
          Number(
            row.total_price || 0
          ) -
          Number(
            row.paid_amount || 0
          );

        const canDeliver =
          balance === 0 &&
          row.status !==
            "Delivered";

        return (
          <button
            disabled={!canDeliver}
            onClick={() =>
              handleDeliver(row)
            }
            style={{
              ...styles.deliverBtn,
              background:
                canDeliver
                  ? "#2563eb"
                  : "#cbd5e1",
            }}
          >
            🚚 Deliver
          </button>
        );
      },
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>
          <h2 style={styles.title}>
            📦 Orders Dashboard
          </h2>

          <p style={styles.subtitle}>
            Manage customer orders
          </p>
        </div>

        <button
  onClick={() =>
    navigate("/orders/create")
  }
  style={styles.createBtn}
>
  + Create Order
</button>
      </div>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        style={styles.search}
      />

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {success && (
        <div style={styles.success}>
          {success}
        </div>
      )}

      <div style={styles.card}>
        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <Table
            columns={columns}
            data={filtered}
          />
        )}
      </div>

      {/* PAYMENT MODAL */}
      {confirmPayment && (
        <div
          style={styles.modalOverlay}
        >
          <div style={styles.modal}>
            <h3>
              Confirm Payment
            </h3>

            <p>
              Customer:{" "}
              {
                confirmPayment.customer_name
              }
            </p>

            <p>
              Item:{" "}
              {
                confirmPayment.item
              }
            </p>

            <p>
              Amount: Tsh{" "}
              {
                payForm[
                  confirmPayment.id
                ]?.amount
              }
            </p>

            <div
              style={
                styles.modalButtons
              }
            >
              <button
                onClick={
                  confirmPaymentSubmit
                }
                style={
                  styles.confirmBtn
                }
              >
                Confirm
              </button>

              <button
                onClick={() =>
                  setConfirmPayment(
                    null
                  )
                }
                style={
                  styles.cancelBtn
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    background: "#f8fafc",
    minHeight: "100vh",
  },

  topBar: {
    display: "flex",
    justifyContent:
      "space-between",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    margin: 0,
  },

  subtitle: {
    color: "#64748b",
  },

  createBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: 10,
    cursor: "pointer",
  },

  search: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    border: "1px solid #ddd",
  },

  card: {
    background: "#fff",
    padding: 15,
    borderRadius: 12,
  },

  money: {
    fontWeight: "bold",
  },

  paid: {
    color: "#16a34a",
    fontWeight: "bold",
  },

  balance: {
    fontWeight: "bold",
  },

  status: {
    color: "#fff",
    padding: "5px 10px",
    borderRadius: 20,
    fontSize: 12,
  },

  paymentBox: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minWidth: 140,
  },

  input: {
    padding: 8,
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  payBtn: {
    color: "#fff",
    border: "none",
    padding: 10,
    borderRadius: 8,
    cursor: "pointer",
  },

  deliverBtn: {
    color: "#fff",
    border: "none",
    padding: 10,
    borderRadius: 8,
    cursor: "pointer",
  },

  success: {
    background: "#dcfce7",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },

  error: {
    background: "#fee2e2",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    width: 400,
  },

  modalButtons: {
    display: "flex",
    gap: 10,
    marginTop: 20,
  },

  confirmBtn: {
    flex: 1,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: 12,
    borderRadius: 8,
  },

  cancelBtn: {
    flex: 1,
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: 12,
    borderRadius: 8,
  },
};