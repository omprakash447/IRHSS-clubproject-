import React, { useEffect, useRef, useState } from 'react';
import { FaBars, FaSignOutAlt, FaTachometerAlt, FaTimes, FaUser } from 'react-icons/fa'; // Importing icons
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [authuser, setauthuser] = useState([]); // User data
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const userIconRef = useRef(null); // To reference the user icon
  const navigate = useNavigate();

  // Check if the user is logged in on component mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, []);

  useEffect(() => {
    const handelaccessuser = async () => {
      try {
        const response = await fetch("http://localhost:2000/user", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setauthuser(data); // Set the authenticated user
        }
      } catch (err) {
        alert(err);
      }
    };
    handelaccessuser();
  }, []);

  // Toggle the menu open/close
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close the menu when a link is clicked in mobile view
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user data from localStorage
    setIsLoggedIn(false); // Update state
    navigate('/'); // Redirect to login page
    setIsModalOpen(false); // Close modal after logout
  };

  // Handle opening/closing the modal (popup)
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Position the modal relative to the user icon
  const modalStyle = {
    position: 'absolute',
    top: '100%', // Position it directly below the user icon
    left: 0,
    transform: 'translateY(10px)', // Add a small space between the icon and the modal
    width: '200px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    padding: '10px',
    zIndex: 1050,
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top sticky-top" style={{ backgroundColor: '#1b558b' }}>
      <div className="container">
        <Link className="navbar-brand title-animate" to="/landingpage" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          Smart Healthcare System
        </Link>

        {/* Hamburger icon (only visible on smaller devices) */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu} // Toggling the menu open/close
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen ? 'true' : 'false'}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? (
            <FaTimes size={30} color="#fff" /> // Cross icon when menu is open
          ) : (
            <FaBars size={30} color="#fff" /> // Hamburger icon when menu is closed
          )}
        </button>

        {/* Normal navbar for large devices */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-animate" to="/dashboard" style={{ padding: '10px 15px' }}>
                    <FaTachometerAlt className="me-2" size={20} />
                    Dashboard
                  </Link>
                </li>
                {/* User Icon Button */}
                <li className="nav-item" style={{ position: 'relative' }} ref={userIconRef}>
                  <button
                    className="nav-link text-animate"
                    style={{ padding: '10px 15px', background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={toggleModal}
                  >
                    <FaUser className="me-2" size={20} />
                    {authuser?.userName} {/* Display username */}
                  </button>

                  {/* Modal (User Details) */}
                  {isModalOpen && (
                    <div style={modalStyle}>
                      <p><strong>Username:</strong> {authuser?.userName}</p>
                      <p><strong>Email:</strong> {authuser?.userEmail}</p>
                      <p><strong>UserType:</strong> {authuser?.userType}</p>
                      {/* Add more fields as needed */}
                      <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                        <FaSignOutAlt className="me-2" size={16} /> Logout
                      </button>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-animate" to="/" style={{ padding: '10px 15px' }} onClick={closeMenu}>
                    <FaUser style={{ marginRight: '8px' }} /> Signup
                  </Link>
                </li>

              </>
            )}
          </ul>
        </div>
      </div>

      {/* Sidebar for mobile view */}
      <div
        className={`navbar-collapse ${isMenuOpen ? 'slide-in' : ''}`}
        id="navbarNav"
        style={{
          position: 'fixed',
          top: 0,
          left: isMenuOpen ? '0' : '-100%',
          width: '250px',
          height: '100%',
          backgroundColor: '#1b558b',
          transition: 'left 0.3s ease-in-out',
          zIndex: 1050,
        }}
      >
        <ul className="navbar-nav ms-auto">
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link className="nav-link text-animate" to="/dashboard" style={{ padding: '10px 15px' }} onClick={closeMenu}>
                  <FaTachometerAlt className="me-2" size={20} />
                  Dashboard
                </Link>
              </li>
              <li className="nav-item" style={{ position: 'relative' }} ref={userIconRef}>
                <button
                  className="nav-link text-animate"
                  style={{ padding: '10px 15px', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={toggleModal}
                >
                  <FaUser className="me-2" size={20} />
                  {authuser?.userName} {/* Display username */}
                </button>

                {/* Modal (User Details) */}
                {isModalOpen && (
                  <div style={modalStyle}>
                    <p><strong>Username:</strong> {authuser?.userName}</p>
                    <p><strong>Email:</strong> {authuser?.userEmail}</p>
                    <p><strong>UserType:</strong> {authuser?.userType}</p>
                    {/* Add more fields as needed */}
                    <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" size={16} /> Logout
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link text-animate" to="/" style={{ padding: '10px 15px' }} onClick={closeMenu}>
                  <FaUser style={{ marginRight: '8px' }} /> Signup
                </Link>
              </li>

            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
