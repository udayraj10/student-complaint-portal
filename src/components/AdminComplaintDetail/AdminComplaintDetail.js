import { useState, useEffect } from "react"
import {
    ArrowLeft,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    User,
    Calendar,
    Tag,
    Send,
} from "lucide-react"
import { feedbackService } from "../../services/feedbackService"
import "./AdminComplaintDetail.css"

const AdminComplaintDetail = ({ complaint, onBack, onStatusUpdate }) => {
    const [status, setStatus] = useState(complaint?.status || "pending")
    const [responseInput, setResponseInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Parse existing response into 'history' array for UI if possible, 
    // or just assume string for simplicity. We use string concatenation for storage compatibility.
    // For chat UI, we can try to split by some delimiter or newlines if we want bubbles,
    // but the user just said "like chat". 
    // We will render the raw string preserved for now, or split by double newline.
    const responseHistory = complaint?.adminResponse ? complaint.adminResponse.split('\n\n') : []

    useEffect(() => {
        if (complaint) {
            setStatus(complaint.status || "pending")
        }
    }, [complaint])

    const getStatusInfo = (statusValue) => {
        switch (statusValue) {
            case "pending":
                return {
                    icon: <Clock className="status-icon pending" size={18} />,
                    label: "Pending",
                    className: "status-badge pending",
                }
            case "in-progress":
                return {
                    icon: <AlertCircle className="status-icon in-progress" size={18} />,
                    label: "In Progress",
                    className: "status-badge in-progress",
                }
            case "resolved":
                return {
                    icon: <CheckCircle className="status-icon resolved" size={18} />,
                    label: "Resolved",
                    className: "status-badge resolved",
                }
            case "rejected":
                return {
                    icon: <XCircle className="status-icon rejected" size={18} />,
                    label: "Rejected",
                    className: "status-badge rejected",
                }
            default:
                return {
                    icon: <Clock className="status-icon pending" size={18} />,
                    label: "Pending",
                    className: "status-badge pending",
                }
        }
    }

    const formatDate = (dateString, includeTime = false) => {
        if (!dateString) return "N/A"
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return "Invalid Date"
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                ...(includeTime && { hour: "2-digit", minute: "2-digit" })
            })
        } catch (error) {
            return "Invalid Date"
        }
    }

    const handleStatusChange = async (newStatus) => {
        setLoading(true)
        setError("")

        try {
            // Update status without changing admin response
            const currentResponse = complaint.adminResponse || null
            feedbackService.updateFeedbackStatus(
                complaint.id,
                newStatus,
                currentResponse
            )
            setStatus(newStatus)
            onStatusUpdate()
        } catch (err) {
            setError(err.message || "Failed to update status")
        } finally {
            setLoading(false)
        }
    }

    const handleResponseSubmit = async () => {
        if (!responseInput.trim()) return

        setLoading(true)
        setError("")

        try {
            const timestamp = new Date().toLocaleString()
            const newEntry = `[${timestamp}] Admin: ${responseInput.trim()}`
            const currentResponse = complaint.adminResponse || ""
            const updatedResponse = currentResponse ? `${currentResponse}\n\n${newEntry}` : newEntry

            feedbackService.updateFeedbackStatus(complaint.id, status, updatedResponse)
            setResponseInput("") // Clear input
            onStatusUpdate()
        } catch (err) {
            setError(err.message || "Failed to submit response")
        } finally {
            setLoading(false)
        }
    }

    if (!complaint) {
        return (
            <div className="complaint-detail">
                <div className="error-message">Complaint not found</div>
            </div>
        )
    }

    const statusInfo = getStatusInfo(status)

    return (
        <div className="admin-complaint-detail">
            <div className="detail-header">
                <button className="back-button" onClick={onBack}>
                    <ArrowLeft size={20} />
                    Back to Complaints
                </button>
            </div>

            <div className="detail-container">
                {/* Left Panel - 40% */}
                <div className="detail-left">
                    <div className="detail-card left-card">
                        <div className="complaint-header-info">
                            <h1 className="complaint-title-large">{complaint.title}</h1>

                            <div className="badges-row">
                                <span className="category-badge">
                                    <Tag size={16} />
                                    {complaint.category}
                                </span>
                                <div className={`${statusInfo.className} status-badge`}>
                                    {statusInfo.icon}
                                    {statusInfo.label}
                                </div>
                            </div>

                            <div className="metadata-grid">
                                <div className="meta-item">
                                    <User size={16} className="meta-icon" />
                                    <div>
                                        <span className="meta-label">Student</span>
                                        <span className="meta-value">
                                            {complaint.userName || "Unknown"}
                                            {complaint.studentId && ` (${complaint.studentId})`}
                                        </span>
                                    </div>
                                </div>
                                <div className="meta-item">
                                    <Calendar size={16} className="meta-icon" />
                                    <div>
                                        <span className="meta-label">Submitted</span>
                                        <span className="meta-value">{formatDate(complaint.createdAt, true)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="status-control-section">
                            <h3>Update Status</h3>
                            <div className="status-buttons-grid">
                                <button
                                    className={`status-btn ${status === "pending" ? "active" : ""}`}
                                    onClick={() => handleStatusChange("pending")}
                                    disabled={loading}
                                >
                                    <Clock size={16} /> Pending
                                </button>
                                <button
                                    className={`status-btn ${status === "in-progress" ? "active" : ""}`}
                                    onClick={() => handleStatusChange("in-progress")}
                                    disabled={loading}
                                >
                                    <AlertCircle size={16} /> In Progress
                                </button>
                                <button
                                    className={`status-btn ${status === "resolved" ? "active" : ""}`}
                                    onClick={() => handleStatusChange("resolved")}
                                    disabled={loading}
                                >
                                    <CheckCircle size={16} /> Resolved
                                </button>
                                <button
                                    className={`status-btn ${status === "rejected" ? "active" : ""}`}
                                    onClick={() => handleStatusChange("rejected")}
                                    disabled={loading}
                                >
                                    <XCircle size={16} /> Rejected
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - 60% */}
                <div className="detail-right">
                    <div className="detail-card right-card">
                        <div className="description-section">
                            <h3>Complaint</h3>
                            <div className="description-content">
                                {complaint.description}
                            </div>
                        </div>

                        <div className="chat-section">
                            <h3>Response History</h3>
                            <div className="chat-history">
                                {responseHistory.length === 0 ? (
                                    <p className="no-history">No responses yet.</p>
                                ) : (
                                    responseHistory.map((msg, index) => {
                                        // Strip timestamp [date] from the beginning if present
                                        const cleanMsg = msg.replace(/^\[.*?\]\s*/, "")
                                        return (
                                            <div key={index} className="chat-bubble admin-bubble right">
                                                {cleanMsg}
                                            </div>
                                        )
                                    })
                                )}
                            </div>

                            <div className="chat-input-area">
                                <textarea
                                    value={responseInput}
                                    onChange={(e) => setResponseInput(e.target.value)}
                                    placeholder="Type your response..."
                                    rows={2}
                                    disabled={loading}
                                />
                                <button
                                    className="send-btn"
                                    onClick={handleResponseSubmit}
                                    disabled={loading || !responseInput.trim()}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            {error && <p className="error-text">{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminComplaintDetail
