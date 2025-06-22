import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calendar, CheckCircle, Clock, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { CreateDraw } from './CreateDraw';
import { axiosInstance } from '../../baseurl/axiosInstance';

const DrawForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState({});
  const itemsPerPage = 5;

  // Get current date
  const currentDate = new Date();
  
  // Function to determine status based on opening date and active status
  const getStatus = (openingDate, active) => {
    const drawDate = new Date(openingDate);
    if (!active) return 'Inactive';
    return drawDate <= currentDate ? 'Draw Done' : 'Yet to Come';
  };

  // Fetch data from API
  const fetchDraws = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/draw");
      setForms(res.data.data.rows || []);
    } catch (error) {
      console.error('Error fetching draws:', error);
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete draw function
  const handleDelete = async (drawId) => {
    if (!window.confirm('Are you sure you want to delete this draw?')) {
      return;
    }

    try {
      setDeleteLoading(prev => ({ ...prev, [drawId]: true }));
      await axiosInstance.delete(`/draw/${drawId}`);
      
      // Remove the deleted item from the forms array
      setForms(prevForms => prevForms.filter(form => form.draw_id !== drawId));
      
      // Show success message (you can replace this with your preferred notification system)
      alert('Draw deleted successfully!');
    } catch (error) {
      console.error('Error deleting draw:', error);
      alert('Failed to delete draw. Please try again.');
    } finally {
      setDeleteLoading(prev => ({ ...prev, [drawId]: false }));
    }
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  // Filter forms based on search term
  const filteredForms = useMemo(() => {
    return forms.filter(form =>
      form.draw_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.opening_date.includes(searchTerm) ||
      getStatus(form.opening_date, form.active).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [forms, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentForms = filteredForms.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    if (status === 'Draw Done') return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === 'Yet to Come') return <Clock className="w-4 h-4 text-orange-600" />;
    return <Clock className="w-4 h-4 text-gray-600" />;
  };

  const getStatusColor = (status) => {
    if (status === 'Draw Done') return 'bg-green-100 text-green-800';
    if (status === 'Yet to Come') return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="w-full mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading draws...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="mb-2">
        <CreateDraw onDrawCreated={fetchDraws} />   
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Draw Forms Management</h1>
        <p className="text-gray-600">Manage and track all draw forms with their opening dates and current status</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by form name, date, or status..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Form Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Opening Date
                  </div>
                </th>
                {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th> */}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentForms.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Search className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No forms found</p>
                      <p>Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentForms.map((form, index) => {
                  const status = getStatus(form.opening_date, form.active);
                  return (
                    <tr key={form.draw_id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{form.draw_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(form.opening_date)}</div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                          <span className="ml-2">{status}</span>
                        </div>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(form.draw_id)}
                          disabled={deleteLoading[form.draw_id]}
                          className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {deleteLoading[form.draw_id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          <span className="ml-1">
                            {deleteLoading[form.draw_id] ? 'Deleting...' : 'Delete'}
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredForms.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredForms.length)} of {filteredForms.length} results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Forms</p>
              <p className="text-2xl font-bold text-blue-900">{forms.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Draws Done</p>
              <p className="text-2xl font-bold text-green-900">
                {forms.filter(form => getStatus(form.opening_date, form.active) === 'Draw Done').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600">Upcoming</p>
              <p className="text-2xl font-bold text-orange-900">
                {forms.filter(form => getStatus(form.opening_date, form.active) === 'Yet to Come').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-900">
                {forms.filter(form => getStatus(form.opening_date, form.active) === 'Inactive').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawForms;