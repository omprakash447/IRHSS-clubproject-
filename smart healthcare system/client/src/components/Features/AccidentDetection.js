import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AccidentDetection() {
  const [accidents, setAccidents] = useState([]);
  const [newAccident, setNewAccident] = useState({ location: '', description: '' });

  // Fetch accidents data from the backend
  useEffect(() => {
    const fetchAccidents = async () => {
      try {
        const response = await fetch('http://localhost:2000/api/accidents');
        if (response.ok) {
          const data = await response.json();
          setAccidents(data.accidents || []);
        } else {
          toast.error('Failed to fetch accidents. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching accidents:', error);
        toast.error('Error fetching accidents. Please try again later.');
      }
    };

    fetchAccidents();
  }, []);

  // Handle the submission of a new accident
  const handleNewAccident = async (e) => {
    e.preventDefault();

    if (!newAccident.location || !newAccident.description) {
      toast.error('Both location and description are required!');
      return;
    }

    const accidentData = {
      location: newAccident.location,
      description: newAccident.description,
    };

    try {
      const response = await fetch('http://localhost:2000/api/accidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accidentData),
      });

      if (response.ok) {
        const newAccidentData = await response.json();
        setAccidents([...accidents, newAccidentData]);
        setNewAccident({ location: '', description: '' });
        toast.success('Accident reported successfully!');
      } else {
        const errorText = await response.text();
        toast.error(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error('Error reporting the accident:', error);
      toast.error('Error reporting the accident. Please try again.');
    }
  };

  // Handle Pending button click
  const handlePending = async (id) => {
    try {
      const response = await fetch(`http://localhost:2000/api/accidents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Pending' }),
      });

      if (response.ok) {
        const updatedAccident = await response.json();
        setAccidents(accidents.map(accident => 
          accident._id === updatedAccident._id ? updatedAccident : accident
        ));
        toast.info(`Accident ${id} marked as Pending.`);
      } else {
        toast.error('Failed to update accident status.');
      }
    } catch (error) {
      console.error('Error updating accident:', error);
      toast.error('Error updating accident. Please try again.');
    }
  };

  // Handle Checkout button click
  const handleCheckout = async (id) => {
    try {
      const response = await fetch(`http://localhost:2000/api/accidents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Checkout' }),
      });

      if (response.ok) {
        const updatedAccident = await response.json();
        setAccidents(accidents.map(accident => 
          accident._id === updatedAccident._id ? updatedAccident : accident
        ));
        toast.success(`Accident ${id} marked as Checked Out.`);
      } else {
        toast.error('Failed to update accident status.');
      }
    } catch (error) {
      console.error('Error updating accident:', error);
      toast.error('Error updating accident. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4" style={{ color: '#1b558b' }}>Accident Alert</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-lg border-0 rounded-3 card-animate">
            <div className="card-body">
              <h3 className="card-title" style={{ color: '#1b558b' }}>Recent Accidents</h3>
              <ul className="list-group list-group-flush">
                {accidents.length > 0 ? (
                  accidents.map((accident) => (
                    <li key={accident._id} className="list-group-item bg-light rounded-3 shadow-sm mb-3">
                      <strong style={{ color: '#1b558b' }}>{accident.location}</strong>
                      <br />
                      {accident.description}
                      <br />
                      <small className="text-muted">{accident.time}</small>
                      <div className="mt-3">
                        {/* Display status */}
                        <span className={`badge ${accident.status === 'Pending' ? 'bg-warning' : 'bg-success'}`}>
                          {accident.status}
                        </span>
                        <div className="mt-2">
                          {/* Pending Button */}
                          <button
                            className="btn btn-warning me-2"
                            onClick={() => handlePending(accident._id)}
                          >
                            Mark as Pending
                          </button>
                          {/* Checkout Button */}
                          <button
                            className="btn btn-success"
                            onClick={() => handleCheckout(accident._id)}
                          >
                            Mark as Checked Out
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-center">No accidents reported yet.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-lg border-0 rounded-3 card-animate">
            <div className="card-body">
              <h3 className="card-title" style={{ color: '#1b558b' }}>Report New Accident</h3>
              <form onSubmit={handleNewAccident}>
                <div className="form-group mb-3">
                  <label htmlFor="accidentLocation" className="form-label" style={{ color: '#1b558b' }}>Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="accidentLocation"
                    value={newAccident.location}
                    onChange={(e) => setNewAccident({ ...newAccident, location: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="accidentDescription" className="form-label" style={{ color: '#1b558b' }}>Description</label>
                  <textarea
                    className="form-control"
                    id="accidentDescription"
                    value={newAccident.description}
                    onChange={(e) => setNewAccident({ ...newAccident, description: e.target.value })}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn" style={{ backgroundColor: '#1b558b', color: 'white', width: '100%', padding: '10px' }}>Report Accident</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AccidentDetection;
