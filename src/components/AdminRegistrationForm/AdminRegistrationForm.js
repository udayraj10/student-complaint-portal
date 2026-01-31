import React, { useState } from "react"
import { User, Mail, Lock } from "lucide-react"
import { authService } from "../../services/authService"
import "./AdminRegistrationForm.css"

const AdminRegistrationForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminId: "",
    gender: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await authService.registerAdmin(formData)
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-registration-form">
      <h2>Register New Admin</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <User className="input-icon" size={20} />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control form-control-icon-padding"
          />
        </div>
        <div className="form-group">
          <Mail className="input-icon" size={18} />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control form-control-icon-padding"
          />
        </div>
        <div className="form-group">
          <User className="input-icon" size={20} />
          <input
            type="number"
            name="adminId"
            placeholder="Admin ID"
            value={formData.adminId}
            onChange={handleChange}
            required
            className="form-control form-control-icon-padding"
          />
        </div>
        <div className="form-group">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="form-control"
            style={{ paddingLeft: '12px' }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <Lock className="input-icon" size={18} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-control form-control-icon-padding"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Admin"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminRegistrationForm
