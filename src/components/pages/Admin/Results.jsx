import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, ChevronLeft, ChevronRight, Search, Filter, AlertCircle, Loader2 } from "lucide-react";
import AllotmentDialog from "./AllotmentDialog";
import WelcomeDialog from "./WelcomeDialog";
import { axiosInstance } from '../../baseurl/axiosInstance'; // Make sure this path is correct

// The mock user data has been removed. We will fetch data from the API.

export default function Results() {
  // --- STATE MANAGEMENT ---
  // Data state
  const [resultsData, setResultsData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Dialog states
  const [allotmentDialog, setAllotmentDialog] = React.useState({
    isOpen: false,
    user: null,
  });
  
  const [welcomeDialog, setWelcomeDialog] = React.useState({
    isOpen: false,
    user: null,
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dateFromFilter, setDateFromFilter] = React.useState("");
  const [dateToFilter, setDateToFilter] = React.useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(5);

  // --- API DATA FETCHING ---
  React.useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('/draft', {
          params: { alloted: true,allotment_done:false } // This is the key parameter to fetch only alloted users
        });

        // Map the API data structure to the component's expected structure
        const mappedData = response.data.data.rows.map(item => ({
          id: item.ticket_id,
          name: item.name,
          phone: item.phone,
          fatherName: item.father_name,
          address: item.address,
          dateOfOpening: item.opening_date,
          // Pass along other original data that might be needed by dialogs
          ...item 
        }));

        setResultsData(mappedData);
      } catch (err) {
        console.error("Failed to fetch results:", err);
        setError("Could not load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []); // Empty dependency array means this runs once on component mount

  // Filter and search logic
  const filteredUsers = React.useMemo(() => {
    return resultsData.filter((user) => {
      const matchesSearch = searchTerm === "" || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        (user.fatherName && user.fatherName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Corrected Date filter logic
      const userDate = user.dateOfOpening ? new Date(user.dateOfOpening) : null;
      if (!userDate) return matchesSearch; // If no date, only filter by search

      const fromDate = dateFromFilter ? new Date(dateFromFilter) : null;
      // To include the entire "to" day, we set the time to the end of the day.
      const toDate = dateToFilter ? new Date(dateToFilter + 'T23:59:59.999Z') : null;

      const matchesDateFilter = 
        (!fromDate || userDate >= fromDate) &&
        (!toDate || userDate <= toDate);

      return matchesSearch && matchesDateFilter;
    });
  }, [resultsData, searchTerm, dateFromFilter, dateToFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFromFilter, dateToFilter]);

  // Dialog functions
  const handleOpenAllotmentDialog = (user) => {
    setAllotmentDialog({ isOpen: true, user });
  };
  const handleCloseAllotmentDialog = () => {
    setAllotmentDialog({ isOpen: false, user: null });
  };
  const handleOpenWelcomeDialog = (user) => {
    setWelcomeDialog({ isOpen: true, user });
  };
  const handleCloseWelcomeDialog = () => {
    setWelcomeDialog({ isOpen: false, user: null });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateFromFilter("");
    setDateToFilter("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, ID, phone, etc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div>
              <Label htmlFor="dateFrom" className="text-sm font-medium mb-1 block">Date From</Label>
              <Input id="dateFrom" type="date" value={dateFromFilter} onChange={(e) => setDateFromFilter(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="dateTo" className="text-sm font-medium mb-1 block">Date To</Label>
              <Input id="dateTo" type="date" value={dateToFilter} onChange={(e) => setDateToFilter(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {resultsData.length} total results
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>Clear Filters</Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              {/* Table headers remain the same */}
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">User ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Father's Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Date of Opening</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-64">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Loading Results...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-red-500">
                    <div className="flex justify-center items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>{error}</span>
                    </div>
                  </td>
                </tr>
              ) : currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{user.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{user.fatherName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{user.address}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {formatDate(user.dateOfOpening)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleOpenAllotmentDialog(user)}>Allotment Letter</Button>
                      <Button size="sm" onClick={() => handleOpenWelcomeDialog(user)}>Welcome Letter</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No results found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({filteredUsers.length} total items)
            </div>
            <div className="flex items-center space-x-2">
               {/* Pagination controls remain the same */}
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs will work as before, now receiving API data */}
      <AllotmentDialog isOpen={allotmentDialog.isOpen} user={allotmentDialog.user} onClose={handleCloseAllotmentDialog} />
      <WelcomeDialog isOpen={welcomeDialog.isOpen} user={welcomeDialog.user} onClose={handleCloseWelcomeDialog} />
    </div>
  );
}