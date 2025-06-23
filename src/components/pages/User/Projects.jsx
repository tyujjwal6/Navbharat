import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../baseurl/axiosInstance';
import PaymentRecipt from '../Admin/PaymentRecipt';

const Projects = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getdata = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/sites');
        console.log(res?.data?.data?.rows);
        setSites(res?.data?.data?.rows || []);
      } catch (err) {
        console.error('Error fetching sites:', err);
        setError('Failed to fetch sites data');
      } finally {
        setLoading(false);
      }
    };
    getdata();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-gray-600">Loading sites...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Projects</h1>
        <p className="text-gray-600">Total Sites: {sites.length}</p>
      </div>

      {sites.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No sites found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PaymentRecipt user={null}/>
          {sites.map((site) => (
            <div key={site.pro_id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Image */}
              {site.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={site.image}
                    alt={site.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full bg-gray-200 items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Image not available</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                <h3 className="text-xl font-semibold mb-1">{site.name}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(site.status)}`}>
                  {site.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Location */}
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{site.city}, {site.state}</span>
                </div>

                {/* Description */}
                {site.des && (
                  <p className="text-gray-700 text-sm line-clamp-2">{site.des}</p>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Units:</span>
                    <span className="ml-1 font-medium">{site.units}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Draw Charges:</span>
                    <span className="ml-1 font-medium">₹{site.draw_charges?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Plot Sizes */}
                {site.plot_sizes && site.plot_sizes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Plot Sizes:</h4>
                    <div className="flex flex-wrap gap-1">
                      {site.plot_sizes.map((size, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Plans */}
                {site.payment_plan && site.payment_plan.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Payment Plans:</h4>
                    <div className="flex flex-wrap gap-1">
                      {site.payment_plan.map((plan, index) => (
                        <span key={index} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                          {plan}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferences */}
                {site.prefer && site.prefer.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Preferences:</h4>
                    <div className="flex flex-wrap gap-1">
                      {site.prefer.map((pref, index) => (
                        <span key={index} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Created: {formatDate(site.created_at)}
                  </span>
                  {site.yout_link && (
                    <a
                      href={site.yout_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 text-xs font-medium flex items-center"
                    >
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Video
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;


