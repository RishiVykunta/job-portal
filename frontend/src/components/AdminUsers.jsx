import React, { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import { getAllUsers, deleteUser } from "../services/adminService";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <GlassCard style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "25px" }}>All Users</h2>

      <table style={{ width: "100%", borderSpacing: "0 16px" }}>
        <thead>
          <tr style={{ textAlign: "left", opacity: 0.8 }}>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{new Date(u.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    deleteUser(u.id);
                    loadUsers();
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );
}

export default AdminUsers;
