import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Eye, 
  User, 
  MapPin, 
  Phone, 
  Building,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Briefcase,
  Cake,
  Globe,
  Image,
  Calendar,
  ClipboardList,
} from 'lucide-react';
import { axiosInstance } from '../../baseurl/axiosInstance';

// Helper component for displaying a label and value in the details dialog
const DetailItem = ({ label, value, isMono = false }) => (
  <div>
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <p className={`text-sm ${isMono ? 'font-mono' : ''}`}>{value || 'N/A'}</p>
  </div>
);

// Helper component to display document images
const DocumentImage = ({ label, url }) => (
    <div>
      <label className="text-sm font-medium text-gray-600 block mb-2">{label}</label>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" title="Click to view full image">
          <img 
            src={url} 
            alt={label} 
            className="rounded-lg border border-gray-200 w-full h-auto max-w-xs object-cover cursor-pointer hover:shadow-lg transition-shadow duration-300" 
          />
        </a>
      ) : (
        <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <div className='text-center text-gray-500'>
                <Image className="h-6 w-6 mx-auto mb-1" />
                <p className="text-sm">Not provided</p>
            </div>
        </div>
      )}
    </div>
  );

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const StatusBadge = ({ status }) => {
  const colorMap = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200'
  };
  
  return (
    <Badge className={`${colorMap[status]} border`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const ProjectInfoCard = ({ application }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg"><MapPin className="h-5 w-5" />Project Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <DetailItem label="Ticket ID" value={application.ticket_id} isMono />
      <DetailItem label="Project" value={application.project} />
      <DetailItem label="Draw Name" value={application.draw_name} />
      <DetailItem label="Opening Date" value={formatDate(application.opening_date)} />
      <DetailItem label="Plot Size" value={application.plot_size} />
      <DetailItem label="Payment Plan" value={application.payment_plan} />
      <DetailItem label="Preference" value={application.prefer} />
      <div>
        <label className="text-sm font-medium text-gray-600">Status</label>
        <StatusBadge status={application.status} />
      </div>
    </CardContent>
  </Card>
);

const IndividualDetails = ({ user }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5" />Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailItem label="Full Name" value={user.name} />
        <DetailItem label="Father's Name" value={user.father_name} />
        <DetailItem label="Date of Birth" value={new Date(user.dob).toLocaleDateString()} icon={Cake} />
        <DetailItem label="Occupation" value={user.occupation} icon={Briefcase} />
        <DetailItem label="Nationality" value={user.nationality} icon={Globe} />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><Phone className="h-5 w-5" />Contact & ID</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailItem label="Phone Number" value={user.phone} />
        <DetailItem label="Address" value={user.address} />
        <DetailItem label="Aadhar Number" value={user.aadhar} isMono />
        <DetailItem label="PAN Card" value={user.pan} isMono />
      </CardContent>
    </Card>
    <ProjectInfoCard application={user} />
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5" />Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DocumentImage label="Aadhar Front" url={user.aadhar_front} />
        <DocumentImage label="Aadhar Back" url={user.aadhar_back} />
        <DocumentImage label="PAN Card Photo" url={user.pan_photo} />
      </CardContent>
    </Card>
  </div>
);

const EOIDetails = ({ eoi }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><ClipboardList className="h-5 w-5" />EOI Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailItem label="Full Name" value={eoi.name} />
        <DetailItem label="Father's Name" value={eoi.father_name} />
        <DetailItem label="Date of Birth" value={new Date(eoi.dob).toLocaleDateString()} icon={Cake} />
        <DetailItem label="Occupation" value={eoi.occupation} icon={Briefcase} />
        <DetailItem label="Nationality" value={eoi.nationality} icon={Globe} />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><Phone className="h-5 w-5" />Contact & ID</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailItem label="Phone Number" value={eoi.phone} />
        <DetailItem label="Address" value={eoi.address} />
        <DetailItem label="Aadhar Number" value={eoi.aadhar} isMono />
        <DetailItem label="PAN Card" value={eoi.pan} isMono />
      </CardContent>
    </Card>
    <ProjectInfoCard application={eoi} />
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5" />Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DocumentImage label="Aadhar Front" url={eoi.aadhar_front} />
        <DocumentImage label="Aadhar Back" url={eoi.aadhar_back} />
        <DocumentImage label="PAN Card Photo" url={eoi.pan_photo} />
      </CardContent>
    </Card>
  </div>
);

const CompanyDetails = ({ company }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><Building className="h-5 w-5" />Company Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailItem label="Company Name" value={company.company_name} />
        <DetailItem label="Company Address" value={company.company_address} />
        <DetailItem label="GST Number" value={company.gst_number} isMono />
        <DetailItem label="PAN Number" value={company.pan_number} isMono />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5" />Authorized Signatory</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailItem label="Signatory Name" value={company.authorized_signatory} />
        <DetailItem label="Signatory Address" value={company.authorized_signatory_address} />
      </CardContent>
    </Card>
    <ProjectInfoCard application={company} />
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><FileText className="h-5 w-5" />Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DocumentImage label="Signatory Passport Photo" url={company.passport_photo} />
        <DocumentImage label="Company PAN Photo" url={company.pan_photo} />
      </CardContent>
    </Card>
  </div>
);

const ApplicationDetailsDialog = ({ application }) => {
  const isIndividual = application.draft_type === 0;
  const isCompany = application.draft_type === 1;
  const isEOI = application.draft_type === 3;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <Eye className="h-4 w-4 text-gray-600" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={application.displayImage} alt={application.displayName} />
              <AvatarFallback>{application.displayName?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            Application Details - {application.displayName}
          </DialogTitle>
        </DialogHeader>
        
        {isIndividual && <IndividualDetails user={application} />}
        {isCompany && <CompanyDetails company={application} />}
        {isEOI && <EOIDetails eoi={application} />}
      </DialogContent>
    </Dialog>
  );
};

const MyApplication = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const userdata = JSON.parse(localStorage.getItem("userdata"));

  useEffect(() => {
    const getdata = async () => {
      try {
        const res = await axiosInstance.get('/draft', {
          params: { user_id: userdata?.user_id }
        });
        const rawData = res.data.data.rows;

        // Standardize data for easier use in the component
        const processedData = rawData.map(item => {
          const isIndividual = item.draft_type === 0;
          const isCompany = item.draft_type === 1;
          const isEOI = item.draft_type === 3;
          
          let type, displayName, displayImage;
          
          if (isIndividual) {
            type = 'Individual';
            displayName = item.name;
            displayImage = item.profile_image;
          } else if (isCompany) {
            type = 'Company';
            displayName = item.company_name;
            displayImage = item.passport_photo;
          } else if (isEOI) {
            type = 'EOI';
            displayName = item.name;
            displayImage = item.profile_image;
          }
          
          return {
            ...item,
            id: item.ticket_id,
            type,
            displayName,
            displayImage,
            status: item.approved ? 'approved' : 'pending',
          };
        });

        setApplications(processedData);
      } catch (error) {
        console.error("Failed to fetch draft applications:", error);
      }
    };
    getdata();
  }, []);

  const projects = useMemo(() => [...new Set(applications.map(app => app.project))], [applications]);
  const types = useMemo(() => [...new Set(applications.map(app => app.type))], [applications]);

  // Helper function to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.toDateString() === d2.toDateString();
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = app.displayName.toLowerCase().includes(searchTermLower) ||
                           String(app.ticket_id).toLowerCase().includes(searchTermLower) ||
                           app.project.toLowerCase().includes(searchTermLower) ||
                           (app.draw_name && app.draw_name.toLowerCase().includes(searchTermLower));
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesProject = projectFilter === 'all' || app.project === projectFilter;
      const matchesType = typeFilter === 'all' || app.type === typeFilter;
      const matchesDate = !selectedDate || isSameDay(app.opening_date, selectedDate);
      
      return matchesSearch && matchesStatus && matchesProject && matchesType && matchesDate;
    });
  }, [searchTerm, statusFilter, projectFilter, typeFilter, selectedDate, applications]);

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, projectFilter, typeFilter, selectedDate]);

  return (
    <div className="w-full space-y-4 p-6 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Application Management</h1>
        
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, ticket ID, project, or draw name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project} value={project}>{project}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
                placeholder="Select date"
              />
              {selectedDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDate('')}
                  className="px-2"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Showing {paginatedApplications.length} of {filteredApplications.length} applications
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Draw Name</TableHead>
              <TableHead>Opening Date</TableHead>
              <TableHead>Payment Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplications.map((app) => (
              <TableRow key={app.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={app.displayImage} alt={app.displayName} />
                      <AvatarFallback>{app.displayName?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{app.displayName}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{app.ticket_id}</TableCell>
                <TableCell>
                  <Badge variant={app.type === 'EOI' ? 'default' : 'outline'} className={app.type === 'EOI' ? 'bg-blue-100 text-blue-800' : ''}>
                    {app.type}
                  </Badge>
                </TableCell>
                <TableCell>{app.project}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {app.draw_name || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    {formatDate(app.opening_date)}
                  </div>
                </TableCell>
                <TableCell>{app.payment_plan}</TableCell>
                <TableCell>
                  <StatusBadge status={app.status} />
                </TableCell>
                <TableCell>
                  <ApplicationDetailsDialog application={app} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplication;