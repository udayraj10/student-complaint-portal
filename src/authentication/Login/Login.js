import React, { useState, useEffect } from "react"
import { Mail, Lock, User, GraduationCap } from "lucide-react"
import { authService } from "../../services/authService"
import logoImage from "../../assets/images/logo.png"
import Loader from "../../components/Loader/Loader"
import "./Login.css"

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    studentId: "",
    course: "",
    gender: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const initAdmin = async () => {
      await authService.initializeDefaultAdmin()
    }
    initAdmin()
  }, [])

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
      if (isLogin) {
        const user = await authService.login(formData.email, formData.password)
        onLogin(user)
      } else {
        if (!formData.name || !formData.studentId || !formData.course || !formData.gender) {
          throw new Error("Please fill all fields")
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match")
        }
        const user = await authService.register(formData)
        onLogin(user)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      studentId: "",
      course: "",
      gender: "",
    })
  }

  return (
    <div className="login-container">
      {loading && <Loader fullScreen text={isLogin ? "Logging in..." : "Registering..."} />}
      <div className={`login-card ${!isLogin ? "register-mode" : ""}`}>
        <div className="login-header">
          <img
            src={logoImage}
            alt="Sri Venkateshwara University Logo"
            className="university-login-logo"
          />
          <h1>Sri Venkateshwara University</h1>
          <p className="subtitle">Student Feedback & Complaint Portal</p>
        </div>

        <h2 className="form-title">{isLogin ? "" : "Student Registration"}</h2>

        <form onSubmit={handleSubmit} className={`login-form ${!isLogin ? "register-form" : ""}`}>
          {!isLogin && (
            <>
              <div className="login-form-group">
                <User className="input-icon" size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
              <div className="login-form-group">
                <GraduationCap className="input-icon" size={20} />
                <input
                  type="number"
                  name="studentId"
                  placeholder="Student ID"
                  value={formData.studentId}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
              <div className="login-form-group">
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required={!isLogin}
                  className="login-select"
                >
                  <option value="">Select Course</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="MCA">MCA</option>
                  <option value="MBA">MBA</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="M.Com">M.Com</option>
                </select>
              </div>
              <div className="login-form-group">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required={!isLogin}
                  className="login-select"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </>
          )}

          <div className="login-form-group">
            <Mail className="input-icon" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-form-group">
            <Lock className="input-icon" size={18} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="login-form-group">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          {error && <div className="login-error-message full-width">{error}</div>}

          <button type="submit" className="login-btn full-width" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="auth-toggle-container">
          {isLogin ? (
            <p>
              New Student?{" "}
              <span className="auth-toggle-link" onClick={toggleMode}>
                Register new student
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span className="auth-toggle-link" onClick={toggleMode}>
                Login here
              </span>
            </p>
          )}
        </div>

        {/* {isLogin && (
          <div className="demo-credentials">
            <p className="demo-title">Demo Credentials:</p>
            <p>
              <strong>Admin:</strong> admin@svu.edu / admin123
            </p>
          </div>
        )} */}
      </div>
    </div>
  )
}

export default Login
