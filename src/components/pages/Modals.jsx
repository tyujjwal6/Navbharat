// src/components/Modals.jsx
import React from 'react';

// A generic modal wrapper
const ModalBase = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-lg relative text-slate-800" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-700">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 transition-colors">×</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

// Your Enquiry Modal
export const EnquiryModal = ({ isOpen, onClose }) => (
  <ModalBase isOpen={isOpen} onClose={onClose} title="Enquire Now">
    <p>This is where your enquiry form would go.</p>
    {/* You can put your form from previous examples here */}
  </ModalBase>
);

// The new Projects Modal
export const ProjectsModal = ({ isOpen, onClose }) => (
  <ModalBase isOpen={isOpen} onClose={onClose} title="Our Projects">
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-lg text-slate-800 mb-2">Delivered Projects</h4>
        <ul className="list-disc list-inside space-y-1 text-slate-600">
          <li>Green Valley, Phase 1 - Noida</li>
          <li>Sunrise Apartments - Greater Noida</li>
          <li>Commercial Hub - Sector 62</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-lg text-slate-800 mb-2">Upcoming Projects</h4>
        <ul className="list-disc list-inside space-y-1 text-slate-600">
          <li>Luxury Villas - Yamuna Expressway</li>
          <li>Smart City Plots - Jewar</li>
        </ul>
      </div>
    </div>
  </ModalBase>
);