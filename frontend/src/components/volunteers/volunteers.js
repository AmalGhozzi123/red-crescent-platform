import React, { useEffect, useState } from "react";
import "./volunteers.css";

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 recherche
  const [filterStatus, setFilterStatus] = useState("all"); // ⚙️ filtre statut

  // Charger les volontaires
  useEffect(() => {
    fetch("http://127.0.0.1:8000/volunteers")
      .then((res) => res.json())
      .then((data) => {
        setVolunteers(data.volunteers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement :", err);
        setLoading(false);
      });
  }, []);

  // Activer / Désactiver un volontaire
  const handleToggleVolunteer = async (id, currentStatus, name) => {
    const endpoint = `http://127.0.0.1:8000/volunteers/${id}/${
      currentStatus ? "activate" : "deactivate"
    }`;

    try {
      const res = await fetch(endpoint, { method: "PUT" });
      if (res.ok) {
        setVolunteers((prev) =>
          prev.map((v) =>
            v.id === id
              ? { ...v, isDeleted: !currentStatus, isAccepted: currentStatus }
              : v
          )
        );

        // ✅ Toast de succès
        setToast({
          type: currentStatus ? "success" : "error",
          message: `Volunteer ${name} has been ${
            currentStatus ? "activated" : "deactivated"
          } successfully.`,
        });

        setConfirmModal(null);
        setTimeout(() => setToast(null), 3000);
      } else {
        setToast({
          type: "error",
          message: "Error updating volunteer status.",
        });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        message: "Server connection error.",
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  // 🔍 Filtrer et rechercher les volontaires
  const filteredVolunteers = volunteers.filter((v) => {
    const nameMatch =
      v.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch =
      filterStatus === "all"
        ? true
        : filterStatus === "active"
        ? !v.isDeleted
        : v.isDeleted;

    return nameMatch && statusMatch;
  });

  if (loading) {
    return <p className="loading-text">Loading volunteers...</p>;
  }

  return (
    <div className="volunteers-container">
      <h1 className="page-title">Volunteer Management</h1>

      {/* 🔍 Barre de recherche + filtre */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by first or last name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Volunteers</option>
          <option value="active">Active Volunteers</option>
          <option value="inactive">Inactive Volunteers</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="volunteer-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Availability</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVolunteers.length > 0 ? (
              filteredVolunteers.map((v) => (
                <tr
                  key={v.id}
                  className="volunteer-row"
                  onClick={() => setSelectedVolunteer(v)}
                >
                  <td>
                    {v.firstName} {v.lastName}
                  </td>
                  <td>{v.email}</td>
                  <td>{v.phone}</td>
                  <td>{v.availability?.join(", ") || "—"}</td>
                  <td>
                    <span className={`status ${v.isDeleted ? "inactive" : "active"}`}>
                      {v.isDeleted ? "Inactive" : "Active"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`toggle-btn ${v.isDeleted ? "activate" : "deactivate"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmModal({
                          id: v.id,
                          action: v.isDeleted ? "activate" : "deactivate",
                          name: `${v.firstName} ${v.lastName}`,
                          currentStatus: v.isDeleted,
                        });
                      }}
                    >
                      {v.isDeleted ? "Activate" : "Deactivate"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No volunteers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal détails volontaire */}
      {selectedVolunteer && (
        <div className="modal-overlay" onClick={() => setSelectedVolunteer(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Volunteer Details</h2>
            <div className="modal-content">
              <p><strong>Full Name:</strong> {selectedVolunteer.firstName} {selectedVolunteer.lastName}</p>
              <p><strong>Email:</strong> {selectedVolunteer.email}</p>
              <p><strong>Phone:</strong> {selectedVolunteer.phone}</p>
              <p><strong>ID (CIN):</strong> {selectedVolunteer.cin}</p>
              <p><strong>Date of Birth:</strong> {selectedVolunteer.dateOfBirth ? new Date(selectedVolunteer.dateOfBirth).toLocaleDateString() : "—"}</p>
              <p><strong>Skills:</strong> {selectedVolunteer.skills?.join(", ") || "—"}</p>
              <p><strong>Availability:</strong> {selectedVolunteer.availability?.join(", ") || "—"}</p>
              {selectedVolunteer.emergencyContact && (
                <div className="emergency-box">
                  <h3>📞Emergency Contact</h3>
                  <p><strong>Name:</strong> {selectedVolunteer.emergencyContact.contactName}</p>
                  <p><strong>Phone:</strong> {selectedVolunteer.emergencyContact.contactPhone}</p>
                  <p><strong>Relation:</strong> {selectedVolunteer.emergencyContact.contactRelation}</p>
                </div>
              )}
<p>
  <strong>Status:</strong>{" "}
  <span
    style={{
      color: selectedVolunteer.isDeleted ? "#D81D2AFF" : "#27C179FF",
      fontWeight: "bold",
    }}
  >
    {selectedVolunteer.isDeleted ? "Inactive" : "Active"}
  </span>
</p>

            </div>
            <button className="close-btn" onClick={() => setSelectedVolunteer(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Modal de confirmation */}
      {confirmModal && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h3>{confirmModal.action === "deactivate" ? "Deactivate Volunteer" : "Activate Volunteer"}</h3>
            <p>
              Are you sure you want to{" "}
              <strong>{confirmModal.action}</strong> the account of{" "}
              <strong>{confirmModal.name}</strong>?
            </p>
            <div className="confirm-actions">
              <button className="cancel-btn" onClick={() => setConfirmModal(null)}>
                Cancel
              </button>
              <button
                className={`confirm-btn ${confirmModal.action}`}
                onClick={() =>
                  handleToggleVolunteer(
                    confirmModal.id,
                    confirmModal.currentStatus,
                    confirmModal.name
                  )
                }
              >
                {confirmModal.action === "deactivate" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}