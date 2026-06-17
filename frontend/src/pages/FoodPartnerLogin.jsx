import React from 'react'
import '../styles/auth.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FoodPartnerLogin = () => {

const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/food-partner/login',
        { email, password },
        { withCredentials: true }
      );
      console.log('partner login response', response.data);
      navigate('/create-food');
    } catch (err) {
      console.error('partner login error', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Login failed');
    } 
  
  }

  return (
    <div className="auth-page">
      <main className="auth-card">
        <h1 className="brand">Partner Portal</h1>
        <nav className="auth-switch">
          <a className="switch-link" href="/user/register">Register as User</a>
          <a className="switch-link" href="/food-partner/register">Register as Food Partner</a>
        </nav>
        <p className="subtitle">Sign in to manage your listings</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" placeholder="partner@example.com" />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" />
          </div>

          <button className="btn primary" type="submit">Login</button>
        </form>

        <p className="muted">New partner? <a href="/food-partner/register">Register</a></p>
      </main>
    </div>
  )
}

export default FoodPartnerLogin
