import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer here
import 'react-toastify/dist/ReactToastify.css'; // Import styles

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('donor');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to backend
      const response = await fetch('http://localhost:2000/userAuth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // If registration is successful, store the user info in localStorage
        localStorage.setItem('user', JSON.stringify({
          name: data.name,    // Assuming the backend returns this field
          email: data.email,  // You can store other fields like token if needed
          userType: data.userType,
        }));

        // Show success toast and redirect to login
        toast.success(data.message || 'Registration successful!');
        navigate('/login-as-user');
      } else {
        toast.error(data.error || 'Registration failed!');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-8 col-12">
          <h2 className="text-center mb-4 animated fadeIn" style={{ color: '#1b558b' }}>Register as user</h2>

          <form onSubmit={handleSubmit} className="card shadow-lg p-4 card-animate">
            <div className="form-group mb-3">
              <label htmlFor="name" className="text-primary">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email" className="text-primary">Email address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password" className="text-primary">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="userType" className="text-primary">User Type</label>
              <select
                className="form-control"
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="donor">Donor</option>
                <option value="recipient">Recipient</option>
                <option value="other">other</option>
              </select>
            </div>
            <button type="submit" className="btn w-100 btn-primary btn-animate" style={{ backgroundColor: '#1b558b' }}>Register</button>
          </form>
          <p className="text-center mt-3">
            Already have an account? <Link to="/login-as-user" className="text-primary">Login here</Link>
          </p>
        </div>
      </div>

      {/* ToastContainer to render notifications */}
      <ToastContainer />
    </div>
  );
}

export default Register;
