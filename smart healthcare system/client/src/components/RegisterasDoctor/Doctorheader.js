import React, { useEffect, useState } from 'react';
import { FaAmbulance, FaBars, FaBriefcaseMedical, FaHandHoldingHeart, FaSignOutAlt, FaTachometerAlt, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function Doctorheader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(null); // Store doctor information
  const [error, setError] = useState(null); // Error message
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await fetch('http://localhost:2000/doctor-profile', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch doctor profile');

        const data = await response.json();
        setDoctorInfo(data); // Set doctor data
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDoctorProfile();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('doctor');
    navigate('/login-as-doctor');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const modalStyle = {
    position: 'absolute',
    top: '60px',
    right: '10px',
    width: '90%',
    maxWidth: '300px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    padding: '10px',
    zIndex: 1050,
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: '#1b558b' }}>
        <div className="container">
          {/* Dashboard Brand */}
          <Link className="navbar-brand" to="/doctor-screen" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
            Doctor Dashboard
          </Link>

          {/* Toggle Sidebar for Mobile */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
          >
            <FaBars size={24} />
          </button>

          {/* Navigation Links */}
          <div className={`collapse navbar-collapse ${isSidebarOpen ? 'd-none' : ''}`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {/* Blood Donation */}
              <li className="nav-item">
                <Link className="nav-link" to="/blood-donation">
                  <FaHandHoldingHeart className="me-2" size={20} />
                  Blood Donations
                </Link>
              </li>
              {/* Blood Requests */}
              <li className="nav-item">
                <Link className="nav-link" to="/blood-requests">
                  <FaBriefcaseMedical className="me-2" size={20} />
                  Blood Requests
                </Link>
              </li>
              {/* Emergency Cases */}
              <li className="nav-item">
                <Link className="nav-link" to="/emergency-cases">
                  <FaAmbulance className="me-2" size={20} />
                  Accidents / Emergencies
                </Link>
              </li>
              {/* Profile */}
              <li className="nav-item d-flex align-items-center">
                <button
                  className="btn text-white d-flex align-items-center"
                  onClick={toggleModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <FaUser size={24} className="me-2" />
                  {doctorInfo && <span style={{ fontSize: '1rem' }}>{doctorInfo.name}</span>}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100%',
            width: '250px',
            backgroundColor: '#1b558b',
            color: 'white',
            transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease',
            zIndex: 1040,
            boxShadow: '2px 0 5px rgba(0, 0, 0, 0.3)',
          }}
        >
          <ul className="list-unstyled p-3">
            <li>
              <Link to="/doctor-screen" className="text-white" style={{ textDecoration: 'none', padding: '15px' }}>
                <FaTachometerAlt className="me-2" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/blood-donation" className="text-white" style={{ textDecoration: 'none', padding: '15px' }}>
                <FaHandHoldingHeart className="me-2" />
                Blood Donations
              </Link>
            </li>
            <li>
              <Link to="/blood-requests" className="text-white" style={{ textDecoration: 'none', padding: '15px' }}>
                <FaBriefcaseMedical className="me-2" />
                Blood Requests
              </Link>
            </li>
            <li>
              <Link to="/emergency-cases" className="text-white" style={{ textDecoration: 'none', padding: '15px' }}>
                <FaAmbulance className="me-2" />
                Accidents / Emergencies
              </Link>
            </li>
            <li>
              <button
                onClick={toggleModal}
                className="text-white"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '15px',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <FaUser className="me-2" />
                Profile
              </button>
            </li>
          </ul>
        </div>

        {/* Modal for Profile */}
        {isModalOpen && doctorInfo && (
          <div style={modalStyle}>
            <h6>Doctor Information</h6>
            <p><strong>Name:</strong> {doctorInfo.name}</p>
            <p><strong>Email:</strong> {doctorInfo.email}</p>
            <p><strong>Specialization:</strong> {doctorInfo.specialization}</p>
            <p><strong>Location:</strong> {doctorInfo.currentHospital}</p>
            <p><strong>Contact:</strong> {doctorInfo.contact}</p>
            <p><strong>Experience:</strong> {doctorInfo.experience} years</p>
            <p><strong>Address:</strong> {doctorInfo.address}</p>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" />
              Logout
            </button>
          </div>
        )}

        {/* Error Handling */}
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </nav>
    </>
  );
}

export default Doctorheader;
