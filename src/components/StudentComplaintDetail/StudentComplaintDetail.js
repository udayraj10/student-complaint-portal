import React from "react"
import {
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Calendar,
    Tag,
} from "lucide-react"
import "./StudentComplaintDetail.css"

const StudentComplaintDetail = ({ complaint, onBack }) => {
    const getStatusInfo = (statusValue) => {
        switch (statusValue) {
            case "pending":
                return {
                    icon: <Clock className="status-icon pending" size={20} />,
                    label: "Pending",
                    className: "status-badge pending",
                }
            case "in-progress":
                return {
                    icon: <AlertCircle className="status-icon in-progress" size={20} />,
                    label: "In Progress",
                    className: "status-badge in-progress",
                }
            case "resolved":
                return {
                    icon: <CheckCircle className="status-icon resolved" size={20} />,
                    label: "Resolved",
                    className: "status-badge resolved",
                }
            case "rejected":
                return {
                    icon: <XCircle className="status-icon rejected" size={20} />,
                    label: "Rejected",
                    className: "status-badge rejected",
                }
            default:
                return {
                    icon: <Clock className="status-icon pending" size={20} />,
                    label: "Pending",
                    className: "status-badge pending",
                }
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) return "Invalid Date"
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
        } catch (error) {
            return "Invalid Date"
        }
    }

    if (!complaint) {
        return (
            <div className="complaint-detail">
                <div className="error-message">Complaint not found</div>
            </div>
        )
    }

    const statusInfo = getStatusInfo(complaint.status)

    return (
        <div className="student-complaint-detail">
            <div className="detail-content">
                <div className="detail-card">
                    <div className="detail-title-section">
                        <div className="title-row">
                            <h1>{complaint.title}</h1>
                            <button className="close-btn" onClick={onBack}>
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className="detail-badges">
                            <span className="category-badge">
                                <Tag size={16} />
                                {complaint.category}
                            </span>
                            <div className={`${statusInfo.className} status-badge`}>
                                {statusInfo.icon}
                                {statusInfo.label}
                            </div>
                        </div>
                    </div>

                    <div className="detail-info">
                        <div className="info-row">
                            <span className="info-label">
                                <Calendar size={16} />
                                Submitted on
                            </span>
                            <span className="info-value">
                                {formatDate(complaint.createdAt)}
                            </span>
                        </div>
                    </div>

                    <div className="detail-description">
                        <h3>Complaint</h3>
                        <p>{complaint.description}</p>
                    </div>

                    <div className="admin-response-section">
                        <h3>Admin Responses</h3>
                        <div className="response-content">
                            {complaint.adminResponse ? (
                                complaint.adminResponse.split('\n\n').map((msg, index) => {
                                    // Strip timestamp [date] from the beginning if present
                                    const cleanMsg = msg.replace(/^\[.*?\]\s*/, "")
                                    return (
                                        <p key={index} className="response-paragraph">
                                            {cleanMsg}
                                        </p>
                                    )
                                })
                            ) : (
                                <p>No response yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentComplaintDetail
