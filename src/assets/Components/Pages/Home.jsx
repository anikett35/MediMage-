import React, { useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {isSignedIn ? (
          <SignedInView user={user} />
        ) : (
          <SignedOutView />
        )}
      </div>
    </div>
  );
}

function SignedInView({ user }) {
  return (
    <div className="text-center fade-in">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome back, {user.firstName}! 👋
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ready to manage your health appointments? Access your dashboard to book new appointments, 
          view upcoming visits, and manage your medical schedule.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <DashboardCard
          title="Go to Dashboard"
          description="Book appointments, view schedules, and manage your bookings"
          link="/dashboard"
          icon="📅"
          primary={true}
        />
        <DashboardCard
          title="Medical History"
          description="View your past appointments and medical records"
          link="/history"
          icon="📋"
        />
      </div>

      <QuickStats />
    </div>
  );
}

function SignedOutView() {
  const heroRef = useRef(null);
  
  useEffect(() => {
    // 3D tilt effect on the hero section
    const handleMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;
      
      heroRef.current.style.transform = `
        perspective(1000px)
        rotateX(${y * 5}deg)
        rotateY(${x * 5}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
    };
    
    const handleLeave = () => {
      heroRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };
    
    if (heroRef.current) {
      heroRef.current.addEventListener('mousemove', handleMove);
      heroRef.current.addEventListener('mouseleave', handleLeave);
    }
    
    return () => {
      if (heroRef.current) {
        heroRef.current.removeEventListener('mousemove', handleMove);
        heroRef.current.removeEventListener('mouseleave', handleLeave);
      }
    };
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section with 3D effect */}
      <section 
        ref={heroRef}
        className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 py-16 transition-transform duration-500 ease-out"
      >
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">MedBook</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your trusted platform for booking medical appointments quickly and securely. 
            Connect with healthcare professionals and manage your health journey with ease.
          </p>
        </div>



        <div className="relative w-full max-w-4xl mx-auto mt-16">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg blur-lg opacity-30 animate-pulse"></div>
          <div className="relative bg-white rounded-xl shadow-2xl p-8 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-100 rounded-lg p-4 animate-float" style={{animationDelay: '0s'}}>
                <div className="text-3xl mb-2">👨‍⚕️</div>
                <h3 className="font-semibold">Find Doctors</h3>
              </div>
              <div className="bg-indigo-100 rounded-lg p-4 animate-float" style={{animationDelay: '0.2s'}}>
                <div className="text-3xl mb-2">📅</div>
                <h3 className="font-semibold">Book Appointments</h3>
              </div>
              <div className="bg-purple-100 rounded-lg p-4 animate-float" style={{animationDelay: '0.4s'}}>
                <div className="text-3xl mb-2">💊</div>
                <h3 className="font-semibold">Get Treatment</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <Features />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

function StatsSection() {
  const stats = [
    { number: '50,000+', label: 'Patients Served', icon: '👥' },
    { number: '500+', label: 'Medical Professionals', icon: '👨‍⚕️' },
    { number: '98%', label: 'Satisfaction Rate', icon: '⭐' },
    { number: '24/7', label: 'Support Available', icon: '🕒' },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Patients Choose Us</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-300"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold mb-1">{stat.number}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: "🏥",
      title: "Trusted Healthcare Network",
      description: "Access a wide network of verified healthcare professionals and specialists across various medical fields."
    },
    {
      icon: "📱",
      title: "Easy Online Booking",
      description: "Book appointments 24/7 with just a few clicks from your computer or mobile device."
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your health information is protected with enterprise-grade security and encryption protocols."
    },
    {
      icon: "⏰",
      title: "Real-time Updates",
      description: "Get instant notifications about your appointments, reminders, and any schedule changes."
    },
    {
      icon: "💬",
      title: "Doctor Messaging",
      description: "Communicate directly with your healthcare providers through our secure messaging system."
    },
    {
      icon: "📊",
      title: "Health Tracking",
      description: "Monitor your health journey with personalized insights and appointment history."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Our Features</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Designed to make healthcare accessible, convenient, and personalized for every patient
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      content: "MedBook made scheduling my appointments so easy. I was able to find a specialist and book a visit within minutes!",
      avatar: "👩"
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      content: "This platform has streamlined my practice management. It's intuitive for both me and my patients.",
      avatar: "👨‍⚕️"
    },
    {
      name: "James Wilson",
      role: "Patient",
      content: "The reminder system saved me from missing my annual checkup. Great service all around!",
      avatar: "👨"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">What Our Users Say</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Hear from patients and doctors who have experienced our platform firsthand
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-4xl mb-4">{testimonial.avatar}</div>
              <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
              <div>
                <div className="font-semibold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Healthcare?</h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of patients who are managing their health appointments with ease and confidence.
        </p>
        <Link
          to="/sign-up"
          className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Create Your Account
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

function DashboardCard({ title, description, link, icon, primary = false }) {
  const baseClasses = "p-8 rounded-xl shadow-lg card-hover transition-all duration-300";
  const cardClasses = primary 
    ? `${baseClasses} bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1`
    : `${baseClasses} bg-white text-gray-900 hover:bg-gray-50 transform hover:-translate-y-1`;

  return (
    <Link to={link} className={cardClasses}>
      <div className="text-4xl mb-4 transform hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className={`text-lg ${primary ? 'text-blue-100' : 'text-gray-600'}`}>
        {description}
      </p>
    </Link>
  );
}

function QuickStats() {
  return (
    <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 fade-in">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Quick Overview</h3>
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard number="0" label="Upcoming Appointments" color="blue" />
        <StatCard number="0" label="Completed Visits" color="green" />
        <StatCard number="0" label="Saved Doctors" color="purple" />
      </div>
    </div>
  );
}

function StatCard({ number, label, color }) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50'
  };

  return (
    <div className={`p-6 rounded-lg ${colorClasses[color]} fade-in transform hover:scale-105 transition-transform duration-300`}>
      <div className="text-3xl font-bold mb-2">{number}</div>
      <div className="text-sm font-medium opacity-75">{label}</div>
    </div>
  );
}

// Add custom CSS for animations
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .card-hover {
    transition: all 0.3s ease;
  }
  
  .card-hover:hover {
    transform: translateY(-5px);
  }
  
  .fade-in {
    animation: fadeIn 0.8s ease-in;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);