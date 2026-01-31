import React, { useState, useEffect, useCallback, useMemo } from "react"
import { FileText, Search, Filter, Plus } from "lucide-react"
import Header from "../../components/Header/Header"
import ComplaintList from "../../components/ComplaintList/ComplaintList"
import AdminComplaintDetail from "../../components/AdminComplaintDetail/AdminComplaintDetail"
import StatsGrid from "../../components/StatsGrid/StatsGrid"
import AdminRegistrationForm from "../../components/AdminRegistrationForm/AdminRegistrationForm"
import FeedbackPostForm from "../../components/FeedbackPostForm/FeedbackPostForm"
import FeedbackPostList from "../../components/FeedbackPostList/FeedbackPostList"
import FeedbackResponsesView from "../../components/FeedbackResponsesView/FeedbackResponsesView"
import Modal from "../../components/Modal/Modal"
import Toast from "../../components/Toast/Toast"
import { feedbackService } from "../../services/feedbackService"
import { feedbackSystemService } from "../../services/feedbackSystemService"
import Loader from "../../components/Loader/Loader"
import "./AdminDashboard.css"

const AdminDashboard = ({ user, onLogout }) => {
  const [complaints, setComplaints] = useState([])
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("complaints")
  const [showAdminRegistration, setShowAdminRegistration] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [feedbackPosts, setFeedbackPosts] = useState([])
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [selectedFeedbackPost, setSelectedFeedbackPost] = useState(null)

  const [showStats, setShowStats] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadComplaints = useCallback(async () => {
    const allComplaints = await feedbackService.getFeedbacks()
    setComplaints(
      allComplaints.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0)
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0)
        return dateB - dateA
      })
    )
  }, [])

  const loadFeedbackPosts = useCallback(async () => {
    const posts = await feedbackSystemService.getFeedbackPosts()
    setFeedbackPosts(posts.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0)
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0)
      return dateB - dateA
    }))
  }, [])

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      await Promise.all([loadComplaints(), loadFeedbackPosts()])
      setLoading(false)
    }
    fetchAllData()
  }, [loadComplaints, loadFeedbackPosts])

  const handleStatusUpdate = async () => {
    const allComplaints = await feedbackService.getFeedbacks()
    setComplaints(
      allComplaints.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0)
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0)
        return dateB - dateA
      })
    )

    // If we have a selected complaint, update it with fresh data
    if (selectedComplaint) {
      const updatedComplaint = allComplaints.find(c => c.id === selectedComplaint.id)
      if (updatedComplaint) {
        setSelectedComplaint(updatedComplaint)
      }
    }
  }

  const handleHomeClick = () => {
    // Reset to default view
    setActiveTab("complaints")
    setSelectedComplaint(null)
    setShowAdminRegistration(false)
    setShowFeedbackForm(false)
    setSearchTerm("")
    setStatusFilter("all")
  }

  const handleFeedbackPostSuccess = async (newPost) => {
    loadFeedbackPosts()
    setShowFeedbackForm(false)

    // Create notification for all students
    if (newPost) {
      // In Firestore, creating individual notifications for all students for one action is inefficient (Write amplification).
      // Better to have students pull "Shared Notifications" or "New Posts".
      // But to match current logic using localStorage style:
      // We will skip creating individual notifications in 'notifications_UserId' key since that's localStorage pattern.
      // Instead, StudentDashboard should just query 'feedback_posts' which needed attention or 'messages' collection.

      // However, StudentDashboard loadNotifications() currently reads from localStorage.
      // We need to fix StudentDashboard loadNotifications() first to NOT rely on localStorage for global events.
      // But preserving current behavior:

      // We will try to rely on 'Recent Feedback Posts' detection in StudentDashboard rather than pushing to every student.
      // So we do NOTHING here regarding pushing notifications to localStorage.
      // The Alert/Toast is enough for Admin.
    }

    setToastMessage("Feedback request posted successfully!")
  }

  const handleDeleteFeedbackPost = (postId) => {
    try {
      feedbackSystemService.deleteFeedbackPost(postId)
      loadFeedbackPosts()
      setToastMessage("Feedback post deleted successfully")
    } catch (error) {
      setToastMessage("Failed to delete feedback post")
    }
  }

  const filteredComplaints = useMemo(() => {
    return complaints.filter((feedback) => {
      const matchesSearch =
        (feedback.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (feedback.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (feedback.category || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === "all" || feedback.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [complaints, searchTerm, statusFilter])

  const stats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter((f) => f.status === "pending").length,
      inProgress: complaints.filter((f) => f.status === "in-progress").length,
      resolved: complaints.filter((f) => f.status === "resolved").length,
    }
  }, [complaints])

  if (selectedComplaint) {
    return (
      <AdminComplaintDetail
        complaint={selectedComplaint}
        onBack={() => setSelectedComplaint(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    )
  }

  if (loading) {
    return <Loader fullScreen text="Loading Dashboard..." />
  }

  return (
    <div className="dashboard">
      <Header
        title="Admin Dashboard"
        userName={user.name}
        user={user}
        onLogout={onLogout}
        showSettings={true}
        onSettingsClick={() => setShowAdminRegistration(true)}
        onHomeClick={handleHomeClick}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      {showAdminRegistration && (
        <Modal
          isOpen={showAdminRegistration}
          onClose={() => setShowAdminRegistration(false)}
        >
          <AdminRegistrationForm
            onSuccess={() => {
              setShowAdminRegistration(false)
              setToastMessage("Admin registered successfully!")
            }}
            onCancel={() => setShowAdminRegistration(false)}
          />
        </Modal>
      )}

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "complaints" ? "active" : ""}`}
            onClick={() => setActiveTab("complaints")}
          >
            Complaints
          </button>
          <button
            className={`tab-btn ${activeTab === "feedback-system" ? "active" : ""}`}
            onClick={() => setActiveTab("feedback-system")}
          >
            Feedback
          </button>
        </div>

        {activeTab === "complaints" && (
          <>
            <div className="filters-section">
              <div className="search-box">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-box">
                <Filter className="filter-icon" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="dashboard-actions">
              <button
                className="secondary-btn"
                onClick={() => setShowStats(!showStats)}
              >
                {showStats ? "Hide Statistics" : "View Statistics"}
              </button>
            </div>

            {showStats && (
              <div className="stats-container">
                <StatsGrid stats={stats} />
              </div>
            )}

            <div className="complaints-section">
              <h2>All Complaints</h2>
              {filteredComplaints.length === 0 ? (
                <div className="empty-state">
                  <FileText size={48} className="empty-icon" />
                  <p>No complaints found</p>
                  <p className="empty-subtitle">
                    {complaints.length === 0
                      ? "No complaints have been submitted yet"
                      : "Try adjusting your search or filter"}
                  </p>
                </div>
              ) : (
                <ComplaintList
                  complaints={filteredComplaints}
                  onSelectComplaint={setSelectedComplaint}
                />
              )}
            </div>
          </>
        )}

        {activeTab === "feedback-system" && (
          <>
            {selectedFeedbackPost && (
              <FeedbackResponsesView
                post={selectedFeedbackPost}
                onClose={() => setSelectedFeedbackPost(null)}
                onDelete={handleDeleteFeedbackPost}
              />
            )}

            {showFeedbackForm && (
              <Modal
                isOpen={showFeedbackForm}
                onClose={() => setShowFeedbackForm(false)}
              >
                <FeedbackPostForm
                  adminId={user.id}
                  adminName={user.name}
                  onSubmitSuccess={handleFeedbackPostSuccess}
                  onCancel={() => setShowFeedbackForm(false)}
                />
              </Modal>
            )}

            <div className="dashboard-actions">
              <button
                className="primary-btn"
                onClick={() => setShowFeedbackForm(true)}
              >
                <Plus size={20} />
                Request Feedback
              </button>
            </div>

            <div className="feedbacks-section">
              <h2>Feedback Requests</h2>
              <FeedbackPostList
                posts={feedbackPosts}
                onSelectPost={setSelectedFeedbackPost}
                onDeletePost={handleDeleteFeedbackPost}
                showActions={true}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
