import React, { useState } from 'react';
import { Home, MapPin, Calendar, PartyPopper, Phone } from 'lucide-react';

// Import Modals
import EnquiryModal from './EnquiryModal';
// Image for Khatu Shyam Ji
import ongoing1 from '../../assets/ongoing1.jpg';
import ongoing2 from '../../assets/ongoing2.jpg';

// Dummy data array. This can be replaced with data fetched from an API.
const projects = [
  {
    id: 1,
    title: 'Smart City Shamli',
    image: ongoing1,
    units: 180,
    location: 'Shamli, Uttar Pradesh',
    tag: 'Lucky Draw',
    date: 'January 10, 2025',
  },
  {
    id: 2,
    title: 'Khatu Shyam Ji',
    image: ongoing2,
    units: 200,
    location: 'Sikar(Khatu Shyam ji), Rajasthan',
    tag: 'Lucky Draw',
    date: 'March 17, 2025',
  },
];

const ProjectCard = ({ project, onViewPortfolio }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col">
    <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-gray-800 mb-3">{project.title}</h3>
      <div className="space-y-3 text-gray-600 mb-4">
        <p className="flex items-center"><Home className="w-5 h-5 mr-2 text-red-400" /> {project.units} Units</p>
        <p className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-red-400" /> {project.location}</p>
        <div className="inline-flex items-center bg-teal-100 text-teal-800 text-sm font-semibold px-3 py-1 rounded-full my-2">
          <PartyPopper className="w-4 h-4 mr-2" />
          {project.tag}
        </div>
        <p className="flex items-center pt-1"><Calendar className="w-5 h-5 mr-2 text-gray-400" /> {project.date}</p>
      </div>
      <div className="mt-auto">
        <button
          onClick={() => onViewPortfolio(project)}
          className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          View Portfolio
        </button>
      </div>
    </div>
  </div>
);

const OngoingProjects = () => {
  const [isEnquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [isPortfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleViewPortfolio = (project) => {
    setSelectedProject(project);
    setPortfolioModalOpen(true);
  };

  return (
    <>
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 inline-block">
              Ongoing projects
            </h2>
            <div className="w-24 h-1 bg-teal-500 mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onViewPortfolio={handleViewPortfolio} />
            ))}
          </div>

          <div className="flex justify-center items-center mt-12 space-x-2">
            <button className="px-4 py-2 text-gray-500 bg-gray-300 rounded-md cursor-not-allowed">
              ← Prev
            </button>
            <button className="px-4 py-2 text-white bg-blue-500 rounded-md font-bold">
              1
            </button>
            <button className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
              Next →
            </button>
          </div>
        </div>
      </section>

      {/* Floating Action Button for Enquiry */}
      <button
        onClick={() => setEnquiryModalOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-gray-800 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-900 hover:scale-110 transition-all duration-300 z-40"
        aria-label="Enquire Now"
      >
        <Phone size={28} />
      </button>

      {/* Modals */}
      <EnquiryModal 
        isOpen={isEnquiryModalOpen} 
        onClose={() => setEnquiryModalOpen(false)} 
      />
      
    </>
  );
};

export default OngoingProjects;