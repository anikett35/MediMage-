import React from "react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">About DocApp</h1>
      
      <p className="mb-4 text-lg">
        DocApp is designed to make managing doctor appointments simple, fast, and secure. 
        Whether you are a patient looking to book consultations or a healthcare provider 
        managing schedules, DocApp streamlines the process for everyone.
      </p>

      <h2 className="text-2xl font-semibold mb-3 mt-6">Why Choose DocApp?</h2>
      <ul className="list-disc list-inside space-y-2 text-lg">
        <li>Easy and quick online booking for doctors of all specialties.</li>
        <li>Secure and private handling of your personal health information.</li>
        <li>Dashboard to manage appointments efficiently.</li>
        <li>Accessible from any device, anytime.</li>
      </ul>

      <p className="mt-6 text-lg">
        Our goal is to make healthcare more accessible and convenient for everyone. 
        With DocApp, booking appointments and managing your health schedule has never been easier.
      </p>
    </div>
  );
}
