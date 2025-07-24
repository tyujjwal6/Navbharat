// src/components/RealEstatePage.jsx

import React, { useState, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import Shadcn/ui Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

// Import your image asset
import buildingFutureImage from '@/assets/buildingfuture.png';

// Register the GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// StatCard component improved to handle non-numeric values for animation.
const StatCard = ({ displayValue, numericValue, label }) => (
  <Card className="stat-card bg-[#FDE8D4] border-0 shadow-none text-center rounded-2xl">
    <CardContent className="flex flex-col justify-center items-center p-6 h-full">
      <p className="stat-value text-4xl md:text-5xl font-bold text-slate-800" data-numeric-value={numericValue}>
        {displayValue}
      </p>
      <p className="mt-2 text-base text-slate-600">{label}</p>
    </CardContent>
  </Card>
);

export default function RealEstatePage() {
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [isSearchSubmitting, setIsSearchSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnquirySubmitting, setIsEnquirySubmitting] = useState(false);
  const [enquiryData, setEnquiryData] = useState({ name: '', email: '', phone: '' });

  const mainRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // --- Intro Animations (Search Bar) ---
      gsap.from('.search-field', { opacity: 0, y: 50, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
      gsap.from('.search-button', { opacity: 0, scale: 0.8, duration: 0.8, delay: 0.6, ease: 'elastic.out(1, 0.75)' });

      // --- NEW: Text Slide-Up Reveal Animation for Main Paragraph ---
      gsap.from(".intro-paragraph-line", {
        scrollTrigger: {
          trigger: ".intro-paragraph",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        yPercent: 110,
        skewY: 7,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
      });
      
      // --- NEW: Section Wipe-In Transition for Stats Section ---
      gsap.from('.stats-section-container', {
        scrollTrigger: {
          trigger: '.stats-section-container',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        clipPath: 'inset(0 100% 0 0)', // Wipes in from the right
        duration: 1.2,
        ease: 'power3.inOut'
      });

      // Stat Cards Animation (triggered after the section wipe)
      gsap.from('.stat-card', {
        scrollTrigger: {
          trigger: '.stats-grid',
          start: 'top 80%',
        },
        opacity: 0, y: 50, scale: 0.95, stagger: 0.2, duration: 0.7, ease: 'back.out(1.4)',
        delay: 0.5 // Add a delay to let the wipe animation play first
      });

      // Number Counting Animation (Improved to handle non-numeric values)
      gsap.utils.toArray('.stat-value').forEach(el => {
        const endValue = parseInt(el.dataset.numericValue, 10);
        // Only animate if it's a valid number
        if (!isNaN(endValue)) {
          gsap.from(el, {
            textContent: 0,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          });
        }
      });

      // --- Building the Future Section ---

      // NEW: Parallax/Scrub Animation for the image
      gsap.to(".building-image", {
        scale: 1.1, // Zoom in slightly
        ease: 'none',
        scrollTrigger: {
          trigger: ".building-future-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1, // Ties the animation progress to the scrollbar
        }
      });

      // NEW: Text Slide-Up Reveal for the overlay text
      const overlayTextTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.building-future-section',
          start: 'top 60%',
          toggleActions: "play none none none",
        }
      });
      overlayTextTimeline.from('.overlay-text', {
        yPercent: 120,
        skewY: 5,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out'
      }).from('.enquire-button-reveal', {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: 'elastic.out(1, 0.75)'
      }, '-=0.5');


    }, mainRef);

    return () => ctx.revert();
  }, []);
  
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!budget || !location) {
      alert('Please select a budget and enter a location.');
      return;
    }
    setIsSearchSubmitting(true);
    setTimeout(() => {
      alert('Search submitted! Check the console.');
      setIsSearchSubmitting(false);
    }, 1500);
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setIsEnquirySubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Enquiry sent successfully! We will get in touch with you soon.');
      setIsEnquirySubmitting(false);
      setIsModalOpen(false);
      setEnquiryData({ name: '', email: '', phone: '' });
    } catch (error) {
      alert('Something went wrong. Please try again.');
      setIsEnquirySubmitting(false);
    }
  };

  const handleEnquiryInputChange = (e) => {
    const { name, value } = e.target;
    setEnquiryData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div ref={mainRef} className="bg-white min-h-screen w-full font-sans">
      <div className="bg-gray-50/50 border-b border-gray-200">
        <div className="container mx-auto px-4 pt-8 pb-6">
          <form onSubmit={handleSearchSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
              <div className="flex flex-col space-y-2 search-field">
                <Label htmlFor="propertyType" className="font-semibold text-green-700">Property Type</Label>
                <Input id="propertyType" type="text" placeholder="Plot, Villa, etc." value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="bg-white"/>
              </div>
              <div className="flex flex-col space-y-2 search-field">
                <Label className="font-semibold text-green-700">Budget</Label>
                <Select onValueChange={setBudget} value={budget}><SelectTrigger className="bg-white"><SelectValue placeholder="Select Budget" /></SelectTrigger><SelectContent><SelectItem value="<50L">Under ₹50 Lakh</SelectItem><SelectItem value="50L-1Cr">₹50 Lakh - ₹1 Crore</SelectItem><SelectItem value="1Cr-2Cr">₹1 Crore - ₹2 Crore</SelectItem><SelectItem value=">2Cr">Above ₹2 Crore</SelectItem></SelectContent></Select>
              </div>
              <div className="flex flex-col space-y-2 search-field">
                <Label htmlFor="location" className="font-semibold text-green-700">Location</Label>
                <Input id="location" type="text" placeholder="Enter Location" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-white"/>
              </div>
              <Button type="submit" disabled={isSearchSubmitting} className="w-full bg-green-600 hover:bg-green-700 lg:col-span-1 search-button">
                {isSearchSubmitting ? 'Searching...' : 'Search Properties'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <main className="container mx-auto px-4">
        <section className="text-center my-16 md:my-20 max-w-4xl mx-auto">
          {/* Add a container with overflow hidden for the text reveal effect */}
          <div className="intro-paragraph overflow-hidden">
             <p className="intro-paragraph-line text-xl md:text-2xl font-semibold text-slate-800 leading-relaxed">
              We at <span className="font-bold">NavBharat Niwas</span> 🏡 are proud to serve you with the best and most affordable plots and homes across India 🇮🇳. Whether you're looking for residential, commercial, or investment opportunities — we've got you covered! ✅ Our properties are government-verified, legally clear, and delivered with trust and transparency 🤝. Join hands with one of the top builders in India and take a confident step toward your dream home today! ✨
            </p>
          </div>
        </section>
        
        <section className="stats-section-container bg-gray-100/70 p-6 md:p-10 rounded-2xl mb-16">
          <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard displayValue="4+" numericValue="4" label="States Covered" />
            <StatCard displayValue="200+" numericValue="200" label="Trusted Clients" />
            <StatCard displayValue="25+" numericValue="25" label="Our Team" />
            <StatCard displayValue="7+" numericValue="7" label="Years Experience" />
          </div>

          <div className="building-future-section mt-12 relative rounded-2xl overflow-hidden group">
            <img src={buildingFutureImage} alt="Modern architecture representing the future" className="building-image w-full h-[400px] object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end items-center text-center p-8">
              {/* Add containers with overflow hidden for the text reveal effect */}
              <div className="overflow-hidden mb-4">
                  <h3 className="overlay-text text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">Building the Future of India</h3>
              </div>
              <div className="overflow-hidden mb-8">
                  <p className="overlay-text text-lg text-gray-200 drop-shadow-md max-w-2xl">Your dream property is just an enquiry away. Let's build together.</p>
              </div>
              
              <div className="enquire-button-reveal">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-white text-green-700 font-bold text-lg hover:bg-gray-200 transition-all duration-300 transform group-hover:scale-105">
                      Enquire Now →
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Enquire About a Property</DialogTitle>
                      <DialogDescription>Fill out the form below and one of our experts will contact you shortly.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEnquirySubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" name="name" value={enquiryData.name} onChange={handleEnquiryInputChange} className="col-span-3" required /></div>
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="email" className="text-right">Email</Label><Input id="email" name="email" type="email" value={enquiryData.email} onChange={handleEnquiryInputChange} className="col-span-3" required /></div>
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="phone" className="text-right">Phone</Label><Input id="phone" name="phone" type="tel" value={enquiryData.phone} onChange={handleEnquiryInputChange} className="col-span-3" required /></div>
                      </div>
                      <DialogFooter><Button type="submit" disabled={isEnquirySubmitting} className="w-full bg-green-600 hover:bg-green-700">{isEnquirySubmitting ? 'Submitting...' : 'Submit Enquiry'}</Button></DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}