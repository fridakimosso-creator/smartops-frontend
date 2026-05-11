import { useEffect, useState } from "react";
import Table from "../../components/ui/Table";
import { getCustomers, createCustomer } from "../../api/api";
 
export default function Customers() {
  const [search, setSearch] = useState("");

  // 📦 BACKEND DATA
  const [customers, setCustomers] = useState([]);

  // 🧾 FORM STATE
  const [form, setForm] = useState({
    name: "",
    phone: "",
    type: "Regular",
    gender: "Male",
    place: "",
    email: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================
  // 🔥 LOAD CUSTOMERS
  // ==========================
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  // ==========================
  // 🔥 HANDLE INPUT
  // ==========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // 🔥 CLEAR MESSAGES WHEN USER TYPES
    setError("");
    setSuccess("");
  };

  // ==========================
  // ➕ CREATE CUSTOMER
  // ==========================
  const addCustomer = async (e) => {
    e.preventDefault();

    // ❌ FRONTEND DUPLICATE CHECK
    const exists = customers.find((c) => c.phone === form.phone);

    if (exists) {
      setError(
        `❌ Phone already used by ${exists.name} (ID: ${exists.id})`
      );
      setSuccess("");
      return;
    }

    try {
      const res = await createCustomer(form);

      // ❌ BACKEND VALIDATION
      if (res.message && res.message.includes("Phone already")) {
        setError("❌ " + res.message);
        setSuccess("");
        return;
      }

      // ✅ SUCCESS
      setSuccess(res.message || "✅ Customer created successfully!");
      setError("");

      // 🔄 REFRESH DATA
      fetchCustomers();

      // 🔄 RESET FORM
      setForm({
        name: "",
        phone: "",
        type: "Regular",
        gender: "Male",
        place: "",
        email: "",
      });

    } catch (err) {
      console.log(err);
      setError("❌ Failed to create customer");
    }
  };

  // ==========================
  // 🔍 SEARCH FILTER
  // ==========================
  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  // ==========================
  // 🎨 BADGE COLORS
  // ==========================
  const getBadge = (type) => {
    switch (type) {
      case "VIP":
        return "#f59e0b";
      case "Corporate":
        return "#4f46e5";
      default:
        return "#16a34a";
    }
  };

  // ==========================
  // 📊 TABLE COLUMNS
  // ==========================
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Phone", accessor: "phone" },
    { header: "Gender", accessor: "gender" },
    { header: "Place", accessor: "place" },
    { header: "Email", accessor: "email" },
    {
      header: "Type",
      render: (row) => (
        <span
          style={{
            background: getBadge(row.type),
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "12px",
          }}
        >
          {row.type}
        </span>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

      {/* HEADER */}
      <div>
        <h2 style={{ margin: 0 }}>Customers</h2>
        <p style={{ color: "#666" }}>
          ERP Customers Module (Orders & Sales Connected)
        </p>
      </div>

      {/* ALERTS */}
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {/* FORM */}
      <form onSubmit={addCustomer} style={styles.form}>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          style={styles.input}
        >
          <option>Male</option>
          <option>Female</option>
        </select>

        <input
          name="place"
          placeholder="Place"
          value={form.place}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          name="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.btn}>
          + Add Customer
        </button>

      </form>

      {/* SEARCH */}
      <input
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {/* TABLE */}
      <Table columns={columns} data={filtered} />

    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
  },

  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
  },

  btn: {
    padding: "10px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  search: {
    padding: "10px",
    maxWidth: "300px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },

  error: {
    padding: "10px",
    background: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "6px",
  },

  success: {
    padding: "10px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "6px",
  },
};