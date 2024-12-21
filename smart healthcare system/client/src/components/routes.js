import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AccidentDetection from './Features/AccidentDetection';
import BloodDonation from './Features/BloodDonation';
import Doctorheader from './RegisterasDoctor/Doctorheader';
import DoctorLogin from './RegisterasDoctor/DoctorLogin';
import DoctorRegister from './RegisterasDoctor/DoctorRegister';
import Login from './RegisterasUser/Login';
import Register from './RegisterasUser/Register';
import Authpage from './Screens/Authpage';
import Dashboard from './Screens/Dashboard';
import Doctorpage from './Screens/Doctorpage';
import Header from './Screens/Header'; // Regular header for all pages except doctor
import LandingPage from './Screens/landingpage';

function RoutesOfThePage() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Home and common header */}
                    <Route path='/Landingpage' element={<><Header /><LandingPage /></>} />
                    <Route path='/' element={<><Header /><Authpage /></>} />

                    {/* Auth routes */}
                    <Route path="/login-as-user" element={<><Header /><Login /></>} />
                    <Route path="/register-as-user" element={<><Header /><Register /></>} />
                    <Route path="/login-as-doctor" element={<><Header /><DoctorLogin /></>} />
                    <Route path="/register-as-doctor" element={<><Header /><DoctorRegister /></>} />

                    {/* User routes */}
                    <Route path="/dashboard" element={<><Header /><Dashboard /></>} />
                    <Route path="/blood-donation" element={<><Header /><BloodDonation /></>} />
                    <Route path="/accident-detection" element={<><Header /><AccidentDetection /></>} />

                    {/* Doctor page with its specific header */}
                    <Route
                        path='/doctor-screen'
                        element={
                            <>
                                <Doctorheader /> {/* Render the DoctorHeader only for the doctor page */}
                                <div className="container mt-4">
                                    <Doctorpage />
                                </div>
                            </>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default RoutesOfThePage;
