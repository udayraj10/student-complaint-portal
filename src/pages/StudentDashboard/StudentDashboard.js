import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Plus, FileText } from "lucide-react"
import Header from "../../components/Header/Header"
import ComplaintList from "../../components/ComplaintList/ComplaintList"
import StudentComplaintDetail from "../../components/StudentComplaintDetail/StudentComplaintDetail"
import Notifications from "../../components/Notifications/Notifications"
import StatsGrid from "../../components/StatsGrid/StatsGrid"
import FeedbackViewList from "../../components/FeedbackViewList/FeedbackViewList"
import FeedbackRatingForm from "../../components/FeedbackRatingForm/FeedbackRatingForm"
import { feedbackService } from "../../services/feedbackService"
import { feedbackSystemService } from "../../services/feedbackSystemService"
import ComplaintModal from "../../components/ComplaintModal/ComplaintModal"
import Toast from "../../components/Toast/Toast"
import Loader from "../../components/Loader/Loader"
import Footer from "../../components/Footer/Footer"
import "./StudentDashboard.css"

const StudentDashboard = ({ user, onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [complaints, setComplaints] = useState([])
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unseenCount, setUnseenCount] = useState(0)
  const [activeTab, setActiveTab] = useState("complaints")
  const [feedbackPosts, setFeedbackPosts] = useState([])
  const [selectedFeedbackPost, setSelectedFeedbackPost] = useState(null)

  const [showStats, setShowStats] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadComplaints = useCallback(async () => {
    const userComplaints = await feedbackService.getFeedbacksByUserId(user.id)
    setComplaints(userComplaints)
  }, [user.id])

  const loadNotifications = useCallback(async () => {
    try {
      // Get stored notifications (legacy or specific user alerts)
      const storedNotifs = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || '[]')

      // Filter to only include notifications within last 48 hours (2 days)
      const now = new Date()
      const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)

      const recentStoredNotifs = storedNotifs.filter(notif => {
        const notifDate = new Date(notif.createdAt)
        return notifDate >= fortyEightHoursAgo
      })

      // Get complaint responses
      const userFeedbacks = await feedbackService.getFeedbacksByUserId(user.id)
      const feedbacksWithResponses = userFeedbacks.filter(
        (feedback) => {
          const hasResponse = feedback.adminResponse && feedback.adminResponse.trim() !== ""
          const responseDate = new Date(feedback.updatedAt)
          return hasResponse && responseDate >= fortyEightHoursAgo
        }
      ).map(feedback => ({
        id: `resp-${feedback.id}`,
        type: 'admin_response',
        message: `Admin responded to your complaint: ${feedback.title}`,
        createdAt: feedback.updatedAt,
        seen: false // We might need to track seen state in local storage or DB. For now defaults to false on reload.
      }))

      // Get recent feedback posts (Dynamic generation of notifications)
      const feedbackPosts = await feedbackSystemService.getFeedbackPostsForStudent(user.id)
      const recentFeedbackPosts = feedbackPosts.filter(post => {
        const postDate = new Date(post.createdAt);
        return postDate >= fortyEightHoursAgo;
      }).map(post => ({
        id: `new-feedback-${post.id}`,
        type: 'feedback_request',
        message: `New Feedback Request: ${post.title}`,
        createdAt: post.createdAt,
        seen: false
      }));

      // Combine all notifications
      // De-duplicate by ID if needed, though IDs should be distinct prefixes
      const allNotifications = [...recentStoredNotifs, ...feedbacksWithResponses, ...recentFeedbackPosts]

      // Sort by most recent
      const sortedNotifications = allNotifications.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0)
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0)
        return dateB - dateA
      })

      setNotifications(sortedNotifications)
      setUnseenCount(sortedNotifications.filter(n => !n.seen).length)
    } catch (error) {
      console.error('Error loading notifications:', error)
      setNotifications([])
      setUnseenCount(0)
    }
  }, [user.id])

  const loadFeedbackPosts = useCallback(async () => {
    const posts = await feedbackSystemService.getFeedbackPostsForStudent(user.id)
    setFeedbackPosts(posts)
  }, [user.id])

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      await Promise.all([loadComplaints(), loadNotifications(), loadFeedbackPosts()])
      setLoading(false)
    }
    fetchAllData()
  }, [loadComplaints, loadNotifications, loadFeedbackPosts])

  const handleNotificationIconClick = () => {
    if (!showNotifications) {
      loadNotifications()
      setUnseenCount(0)
    }
    setShowNotifications(!showNotifications)
  }

  const handleFeedbackSuccess = () => {
    loadComplaints()
    loadNotifications()
    setToastMessage("Your complaint has been submitted successfully.")
  }

  const handleHomeClick = () => {
    // Reset to default view
    setActiveTab("complaints")
    setShowNotifications(false)
    setIsModalOpen(false)
    setSelectedFeedbackPost(null)
  }

  const handleFeedbackRatingSuccess = () => {
    loadFeedbackPosts()
    setSelectedFeedbackPost(null)
    setToastMessage("Thank you for your rating!")
  }

  const handleNotificationClick = (notification) => {
    // Mark notification as seen
    const notifs = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || '[]')
    const updatedNotifs = notifs.map(n =>
      n.id === notification.id ? { ...n, seen: true } : n
    )
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifs))

    // Navigate based on notification type
    if (notification.type === 'feedback_request') {
      setActiveTab('feedback-system')
      setShowNotifications(false)
    } else if (notification.type === 'admin_response') {
      setActiveTab('complaints')
      setShowNotifications(false)
    }

    loadNotifications()
  }

  const stats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter(f => f.status === 'pending').length,
      inProgress: complaints.filter(f => f.status === 'in-progress').length,
      resolved: complaints.filter(f => f.status === 'resolved').length,
    };
  }, [complaints]);

  if (loading) {
    return <Loader fullScreen text="Loading Dashboard..." />
  }

  return (
    <div className="dashboard">
      <Header
        title="Student Dashboard"
        userName={user.name}
        user={user}
        onLogout={onLogout}
        onNotificationsClick={handleNotificationIconClick}
        notificationCount={unseenCount}
        onHomeClick={handleHomeClick}
      />

      <Notifications
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />

      <ComplaintModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={user.id}
        userName={user.name}
        studentId={user.studentId}
        onSubmitSuccess={handleFeedbackSuccess}
      />

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "complaints" ? "active" : ""}`}
            onClick={() => setActiveTab("complaints")}
          >
            My Complaints
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
            {selectedComplaint ? (
              <StudentComplaintDetail
                complaint={selectedComplaint}
                onBack={() => setSelectedComplaint(null)}
              />
            ) : (
              <>
                <div className="dashboard-actions">
                  <button
                    className="primary-btn"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus size={20} />
                    Raise a Complaint
                  </button>
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
                  <h2>Complaints</h2>
                  {complaints.length === 0 ? (
                    <div className="empty-state">
                      <FileText size={48} className="empty-icon" />
                      <p>No complaints submitted yet</p>
                      <p className="empty-subtitle">
                        Click "Raise a Complaint" to get started
                      </p>
                    </div>
                  ) : (
                    <ComplaintList
                      complaints={complaints}
                      onSelectComplaint={setSelectedComplaint}
                    />
                  )}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === "feedback-system" && (
          <>
            {selectedFeedbackPost && (
              <FeedbackRatingForm
                post={selectedFeedbackPost}
                studentId={user.id}
                studentName={user.name}
                onClose={() => setSelectedFeedbackPost(null)}
                onSubmitSuccess={handleFeedbackRatingSuccess}
              />
            )}

            <div className="feedbacks-section">
              <h2>Feedback from Admin</h2>
              <FeedbackViewList
                posts={feedbackPosts}
                studentId={user.id}
                onSelectPost={setSelectedFeedbackPost}
              />
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default StudentDashboard
