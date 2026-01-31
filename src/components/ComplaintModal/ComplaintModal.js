import ComplaintForm from "../ComplaintForm/ComplaintForm"
import Modal from "../Modal/Modal"
import "./ComplaintModal.css"

const ComplaintModal = ({
  isOpen,
  onClose,
  userId,
  userName,
  studentId,
  onSubmitSuccess,
}) => {
  const handleFeedbackSubmitted = () => {
    onSubmitSuccess()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ComplaintForm
        userId={userId}
        userName={userName}
        studentId={studentId}
        onSubmit={handleFeedbackSubmitted}
      />
    </Modal>
  )
}

export default ComplaintModal
