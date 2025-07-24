// src/pages/EvergreenPage.jsx

import React from 'react';
import bgVideo from '../../assets/mainbg.mp4'; // Adjust the path as necessary

// 1. Import the new dynamic Header component
import Header from './Header'; 
import RealEstatePage from './RealEstatePage';
import EnquiryModal from './EnquiryModal';
import OngoingProjects from './OngoingProjects';
import About from './About';
import Footer from './Footer';


const customFontStyle = {
  fontFamily: "'SF Pro Text', serif", // Changed to serif for better font matching
  fontWeight: 400, // Katibeh is typically regular weight
  fontStyle: "normal",
};




const EvergreenPage = () => {
  return (
    // Note: Removed "overflow-hidden" and changed "h-screen" to "min-h-screen"
    // to allow the page content to scroll.
    <div className="relative w-full min-h-screen font-sans text-white bg-black">
      {/* Background Video Layer */}
      <div className="absolute top-0 left-0 w-full h-screen">
        <video
          className="w-full h-full object-cover"
          src={bgVideo}
          autoPlay
          loop
          muted
          playsInline // Important for mobile browsers
        />
        {/* Black Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
      </div>

      {/* 2. Header is now positioned on top of everything */}
      <Header />

      {/* Main Content Container */}
      <div className="relative flex flex-col h-screen px-4 sm:px-8 md:px-16">
        {/* Hero Section */}
        <main className="flex-grow flex items-center">
          <div className="w-full flex flex-col md:flex-row justify-between items-end gap-8">
            {/* Left Side: Title */}
            <div className="max-w-3xl">
              <div className="flex space-x-3 mb-4">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm">House</span>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm">Apartment</span>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm">Residential</span>
              </div>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-light leading-tight">
                Build Your Future, One<br />Property at a Time.
              </h2>
            </div>
            {/* Right Side: Text */}
            <div  className="max-w-xs text-right  text-gray-300 text-sm hidden lg:block">
              <p>Own Your World. One Property at a Time. Own Your World. One Property at a Time. Own Your World. One Property at a Time. Own Your World. One Property at a Time.</p>
            </div>
          </div>
        </main>
      </div>

      <div>
        <RealEstatePage/>
      </div>
      <div>
        <EnquiryModal isOpen={false} onClose={() => {}} />
      </div>
      <div>
        <OngoingProjects />
      </div>
      <div>
        <About/>
      </div>
      <div>
        <Footer />
      </div>

    
    </div>
  );
};

export default EvergreenPage;