import React, { useState } from 'react';
import { Phone, Mail, Building2, MapPin, Instagram, Facebook, Youtube, X } from 'lucide-react';

// A reusable Modal component to be used for Contact Us, Location, etc.
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-lg relative text-slate-800" 
        onClick={e => e.stopPropagation()} // Prevents modal from closing when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-700">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 transition-colors">
            <X size={28} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

const Footer = () => {
    // A single state to manage which modal is currently open
    const [openModal, setOpenModal] = useState(null);

    // State for the contact form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    
    // State to handle API submission status (loading, success/error message)
    const [apiStatus, setApiStatus] = useState({ loading: false, message: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    // Handles form submission, including the dummy API call
    const handleContactSubmit = (e) => {
        e.preventDefault();
        setApiStatus({ loading: true, message: '' });
        
        console.log("Submitting form data:", formData);

        // Hitting a dummy API (JSONPlaceholder)
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
        .then(response => response.json())
        .then(json => {
            console.log("Dummy API Response:", json);
            setApiStatus({ loading: false, message: 'Thank you for your message! We will get back to you soon.' });
            // Reset form and close modal after a 3-second delay
            setTimeout(() => {
                setFormData({ name: '', email: '', message: '' });
                setOpenModal(null);
                setApiStatus({ loading: false, message: '' });
            }, 3000);
        })
        .catch(error => {
            console.error("API Error:", error);
            setApiStatus({ loading: false, message: 'Sorry, something went wrong. Please try again.' });
        });
    };
    
    // Renders the correct content inside the modal based on which one is open
    const renderModalContent = () => {
        switch(openModal) {
            case 'contact':
                return (
                    <form onSubmit={handleContactSubmit}>
                       <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-600">Full Name</label>
                                <input type="text" name="name" id="name" required value={formData.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" placeholder="John Doe" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-600">Email Address</label>
                                <input type="email" name="email" id="email" required value={formData.email} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-600">Message</label>
                                <textarea name="message" id="message" rows="4" required value={formData.message} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" placeholder="Your message here..."></textarea>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button type="submit" disabled={apiStatus.loading} className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-400 disabled:cursor-not-allowed">
                                {apiStatus.loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                        {apiStatus.message && <p className={`mt-4 text-center text-sm ${apiStatus.message.includes('Sorry') ? 'text-red-600' : 'text-green-600'}`}>{apiStatus.message}</p>}
                    </form>
                );
            case 'location':
                return (
                    <>
                        <p className="mb-4 text-slate-600">You can find our office at:</p>
                        <p className="font-semibold text-slate-800">Sector 63, Noida, Uttar Pradesh - 208003</p>
                        <div className="mt-4 rounded-lg overflow-hidden border border-slate-200">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.555899981302!2d77.38799891508207!3d28.61311038242557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce565a5aaaaab%3A0x256e29b13926f7c!2sSector%2063%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1678886432123!5m2!1sen!2sin" 
                                width="100%" height="300" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Office Location Map">
                            </iframe>
                        </div>
                    </>
                );
            case 'terms':
                return (
                    <div className="prose prose-slate max-w-none text-sm text-slate-600">
                        <h4>General Terms</h4>
                        <p>This is placeholder content for Terms and Conditions. Your actual terms would describe the rules and guidelines for using your service.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.</p>
                        <h4>User Responsibilities</h4>
                        <p>Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.</p>
                    </div>
                );
            case 'privacy':
                return (
                    <div className="prose prose-slate max-w-none text-sm text-slate-600">
                        <h4>Information We Collect</h4>
                        <p>This is placeholder content for the Privacy and Policy. It would detail how user data is collected, used, and protected.</p>
                        <p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.</p>
                        <h4>How We Use Your Data</h4>
                        <p>Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.</p>
                    </div>
                );
            default: return null;
        }
    };
    
    // Returns the correct title for the modal
    const getModalTitle = () => {
        switch(openModal) {
            case 'contact': return 'Contact Us';
            case 'location': return 'Our Office Location';
            case 'terms': return 'Terms and Conditions';
            case 'privacy': return 'Privacy and Policy';
            default: return '';
        }
    }

    return (
        <>
            <footer className="bg-[#2a3c4f] text-gray-200 font-sans relative py-12 sm:py-16 px-6 sm:px-8 lg:px-12">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    
                    {/* Column 1: Contact Info */}
                    <div className="space-y-6">
                        <img src="./src/assets/logo.png" alt="Nav Bharat Niwas Logo" className="w-48" />
                        <div className="space-y-4 text-base">
                            <p className="flex items-center space-x-2">
                                <Phone size={18} className="text-gray-400" />
                                <span><strong>Phone:</strong> <a href="tel:+919971488477" className="underline hover:no-underline hover:text-white transition-colors">+919971488477</a></span>
                            </p>
                            <p className="flex items-center space-x-2">
                                <Mail size={18} className="text-gray-400" />
                                <span><strong>Email:</strong> <a href="mailto:support@navbharatniwas.in" className="underline hover:no-underline hover:text-white transition-colors">support@navbharatniwas.in</a></span>
                            </p>
                            <p className="flex items-start space-x-2">
                                <Building2 size={18} className="mt-1 text-gray-400 flex-shrink-0" />
                                <span><strong>Address:</strong> Sector 63, Noida, Uttar Pradesh - 208003</span>
                            </p>
                        </div>
                        <div className="space-y-4 text-base">
                            <button onClick={() => setOpenModal('contact')} className="font-semibold underline hover:text-white transition-colors">
                                Contact Us
                            </button>
                            <p className="flex items-center space-x-2">
                                <MapPin size={18} className="text-gray-400" />
                                <span><strong>Office Location:</strong> <button onClick={() => setOpenModal('location')} className="ml-1 underline hover:no-underline hover:text-white transition-colors">Location</button></span>
                            </p>
                        </div>
                        <div className="space-y-3 text-base pt-4">
                            <p><strong>Account Number:</strong> 924020056702191</p>
                            <p><strong>IFSC Code:</strong> UTIB0001540</p>
                            <p><strong>Bank:</strong> Axis Bank</p>
                        </div>
                    </div>

                    {/* Column 2 & 3: Follow Us & Legal Links (Combined for better responsive flow) */}
                    <div className="md:col-span-1 lg:col-span-2">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white">Follow Us</h3>
                                <div className="space-y-3 text-base">
                                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 underline hover:no-underline hover:text-white transition-colors">
                                        <Instagram size={20} /> <span>Instagram</span>
                                    </a>
                                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 underline hover:no-underline hover:text-white transition-colors">
                                        <Facebook size={20} /> <span>Facebook</span>
                                    </a>
                                    <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 underline hover:no-underline hover:text-white transition-colors">
                                        <Youtube size={20} /> <span>YouTube</span>
                                    </a>
                                </div>
                            </div>

                            <div className="space-y-6 text-base">
                                {/* Invisible spacer to align with "Follow Us" on larger screens */}
                                <h3 className="text-xl font-bold opacity-0 hidden sm:block">Links</h3>
                                <div className="space-y-3">
                                    <button onClick={() => setOpenModal('terms')} className="block underline hover:no-underline hover:text-white transition-colors">Terms and Conditions</button>
                                    <button onClick={() => setOpenModal('privacy')} className="block underline hover:no-underline hover:text-white transition-colors">Privacy and Policy</button>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>

                {/* Floating Action Button */}
                <a href="tel:+919971488477" aria-label="Call us" className="fixed bottom-5 right-5 bg-gray-800 p-4 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-40">
                    <Phone size={24} className="text-white" />
                </a>
            </footer>

            {/* Modal Container to render the active modal */}
            <Modal isOpen={!!openModal} onClose={() => setOpenModal(null)} title={getModalTitle()}>
                {renderModalContent()}
            </Modal>
        </>
    );
};

export default Footer;