// src/components/EnquiryModal.jsx
import { X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// This component expects `isOpen` and `onClose` props from its parent
const EnquiryModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
            className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-xl bg-[#282828] text-white"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-[#3e3e3e] hover:bg-[#505050] transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">Get a Call from Us</h2>
            </div>

            <form className="space-y-5">
              {/* Form Fields */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
                <input type="text" id="name" placeholder="Enter your name" className="w-full bg-[#3e3e3e] border border-[#505050] rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition" />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1.5">Phone Number</label>
                <input type="tel" id="phone" placeholder="Enter your phone number" className="w-full bg-[#3e3e3e] border border-[#505050] rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition" />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1.5">City</label>
                <input type="text" id="city" placeholder="Enter your city" className="w-full bg-[#3e3e3e] border border-[#505050] rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition" />
              </div>

              <div className="relative">
                <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-1.5">Budget</label>
                <select id="budget" className="w-full appearance-none bg-[#3e3e3e] border border-[#505050] rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition">
                  <option>Select your budget</option>
                  <option>Under $500k</option>
                  <option>$500k - $1M</option>
                  <option>$1M+</option>
                </select>
                <ChevronDown className="absolute right-3 top-10 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              
              {/* Checkbox */}
              <div className="flex items-start pt-2">
                <input id="authorize" type="checkbox" className="h-4 w-4 mt-0.5 rounded bg-zinc-700 border-zinc-600 text-green-500 focus:ring-green-500" />
                <label htmlFor="authorize" className="ml-3 text-xs text-gray-400">
                  I Authorize NavBharat Niwas to send notification via SMS/RCS/Email/WhatsApp.
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="w-full py-3 mt-4 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                SUBMIT
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EnquiryModal;