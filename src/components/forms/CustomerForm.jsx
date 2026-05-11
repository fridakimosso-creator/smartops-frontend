import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function CustomerForm({ onSubmit }) {
  const { theme } = useTheme();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    type: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        name="name"
        placeholder="Customer Name"
        value={form.name}
        onChange={handleChange}
        style={styles.input(theme)}
        required
      />

      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        style={styles.input(theme)}
        required
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        style={styles.input(theme)}
        required
      >
        <option value="">Select Type</option>
        <option value="Retail">Retail</option>
        <option value="Wholesale">Wholesale</option>
      </select>

      <button type="submit" style={styles.btn}>
        Save Customer
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