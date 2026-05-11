import { useEffect, useState } from "react";

export default function Users() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/admin/users", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // CREATE USER
  // =========================
  const createUser = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("User created successfully");

    // reset form
    setName("");
    setEmail("");
    setPassword("");
    setRole("staff");

    fetchUsers();
  };

  // =========================
  // DELETE USER
  // =========================
  const deleteUser = async (id) => {
    await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token
      }
    });

    fetchUsers();
  };

  // =========================
  // CHANGE ROLE
  // =========================
  const changeRole = async (id, newRole) => {
    await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ role: newRole })
    });

    fetchUsers();
  };

  return (
    <div style={{ padding: 20 }}>

      <h2>👤 User Management (Admin Panel)</h2>

      {/* =========================
          CREATE USER FORM
      ========================= */}
      <form onSubmit={createUser}
        style={{
          marginBottom: 20,
          padding: 15,
          border: "1px solid #ccc"
        }}
      >
        <h3>Create New User</h3>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">admin</option>
          <option value="staff">staff</option>
          <option value="user">user</option>
        </select>

        <br /><br />

        <button type="submit">
          Create User
        </button>
      </form>

      {/* =========================
          USERS TABLE
      ========================= */}
      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>

              <td>
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                >
                  <option value="admin">admin</option>
                  <option value="staff">staff</option>
                  <option value="user">user</option>
                </select>
              </td>

              <td>
                <button onClick={() => deleteUser(u.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}