import { useState } from "react";

export default function SMS() {
  const [form, setForm] = useState({
    customer: "",
    phone: "",
    message: "",
  });

  const [smsList, setSmsList] = useState([
    {
      id: 1,
      customer: "",
      phone: "",
      message: "",
      status: "",
    },
  ]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendSMS = (e) => {
    e.preventDefault();

    const newSMS = {
      id: Date.now(),
      ...form,
      status: "Sent",
    };

    // frontend only (later backend will handle real SMS)
    setSmsList([newSMS, ...smsList]);

    alert("SMS Sent Successfully ✔");

    setForm({
      customer: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div>
        <h2 style={{ margin: 0 }}>SMS Notifications</h2>
        <p style={{ color: "#666" }}>
          Send alerts to customers instantly
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={sendSMS} style={styles.form}>

        <input
          name="customer"
          placeholder="Customer Name"
          value={form.customer}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <textarea
          name="message"
          placeholder="Message..."
          value={form.message}
          onChange={handleChange}
          style={styles.textarea}
          required
        />

        <button type="submit" style={styles.btn}>
          Send SMS
        </button>

      </form>

      {/* HISTORY TABLE */}
      <div>
        <h3>SMS History</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {smsList.map((sms) => (
              <tr key={sms.id}>
                <td>{sms.customer}</td>
                <td>{sms.phone}</td>
                <td>{sms.message}</td>
                <td>
                  <span style={styles.status}>
                    {sms.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "400px",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },

  textarea: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    minHeight: "100px",
  },

  btn: {
    padding: "10px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  status: {
    padding: "4px 8px",
    background: "#16a34a",
    color: "#fff",
    borderRadius: "6px",
    fontSize: "12px",
  },
};