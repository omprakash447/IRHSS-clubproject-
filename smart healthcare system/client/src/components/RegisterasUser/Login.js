import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer here
import 'react-toastify/dist/ReactToastify.css'; // Import styles

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To show login errors
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error message
    try {
      // Send POST request to backend
      const response = await fetch('http://localhost:2000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials:"include",
      });

      const data = await response.json();

      if (response.ok) {
        // If login is successful, store the user info in localStorage
        localStorage.setItem('user', JSON.stringify({
          email: data.email, // You can store other user data like token here
          token: data.token,  // If you get a token from the backend
        }));

        // Show success toast and redirect to dashboard
        toast.success(data.message || 'Login successful!');
        navigate('/dashboard');
        window.location.reload();
      } else {
        setError(data.error); // Display error message from backend
        toast.error(data.error || 'Login failed!');
      }

    } catch (err) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-8 col-12">
          <h2 className="text-center mb-4 animated fadeIn" style={{ color: '#1b558b' }}>Login as user</h2>

          {error && <div className="alert alert-danger">{error}</div>} {/* Show error if any */}

          <form onSubmit={handleSubmit} className="card shadow-lg p-4 card-animate">
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
            <button type="submit" className="btn w-100 btn-primary btn-animate" style={{ backgroundColor: '#1b558b' }}>Login</button>
          </form>
          <p className="text-center mt-3">
            Don't have an account? <Link to="/register-as-user" className="text-primary">Register here</Link>
          </p>
        </div>
      </div>

      {/* ToastContainer to render notifications */}
      <ToastContainer />
    </div>
  );
}

export default Login;
