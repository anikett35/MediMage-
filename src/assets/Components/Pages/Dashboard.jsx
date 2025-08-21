import React, { useState } from "react";

export default function Dashboard() {
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const doctorsList = [
    { id: 1, name: "Dr. Smith", specialty: "Cardiology", availability: "Mon-Fri" },
    { id: 2, name: "Dr. Lee", specialty: "Dermatology", availability: "Tue-Sat" },
    { id: 3, name: "Dr. Patel", specialty: "General Medicine", availability: "Mon-Wed-Fri" },
    { id: 4, name: "Dr. Johnson", specialty: "Pediatrics", availability: "Mon-Fri" },
    { id: 5, name: "Dr. Williams", specialty: "Orthopedics", availability: "Wed-Sun" }
  ];

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const appointmentReasons = [
    "Routine Checkup",
    "Follow-up",
    "Consultation",
    "Emergency",
    "Prescription Refill",
    "Test Results",
    "Other"
  ];

  const handleBook = () => {
    if (doctor && date && time && reason) {
      const selectedDoctor = doctorsList.find(d => d.name === doctor);
      const newAppointment = {
        id: Date.now(),
        doctor,
        specialty: selectedDoctor?.specialty || "",
        date,
        time,
        reason,
        status: "Confirmed",
        bookedAt: new Date().toLocaleString()
      };
      
      setAppointments([...appointments, newAppointment]);
      
      // Reset form
      setDoctor("");
      setDate("");
      setTime("");
      setReason("");
      setShowForm(false);
      
      // Show success message (you could implement toast notifications here)
      alert("Appointment booked successfully!");
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleCancel = (id) => {
    setAppointments(appointments.filter(appointment => appointment.id !== id));
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    return appointments.filter(appointment => new Date(appointment.date) >= today)
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getPastAppointments = () => {
    const today = new Date();
    return appointments.filter(appointment => new Date(appointment.date) < today)
                    .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your medical appointments and health records</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Appointments" 
            value={appointments.length} 
            icon="📅" 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Upcoming" 
            value={getUpcomingAppointments().length} 
            icon="⏰" 
            color="bg-green-500" 
          />
          <StatCard 
            title="Completed" 
            value={getPastAppointments().length} 
            icon="✅" 
            color="bg-purple-500" 
          />
          <StatCard 
            title="Available Doctors" 
            value={doctorsList.length} 
            icon="👩‍⚕️" 
            color="bg-orange-500" 
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Book Appointment</h2>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    + New Appointment
                  </button>
                )}
              </div>

              {showForm && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Doctor
                    </label>
                    <select
                      value={doctor}
                      onChange={(e) => setDoctor(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose a doctor</option>
                      {doctorsList.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name} - {d.specialty}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      min={getTodayDate()}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Time
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Visit
                    </label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select reason</option>
                      {appointmentReasons.map((reasonOption) => (
                        <option key={reasonOption} value={reasonOption}>
                          {reasonOption}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleBook}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Book Appointment
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!showForm && appointments.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🏥</div>
                  <p className="text-gray-500">No appointments yet. Book your first appointment!</p>
                </div>
              )}
            </div>
          </div>

          {/* Appointments List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Appointments */}
            {getUpcomingAppointments().length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
                <div className="space-y-4">
                  {getUpcomingAppointments().map((appointment) => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      onCancel={handleCancel}
                      isUpcoming={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past Appointments */}
            {getPastAppointments().length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Past Appointments</h2>
                <div className="space-y-4">
                  {getPastAppointments().map((appointment) => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      onCancel={handleCancel}
                      isUpcoming={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function AppointmentCard({ appointment, onCancel, isUpcoming }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`border rounded-lg p-4 ${isUpcoming ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900">{appointment.doctor}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {appointment.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{appointment.specialty}</p>
          <p className="text-sm text-gray-600 mb-1">
            📅 {formatDate(appointment.date)} at {appointment.time}
          </p>
          <p className="text-sm text-gray-600">
            🏥 {appointment.reason}
          </p>
        </div>
        {isUpcoming && (
          <button
            onClick={() => onCancel(appointment.id)}
            className="ml-4 px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}