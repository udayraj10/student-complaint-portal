# Student Feedback and Complaint Portal
## Sri Venkateshwara University

A centralized platform for students to submit feedback and complaints with real-time tracking and administrative management.

## Features
- **User Authentication**: Student & Admin roles with secure login
- **Feedback Submission**: Submit feedback/complaints with categorization and priority levels
- **Real-time Status Tracking**: Track feedback status (Pending, In Progress, Resolved, Rejected)
- **Administrative Dashboard**: Manage all feedbacks, update status, and respond to students
- **Clean UI**: Minimalist design with Inter font and modern styling

## Tech Stack
- **Frontend:** React.js
- **Icons:** Lucide React
- **Storage:** Google Firebase
- **Styling:** CSS3 with custom components

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Demo Credentials

### Admin Login
- **Email:** admin@svu.edu
- **Password:** admin123

### Student Access
- Register a new account from the login page
- Fill in your name, student ID, email, and password

## Project Structure

```
src/
├── components/
│   ├── Login.js              # Authentication component
│   ├── StudentDashboard.js   # Student dashboard
│   ├── AdminDashboard.js     # Admin dashboard
│   ├── FeedbackForm.js       # Feedback submission form
│   ├── FeedbackList.js       # List of feedbacks
│   └── FeedbackDetail.js     # Detailed feedback view (admin)
├── services/
│   ├── authService.js        # Authentication logic
│   └── feedbackService.js    # Feedback CRUD operations
├── App.js                    # Main app component
└── index.js                  # Entry point
```

## Features in Detail

### Student Features
- Submit feedback/complaints with categories
- Set priority levels (Low, Medium, High, Urgent)
- View all submitted feedbacks
- Track status of each feedback
- View admin responses

### Admin Features
- View all feedbacks from all students
- Filter and search feedbacks
- Update feedback status
- Respond to student feedbacks
- View statistics dashboard

## Storage

Currently using LocalStorage for demo purposes. The code is structured to easily integrate with:
- Firebase Firestore
- REST APIs
- Other database solutions

## Future Enhancements
- Email notifications
- File attachments
- Advanced filtering and sorting
- Analytics and reporting
- Mobile app

### Settings Page
- Configure your settings
- Change your password
- Update your profile

## License
This project is created for Sri Venkateshwara University.


