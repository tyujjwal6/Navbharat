import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';

// Import local components and assets
import EnquiryModal from './EnquiryModal';
import Khatushyamji1 from '../../assets/Khatushyamji1.jpg'; // Assuming this is the correct path from your example
import Khatushyamji2 from '../../assets/Khatushyamji2.jpg'; // Assuming this is the correct path from your example

// --- DUMMY DATA ---
// It's good practice to keep data separate
const projectData = {
name: "Khatu Shyam Ji",
images: [Khatushyamji1, Khatushyamji2], // Use an array for the gallery
status: "ongoing",
tag: "lucky draw",
planName: "NavBharat Niwas Smart City Development Plan (NNSCDP) - Khatu shyam ji, Phulera",
planNameHindi: "नवभारत ननवास स्माटण लसटी वकास योजना (NNSCDP) के तहत खाटू श्याम जी, राजस्थान!",
discoverTitle: "Discover Your Dream Property in Khatu Shyam ji",
description: [
"Navbharat Niwas – Premium Plots & Commercial Shops on Sikar Road Navbharat Niwas is a thoughtfully planned real estate development on Sikar Road, offering a perfect blend of residential and commercial opportunities. Designed for modern living and business growth, the project features well-laid-out plots for dream homes and strategically located commercial shops for thriving enterprises. With excellent connectivity, top-tier infrastructure, and a rapidly growing neighborhood, Navbharat Niwas is an ideal investment destination for homeowners and business owners alike.",
"The residential plots in Navbharat Niwas are designed to provide a peaceful and secure environment, making it the perfect place to build your dream home. With well-planned roads, green spaces, and essential amenities, the project ensures a comfortable and convenient lifestyle. The commercial shops, strategically positioned within the development, offer a prime business location with high visibility and foot traffic, making them ideal for retail stores, offices, or investment purposes.",
"Located in a fast-developing area, Navbharat Niwas enjoys seamless access to key locations, including schools, hospitals, shopping centers, and transportation hubs. The project is built with a vision for long-term growth, ensuring that property values appreciate over time, making it a smart choice for investors. With a commitment to quality, security, and sustainable urban planning, Navbharat Niwas presents itself as a destination where modern living and business success go hand in hand. Secure your plot or commercial space today and be part of this thriving community on Sikar Road."
],
};

const KhatuShyamJi = () => {
const [isModalOpen, setModalOpen] = useState(false);
const [currentImageIndex, setCurrentImageIndex] = useState(0);

const mainContentRef = useRef(null);
const sliderTimeoutRef = useRef(null); // Ref for slider timeout

// GSAP Animations on component mount
useEffect(() => {
const ctx = gsap.context(() => {
gsap.from('.gsap-fade-in', {
opacity: 0,
y: 30,
duration: 0.8,
stagger: 0.15,
ease: 'power3.out'
});
gsap.from('.fab-button', {
scale: 0,
rotation: -180,
duration: 1,
ease: 'elastic.out(1, 0.5)',
delay: 0.5
});
}, mainContentRef);

return () => ctx.revert(); // Cleanup GSAP animations
}, []);

const resetSliderTimeout = () => {
    if (sliderTimeoutRef.current) {
        clearTimeout(sliderTimeoutRef.current);
    }
};

const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % projectData.images.length);
}, []); // projectData.images.length is constant, so no dependency needed

const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + projectData.images.length) % projectData.images.length);
};

// Automatic image scrolling effect
useEffect(() => {
    resetSliderTimeout();
    sliderTimeoutRef.current = setTimeout(handleNextImage, 3500); // 3.5-second interval

    return () => {
        resetSliderTimeout();
    };
}, [currentImageIndex, handleNextImage]);


return (
<>
<Helmet>
<title>{`${projectData.name} Project | EverGreen Properties`}</title>
<meta name="description" content={`Details about our ongoing project at ${projectData.name}. Premium plots and commercial shops.`} />
</Helmet>

<main ref={mainContentRef} className="bg-white min-h-screen font-sans">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        
        {/* Left Column: Image Gallery */}
        <div 
            className="relative gsap-fade-in"
            onMouseEnter={resetSliderTimeout}
            onMouseLeave={() => {
                sliderTimeoutRef.current = setTimeout(handleNextImage, 3500);
            }}
        >
          <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg shadow-2xl">
            <div 
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
                {projectData.images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`${projectData.name} site view ${index + 1}`}
                        className="h-full w-full flex-shrink-0 object-cover"
                    />
                ))}
            </div>
          </div>
          {projectData.images.length > 1 && (
            <>
              <button onClick={handlePrevImage} className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-all duration-300 focus:outline-none" aria-label="Previous Image">
                <ChevronLeft size={24} />
              </button>
              <button onClick={handleNextImage} className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-all duration-300 focus:outline-none" aria-label="Next Image">
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                {projectData.images.map((_, slideIndex) => (
                    <button
                        key={slideIndex}
                        onClick={() => setCurrentImageIndex(slideIndex)}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${
                            currentImageIndex === slideIndex ? 'w-4 bg-white' : 'bg-white/50'
                        }`}
                    />
                ))}
            </div>
            </>
          )}
        </div>

        {/* Right Column: Project Details */}
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 gsap-fade-in">{projectData.name}</h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-3 my-5 gsap-fade-in">
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">{projectData.status}</span>
            <span className="flex items-center gap-2 text-green-600 font-semibold">
              <CheckCircle2 size={18} />
              {projectData.tag}
            </span>
          </div>
          
          <div className="space-y-6 text-gray-800">
            <div className="gsap-fade-in">
              <h2 className="text-lg font-bold text-gray-900">{projectData.planName}</h2>
              <p className="text-lg font-semibold mt-1">{projectData.planNameHindi}</p>
            </div>
            
            <div className="gsap-fade-in">
              <h3 className="text-xl font-bold text-gray-900">{projectData.discoverTitle}</h3>
            </div>
            
            {projectData.description.map((paragraph, index) => (
              <p key={index} className="text-base text-gray-700 leading-relaxed gsap-fade-in">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  </main>

  {/* Floating Action Button for Enquiry */}
  <button
    onClick={() => setModalOpen(true)}
    className="fab-button fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-gray-800 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-900 hover:scale-110 transition-all duration-300 z-40"
    aria-label="Enquire Now"
  >
    <Phone size={28} />
  </button>

  {/* The Modal */}
  <EnquiryModal 
    isOpen={isModalOpen} 
    onClose={() => setModalOpen(false)} 
    projectName={projectData.name}
  />
</>
);
};

export default KhatuShyamJi;