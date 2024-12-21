import React from 'react';
import { Link } from 'react-router-dom';
import img1 from "../assets/1.png";
import img2 from "../assets/2.png";

function Dashboard() {
  return (
    <>
    <div className="container mt-5">
      <h2 className="text-center mb-5" style={{ color: '#1b558b' }}>Dashboard</h2>
      <div className="row justify-content-center">
        {/* Blood Donation Card */}
        <div className="col-md-4 col-sm-6 mb-4">
          <div className="card shadow-lg rounded-3 border-0 card-hover">
            <div className="card-body">
              <h5 className="card-title" style={{ color: '#1b558b' }}>Blood Donation & Receive</h5>
              <p className="card-text">Manage blood donation and receiving processes.</p>
              {/* Responsive image for the card with margin bottom */}
              <img 
                src={img1} 
                alt="Blood Donation"
                className="card-img-top img-fluid mb-3"  // Added mb-3 for margin-bottom to separate from button
              />
              <Link 
                to="/blood-donation" 
                className="btn btn-primary w-100 py-2 shadow-sm btn-animate"
                style={{ backgroundColor: '#1b558b' }}
              >
                Go to Blood Donation
              </Link>
            </div>
          </div>
        </div>

        {/* Accident Detection Card */}
        <div className="col-md-4 col-sm-6 mb-4">
          <div className="card shadow-lg rounded-3 border-0 card-hover">
            <div className="card-body">
              <h5 className="card-title" style={{ color: '#1b558b' }}>Accident Alert</h5>
              <p className="card-text">Monitor and respond to accident alerts.</p>
              {/* Responsive image for the card with margin bottom */}
              <img 
                src={img2} 
                alt="Accident Detection"
                className="card-img-top img-fluid mb-3"  // Added mb-3 for margin-bottom to separate from button
              />
              <Link 
                to="/accident-detection" 
                className="btn btn-primary w-100 py-2 shadow-sm btn-animate"
                style={{ backgroundColor: '#1b558b' }}
              >
                Go to Accident Alert
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Dashboard;
