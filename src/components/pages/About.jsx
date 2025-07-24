// src/components/About.jsx

import React, { useState, useRef, useLayoutEffect } from 'react';
import { Phone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import the modals
import { EnquiryModal, ProjectsModal } from './Modals'; // Adjust path if needed

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const [isEnquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [isProjectsModalOpen, setProjectsModalOpen] = useState(false);

  const mainRef = useRef(null);

  useLayoutEffect(() => {
    // Create a context for our animations to avoid conflicts
    const ctx = gsap.context(() => {
      
      // Animate the main card entrance
      gsap.from('.about-card', {
        scrollTrigger: {
          trigger: '.about-card',
          start: 'top 85%', // Start animation when 85% of the card is visible
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: 'power3.out',
      });

      // Create a timeline for the content inside the card
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-card',
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Staggered animation for the content
      tl.from('.about-title, .title-divider', { opacity: 0, y: -40, stagger: 0.15, duration: 0.8, ease: 'power2.out' })
        .from('.about-paragraph', { opacity: 0, y: 30, duration: 1, ease: 'power2.out' }, '-=0.5')
        .from('.serve-title', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, '-=0.6')
        .from('.list-item', { opacity: 0, x: -30, stagger: 0.2, duration: 0.7, ease: 'back.out(1.4)' }, '-=0.4')
        .from('.projects-button', { opacity: 0, scale: 0.8, duration: 1, ease: 'elastic.out(1, 0.75)' }, '-=0.5');

      // Floating Action Button animation
      gsap.from('.fab-enquire', {
        delay: 1, // Give a slight delay to let the page settle
        duration: 1.2,
        scale: 0,
        opacity: 0,
        ease: 'elastic.out(1, 0.6)',
      });

    }, mainRef);

    // Cleanup function
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={mainRef} className="bg-gray-100 py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <div className="about-card bg-[#fceded] text-[#3A3A3A] p-8 sm:p-10 lg:p-12 rounded-lg shadow-md">
            
            <div className="text-center mb-8">
              <h2 className="about-title text-3xl md:text-4xl font-bold">About Us</h2>
              <div className="title-divider w-20 h-1 bg-gray-400 mx-auto mt-3"></div>
            </div>

            <p className="about-paragraph text-base md:text-lg leading-relaxed text-center mb-8">
              Nav Bharat Niwas is a trusted real estate company based in Noida, Uttar Pradesh, located in Sector 63 near the metro station. We specialize in providing premium land sales to help you secure valuable investments. Our team is dedicated to offering transparent, reliable, and affordable real estate solutions. Whether you are looking for residential or commercial land, we offer properties with high growth potential. Join us at Nav Bharat Niwas and take the first step towards building a secure future with prime land investments.
            </p>

            <div className="text-center my-8">
              <h3 className="serve-title text-xl md:text-2xl font-bold">We Serve</h3>
            </div>

            <ul className="list-disc list-inside space-y-4 text-base md:text-lg mx-auto max-w-2xl mb-10">
              <li className="list-item">End-to-end real estate consultancy for investors and homebuyers.</li>
              <li className="list-item">No hidden charges – full disclosure of pricing, layout, and specifications.</li>
              <li className="list-item">Land titles that are verified and legally acquired with proper documentation.</li>
            </ul>

            <div className="text-center">
              <button 
                onClick={() => setProjectsModalOpen(true)}
                className="projects-button bg-[#2D3748] text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-[#1A202C] transition-colors duration-300 transform hover:scale-105"
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
        className="fab-enquire fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-[#2D3748] text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-[#1A202C] hover:scale-110 transition-all duration-300 z-40"
        aria-label="Enquire Now"
      >
        <Phone size={28} />
      </button>

      {/* Render the Modals */}
      <EnquiryModal isOpen={isEnquiryModalOpen} onClose={() => setEnquiryModalOpen(false)} />
      <ProjectsModal isOpen={isProjectsModalOpen} onClose={() => setProjectsModalOpen(false)} />
    </>
  );
};

export default About;