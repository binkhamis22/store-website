import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await API.register({ name, email, password, phone });
      
      // Check if registration was successful
      if (res.message === 'User registered successfully') {
        navigate('/login'); // Redirect to login page
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="tel" 
            placeholder="Phone Number" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        {error && <div className="error">{error}</div>}
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register; 