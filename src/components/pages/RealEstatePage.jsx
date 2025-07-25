// src/components/RealEstatePage.jsx

import React, { useState, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

// Import Shadcn/ui Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

// Import your image asset
import buildingFutureImage from '@/assets/buildingfuture.png';

gsap.registerPlugin(ScrollTrigger);

const StatCard = ({ displayValue, numericValue, label }) => (
  <Card className="stat-card bg-[#FDE8D4] border-0 shadow-none text-center rounded-2xl">
    <CardContent className="flex flex-col justify-center items-center p-6 h-full">
      <p 
        className="stat-value text-4xl md:text-5xl font-bold text-slate-800"
        data-numeric-value={numericValue}
        data-display-value={displayValue}
      >
        0
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
  const paragraphRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // --- 1. ENTRANCE & HEADER PARALLAX ---
      // This `scrub` animation naturally works in both directions.
      gsap.to('.hero-header', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: mainRef.current,
          start: 'top top',
          end: '+=500',
          scrub: 1.5,
        },
      });
      // This is a one-time entrance animation, so it doesn't need to reverse.
      gsap.from('.search-field, .search-button', {
        opacity: 0, y: 30, stagger: 0.1, duration: 0.8, ease: 'power3.out',
      });

      // --- 2. WORD-BY-WORD REVEAL ---
      // The `scrub` property ensures this animation is perfectly tied to the scrollbar,
      // animating forward as you scroll down and backward as you scroll up.
      const splitText = new SplitType(paragraphRef.current, { types: 'words' });
      gsap.set(splitText.words, { y: '100%', opacity: 0 });
      gsap.to(splitText.words, {
        y: '0%',
        opacity: 1,
        stagger: 0.05,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: paragraphRef.current,
          start: 'top 80%',
          end: 'bottom 80%',
          scrub: 1.5,
        },
      });
      
      // --- 3. STATISTICS SECTION: WIPE & NUMBER COUNT ---
      // This `scrub` animation also works in both directions automatically.
      gsap.from('.stats-section-container', {
        clipPath: 'inset(0 100% 0 0)',
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: '.stats-section-container',
          start: 'top 85%',
          end: 'top 50%',
          scrub: 1.5,
        },
      });

      // The `toggleActions: 'play none none reverse'` makes the cards
      // animate in when scrolling down and animate out when scrolling back up.
      gsap.from('.stat-card', {
          opacity: 0,
          y: 50,
          stagger: 0.2,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
              trigger: '.stats-grid',
              start: 'top 80%',
              toggleActions: 'play none none reverse',
          }
      });
      
      // <<< REFINED NUMBER COUNTER FOR BETTER REVERSE SCROLL EXPERIENCE
      gsap.utils.toArray('.stat-value').forEach(el => {
        const numericVal = parseInt(el.dataset.numericValue, 10);
        const displayVal = el.dataset.displayValue;
        const counter = { value: 0 };
        
        gsap.to(counter, {
          value: numericVal,
          duration: 2.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            // 'restart' will play the animation every time you enter from the top.
            // 'reset' will snap the number back to 0 when you scroll up past the start.
            // This feels much more natural than watching the number count down.
            toggleActions: 'restart none none reset',
          },
          onUpdate: () => {
            const suffix = displayVal.includes('+') ? '+' : '';
            el.textContent = Math.ceil(counter.value) + suffix;
          },
        });
      });

      // --- 4. "BUILDING THE FUTURE" PARALLAX & TEXT REVEAL ---
      // All animations in this section use `scrub`, so they are fully
      // interactive with both up and down scrolling by default.
      gsap.to(".building-image", {
        scale: 1.15, ease: 'none',
        scrollTrigger: {
          trigger: ".building-future-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      });

      const overlayTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.building-future-section',
          start: 'top 60%',
          end: 'top 20%',
          scrub: 1.5,
        }
      });
      gsap.set('.overlay-text', { y: '110%' });
      overlayTimeline
        .to('.overlay-text', { y: '0%', stagger: 0.1, ease: 'power3.out' })
        .from('.enquire-button-reveal', { opacity: 0, scale: 0.8, ease: 'elastic.out' }, '-=0.5');

    }, mainRef);

    // Cleanup function
    return () => ctx.revert();
  }, []);

  // Form Handlers (no changes needed)
  const handleSearchSubmit = async (e) => { e.preventDefault(); /* ... */ };
  const handleEnquirySubmit = async (e) => { e.preventDefault(); /* ... */ };
  const handleEnquiryInputChange = (e) => { const { name, value } = e.target; setEnquiryData(prev => ({ ...prev, [name]: value })); };

  return (
    <div ref={mainRef} className="bg-white min-h-screen w-full font-sans">
      <div className="hero-header bg-gray-50/50 border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 pt-8 pb-6">
          <form onSubmit={handleSearchSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
                <div className="flex flex-col space-y-2 search-field"><Label htmlFor="propertyType" className="font-semibold text-green-700">Property Type</Label><Input id="propertyType" type="text" placeholder="Plot, Villa, etc." value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="bg-white"/></div>
                <div className="flex flex-col space-y-2 search-field"><Label className="font-semibold text-green-700">Budget</Label><Select onValueChange={setBudget} value={budget}><SelectTrigger className="bg-white"><SelectValue placeholder="Select Budget" /></SelectTrigger><SelectContent><SelectItem value="<50L">Under ₹50 Lakh</SelectItem><SelectItem value="50L-1Cr">₹50 Lakh - ₹1 Crore</SelectItem><SelectItem value="1Cr-2Cr">₹1 Crore - ₹2 Crore</SelectItem><SelectItem value=">2Cr">Above ₹2 Crore</SelectItem></SelectContent></Select></div>
                <div className="flex flex-col space-y-2 search-field"><Label htmlFor="location" className="font-semibold text-green-700">Location</Label><Input id="location" type="text" placeholder="Enter Location" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-white"/></div>
                <Button type="submit" disabled={isSearchSubmitting} className="w-full bg-green-600 hover:bg-green-700 lg:col-span-1 search-button">{isSearchSubmitting ? 'Searching...' : 'Search Properties'}</Button>
            </div>
          </form>
        </div>
      </div>
      
      <main className="container mx-auto px-4">
        <section className="text-center my-20 md:my-28 max-w-4xl mx-auto">
          <div className="intro-paragraph-wrapper overflow-hidden">
            <p ref={paragraphRef} className="intro-paragraph-line text-xl md:text-2xl font-semibold text-slate-800 leading-relaxed">
              We at <span className="font-bold">NavBharat Niwas</span> 🏡 are proud to serve you with the best and most affordable plots and homes across India 🇮🇳. Whether you're looking for residential, commercial, or investment opportunities — we've got you covered! ✅ Our properties are government-verified, legally clear, and delivered with trust and transparency 🤝. Join hands with one of the top builders in India and take a confident step toward your dream home today! ✨
            </p>
          </div>
        </section>
        
        <section className="stats-section-container bg-gray-100/70 p-6 md:p-10 rounded-2xl mb-16 md:mb-24">
          <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard displayValue="4+" numericValue="4" label="States Covered" />
            <StatCard displayValue="200+" numericValue="200" label="Trusted Clients" />
            <StatCard displayValue="25+" numericValue="25" label="Our Team" />
            <StatCard displayValue="7+" numericValue="7" label="Years Experience" />
          </div>

          <div className="building-future-section mt-12 relative rounded-2xl overflow-hidden group">
            <img src={buildingFutureImage} alt="Modern architecture representing the future" className="building-image w-full h-[400px] object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end items-center text-center p-8">
              <div className="overflow-hidden mb-4"><h3 className="overlay-text text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">Building the Future of India</h3></div>
              <div className="overflow-hidden mb-8"><p className="overlay-text text-lg text-gray-200 drop-shadow-md max-w-2xl">Your dream property is just an enquiry away. Let's build together.</p></div>
              <div className="enquire-button-reveal">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}><DialogTrigger asChild><Button size="lg" className="bg-white text-green-700 font-bold text-lg hover:bg-gray-200 transition-all duration-300 transform group-hover:scale-105">Enquire Now →</Button></DialogTrigger><DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Enquire About a Property</DialogTitle><DialogDescription>Fill out the form below and one of our experts will contact you shortly.</DialogDescription></DialogHeader><form onSubmit={handleEnquirySubmit}><div className="grid gap-4 py-4"><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" name="name" value={enquiryData.name} onChange={handleEnquiryInputChange} className="col-span-3" required /></div><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="email" className="text-right">Email</Label><Input id="email" name="email" type="email" value={enquiryData.email} onChange={handleEnquiryInputChange} className="col-span-3" required /></div><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="phone" className="text-right">Phone</Label><Input id="phone" name="phone" type="tel" value={enquiryData.phone} onChange={handleEnquiryInputChange} className="col-span-3" required /></div></div><DialogFooter><Button type="submit" disabled={isEnquirySubmitting} className="w-full bg-green-600 hover:bg-green-700">{isEnquirySubmitting ? 'Submitting...' : 'Submit Enquiry'}</Button></DialogFooter></form></DialogContent></Dialog>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}