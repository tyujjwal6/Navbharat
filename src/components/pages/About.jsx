import React, { useState } from 'react';
import { Phone } from 'lucide-react';

// Import the modals
import EnquiryModal from './EnquiryModal';

const About = () => {
  // State to manage the visibility of each modal
  const [isEnquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [isProjectsModalOpen, setProjectsModalOpen] = useState(false);

  return (
    <>
      <section className="bg-gray-100 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#fceded] text-[#3A3A3A] p-8 sm:p-10 lg:p-12 rounded-lg shadow-md">
            
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold">About Us</h2>
              <div className="w-20 h-1 bg-gray-400 mx-auto mt-3"></div>
            </div>

            <p className="text-base md:text-lg leading-relaxed text-center mb-8">
              Nav Bharat Niwas is a trusted real estate company based in Noida, Uttar Pradesh, located in Sector 63 near the metro station. We specialize in providing premium land sales to help you secure valuable investments. Our team is dedicated to offering transparent, reliable, and affordable real estate solutions. Whether you are looking for residential or commercial land, we offer properties with high growth potential. Join us at Nav Bharat Niwas and take the first step towards building a secure future with prime land investments.
            </p>

            <div className="text-center my-8">
              <h3 className="text-xl md:text-2xl font-bold">We Serve</h3>
            </div>

            <ul className="list-disc list-inside space-y-4 text-base md:text-lg mx-auto max-w-2xl mb-10">
              <li>End-to-end real estate consultancy for investors and homebuyers.</li>
              <li>No hidden charges – full disclosure of pricing, layout, and specifications.</li>
              <li>Land titles that are verified and legally acquired with proper documentation.</li>
            </ul>

            <div className="text-center">
              <button 
                onClick={() => setProjectsModalOpen(true)}
                className="bg-[#2D3748] text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-[#1A202C] transition-colors duration-300 transform hover:scale-105"
              >
                See Delivered and Upcoming projects
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button for Enquiry */}
      <button
        onClick={() => setEnquiryModalOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-[#2D3748] text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-[#1A202C] hover:scale-110 transition-all duration-300 z-40"
        aria-label="Enquire Now"
      >
        <Phone size={28} />
      </button>

      {/* Render the Modals */}
      <EnquiryModal isOpen={isEnquiryModalOpen} onClose={() => setEnquiryModalOpen(false)} />
    </>
  );
};

export default About;