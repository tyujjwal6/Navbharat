// src/components/About.jsx

import React, { useState, useRef, useLayoutEffect } from 'react';
import { Phone, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Reveal from './Reveal';
import { EnquiryModal, ProjectsModal } from './Modals';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const [isEnquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [isProjectsModalOpen, setProjectsModalOpen] = useState(false);

  const mainRef = useRef(null);

  useLayoutEffect(() => {
    // GSAP context is the modern standard for managing animations in React components.
    // It automatically handles cleanup, preventing memory leaks.
    const ctx = gsap.context(() => {
      
      // matchMedia is the key to responsive GSAP animations.
      ScrollTrigger.matchMedia({

        // Using "(all)" is a powerful technique. It ensures that these
        // ScrollTrigger instances are properly killed and re-created on
        // ANY screen resize, making them robust. This is perfect for
        // animations that should run on all screen sizes.
        "(all)": function() {
          
          // Card Parallax Effect
          // Using `yPercent` is great for responsiveness as it's relative to the element's height.
          gsap.to('.about-card', {
            yPercent: -15, // Slightly increased for a more noticeable effect
            ease: 'none',
            scrollTrigger: {
              trigger: '.about-card-wrapper',
              start: 'top bottom', // Start when the top of the wrapper hits the bottom of the viewport
              end: 'bottom top',   // End when the bottom of the wrapper hits the top
              scrub: 1,            // A scrub value of 1 feels very connected to the scroll
            },
          });
    
          // Scroll-Aware Floating Action Button
          gsap.from('.fab-enquire', {
            scrollTrigger: {
              trigger: mainRef.current,
              start: 'top 40%', // Trigger earlier to ensure it's visible
              toggleActions: 'play none none reverse',
            },
            scale: 0,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.7)',
          });
        }
        
      });

    }, mainRef); // Scope the context to the main section

    // The context's cleanup function will be called automatically on unmount.
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={mainRef} className="bg-gray-100 py-16 sm:py-20 lg:py-24 overflow-x-hidden">
        {/* The wrapper is essential for the parallax trigger to work correctly */}
        <div className="about-card-wrapper max-w-4xl mx-auto px-4">
          <div className="about-card bg-[#fceded] text-[#3A3A3A] p-8 sm:p-10 lg:p-12 rounded-2xl shadow-xl">
            
            <div className="text-center mb-8">
              <Reveal>
                <h2 className="text-3xl md:text-4xl font-bold">About Us</h2>
              </Reveal>
              <Reveal>
                <div className="w-24 h-1 bg-gray-400 mx-auto mt-4 rounded-full"></div>
              </Reveal>
            </div>
            
            <Reveal>
              <p className="text-base md:text-lg leading-relaxed text-center mb-10">
                Nav Bharat Niwas is a trusted real estate company based in Noida, Uttar Pradesh, located in Sector 63 near the metro station. We specialize in providing premium land sales to help you secure valuable investments. Our team is dedicated to offering transparent, reliable, and affordable real estate solutions. Whether you are looking for residential or commercial land, we offer properties with high growth potential. Join us at Nav Bharat Niwas and take the first step towards building a secure future with prime land investments.
              </p>
            </Reveal>

            <div className="text-center my-8">
              <Reveal>
                <h3 className="text-xl md:text-2xl font-bold">We Serve</h3>
              </Reveal>
            </div>
            
            <ul className="space-y-4 text-base md:text-lg mx-auto max-w-2xl mb-12">
              <Reveal>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span>End-to-end real estate consultancy for investors and homebuyers.</span>
                </li>
              </Reveal>
              <Reveal>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span>No hidden charges – full disclosure of pricing, layout, and specifications.</span>
                </li>
              </Reveal>
              <Reveal>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <span>Land titles that are verified and legally acquired with proper documentation.</span>
                </li>
              </Reveal>
            </ul>

            <div className="text-center">
              <Reveal>
                <button 
                  onClick={() => setProjectsModalOpen(true)}
                  className="bg-[#2D3748] text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-[#1A202C] transition-colors duration-300 transform hover:scale-105"
                >
                  See Delivered and Upcoming projects
                </button>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button for Enquiry */}
      <button
        onClick={() => setEnquiryModalOpen(true)}
        className="fab-enquire fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-[#2D3748] text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-[#1A202C] hover:scale-110 transform-gpu z-40"
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