import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BloodDonation() {
  // State for Donate Blood form
  const [donateBloodType, setDonateBloodType] = useState('');
  const [donateQuantity, setdonateQuantity] = useState('');
  const [donateLocation, setDonateLocation] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorContact, setDonorContact] = useState('');

  // State for Request Blood form
  const [requestBloodType, setRequestBloodType] = useState('');
  const [requestQuantity, setRequestQuantity] = useState('');
  const [requestLocation] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientContact, setPatientContact] = useState('');
  const [priority, setPriority] = useState('');

  // State to hold donation and request data
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch donation and request data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const donationResponse = await fetch('http://localhost:2000/blood/donations', { credentials: 'include' });
        const requestResponse = await fetch('http://localhost:2000/blood/requests', { credentials: 'include' });

        if (donationResponse.ok) {
          const donationData = await donationResponse.json();
          setDonations(donationData);
        } else {
          console.error('Failed to fetch donation data');
        }

        if (requestResponse.ok) {
          const requestData = await requestResponse.json();
          setRequests(requestData);
        } else {
          console.error('Failed to fetch request data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  // Handle Donation
  const handleDonation = async (e) => {
    e.preventDefault();

    const donationData = {
      bloodType: donateBloodType,
      quantity: donateQuantity,
      location: donateLocation,
      name: donorName,
      contact: donorContact,
    };

    try {
      const response = await fetch('http://localhost:2000/blood/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Response:', errorData);
        toast.error(errorData.error || 'Failed to submit donation.');
      } else {
        const result = await response.json();
        toast.success(result.message || 'Thank you for your donation!');
        const donationResponse = await fetch('http://localhost:2000/blood/donations', { credentials: 'include' });
        if (donationResponse.ok) {
          const donationData = await donationResponse.json();
          setDonations(donationData);
        }
      }
    } catch (err) {
      console.error('Error during donation:', err);
      toast.error('An error occurred. Please try again.');
    }
  };

  // Handle Request
  const handleRequest = async (e) => {
    e.preventDefault();

    const requestData = {
      bloodType: requestBloodType,
      quantity: requestQuantity,
      location: requestLocation,
      name: patientName,
      contact: patientContact,
      priority,
    };

    try {
      const availabilityResponse = await fetch('http://localhost:2000/blood/request/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bloodType: requestBloodType,
          quantity: requestQuantity,
        }),
        credentials: 'include',
      });

      if (!availabilityResponse.ok) {
        const error = await availabilityResponse.json();
        console.error('Availability Error:', error);
        toast.error(error.error || 'Failed to check blood availability.');
        return;
      }

      const availabilityResult = await availabilityResponse.json();

      if (availabilityResult.available) {
        toast.success(`The requested blood (${requestBloodType}, ${requestQuantity} ml) is available.`);
      } else {
        toast.error(`The requested blood (${requestBloodType}, ${requestQuantity} ml) is not available.`);
        return;
      }

      const submitResponse = await fetch('http://localhost:2000/blood/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        credentials: 'include',
      });

      if (!submitResponse.ok) {
        const error = await submitResponse.json();
        console.error('Submit Error:', error);
        toast.error(error.error || 'Failed to submit blood request.');
      } else {
        const result = await submitResponse.json();
        toast.success(result.message || 'Blood request submitted successfully.');
        const requestResponse = await fetch('http://localhost:2000/blood/requests', { credentials: 'include' });
        if (requestResponse.ok) {
          const requestData = await requestResponse.json();
          setRequests(requestData);
        }
      }
    } catch (err) {
      console.error('Error during blood request:', err);
      toast.error('An error occurred. Please try again.');
    }
  };

  // Handle showing modal
  const handleShowModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" style={{ color: '#1b558b' }}>
        Blood Donation & Request
      </h2>
      <div className="row">
        {/* Donate Blood Section */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-lg rounded-3 border-0">
            <div className="card-body">
              <h3 className="card-title" style={{ color: '#1b558b' }}>
                Donate Blood
              </h3>
              <form onSubmit={handleDonation}>
                {/* Form fields for donation */}
                <div className="form-group mb-3">
                  <label htmlFor="donateBloodType" style={{ color: '#1b558b' }}>
                    Blood Type
                  </label>
                  <select
                    className="form-control"
                    id="donateBloodType"
                    value={donateBloodType}
                    onChange={(e) => setDonateBloodType(e.target.value)}
                    required
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="donateQuantity" style={{ color: '#1b558b' }}>
                    Quantity (ml)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="donateQuantity"
                    value={donateQuantity}
                    onChange={(e) => setdonateQuantity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="donorName" style={{ color: '#1b558b' }}>
                    Donor Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="donorName"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="donorContact" style={{ color: '#1b558b' }}>
                    Contact Information
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="donorContact"
                    value={donorContact}
                    onChange={(e) => setDonorContact(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="donateLocation" style={{ color: '#1b558b' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="donateLocation"
                    value={donateLocation}
                    onChange={(e) => setDonateLocation(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn"
                  style={{
                    backgroundColor: '#1b558b',
                    color: 'white',
                    width: '100%',
                    padding: '10px',
                  }}
                >
                  Donate
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Request Blood Section */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-lg rounded-3 border-0">
            <div className="card-body">
              <h3 className="card-title" style={{ color: '#1b558b' }}>
                Request Blood
              </h3>
              <form onSubmit={handleRequest}>
                {/* Form fields for request */}
                <div className="form-group mb-3">
                  <label htmlFor="requestBloodType" style={{ color: '#1b558b' }}>
                    Blood Type
                  </label>
                  <select
                    className="form-control"
                    id="requestBloodType"
                    value={requestBloodType}
                    onChange={(e) => setRequestBloodType(e.target.value)}
                    required
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="requestQuantity" style={{ color: '#1b558b' }}>
                    Quantity (ml)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="requestQuantity"
                    value={requestQuantity}
                    onChange={(e) => setRequestQuantity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="patientName" style={{ color: '#1b558b' }}>
                    Patient Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="patientContact" style={{ color: '#1b558b' }}>
                    Contact Information
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="patientContact"
                    value={patientContact}
                    onChange={(e) => setPatientContact(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="requestPriority" style={{ color: '#1b558b' }}>
                    Priority
                  </label>
                  <select
                    className="form-control"
                    id="requestPriority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn"
                  style={{
                    backgroundColor: '#1b558b',
                    color: 'white',
                    width: '100%',
                    padding: '10px',
                  }}
                >
                  Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Display Donation and Request Data in Tables */}
      <div className="row">
        {/* Donation Table */}
        <div className="col-12 col-md-6">
          <h4 className="text-center" style={{ color: '#1b558b' }}>Donation Records</h4>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Blood Type</th>
                  <th>Quantity (ml)</th>
                  <th>Location</th>
                  <th>Donor Name</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation._id}>
                    <td>{donation.bloodType}</td>
                    <td>{donation.quantity}</td>
                    <td>{donation.location}</td>
                    <td>{donation.name}</td>
                    <td>{donation.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Request Table */}
        <div className="col-12 col-md-6">
          <h4 className="text-center" style={{ color: '#1b558b' }}>Request Records</h4>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Blood Type</th>
                  <th>Quantity (ml)</th>
                  <th>Location</th>
                  <th>Patient Name</th>
                  <th>Contact</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request._id} onClick={() => handleShowModal(request)} style={{ cursor: 'pointer' }}>
                    <td>{request.bloodType}</td>
                    <td>{request.quantity}</td>
                    <td>{request.location}</td>
                    <td>{request.name}</td>
                    <td>{request.contact}</td>
                    <td>{request.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for displaying request details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Blood Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div>
              <p><strong>Blood Type:</strong> {selectedRequest.bloodType}</p>
              <p><strong>Quantity:</strong> {selectedRequest.quantity} ml</p>
              <p><strong>Location:</strong> {selectedRequest.location}</p>
              <p><strong>Patient Name:</strong> {selectedRequest.name}</p>
              <p><strong>Contact:</strong> {selectedRequest.contact}</p>
              <p><strong>Priority:</strong> {selectedRequest.priority}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default BloodDonation;

