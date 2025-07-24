// src/pages/EvergreenPage.jsx

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import bgVideo from '../../assets/mainbg.mp4'; // Adjust the path as necessary

// Import your other page components
import Header from './Header'; 
import RealEstatePage from './RealEstatePage';
import OngoingProjects from './OngoingProjects';
import About from './About';
import Footer from './Footer';
import ActionButtons from './ActionButtons';

// Register the GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const EvergreenPage = () => {
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const contentRef = useRef(null); // Ref for the main white content section

  useLayoutEffect(() => {
    // GSAP Context for safe animation cleanup
    const ctx = gsap.context(() => {

      // --- 1. Initial Cinematic Entrance Animation (plays once on load) ---
      const entranceTimeline = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 1.2 }
      });
      
      entranceTimeline
        .from('.hero-tag', { opacity: 0, y: 30, stagger: 0.1, })
        .from('.hero-title-line-inner', { yPercent: 120, skewY: 5, stagger: 0.15 }, "-=0.8")
        .from('.hero-description', { opacity: 0, y: 20 }, "-=0.6");

      // --- 2. Main High-Level Scroll Transition ---
      const mainScrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top top",
          end: "+=200%", // Give the animation plenty of scroll distance to feel smooth
          scrub: 1, // Smoothly links animation to scrollbar
          pin: heroRef.current, // Pins the hero section viewport
        }
      });

      // A) The white content section performs a "liquid wipe" over the hero
      mainScrollTimeline.fromTo(contentRef.current, 
        { 
          y: "100vh", // Start 100% of the viewport height down
          borderTopLeftRadius: "50vw", // Start with curved top corners
          borderTopRightRadius: "50vw",
        },
        { 
          y: "0vh", // End perfectly at the top
          borderTopLeftRadius: "0vw", // End with sharp corners
          borderTopRightRadius: "0vw",
          ease: "power2.inOut"
        },
        0 // Add to the beginning of the timeline
      );

      // B) The hero text recedes (scales down, fades, and blurs)
      mainScrollTimeline.to('.hero-content-container', {
        scale: 0.8,
        opacity: 0,
        filter: "blur(10px)", // Add a beautiful blur effect
        ease: 'power2.in'
      }, 0);

      // C) The background video continues a subtle zoom for immersion
      mainScrollTimeline.to('.background-video-container', {
        scale: 1.1,
        ease: 'none'
      }, 0);
      
      // --- 3. Dynamic Header Animation ---
      gsap.fromTo('.main-header', 
        { yPercent: -100, autoAlpha: 0 },
        {
          scrollTrigger: {
            trigger: mainRef.current,
            start: "top top",
            toggleActions: "play none none reverse",
          },
          yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out'
        }
      );

    }, mainRef);

    // Cleanup function
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="relative w-full font-sans bg-black">
      
      {/* Container for the background video which will be animated */}
      <div className="background-video-container absolute top-0 left-0 w-full h-screen">
        <video
          className="w-full h-full object-cover"
          src={bgVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
      </div>

      {/* The Header is positioned separately for independent animation */}
      <div className="main-header fixed top-0 left-0 w-full z-50 invisible">
         <Header />
      </div>

      {/* Hero Section Container (This will be pinned and its content animated) */}
      <div ref={heroRef} className="relative flex flex-col h-screen text-white">
        {/* Added a container here to specifically target hero content for animations */}
        <div className="hero-content-container flex-grow flex items-center px-4 sm:px-8 md:px-16">
            <div className="w-full flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="max-w-3xl">
                <div className="hero-tags-container flex space-x-3 mb-4">
                    <span className="hero-tag bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm">House</span>
                    <span className="hero-tag bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm">Apartment</span>
                    <span className="hero-tag bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm">Residential</span>
                </div>
                <div className="hero-title">
                    <div className="hero-title-line overflow-hidden">
                    <h2 className="hero-title-line-inner text-5xl sm:text-6xl md:text-7xl font-light leading-tight">Build Your Future, One</h2>
                    </div>
                    <div className="hero-title-line overflow-hidden">
                    <h2 className="hero-title-line-inner text-5xl sm:text-6xl md:text-7xl font-light leading-tight">Property at a Time.</h2>
                    </div>
                </div>
                </div>
                <div className="max-w-xs text-right text-gray-300 text-sm hidden lg:block">
                <p className="hero-description">Own Your World. One Property at a Time. Own Your World. One Property at a Time. Own Your World. One Property at a Time. Own Your World. One Property at a Time.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content (The white section that wipes over the hero) */}
      <div ref={contentRef} className="relative z-10 bg-white">
        <RealEstatePage />
        <OngoingProjects />
        <About />
        <ActionButtons /> 
        <Footer />
      </div>
    </div>
  );
};

export default EvergreenPage;