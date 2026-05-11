import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchCustomers, createOrder } from "../../api/api";

export default function CreateOrder() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    item: "",
    quantity: 1,
    unit_price: "",
    paid_amount: 0,
    payment_method: "cash",
    notes: "",
  });

  // ================= TOTAL =================
  const total =
    Number(form.quantity || 0) *
    Number(form.unit_price || 0);

  // ================= SEARCH =================
  const handleSearch = async (value) => {
    setSearch(value);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    try {
      const data = await searchCustomers(value);
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("SEARCH CUSTOMER ERROR:", err);
      setResults([]);
    }
  };

  // ================= SELECT CUSTOMER =================
  const selectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setSearch(`${customer.name} (${customer.phone})`);
    setResults([]);
  };

  // ================= FORM =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    // Validation
    if (!selectedCustomer) {
      return setError("❌ Please select customer");
    }

    if (!form.item.trim()) {
      return setError("❌ Item is required");
    }

    if (
      Number(form.quantity) <= 0 ||
      Number(form.unit_price) <= 0
    ) {
      return setError(
        "❌ Quantity and price must be greater than 0"
      );
    }

    const paid = Number(form.paid_amount || 0);

    if (paid > total) {
      return setError(
        "❌ Paid amount cannot exceed total amount"
      );
    }

    try {
      setLoading(true);

      const payload = {
        customer_id: selectedCustomer.id,
        item: form.item.trim(),
        quantity: Number(form.quantity),
        unit_price: Number(form.unit_price),
        paid_amount: paid,
        payment_method: form.payment_method,
        notes: form.notes.trim(),
      };

      const res = await createOrder(payload);

      setSuccess(
        res.message ||
          "✅ Order sent for admin approval"
      );

      // Reset form
      setForm({
        item: "",
        quantity: 1,
        unit_price: "",
        paid_amount: 0,
        payment_method: "cash",
        notes: "",
      });

      setSelectedCustomer(null);
      setSearch("");
      setResults([]);

      setTimeout(() => {
        navigate("/admin");
      }, 1200);

    } catch (err) {
      console.log("CREATE ORDER ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "❌ Failed to create order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* HEADER */}
        <div style={styles.headerBox}>
          <h2>📦 Create Order</h2>
          <p>All orders go to Admin Approval Dashboard</p>
        </div>

        {/* ALERTS */}
        {success && (
          <div style={styles.successBox}>
            {success}
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* CUSTOMER */}
          <div style={styles.sectionBox}>
            <h3>👤 Customer Information</h3>

            <input
              type="text"
              placeholder="Search customer (name or phone)"
              value={search}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
              style={styles.input}
            />

            {results.length > 0 && (
              <div style={styles.dropdown}>
                {results.map((customer) => (
                  <div
                    key={customer.id}
                    style={styles.option}
                    onClick={() =>
                      selectCustomer(customer)
                    }
                  >
                    <b>{customer.name}</b>
                    <div>{customer.phone}</div>
                  </div>
                ))}
              </div>
            )}

            {selectedCustomer && (
              <div style={styles.selectedBox}>
                Selected:
                <b>
                  {" "}
                  {selectedCustomer.name}
                </b>{" "}
                ({selectedCustomer.phone})
              </div>
            )}
          </div>

          {/* ORDER DETAILS */}
          <div style={styles.sectionBox}>
            <h3>🧾 Order Details</h3>

            <input
              type="text"
              name="item"
              placeholder="Item / Service"
              value={form.item}
              onChange={handleChange}
              style={styles.input}
            />

            <div style={styles.row}>
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleChange}
                style={styles.input}
                min="1"
              />

              <input
                type="number"
                name="unit_price"
                placeholder="Unit Price"
                value={form.unit_price}
                onChange={handleChange}
                style={styles.input}
                min="0"
              />
            </div>
          </div>

          {/* PAYMENT */}
          <div style={styles.sectionBox}>
            <h3>💰 Payment</h3>

            <input
              type="number"
              name="paid_amount"
              placeholder="Paid Amount"
              value={form.paid_amount}
              onChange={handleChange}
              style={styles.input}
              min="0"
            />

            <select
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="cash">
                Cash
              </option>
              <option value="bank">
                Bank
              </option>
              <option value="mobile">
                Mobile Money
              </option>
              <option value="card">
                Card
              </option>
            </select>

            <div style={styles.totalBox}>
              TOTAL: Tsh{" "}
              {total.toLocaleString()}
            </div>
          </div>

          {/* NOTES */}
          <div style={styles.sectionBox}>
            <h3>📝 Notes</h3>

            <textarea
              name="notes"
              placeholder="Extra notes..."
              value={form.notes}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>

          {/* ACTIONS */}
          <div style={styles.actions}>
            <button
              type="button"
              onClick={() =>
                navigate("/dashboard/orders")
              }
              style={styles.cancelBtn}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={styles.saveBtn}
            >
              {loading
                ? "Sending..."
                : "Send to Admin"}
            </button>
          </div>
        </form>
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
  },

  card: {
    maxWidth: 900,
    margin: "auto",
    background: "#fff",
    padding: 25,
    borderRadius: 16,
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  headerBox: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "1px solid #eee",
  },

  sectionBox: {
    marginBottom: 20,
    padding: 15,
    border: "1px solid #eee",
    borderRadius: 12,
    background: "#fafafa",
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ddd",
    marginBottom: 10,
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ddd",
    minHeight: 100,
    resize: "vertical",
    boxSizing: "border-box",
  },

  row: {
    display: "flex",
    gap: 10,
  },

  dropdown: {
    border: "1px solid #ddd",
    borderRadius: 8,
    overflow: "hidden",
    maxHeight: 180,
    overflowY: "auto",
    background: "#fff",
  },

  option: {
    padding: 12,
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },

  selectedBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    background: "#dcfce7",
  },

  totalBox: {
    background: "#e0f2fe",
    padding: 12,
    borderRadius: 8,
    fontWeight: "bold",
    fontSize: 18,
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },

  saveBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: 8,
    cursor: "pointer",
  },

  cancelBtn: {
    background: "#ddd",
    border: "none",
    padding: "12px 20px",
    borderRadius: 8,
    cursor: "pointer",
  },

  successBox: {
    background: "#dcfce7",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },

  errorBox: {
    background: "#fee2e2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    color: "#991b1b",
  },
};