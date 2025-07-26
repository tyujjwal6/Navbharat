import React, { useState, useLayoutEffect, useRef, useEffect, useCallback } from 'react';
import { Check, X, Phone, ArrowLeft, ArrowRight, LoaderCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// --- Reusable Modal Component ---
const Modal = ({ isOpen, onClose, children, title }) => {
const modalRef = useRef(null);

useLayoutEffect(() => {
if (isOpen) {
document.body.style.overflow = 'hidden';
gsap.to(modalRef.current, {
opacity: 1,
scale: 1,
duration: 0.3,
ease: 'power3.inOut'
});
gsap.to('.modal-backdrop', { opacity: 1, duration: 0.3 });
} else {
document.body.style.overflow = 'auto';
}
}, [isOpen]);

const handleClose = () => {
gsap.to(modalRef.current, {
opacity: 0,
scale: 0.95,
duration: 0.2,
ease: 'power3.inOut',
onComplete: onClose
});
gsap.to('.modal-backdrop', { opacity: 0, duration: 0.2 });
};

if (!isOpen) return null;

return (
<div
className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/60 opacity-0"
onClick={handleClose}
>
<div
ref={modalRef}
className="relative w-11/12 max-w-lg scale-95 transform rounded-xl bg-white p-6 opacity-0 shadow-2xl"
onClick={(e) => e.stopPropagation()}
>
<div className="flex items-center justify-between border-b pb-3">
<h3 className="text-xl font-semibold text-gray-800">{title}</h3>
<button
onClick={handleClose}
className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800"
>
<X size={24} />
</button>
</div>
<div className="mt-4">{children}</div>
</div>
</div>
);
};

// --- Image Slider Component ---
const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };
    
    // Using useCallback to prevent re-creation of the function on every render
    const goToNext = useCallback(() => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    }, [images.length]);

    useEffect(() => {
        resetTimeout();
        // Set a timer to advance to the next slide
        timeoutRef.current = setTimeout(goToNext, 3000); // 3 seconds interval

        // Clean up the timeout when the component unmounts or currentIndex changes
        return () => {
            resetTimeout();
        };
    }, [currentIndex, goToNext]); // Re-run effect when slide changes

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div 
            className="relative h-full w-full overflow-hidden rounded-lg shadow-lg"
            // Pause slider on mouse enter
            onMouseEnter={resetTimeout}
            // Resume slider on mouse leave
            onMouseLeave={() => {
                timeoutRef.current = setTimeout(goToNext, 3000);
            }}
        >
            {/* Slides Container */}
            <div 
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((image, index) => (
                    <img key={index} src={image} alt={`Shamli development site ${index + 1}`} className="h-full w-full flex-shrink-0 object-cover" />
                ))}
            </div>

            {/* Navigation Arrows */}
            <button onClick={goToPrevious} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60">
                <ArrowLeft size={20} />
            </button>
            <button onClick={goToNext} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60">
                <ArrowRight size={20} />
            </button>

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                {images.map((_, slideIndex) => (
                    <button
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${
                            currentIndex === slideIndex ? 'w-4 bg-white' : 'bg-white/50'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};


// --- Main Page Component ---
const SmartCityShamli = () => {
const [isApplyModalOpen, setApplyModalOpen] = useState(false);
const [isContactModalOpen, setContactModalOpen] = useState(false);

// Form State
const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

const mainRef = useRef(null);
const contentRef = useRef(null);
const images = [
'./src/assets/shamli1.jpg', // Replace with actual paths to your images
'./src/assets/shamli2.jpg',
'./src/assets/shamli3.jpg'
];

// GSAP Animations
useLayoutEffect(() => {
const ctx = gsap.context(() => {
gsap.from(contentRef.current.children, {
opacity: 0,
y: 30,
duration: 0.6,
stagger: 0.1,
ease: 'power3.out',
scrollTrigger: {
trigger: contentRef.current,
start: 'top 80%',
toggleActions: 'play none none none',
}
});
}, mainRef);
return () => ctx.revert();
}, []);

const handleInputChange = (e) => {
const { name, value } = e.target;
setFormData(prev => ({ ...prev, [name]: value }));
};

const handleFormSubmit = async (e) => {
e.preventDefault();
setIsSubmitting(true);
setSubmitStatus(null);

// This is where you would integrate your backend API
console.log("Submitting form data:", formData);

try {
    // Hitting a dummy API for demonstration
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error('Network response was not ok.');
    
    const result = await response.json();
    console.log("API Response:", result);

    setSubmitStatus('success');
    setFormData({ name: '', phone: '', email: '' }); // Clear form
    setTimeout(() => setApplyModalOpen(false), 2000); // Close modal after 2s

} catch (error) {
    console.error("Submission failed:", error);
    setSubmitStatus('error');
} finally {
    setIsSubmitting(false);
}

};

return (
<div ref={mainRef} className="min-h-screen bg-gray-50 font-sans">
<div className="container mx-auto px-4 py-12 md:py-20">
<div className="mb-10 text-center">
<h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
Smart City Shamli
</h1>
<div className="mt-4 flex items-center justify-center gap-4">
<span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
ongoing
</span>
<span className="flex items-center gap-2 text-sm font-semibold text-blue-600">
<Check className="h-5 w-5 text-blue-500" />
lucky draw
</span>
</div>
</div>

<div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
      {/* Left Column: Image Slider */}
      <div className="lg:col-span-3 h-[300px] md:h-[500px]">
        <ImageSlider images={images} />
      </div>

      {/* Right Column: Text Content */}
      <div ref={contentRef} className="lg:col-span-2">
        <h2 className="text-lg font-bold text-gray-800">NavBharat Niwas Smart City Development Plan (NNSCDP)</h2>
        <p className="mb-4 text-lg font-semibold text-gray-600">नभभारत निवास स्मार्ट शहर विकास योजना</p>

        <h3 className="mt-6 text-2xl font-bold text-gray-900">Discover Your Dream Property in Shamli</h3>
        <p className="mt-2 text-gray-600 leading-relaxed">
            Welcome to Shamli, where your dream property awaits! Investing in land here offers you a world of benefits:
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <h4 className="font-bold text-gray-800">Improved Connectivity:</h4>
            <p className="text-gray-600">The development of national highways and better infrastructure has made Shamli more accessible, attracting investors and boosting the real estate market.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Job Creation:</h4>
            <p className="text-gray-600">The establishment of the textile park and other industrial projects is expected to create thousands of jobs, which in turn increases the demand for housing and commercial spaces.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Investment:</h4>
            <p className="text-gray-600">Significant investments have been made in the region, including a proposed investment of over ₹700 crore for industrial development. This influx of capital is driving the growth of the real estate sector.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Affordable Prices:</h4>
            <p className="text-gray-600">Land in Shamli is still affordable compared to big cities, making it a smart investment for the future.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Strategic Location:</h4>
            <p className="text-gray-600">Shamli is well-connected to major cities and highways, providing easy access to urban conveniences without the hustle and bustle.</p>
          </div>
           <div>
            <h4 className="font-bold text-gray-800">Textile Park Development:</h4>
            <p className="text-gray-600">Shamli is set to host its first private textile park under the Uttar Pradesh Textile and Garment Policy 2022. This park will bring significant investment, create over 5,000 jobs, and boost the local economy. It's a great opportunity for industrial growth and employment in the region.</p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => setApplyModalOpen(true)}
            className="w-full rounded-lg bg-blue-600 px-6 py-4 text-center text-lg font-bold text-white shadow-md transition-transform duration-200 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Apply for Luckydraw with ₹5,100 only.
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Floating Action Button */}
  <button 
    onClick={() => setContactModalOpen(true)}
    className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-white shadow-xl transition-transform hover:scale-110"
    aria-label="Contact Us"
  >
    <Phone size={28} />
  </button>

  {/* Modals */}
  <Modal isOpen={isApplyModalOpen} onClose={() => setApplyModalOpen(false)} title="Apply for Lucky Draw">
    {!submitStatus && (
        <form onSubmit={handleFormSubmit}>
            <p className="mb-4 text-sm text-gray-600">Fill in your details below to enter the lucky draw. Our team will contact you shortly.</p>
            <div className="space-y-4">
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required className="w-full rounded-md border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500" />
                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required className="w-full rounded-md border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500" />
                <input type="email" name="email" placeholder="Email Address (Optional)" value={formData.email} onChange={handleInputChange} className="w-full rounded-md border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={isSubmitting} className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">
                {isSubmitting ? <LoaderCircle className="mx-auto animate-spin" /> : 'Submit Application'}
            </button>
        </form>
    )}
    {submitStatus === 'success' && (
        <div className="text-center">
            <Check className="mx-auto h-16 w-16 rounded-full bg-green-100 p-2 text-green-600" />
            <h3 className="mt-4 text-xl font-semibold">Application Received!</h3>
            <p className="mt-2 text-gray-600">Thank you! We have received your application and will be in touch soon.</p>
        </div>
    )}
    {submitStatus === 'error' && (
        <div className="text-center">
            <X className="mx-auto h-16 w-16 rounded-full bg-red-100 p-2 text-red-600" />
            <h3 className="mt-4 text-xl font-semibold">Submission Failed</h3>
            <p className="mt-2 text-gray-600">Something went wrong. Please try again or contact us directly.</p>
            <button onClick={() => setSubmitStatus(null)} className="mt-4 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800">Try Again</button>
        </div>
    )}
  </Modal>

  <Modal isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)} title="Contact Us">
    <div className="space-y-3 text-gray-700">
        <p>For any inquiries, please reach out to us:</p>
        <p><strong>Phone:</strong> <a href="tel:+911234567890" className="text-blue-600 hover:underline">+91 12345 67890</a></p>
        <p><strong>Email:</strong> <a href="mailto:contact@navbharat.com" className="text-blue-600 hover:underline">contact@navbharat.com</a></p>
    </div>
  </Modal>
</div>
);
};

export default SmartCityShamli;