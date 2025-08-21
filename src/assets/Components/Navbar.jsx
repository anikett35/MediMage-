import React, { useState, useEffect } from "react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isSignedIn } = useUser();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('nav')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const navigationItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Dashboard', path: '/dashboard', icon: '📊', requiresAuth: true },
    { name: 'DoctorList', path: '/DoctorList', icon: '👩‍⚕️' },
    { name: 'About', path: '/about', icon: '📋' },
    { name: 'Contact', path: '/contact', icon: '📞' },
  ];

  const filteredNavItems = navigationItems.filter(item => 
    !item.requiresAuth || isSignedIn
  );

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-gradient-to-r from-blue-600 to-indigo-700'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className={`flex items-center space-x-2 text-2xl font-bold transition-colors ${
              scrolled ? 'text-blue-600 hover:text-blue-700' : 'text-white hover:text-blue-100'
            }`}
          >
            <span className="text-3xl">🏥</span>
            <span>DocApp</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {filteredNavItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path}
                isActive={isActivePath(item.path)}
                scrolled={scrolled}
                icon={item.icon}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  scrolled 
                    ? 'text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white' 
                    : 'text-blue-600 bg-white hover:bg-blue-50'
                }`}>
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  scrolled 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
                    : 'bg-blue-500 text-white hover:bg-blue-400'
                }`}>
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center space-x-3">
                <NotificationBell scrolled={scrolled} />
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-white/20 hover:ring-white/40 transition-all"
                    }
                  }}
                  userProfileMode="modal"
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <SignedIn>
              <NotificationBell scrolled={scrolled} />
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9"
                  }
                }}
                userProfileMode="modal"
              />
            </SignedIn>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md transition-colors ${
                scrolled 
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isOpen}
        navigationItems={filteredNavItems}
        currentPath={location.pathname}
        onClose={() => setIsOpen(false)}
        scrolled={scrolled}
      />
    </nav>
  );
}

function NavLink({ to, children, isActive, scrolled, icon }) {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        isActive
          ? scrolled
            ? 'bg-blue-100 text-blue-700'
            : 'bg-white/20 text-white'
          : scrolled
            ? 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
            : 'text-white/90 hover:text-white hover:bg-white/10'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{children}</span>
    </Link>
  );
}

function NotificationBell({ scrolled }) {
  const [hasNotifications, setHasNotifications] = useState(true);

  return (
    <button className={`relative p-2 rounded-full transition-colors ${
      scrolled 
        ? 'text-gray-700 hover:bg-gray-100' 
        : 'text-white hover:bg-white/10'
    }`}>
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {hasNotifications && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
      )}
    </button>
  );
}

function MobileMenu({ isOpen, navigationItems, currentPath, onClose, scrolled }) {
  return (
    <div className={`lg:hidden transition-all duration-300 ease-in-out ${
      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
    }`}>
      <div className={`${
        scrolled 
          ? 'bg-white border-t border-gray-200' 
          : 'bg-gradient-to-b from-blue-700 to-indigo-800'
      } px-4 pt-4 pb-6 space-y-2`}>
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentPath === item.path
                ? scrolled
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white/20 text-white'
                : scrolled
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}

        {/* Mobile Auth Buttons */}
        <SignedOut>
          <div className="flex flex-col space-y-3 pt-4 border-t border-white/20">
            <SignInButton mode="modal">
              <button className={`w-full py-3 rounded-lg font-medium transition-colors ${
                scrolled 
                  ? 'text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white' 
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}>
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className={`w-full py-3 rounded-lg font-medium transition-colors ${
                scrolled 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}>
                Get Started
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}