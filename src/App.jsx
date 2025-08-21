import React from "react";
import { Routes, Route } from "react-router-dom";

// Import your components from your project folder
import Navbar from './assets/Components/Navbar';
import Home from './assets/Components/Pages/Home';
import Dashboard from './assets/Components/Pages/Dashboard';
import Contact from './assets/Components/Pages/Contact';
import About from './assets/Components/Pages/About';
import ProtectedRoute from './assets/Components/ProtectedRoute';
import DoctorList from './assets/Components/Pages/Doctors';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/DoctorList" element={<DoctorList />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
