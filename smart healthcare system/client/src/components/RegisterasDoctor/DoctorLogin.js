import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // API call to login endpoint
      const response = await fetch("http://localhost:2000/doctor-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Include cookies for session handling
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login: Display success toast
        toast.success("Login successful!");
        localStorage.setItem("doctor", JSON.stringify(data.doctor)); // Store doctor session data locally
        navigate("/doctor-screen"); // Navigate to the doctor dashboard or desired route
      } else {
        // Handle login failure: Display error toast
        toast.error(data.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error(err);
      // Display error toast for unexpected errors
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-90">
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "30rem", borderRadius: '15px' }}>
        <h3 className="text-center mb-4" style={{ color: "#1b558b" }}>
          Login as Doctor
        </h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#1b558b" }}>
              Login
            </button>
          </div>
        </form>
        <div className="text-center mt-3">
          <p>
            Don't have an account? <Link to="/register-as-doctor">Register</Link>
          </p>
        </div>

        {/* Image below the form */}
        <div className="mt-4">
          <img
            src="https://drgalen.org/assets/img/doctor-login.png" // Replace with your actual image URL
            alt="Doctor Login"
            className="img-fluid"
            style={{
              borderRadius: '15px', 
              objectFit: 'cover', // Ensures the image doesn't stretch and maintains its aspect ratio
              width: '100%', // Makes the image responsive
              maxHeight: '400px', // Optional: limits the height for better control
            }}
          />
        </div>
      </div>

      {/* Include ToastContainer here for toast notifications */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default DoctorLogin;
