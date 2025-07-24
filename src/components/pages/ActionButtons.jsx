import React, { useState } from 'react';
import { BookCopy, Gift, X } from 'lucide-react';

// A reusable Modal component for the lucky draw form
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-md relative text-slate-800" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-700 flex items-center gap-3">
            <Gift className="text-rose-500" />
            {title}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 transition-colors">
            <X size={28} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};


const ActionButtons = () => {
    // State to control the visibility of the lucky draw modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State to hold the form data
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });
    
    // State to manage the API submission process
    const [apiStatus, setApiStatus] = useState({ loading: false, message: '' });

    // Update form data state on input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle the form submission
    const handleLuckyDrawSubmit = (e) => {
        e.preventDefault();
        setApiStatus({ loading: true, message: '' });
        
        console.log("Submitting Lucky Draw data:", formData);

        // Dummy API call to simulate backend integration
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
            console.log("Dummy API Success:", data);
            setApiStatus({ loading: false, message: 'Congratulations! You have entered the lucky draw.' });
            
            // Close the modal and reset form after 3 seconds
            setTimeout(() => {
                setIsModalOpen(false);
                setFormData({ name: '', phone: '', email: '' });
                setApiStatus({ loading: false, message: '' });
            }, 3000);
        })
        .catch(error => {
            console.error("Dummy API Error:", error);
            setApiStatus({ loading: false, message: 'An error occurred. Please try again.' });
        });
    };

    return (
        <>
            {/* The main container for the buttons */}
            <div className="bg-white w-full py-12">
                <div className="container mx-auto flex flex-col items-center justify-center gap-6 px-4">
                    
                    {/* Read Our Blogs Button */}
                    <a
                        href="/blogs" // This would navigate to your blogs page in a real app
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-[#FDDCD1] text-[#59433D] text-lg font-semibold rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out"
                    >
                        <BookCopy size={22} />
                        <span>Read Our Blogs</span>
                    </a>

                    {/* Fill Lucky Draw Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-12 py-3 bg-[#2a3c4f] text-white text-lg font-semibold rounded-lg shadow-md hover:bg-[#37475a] transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out"
                    >
                        Fill Lucky Draw
                    </button>
                </div>
            </div>

            {/* Lucky Draw Modal */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title="Enter the Lucky Draw!"
            >
                <form onSubmit={handleLuckyDrawSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-600">Full Name</label>
                        <input type="text" name="name" id="name" required value={formData.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" placeholder="John Doe" />
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-600">Phone Number</label>
                        <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" placeholder="9876543210" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-600">Email Address</label>
                        <input type="email" name="email" id="email" required value={formData.email} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm" placeholder="you@example.com" />
                    </div>
                    <div className="pt-4">
                        <button type="submit" disabled={apiStatus.loading} className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:bg-rose-300 disabled:cursor-not-allowed transition-colors">
                            {apiStatus.loading ? 'Submitting...' : 'Enter Now'}
                        </button>
                    </div>
                    {apiStatus.message && (
                        <p className={`mt-4 text-center text-sm ${apiStatus.message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
                            {apiStatus.message}
                        </p>
                    )}
                </form>
            </Modal>
        </>
    );
};

export default ActionButtons;