// src/components/Header.jsx

import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom'; // Import Link and NavLink
import { IoGlobeOutline } from 'react-icons/io5';
import mainLogo from '../../assets/logo.png'; // Adjust the path as necessary

const customFontStyle = {
  fontFamily: "'Katibeh', serif", // Changed to serif for better font matching
  fontWeight: 400, // Katibeh is typically regular weight
  fontStyle: "normal",
};

const Header = () => {
  // State to control header visibility (show/hide)
  const [isVisible, setIsVisible] = useState(true);
  // State to track the last scroll position
  const [lastScrollY, setLastScrollY] = useState(0);
  // State to control the background style based on scroll position
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if user has scrolled past the top (e.g., > 10px)
      if (currentScrollY > 10) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }

      // Determine scroll direction to show/hide the header
      // We also add a small threshold (currentScrollY > 100) to prevent hiding on small scrolls
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      // Update the last scroll position
      setLastScrollY(currentScrollY);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup function to remove the listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out
        ${hasScrolled ? 'py-4 bg-black/50 backdrop-blur-lg shadow-lg' : 'py-6 bg-transparent'}
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 flex justify-between items-center">
         {/* Logo is now a link to the homepage */}
         <Link to="/">
            <img className='h-16' src={mainLogo} alt="EverGreen Properties Logo" />
        </Link>
        {/* Navigation uses NavLink for active styling and regular links for others */}
        <nav className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm p-1 rounded-full">
          {/* NavLink automatically adds styling for the active route */}
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                isActive ? 'bg-white text-black' : 'text-gray-200 hover:bg-white/10'
              }`
            }
            end // Ensures this link is only active for the exact home path
          >
            Home
          </NavLink>
          {/* These are treated as section links on the homepage */}
          <Link to={'/about'  }> <p className="hover:bg-white/10 text-gray-200 px-4 py-2 rounded-full text-sm"> About Us</p></Link>
          <a href="/#properties" className="hover:bg-white/10 text-gray-200 px-4 py-2 rounded-full text-sm">Property List</a>
          <a href="/#contact" className="hover:bg-white/10 text-gray-200 px-4 py-2 rounded-full text-sm">Contact Us</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-sm text-white">
            <IoGlobeOutline size={20} />
            <span>Eng</span>
          </button>
          {/* Added a Sign In link pointing to the /login route */}
          <Link to="/login" className="text-white hover:text-gray-300 text-sm font-semibold transition-colors">
            Sign In
          </Link>
          {/* The Sign Up button is now a Link pointing to the /register route */}
          <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;