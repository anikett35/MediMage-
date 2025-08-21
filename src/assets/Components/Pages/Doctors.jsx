import React, { useState, useEffect, useRef } from 'react';
import { FaStar, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaCalendarAlt, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import { useUser, SignInButton, SignUpButton } from '@clerk/clerk-react';

// Import sound file (you'll need to add this file to your project)
// For this example, I'll use a placeholder - you should replace with actual sound file
// import paymentSuccessSound from './sounds/payment-success.mp3';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  
  const { isSignedIn } = useUser();
  
  // Create a reference for the audio element
  const audioRef = useRef(null);

  // Sample doctor data
  useEffect(() => {
    const sampleDoctors = [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiologist',
        experience: '12 years',
        rating: 4.8,
        totalRatings: 124,
        price: 1500,
        availability: ['10:00 AM', '2:00 PM', '4:30 PM'],
        location: 'New Delhi, India',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        specialty: 'Neurologist',
        experience: '15 years',
        rating: 4.9,
        totalRatings: 98,
        price: 2000,
        availability: ['9:00 AM', '11:30 AM', '3:00 PM'],
        location: 'Mumbai, India',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 3,
        name: 'Dr. Emily Williams',
        specialty: 'Pediatrician',
        experience: '8 years',
        rating: 4.7,
        totalRatings: 87,
        price: 1200,
        availability: ['10:30 AM', '1:00 PM', '5:00 PM'],
        location: 'Bangalore, India',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      },
      {
        id: 4,
        name: 'Dr. James Wilson',
        specialty: 'Orthopedic Surgeon',
        experience: '18 years',
        rating: 4.6,
        totalRatings: 156,
        price: 2500,
        availability: ['8:00 AM', '12:00 PM', '4:00 PM'],
        location: 'Chennai, India',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
      }
    ];
    setDoctors(sampleDoctors);
  }, []);

  // Function to play the success sound
  const playSuccessSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current.play().catch(error => {
        console.log("Audio play failed:", error);
        // This is normal in some browsers that require user interaction first
      });
    }
  };

  const handleBookAppointment = (doctor) => {
    if (!isSignedIn) {
      setSelectedDoctor(doctor);
      setShowSignInPrompt(true);
      return;
    }
    
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
    setPaymentSuccess(false);
    // Set default booking date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
  };

  const simulatePayment = () => {
    setIsProcessing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      playSuccessSound(); // Play the success sound
      
      // After 3 seconds, close the modal
      setTimeout(() => {
        setShowBookingModal(false);
        setPaymentSuccess(false);
      }, 3000);
    }, 2000);
  };

  const handlePayment = () => {
    if (!bookingDate || !bookingTime) {
      alert("Please select date and time for your appointment");
      return;
    }
    
    simulatePayment();
  };

  const submitReview = () => {
    alert(`Thank you for your ${rating} star review!`);
    setRating(0);
    setReview('');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2)}`;
    }
    
    return value;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Hidden audio element for payment success sound */}
      <audio ref={audioRef} src="/Payment.mp3" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Doctor</h1>
          <p className="text-lg text-gray-600">Book appointments with top-rated specialists</p>
        </div>

        {/* Doctor List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-16 w-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  <div className="flex mr-2">
                    {renderStars(doctor.rating)}
                  </div>
                  <span className="text-sm text-gray-600">({doctor.totalRatings})</span>
                </div>

                <div className="flex items-center mb-3 text-sm text-gray-600">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{doctor.location}</span>
                </div>

                <div className="flex items-center mb-3 text-sm text-gray-600">
                  <FaClock className="mr-2" />
                  <span>{doctor.experience} experience</span>
                </div>

                <div className="flex items-center mb-4 text-sm font-semibold text-gray-900">
                  <FaMoneyBillWave className="mr-2" />
                  <span>₹{doctor.price} consultation</span>
                </div>

                <button
                  onClick={() => handleBookAppointment(doctor)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sign In Prompt Modal */}
        {showSignInPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
              <p className="text-gray-600 mb-6">
                You need to be signed in to book an appointment with {selectedDoctor?.name}.
              </p>
              
              <div className="flex flex-col space-y-4">
                <SignInButton mode="modal">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                    Sign In
                  </button>
                </SignInButton>
                
                <SignUpButton mode="modal">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                    Create Account
                  </button>
                </SignUpButton>
                
                <button
                  onClick={() => setShowSignInPrompt(false)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
              {!paymentSuccess ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Appointment</h2>
                  
                  <div className="flex items-center mb-6">
                    <img
                      src={selectedDoctor.image}
                      alt={selectedDoctor.name}
                      className="h-12 w-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{selectedDoctor.name}</h3>
                      <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendarAlt className="inline mr-2" />
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaClock className="inline mr-2" />
                      Select Time
                    </label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select a time</option>
                      {selectedDoctor.availability.map((time, index) => (
                        <option key={index} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCreditCard className="inline mr-2" />
                      Payment Method
                    </label>
                    <div className="flex space-x-4 mb-4">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`px-4 py-2 rounded-md ${paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      >
                        Credit/Debit Card
                      </button>
                      <button
                        onClick={() => setPaymentMethod('upi')}
                        className={`px-4 py-2 rounded-md ${paymentMethod === 'upi' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      >
                        UPI
                      </button>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                          <input
                            type="text"
                            name="number"
                            value={formatCardNumber(cardDetails.number)}
                            onChange={handleCardInputChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                          <input
                            type="text"
                            name="name"
                            value={cardDetails.name}
                            onChange={handleCardInputChange}
                            placeholder="John Doe"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                              type="text"
                              name="expiry"
                              value={formatExpiry(cardDetails.expiry)}
                              onChange={handleCardInputChange}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <input
                              type="text"
                              name="cvv"
                              value={cardDetails.cvv}
                              onChange={handleCardInputChange}
                              placeholder="123"
                              maxLength={3}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'upi' && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                        <input
                          type="text"
                          placeholder="yourname@upi"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        <p className="text-xs text-gray-500 mt-2">You will be redirected to your UPI app for payment</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold">Total: ₹{selectedDoctor.price}</span>
                    <button
                      onClick={handlePayment}
                      disabled={!bookingDate || !bookingTime || isProcessing}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Processing...' : 'Pay Now'}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setShowBookingModal(false);
                      setIsProcessing(false);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                  <p className="text-gray-600 mb-4">Your appointment with {selectedDoctor.name} has been confirmed.</p>
                  <p className="text-sm text-gray-500">Date: {bookingDate} at {bookingTime}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rating Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate Your Experience</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Choose a doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <button
                  key={index}
                  className="text-2xl focus:outline-none"
                  onClick={() => setRating(index + 1)}
                  onMouseEnter={() => setHover(index + 1)}
                  onMouseLeave={() => setHover(0)}
                >
                  <FaStar
                    className={index + 1 <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Share your experience..."
            ></textarea>
          </div>

          <button
            onClick={submitReview}
            disabled={rating === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;