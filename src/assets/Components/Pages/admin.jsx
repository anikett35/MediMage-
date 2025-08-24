import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [contacts, setContacts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    totalContacts: 0,
    newContacts: 0,
    totalAppointments: 0,
    upcomingAppointments: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Load data on component mount and tab change
  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Load data from API
  const loadData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'contacts') {
        const response = await fetch('/api/contact/view');
        const data = await response.json();
        
        if (data.success) {
          setContacts(data.contacts);
          updateStats({ contacts: data.contacts, appointments });
        } else {
          console.error('Failed to load contacts');
        }
      } else {
        const response = await fetch('/api/appointments/view');
        const data = await response.json();
        
        if (data.success) {
          setAppointments(data.appointments);
          updateStats({ contacts, appointments: data.appointments });
        } else {
          console.error('Failed to load appointments');
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update statistics
  const updateStats = (data) => {
    const today = new Date().toDateString();
    const now = new Date();
    
    setStats({
      totalContacts: data.contacts.length,
      newContacts: data.contacts.filter(c => (c.status || 'new') === 'new').length,
      totalAppointments: data.appointments.length,
      upcomingAppointments: data.appointments.filter(a => new Date(a.date) > now).length
    });
  };

  // Filter and sort contacts
  const filteredContacts = contacts
    .filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || (contact.status || 'new') === statusFilter;
      const matchesPriority = priorityFilter === 'all' || (contact.priority || 'medium') === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
        default:
          return 0;
      }
    });

  // Filter and sort appointments
  const filteredAppointments = appointments
    .filter(appointment => {
      const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || (appointment.status || 'scheduled') === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
        default:
          return 0;
      }
    });

  // View contact details
  const viewContact = (contact) => {
    setSelectedContact(contact);
    setSelectedAppointment(null);
    setShowModal(true);
  };

  // View appointment details
  const viewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedContact(null);
    setShowModal(true);
  };

  // Delete single contact
  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      const response = await fetch(`/api/contact/delete/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await loadData();
        alert('Contact deleted successfully!');
      } else {
        alert('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact');
    }
  };

  // Delete single appointment
  const deleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    
    try {
      const response = await fetch(`/api/appointments/delete/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await loadData();
        alert('Appointment deleted successfully!');
      } else {
        alert('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Error deleting appointment');
    }
  };

  // Delete all items
  const deleteAllItems = async () => {
    const itemType = activeTab === 'contacts' ? 'contacts' : 'appointments';
    
    if (!window.confirm(`⚠️ Are you sure you want to delete ALL ${itemType}?\n\nThis action cannot be undone!`)) return;
    
    try {
      const endpoint = activeTab === 'contacts' ? '/api/contact/delete-all' : '/api/appointments/delete-all';
      const response = await fetch(endpoint, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await loadData();
        alert(`All ${itemType} deleted successfully!`);
      } else {
        alert(`Failed to delete ${itemType}`);
      }
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
      alert(`Error deleting ${itemType}`);
    }
  };

  // Get priority badge style
  const getPriorityStyle = (priority) => {
    const p = priority || 'medium';
    const styles = {
      high: 'bg-red-100 text-red-800 border border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      low: 'bg-green-100 text-green-800 border border-green-200'
    };
    return styles[p] || styles.medium;
  };

  // Get status badge style
  const getStatusStyle = (status) => {
    const s = status || 'new';
    const styles = {
      new: 'bg-blue-100 text-blue-800 border border-blue-200',
      replied: 'bg-green-100 text-green-800 border border-green-200',
      closed: 'bg-gray-100 text-gray-800 border border-gray-200',
      scheduled: 'bg-blue-100 text-blue-800 border border-blue-200',
      completed: 'bg-green-100 text-green-800 border border-green-200',
      cancelled: 'bg-red-100 text-red-800 border border-red-200'
    };
    return styles[s] || styles.new;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mark as replied
  const markAsReplied = async (id) => {
    try {
      const response = await fetch(`/api/contact/update-status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'replied' })
      });
      
      if (response.ok) {
        await loadData();
        alert('Status updated to replied!');
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/appointments/update-status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        await loadData();
        alert(`Appointment marked as ${status}!`);
      } else {
        alert('Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Error updating appointment status');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            🏥 MediMaga Admin Dashboard
          </h1>
          <p className="text-slate-600">Manage patient inquiries and appointments</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'contacts'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📧 Contact Messages ({stats.totalContacts})
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'appointments'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📅 Appointments ({stats.totalAppointments})
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <span className="text-2xl text-blue-600">
                  {activeTab === 'contacts' ? '👥' : '📅'}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {activeTab === 'contacts' ? stats.totalContacts : stats.totalAppointments}
                </p>
                <p className="text-slate-600 text-sm">
                  Total {activeTab === 'contacts' ? 'Contacts' : 'Appointments'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <span className="text-2xl text-green-600">
                  {activeTab === 'contacts' ? '🔔' : '⏰'}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {activeTab === 'contacts' ? stats.newContacts : stats.upcomingAppointments}
                </p>
                <p className="text-slate-600 text-sm">
                  {activeTab === 'contacts' ? 'New Messages' : 'Upcoming'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <span className="text-2xl text-purple-600">📊</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {activeTab === 'contacts' 
                    ? contacts.filter(c => (c.priority || 'medium') === 'high').length
                    : appointments.filter(a => (a.priority || 'medium') === 'high').length
                  }
                </p>
                <p className="text-slate-600 text-sm">High Priority</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-full mr-4">
                <span className="text-2xl text-amber-600">
                  {activeTab === 'contacts' ? '💬' : '✅'}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {activeTab === 'contacts' 
                    ? contacts.filter(c => (c.status || 'new') === 'replied').length
                    : appointments.filter(a => (a.status || 'scheduled') === 'completed').length
                  }
                </p>
                <p className="text-slate-600 text-sm">
                  {activeTab === 'contacts' ? 'Replied' : 'Completed'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Header Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === 'contacts' ? 'Contact Messages' : 'Appointment Management'}
            </h2>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={loadData}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
              >
                <span className={`mr-2 ${loading ? 'animate-spin' : ''}`}>🔄</span>
                Refresh
              </button>
              <button
                onClick={deleteAllItems}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
              >
                <span className="mr-2">🗑️</span>
                Clear All
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              {activeTab === 'contacts' ? (
                <>
                  <option value="new">New</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </>
              ) : (
                <>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </>
              )}
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center mb-4">
            <span className="text-sm text-gray-600 mr-2">Sort by:</span>
            <div className="flex space-x-2">
              {['newest', 'oldest', 'priority'].map(option => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`px-3 py-1 text-sm rounded-full transition-all ${
                    sortBy === option 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {activeTab === 'contacts' ? filteredContacts.length : filteredAppointments.length} of{' '}
              {activeTab === 'contacts' ? contacts.length : appointments.length} {activeTab}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading {activeTab}...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && (
            (activeTab === 'contacts' ? filteredContacts.length === 0 : filteredAppointments.length === 0) && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {activeTab === 'contacts' ? '📭' : '📅'}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  No {activeTab} found
                </h3>
                <p className="text-slate-600">
                  {activeTab === 'contacts' 
                    ? 'When patients submit contact forms, they will appear here.'
                    : 'When appointments are booked, they will appear here.'
                  }
                </p>
              </div>
            )
          )}

          {/* Contacts Table */}
          {!loading && activeTab === 'contacts' && filteredContacts.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(contact.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                          <div className="text-sm text-gray-500">{contact.phone || 'No phone'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">{contact.subject}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${getPriorityStyle(contact.priority)}`}>
                          {(contact.priority || 'medium').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {contact.department || 'General'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusStyle(contact.status)}`}>
                          {(contact.status || 'new').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewContact(contact)}
                            className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded-lg hover:bg-blue-50"
                            title="View Details"
                          >
                            👁️ View
                          </button>
                          {(contact.status || 'new') === 'new' && (
                            <button
                              onClick={() => markAsReplied(contact._id)}
                              className="text-green-600 hover:text-green-900 transition-colors p-2 rounded-lg hover:bg-green-50"
                              title="Mark as Replied"
                            >
                              ✓ Reply
                            </button>
                          )}
                          <button
                            onClick={() => deleteContact(contact._id)}
                            className="text-red-600 hover:text-red-900 transition-colors p-2 rounded-lg hover:bg-red-50"
                            title="Delete Contact"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Appointments Table */}
          {!loading && activeTab === 'appointments' && filteredAppointments.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(appointment.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                          <div className="text-sm text-gray-500">{appointment.patientEmail}</div>
                          <div className="text-sm text-gray-500">{appointment.patientPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{appointment.doctorName}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {appointment.department}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${getPriorityStyle(appointment.priority)}`}>
                          {(appointment.priority || 'medium').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusStyle(appointment.status)}`}>
                          {(appointment.status || 'scheduled').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewAppointment(appointment)}
                            className="text-blue-600 hover:text-blue-900 transition-colors p-2 rounded-lg hover:bg-blue-50"
                            title="View Details"
                          >
                            👁️ View
                          </button>
                          {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                            <button
                              onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                              className="text-green-600 hover:text-green-900 transition-colors p-2 rounded-lg hover:bg-green-50"
                              title="Mark as Completed"
                            >
                              ✓ Complete
                            </button>
                          )}
                          <button
                            onClick={() => deleteAppointment(appointment._id)}
                            className="text-red-600 hover:text-red-900 transition-colors p-2 rounded-lg hover:bg-red-50"
                            title="Delete Appointment"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Contact Details Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800">Contact Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-lg font-medium text-gray-900">{selectedContact.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-lg text-gray-900">{selectedContact.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-lg text-gray-900">{selectedContact.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <p className="text-lg font-medium text-gray-900">{selectedContact.subject}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <p className="text-lg text-gray-900">{selectedContact.department || 'General'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPriorityStyle(selectedContact.priority)}`}>
                        {(selectedContact.priority || 'medium').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusStyle(selectedContact.status)}`}>
                      {(selectedContact.status || 'new').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Received: {formatDate(selectedContact.createdAt)}
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  {(selectedContact.status || 'new') === 'new' && (
                    <button
                      onClick={() => {
                        markAsReplied(selectedContact._id);
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Mark as Replied
                    </button>
                  )}
                  <button
                    onClick={() => {
                      deleteContact(selectedContact._id);
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800">Appointment Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                    <p className="text-lg font-medium text-gray-900">{selectedAppointment.patientName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-lg text-gray-900">{selectedAppointment.patientEmail}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-lg text-gray-900">{selectedAppointment.patientPhone}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                    <p className="text-lg text-gray-900">{formatDate(selectedAppointment.date)}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                    <p className="text-lg font-medium text-gray-900">{selectedAppointment.doctorName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <p className="text-lg text-gray-900">{selectedAppointment.department}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPriorityStyle(selectedAppointment.priority)}`}>
                        {(selectedAppointment.priority || 'medium').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusStyle(selectedAppointment.status)}`}>
                        {(selectedAppointment.status || 'scheduled').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedAppointment.notes || 'No additional notes provided.'}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Created: {formatDate(selectedAppointment.createdAt)}
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  {selectedAppointment.status !== 'completed' && selectedAppointment.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        updateAppointmentStatus(selectedAppointment._id, 'completed');
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}
                  <button
                    onClick={() => {
                      deleteAppointment(selectedAppointment._id);
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;