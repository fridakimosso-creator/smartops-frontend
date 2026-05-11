import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function TransactionForm({ onSubmit }) {
  const { theme } = useTheme();

  const [form, setForm] = useState({
    customer: "",
    amount: "",
    type: "Income",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount),
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
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        style={styles.input(theme)}
        required
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        style={styles.input(theme)}
      >
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>
      </select>

      <button type="submit" style={styles.btn}>
        Save Transaction
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
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};