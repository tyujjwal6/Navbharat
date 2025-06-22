import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, Check, X, ChevronLeft, ChevronRight, User, Phone, MapPin, FileText, Briefcase, Building, Filter } from 'lucide-react';
import { axiosInstance } from '../../baseurl/axiosInstance'; // Make sure this path is correct
import SimpleDialog from './PaymentRecipt';

// Helper component to display document images
const DocumentImage = ({ label, url }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" title="Click to view full image">
          <img 
            src={url} 
            alt={label} 
            className="w-full h-40 object-cover rounded-lg border border-gray-300 cursor-pointer hover:shadow-md transition-shadow"
          />
        </a>
      ) : (
        <div className="flex items-center justify-center h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-gray-500">
          Not Provided
        </div>
      )}
    </div>
);

const FilledForms = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allotmentValue, setAllotmentValue] = useState('');
  const [giftValue, setGiftValue] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/draft');
        const rawData = res.data.data.rows;
        
        const processedData = rawData.map(item => ({
          ...item,
          displayName: item.draft_type === 0 ? item.name : item.company_name,
          displayImage: item.draft_type === 0 ? item.profile_image : item.passport_photo,
          status: item.approved === 1 ? 'approved' : item.approved === 2 ? 'rejected' : 'pending',
          // The 'alloted' field will come from your API response for approved items
        }));
        setApplications(processedData);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      setAllotmentValue('');
      setGiftValue('');
    } else if (selectedApplication) {
      // Pre-fill fields if data already exists
      setAllotmentValue(selectedApplication.allot || '');
      setGiftValue(selectedApplication.gift || '');
    }
  }, [isModalOpen, selectedApplication]);


  const handleStatusUpdate = async (ticketId, newStatus) => {
    const statusValue = newStatus === 'approved' ? 1 : 2;
    
    try {
      await axiosInstance.put(`/draft/${ticketId}`, { approved: statusValue });
      
      setApplications(prevData =>
        prevData.map(app =>
          app.ticket_id === ticketId
            ? { ...app, status: newStatus }
            : app
        )
      );

      if (selectedApplication && selectedApplication.ticket_id === ticketId) {
        setIsModalOpen(false);
        setSelectedApplication(null);
      }
      console.log(`Successfully updated ticket ${ticketId} to status: ${newStatus}`);
    } catch (error) {
      console.error(`Failed to update status for ticket ${ticketId}:`, error);
      alert(`Error updating status for Ticket ID ${ticketId}. Please see the console for details.`);
    }
  };

  // --- MODIFIED: Handler for submitting allotment details ---
  const handlePassToResult = async (ticketId) => {
    if (!allotmentValue.trim() || !giftValue.trim()) {
      alert("Please fill in both 'Enter Allot' and 'Enter Gift' fields before proceeding.");
      return;
    }

    const payload = {
        alloted: true,
        allot: allotmentValue,
        gift: giftValue,
    };

    console.log("Submitting to /draft/", ticketId, "with payload:", payload);
    
    try {
      // The actual API call as per your request
      await axiosInstance.put(`/draft/${ticketId}`, payload);
      
      alert(`Successfully submitted allotment details for ticket ${ticketId}.`);

      // Update the local state to reflect the change immediately
      setApplications(prevData =>
        prevData.map(app =>
          app.ticket_id === ticketId
            ? { ...app, ...payload } // Merge the payload into the local app data
            : app
        )
      );
      
      // Close modal and reset state after successful submission
      setIsModalOpen(false);
      setSelectedApplication(null);

    } catch (error) {
      console.error(`Failed to submit allotment for ticket ${ticketId}:`, error);
      alert(`Error submitting allotment for ticket ${ticketId}. See console for details.`);
    }
  };


  const filteredData = useMemo(() => {
    return applications.filter(app => {
      const dateMatch = !selectedDate || (app.opening_date && new Date(app.opening_date).toISOString().split('T')[0] === selectedDate);
      
      const statusMatch = !selectedStatus || app.status === selectedStatus;
      
      const searchMatch = !searchTerm || (
        app.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(app.ticket_id).includes(searchTerm) || app.draw_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.phone && app.phone.includes(searchTerm)) ||
        app.status.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return dateMatch && statusMatch && searchMatch;
    });
  }, [applications, searchTerm, selectedDate, selectedStatus]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleRowClick = (app) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium capitalize";
    switch (status) {
      case 'pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'approved': return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected': return `${baseClasses} bg-red-100 text-red-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const ModalContent = () => {
    if (!selectedApplication) return null;
    const isIndividual = selectedApplication.draft_type === 0;

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Details */}
                <div className="space-y-6">
                    {isIndividual ? (
                        <>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center"><User className="w-5 h-5 mr-2" />Personal Information</h3>
                            <div className="space-y-3 text-sm">
                                <p><strong className="font-medium text-gray-600">Full Name:</strong> {selectedApplication.name}</p>
                                <p><strong className="font-medium text-gray-600">Father's Name:</strong> {selectedApplication.father_name}</p>
                                <p><strong className="font-medium text-gray-600">Occupation:</strong> {selectedApplication.occupation}</p>
                                <p><strong className="font-medium text-gray-600">Phone:</strong> {selectedApplication.phone}</p>
                                <p><strong className="font-medium text-gray-600">Address:</strong> {selectedApplication.address}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center"><Building className="w-5 h-5 mr-2" />Company Information</h3>
                             <div className="space-y-3 text-sm">
                                <p><strong className="font-medium text-gray-600">Company Name:</strong> {selectedApplication.company_name}</p>
                                <p><strong className="font-medium text-gray-600">Company Address:</strong> {selectedApplication.company_address}</p>
                                <p><strong className="font-medium text-gray-600">GST Number:</strong> {selectedApplication.gst_number}</p>
                                <p><strong className="font-medium text-gray-600">PAN Number:</strong> {selectedApplication.pan_number}</p>
                             </div>
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center"><User className="w-5 h-5 mr-2" />Authorized Signatory</h3>
                             <div className="space-y-3 text-sm">
                                <p><strong className="font-medium text-gray-600">Name:</strong> {selectedApplication.authorized_signatory}</p>
                                <p><strong className="font-medium text-gray-600">Address:</strong> {selectedApplication.authorized_signatory_address}</p>
                             </div>
                        </>
                    )}
                </div>
                {/* Right Column: Profile Picture */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{isIndividual ? "Profile Picture" : "Signatory Photo"}</h3>
                    <DocumentImage label="" url={selectedApplication.displayImage} />
                </div>
            </div>

            {/* Documents Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><FileText className="w-5 h-5 mr-2" />Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isIndividual ? (
                        <>
                            <DocumentImage label="Aadhar Card (Front)" url={selectedApplication.aadhar_front} />
                            <DocumentImage label="Aadhar Card (Back)" url={selectedApplication.aadhar_back} />
                            <DocumentImage label="PAN Card" url={selectedApplication.pan_photo} />
                        </>
                    ) : (
                        <>
                            <DocumentImage label="Company PAN" url={selectedApplication.pan_photo} />
                            <DocumentImage label="Passport Photo" url={selectedApplication.passport_photo} />
                            <div/>
                        </>
                    )}
                </div>
            </div>

            {/* --- MODIFIED: Action / Input Section with logic for alloted status --- */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              {selectedApplication.status === 'pending' && (
                  <div className="flex space-x-4">
                      <button onClick={() => handleStatusUpdate(selectedApplication.ticket_id, 'approved')} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <Check className="w-4 h-4 mr-2" />Approve
                      </button>
                      <button onClick={() => handleStatusUpdate(selectedApplication.ticket_id, 'rejected')} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          <X className="w-4 h-4 mr-2" />Reject
                      </button>
                  </div>
              )}
              
              {selectedApplication.status === 'approved' && !selectedApplication.alloted && (
                  <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Finalize Allotment</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                          <div className="md:col-span-1">
                              <label htmlFor="allot" className="block text-sm font-medium text-gray-700">Enter Allot</label>
                              <input
                                  type="text"
                                  id="allot"
                                  value={allotmentValue}
                                  onChange={(e) => setAllotmentValue(e.target.value)}
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  placeholder="e.g., Plot No. 123"
                              />
                          </div>
                          <div className="md:col-span-1">
                              <label htmlFor="gift" className="block text-sm font-medium text-gray-700">Enter Gift</label>
                              <input
                                  type="text"
                                  id="gift"
                                  value={giftValue}
                                  onChange={(e) => setGiftValue(e.target.value)}
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  placeholder="e.g., Gold Coin"
                              />
                          </div>
                          <div className="md:col-span-1">
                              <button
                                  onClick={() => handlePassToResult(selectedApplication.ticket_id)}
                                  className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                              >
                                  Submit Allotment
                              </button>
                          </div>
                      </div>
                  </div>
              )}

              {selectedApplication.status === 'approved' && selectedApplication.alloted && (
                 <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Allotment Details Submitted</h3>
                    <div className="space-y-3 text-sm p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p><strong className="font-medium text-gray-600">Allotment:</strong> {selectedApplication.allot}</p>
                        <p><strong className="font-medium text-gray-600">Gift:</strong> {selectedApplication.gift}</p>
                    </div>
                 </div>
              )}
            </div>
        </div>
    );
};

    const dialogRef = React.useRef();

// ... The rest of the component remains the same ...
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header with Search, Date Filter, and Status Filter */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Draw Forms Management</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search by name, ticket ID, phone, or status..." 
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                value={searchTerm} 
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} 
              />
            </div>
            <div className="relative">
              <input
                type="date"
                className="pr-10 pl-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {selectedDate && (
                <button 
                  onClick={() => setSelectedDate('')} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Clear date filter"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 appearance-none bg-white"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              {selectedStatus && (
                <button 
                  onClick={() => setSelectedStatus('')} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Clear status filter"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Draw Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opening Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Decision</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((app) => (
                <tr key={app.ticket_id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleRowClick(app)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.ticket_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{app.draw_name}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {app.opening_date ? new Date(app.opening_date).toLocaleDateString() : 'N/A'}
                </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.displayName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.phone || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={getStatusBadge(app.status)}>{app.status}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><Eye className="w-5 h-5" /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {app.status === 'pending' ? (
                      <div className="flex items-center space-x-2">
                        <button onClick={(e) => {e.stopPropagation(); handleStatusUpdate(app.ticket_id, 'approved');}} className="flex items-center justify-center px-2 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-xs" title="Approve"><Check className="w-3 h-3 mr-1" />Approve</button>
                        <button onClick={(e) => {e.stopPropagation(); handleStatusUpdate(app.ticket_id, 'rejected');}} className="flex items-center justify-center px-2 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-xs" title="Reject"><X className="w-3 h-3 mr-1" />Reject</button>
                      </div>
                    ) : (<span className="text-gray-500 text-xs italic capitalize">{app.status}</span>)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results</div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1 || totalPages === 0} className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-3 py-1 text-sm">Page {currentPage} of {totalPages > 0 ? totalPages : 1}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Application Details - TKT{selectedApplication.ticket_id} ({selectedApplication.draw_name})</h2>
                 <div>
       <button className='bg-blue-800 text-white p-2 rounded' onClick={() => dialogRef.current?.open()}>
        Send Payment Reciept
      </button>
       <SimpleDialog 
        ref={dialogRef} 
        data={selectedApplication}
      />
    </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>
            <ModalContent />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilledForms;