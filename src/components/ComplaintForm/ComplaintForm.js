import React, { useState } from "react"
import { Send, AlertCircle } from "lucide-react"
import { feedbackService } from "../../services/feedbackService"
import "./ComplaintForm.css"

const ComplaintForm = ({ userId, userName, studentId, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const categories = [
    "Academic",
    "Infrastructure",
    "Faculty",
    "Administration",
    "Library",
    "Canteen",
    "Hostel",
    "Other",
  ]

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

    if (!formData.title || !formData.category || !formData.description) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)

    try {
      feedbackService.createFeedback({
        ...formData,
        userId,
        userName,
        studentId,
      })

      // Reset form
      setFormData({
        title: "",
        category: "",
        description: "",
      })

      onSubmit()
    } catch (err) {
      setError(err.message || "Failed to submit feedback")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="feedback-form-container">
      <div className="feedback-form-card">
        <div className="form-header">
          <h2>Complaint Submission Form</h2>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Brief title for your complaint"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Provide detailed description of your complaint..."
              rows={6}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={loading}>
              <Send size={18} />
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ComplaintForm
