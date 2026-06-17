import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/auth.css'
import axios from 'axios'

const UserRegister = () => {
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const firstName = e.target.firstName.value
    const lastName = e.target.lastName.value
    const email = e.target.email.value
    const password = e.target.password.value

    try {
      const res = await axios.post(
        'http://localhost:3000/api/auth/user/register',
        {
          fullName: `${firstName} ${lastName}`,
          email,
          password,
        },
        { withCredentials: true }
      )

      console.log('register response', res.data)
      navigate('/')
    } catch (err) {
      console.error('register error', err.response?.data || err.message)
      alert(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="auth-page">
      <main className="auth-card partner-card">
        <div className="auth-header">
          <div>
            <p className="eyebrow">Create your account</p>
            <h1>Join to explore and enjoy delicious meals.</h1>
          </div>
          <p className="switch-hint">
            Switch: <span>User</span> · <a href="/food-partner/register">Food partner</a>
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="split-grid">
            <div className="field">
              <label>First Name</label>
              <input type="text" name="firstName" placeholder="Jack" />
            </div>
            <div className="field">
              <label>Last Name</label>
              <input type="text" name="lastName" placeholder="Doe" />
            </div>
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" />
          </div>

          <button className="btn primary large" type="submit">
            Sign Up
          </button>
        </form>

        <p className="muted">
          Already have an account? <a href="/user/login">Sign in</a>
        </p>
      </main>
    </div>
  )
}

export default UserRegister
