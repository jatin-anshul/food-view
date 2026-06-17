import React from 'react'
import '../styles/auth.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FoodPartnerRegister = () => {

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const contactName = e.target.contactName.value;
    const phone = e.target.phone.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const address = e.target.address.value; 

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/food-partner/register',
        { name, contactName, phone, email, password, address },
        { withCredentials: true }
      );
      console.log('partner register response', response.data);
      navigate('/create-food');
    } catch (err) {
      console.error('partner register error', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Registration failed');
    }
  }


  return (
    <div className="auth-page">
      <main className="auth-card partner-card">
        <div className="auth-header">
          <div>
            <p className="eyebrow">Partner sign up</p>
            <h1>Grow your business with our platform.</h1>
          </div>
          <p className="switch-hint">
            Switch: <a href="/user/register">User</a> · <span>Food partner</span>
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Business Name</label>
            <input type="text" name="name" placeholder="Tasty Bites" />
          </div>

          <div className="split-grid">
            <div className="field">
              <label>Contact Name</label>
              <input type="text" name="contactName" placeholder="Jane Doe" />
            </div>
            <div className="field">
              <label>Phone</label>
              <input type="tel" name="phone" placeholder="+1 555 123 4567" />
            </div>
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" name="email" placeholder="business@example.com" />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" name="password" placeholder="Create password" />
          </div>

          <div className="field">
            <label>Address</label>
            <input type="text" name="address" placeholder="123 Market Street" />
            <p className="field-note">Full address helps customers find you faster.</p>
          </div>

          <button className="btn primary large" type="submit">Create Partner Account</button>
        </form>

        <p className="muted">Already a partner? <a href="/food-partner/login">Sign in</a></p>
      </main>
    </div>
  )
}

export default FoodPartnerRegister
