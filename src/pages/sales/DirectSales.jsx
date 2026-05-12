import { useEffect, useState } from "react";

export default function Sales() {
  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState(null);

  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);

  // ✅ NEW: payment method
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [message, setMessage] = useState("");

  // ==========================
  // LOAD CUSTOMERS
  // ==========================
  useEffect(() => {
    fetch("https://smartops-backend-1.onrender.com/api/customers")
      .then((res) => res.json())
      .then(setCustomers)
      .catch((err) => console.log(err));
  }, []);

  // ==========================
  // SEARCH CUSTOMER
  // ==========================
  const handleSearch = (value) => {
    setSearch(value);

    const found = customers.find(
      (c) =>
        c.phone.includes(value) ||
        c.name.toLowerCase().includes(value.toLowerCase())
    );

    setCustomer(found || null);
  };

  // ==========================
  // SEND SALE → PENDING APPROVAL
  // ==========================
  const addSale = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!customer) {
      setMessage("❌ Please select a valid customer");
      return;
    }

    if (!product || !price || !quantity) {
      setMessage("❌ Fill all fields");
      return;
    }

    const qty = Number(quantity);
    const unitPrice = Number(price);

    if (isNaN(qty) || isNaN(unitPrice) || qty <= 0 || unitPrice <= 0) {
      setMessage("❌ Invalid quantity or price");
      return;
    }

    try {
      const res = await fetch("https://smartops-backend-1.onrender.com/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customer.id,
          customer_phone: customer.phone,
          product,
          quantity: qty,
          unit_price: unitPrice,
          payment_method: paymentMethod, // ✅ FIX ADDED
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Sale sent for admin approval");

        // reset form
        setProduct("");
        setPrice("");
        setQuantity(1);
        setPaymentMethod("cash");
        setSearch("");
        setCustomer(null);
      } else {
        setMessage(data.message || "❌ Failed to create sale");
      }
    } catch (err) {
      console.log(err);
      setMessage("❌ Server error");
    }
  };

  // ==========================
  // UI
  // ==========================
  return (
    <div style={styles.container}>
      <h2>💰 Direct Sales (POS)</h2>

      {message && <div style={styles.msg}>{message}</div>}

      {/* SEARCH CUSTOMER */}
      <input
        placeholder="Search customer (name or phone)"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={styles.input}
      />

      {/* SELECTED CUSTOMER */}
      {customer && (
        <div style={styles.ok}>
          ✔ {customer.name} ({customer.phone})
        </div>
      )}

      {/* FORM */}
      <form onSubmit={addSale} style={styles.form}>
        <input
          placeholder="Product"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Unit Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={styles.input}
        />

        {/* ✅ PAYMENT METHOD FIX */}
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={styles.input}
        >
          <option value="cash">Cash</option>
          <option value="bank">Bank</option>
          <option value="mobile">Mobile Money</option>
          <option value="card">Card</option>
        </select>

        <button style={styles.btn}>
          Send for Approval
        </button>
      </form>
    </div>
  );
}

/* ================= STYLE ================= */

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    maxWidth: 500,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  input: {
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 6,
  },

  btn: {
    padding: 10,
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  ok: {
    padding: 10,
    background: "#dcfce7",
    color: "#166534",
    borderRadius: 6,
  },

  msg: {
    padding: 10,
    background: "#fef3c7",
    color: "#92400e",
    borderRadius: 6,
  },
};