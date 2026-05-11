import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function OrderForm({ onSubmit }) {
  const { theme } = useTheme();

  const [form, setForm] = useState({
    customer: "",
    product: "",
    amount: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount), // ensure number
    });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        name="customer"
        placeholder="Customer Name"
        value={form.customer}
        onChange={handleChange}
        style={styles.input(theme)}
        required
      />

      <input
        name="product"
        placeholder="Product"
        value={form.product}
        onChange={handleChange}
        style={styles.input(theme)}
        required
      />

      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        style={styles.input(theme)}
        required
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        style={styles.input(theme)}
      >
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="Completed">Completed</option>
      </select>

      <button type="submit" style={styles.btn}>
        Save Order
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
  },

  input: (t) => ({
    padding: "10px",
    borderRadius: "6px",
    border: `1px solid ${t.border}`,
    background: t.background,
    color: t.color,
  }),

  btn: {
    padding: "10px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};