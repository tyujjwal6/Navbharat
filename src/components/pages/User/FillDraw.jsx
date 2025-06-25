import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Building2, Upload, Camera, CreditCard, MapPin, Phone, Calendar, FileText, UserCheck, Briefcase, AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import { axiosInstance } from '../../baseurl/axiosInstance';

export default function FillDraw() {
  // --- Dynamic Data State ---
  const [projects, setProjects] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [initialDataLoading, setInitialDataLoading] = useState(true);

  // --- Individual Form State ---
  const [individualForm, setIndividualForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    occupation: '',
    fatherName: '',
    aadharNumber: '',
    panNumber: '',
    dob: '',
    nationality: '',
    advisor: '', // Will hold advisor ID
    projectSelection: '',
    paymentPlan: '',
    plotSize: '',
    preferences: '',
    aadharFront: null,
    aadharBack: null,
    panPhoto: null,
    profilePhoto: null
  });

  // --- Company Form State ---
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    authorizedSignatory: '',
    gstNumber: '',
    panNumber: '',
    companyAddress: '',
    authorizedSignatoryAddress: '',
    advisor: '', // Will hold advisor ID
    project: '',
    paymentPlan: '',
    plotSize: '',
    preference: '',
    panPhoto: null,
    passportPhoto: null
  });

  // --- EOI Form State (New) ---
  const [eoiForm, setEoiForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    occupation: '',
    fatherName: '',
    aadharNumber: '',
    panNumber: '',
    dob: '',
    nationality: '',
    advisor: '', // Will hold advisor ID
    projectSelection: '',
    paymentPlan: '',
    plotSize: '',
    preferences: '',
    aadharFront: null,
    aadharBack: null,
    panPhoto: null,
    profilePhoto: null
  });

  // --- API State Management ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [drawid,setdrawid]=useState(null);

  // --- Fetch Initial Data on Component Mount ---
  useEffect(() => {
    const fetchInitialData = async () => {
      setInitialDataLoading(true);
      setError(null);
      try {
        const ress = await axiosInstance.get('/draw');
        setdrawid(ress?.data?.data?.rows[ress?.data?.data?.rows?.length-1].draw_id)
        const [projectsResponse, advisorsResponse] = await Promise.all([
          axiosInstance.get('/sites'),
          axiosInstance.get('/adv')
        ]);


        const projectsResult = projectsResponse.data.data.rows;
        const advisorsResult = advisorsResponse.data.data.rows;

        setProjects(projectsResult || []);
        setAdvisors(advisorsResult || []);

      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load required data. Please refresh the page.');
        setProjects([]);
        setAdvisors([]);
      } finally {
        setInitialDataLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // --- Helper to get project name based on form type ---
  const getProjectName = (formType) => {
    if (formType === 'individual') return individualForm.projectSelection;
    if (formType === 'company') return companyForm.project;
    if (formType === 'eoi') return eoiForm.projectSelection;
    return null;
  }

  // --- Get Dynamic Data Based on Selected Project ---
  const getProjectData = (projectName) => {
    return projects.find(project => project.name === projectName) || null;
  };

  const getPaymentPlans = (formType) => {
    const projectName = getProjectName(formType);
    const project = getProjectData(projectName);
    return project ? project.payment_plan || [] : [];
  };

  const getPlotSizes = (formType) => {
    const projectName = getProjectName(formType);
    const project = getProjectData(projectName);
    return project ? project.plot_sizes || [] : [];
  };

  const getPreferences = (formType) => {
    const projectName = getProjectName(formType);
    const project = getProjectData(projectName);
    return project ? project.prefer || [] : [];
  };

  const getDrawCharges = (formType) => {
    const projectName = getProjectName(formType);
    const project = getProjectData(projectName);
    return project ? project.draw_charges || 5100 : 5100;
  };

  // --- Event Handlers ---

  const handleFileUpload = (file, formType, fieldName) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        if (formType === 'individual') {
          setIndividualForm(prev => ({ ...prev, [fieldName]: base64 }));
        } else if (formType === 'company') {
          setCompanyForm(prev => ({ ...prev, [fieldName]: base64 }));
        } else if (formType === 'eoi') {
          setEoiForm(prev => ({ ...prev, [fieldName]: base64 }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileRemove = (formType, fieldName) => {
    if (formType === 'individual') {
        setIndividualForm(prev => ({ ...prev, [fieldName]: null }));
    } else if (formType === 'company') {
        setCompanyForm(prev => ({ ...prev, [fieldName]: null }));
    } else if (formType === 'eoi') {
        setEoiForm(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleInputChange = (value, fieldName, formType) => {
    setError(null);
    setSuccess(null);
    
    if (formType === 'individual') {
      setIndividualForm(prev => {
        const newForm = { ...prev, [fieldName]: value };
        if (fieldName === 'projectSelection') {
          newForm.paymentPlan = '';
          newForm.plotSize = '';
          newForm.preferences = '';
        }
        return newForm;
      });
    } else if (formType === 'company') {
      setCompanyForm(prev => {
        const newForm = { ...prev, [fieldName]: value };
        if (fieldName === 'project') {
          newForm.paymentPlan = '';
          newForm.plotSize = '';
          newForm.preference = '';
        }
        return newForm;
      });
    } else if (formType === 'eoi') {
      setEoiForm(prev => {
        const newForm = { ...prev, [fieldName]: value };
        if (fieldName === 'projectSelection') {
          newForm.paymentPlan = '';
          newForm.plotSize = '';
          newForm.preferences = '';
        }
        return newForm;
      });
    }
  };
  const userdata = JSON.parse(localStorage.getItem("userdata"));

  // --- API Submission Handlers ---

  const handleIndividualSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      user_id:userdata?.user_id,
      draft_type: 0,
      advance:getDrawCharges('individual').toLocaleString(),
      draw_id:drawid,
      email:individualForm?.email,
      name: individualForm.name,
      phone: individualForm.phone,
      address: individualForm.address,
      occupation: individualForm.occupation,
      father_name: individualForm.fatherName,
      aadhar: individualForm.aadharNumber,
      pan: individualForm.panNumber,
      dob: individualForm.dob,
      nationality: individualForm.nationality,
      adv_id: individualForm.advisor, // This is now the adv_id
      project: individualForm.projectSelection,
      payment_plan: individualForm.paymentPlan,
      plot_size: individualForm.plotSize,
      prefer: individualForm.preferences,
      aadhar_front: individualForm.aadharFront,
      aadhar_back: individualForm.aadharBack,
      pan_photo: individualForm.panPhoto,
      profile_image: individualForm.profilePhoto,
    };
    
    try {
      await axiosInstance.post('/create-draft', payload);
      setSuccess('Individual registration submitted successfully!');
      // setIndividualForm({ ...initial state ... });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
         user_id:userdata?.user_id,
         email:companyForm?.email,
      draft_type: 1,
      advance:getDrawCharges('company').toLocaleString(),
      company_name: companyForm.companyName,
      authorized_signatory: companyForm.authorizedSignatory,
      gst_number: companyForm.gstNumber,
      pan_number: companyForm.panNumber,
      company_address: companyForm.companyAddress,
      authorized_signatory_address: companyForm.authorizedSignatoryAddress,
      adv_id: companyForm.advisor, // This is now the adv_id
      project: companyForm.project,
      payment_plan: companyForm.paymentPlan,
      plot_size: companyForm.plotSize,
      prefer: companyForm.preference,
      pan_photo: companyForm.panPhoto,
      passport_photo: companyForm.passportPhoto,
    };

    try {
      await axiosInstance.post('/create-draft',payload);
      setSuccess('Company registration submitted successfully!');
      // setCompanyForm({ ...initial state ... });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEoiSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const payload = {
      user_id:userdata?.user_id,
      draft_type: 3, // The key difference for EOI
      advance:getDrawCharges('eoi').toLocaleString(),
      draw_id:drawid,
      email:eoiForm?.email,
      name: eoiForm.name,
      phone: eoiForm.phone,
      address: eoiForm.address,
      occupation: eoiForm.occupation,
      father_name: eoiForm.fatherName,
      aadhar: eoiForm.aadharNumber,
      pan: eoiForm.panNumber,
      dob: eoiForm.dob,
      nationality: eoiForm.nationality,
      adv_id: eoiForm.advisor,
      project: eoiForm.projectSelection,
      payment_plan: eoiForm.paymentPlan,
      plot_size: eoiForm.plotSize,
      prefer: eoiForm.preferences,
      aadhar_front: eoiForm.aadharFront,
      aadhar_back: eoiForm.aadharBack,
      pan_photo: eoiForm.panPhoto,
      profile_image: eoiForm.profilePhoto,
    };
    
    try {
      await axiosInstance.post('/create-draft', payload);
      setSuccess('EOI form submitted successfully!');
      // setEoiForm({ ...initial state ... });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Reusable Components ---
  const FileUploadField = ({ label, icon: Icon, formType, fieldName, previewSrc, accept = "image/*" }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-2"><Icon className="h-4 w-4 text-blue-600" />{label}</Label>
      {previewSrc ? (
        <div className="relative group border rounded-lg p-2 bg-gray-50">
          <img src={previewSrc} alt={`${label} preview`} className="h-24 w-full object-contain rounded-md" />
          <div className="absolute top-1 right-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleFileRemove(formType, fieldName)}
              className="h-7 w-auto px-2 rounded-md opacity-80 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
            >
              Change
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <Input type="file" accept={accept} onChange={(e) => handleFileUpload(e.target.files[0], formType, fieldName)} className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" disabled={loading} />
        </div>
      )}
    </div>
  );

  // --- Loading State UI ---
  if (initialDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="flex items-center gap-3 text-blue-600">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg font-medium">Loading Form Data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen  overflow-y-scroll bg-gradient-to-br max-w-screen from-blue-50 to-indigo-100 ">
      <div className="w-full h-full">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3"><FileText className="h-8 w-8" />Lucky Draw & EOI Form</CardTitle>
            <p className="text-blue-100 mt-2">Choose your registration type and fill the required details</p>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="individual" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="individual" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"><User className="h-4 w-4" /> Individual</TabsTrigger>
                <TabsTrigger value="company" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"><Building2 className="h-4 w-4" /> Company</TabsTrigger>
                <TabsTrigger value="eoi" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200"><FileText className="h-4 w-4" /> EOI</TabsTrigger>
              </TabsList>

              {/* Individual Form */}
              <TabsContent value="individual" className="space-y-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2"><User className="h-5 w-5 text-blue-600" /> Personal Information</h3>
                      <div className="space-y-2"><Label htmlFor="name">Full Name *</Label><Input id="name" placeholder="Enter your full name" value={individualForm.name} onChange={(e) => handleInputChange(e.target.value, 'name', 'individual')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-600" /> Phone Number *</Label><Input id="phone" placeholder="Enter your phone number" value={individualForm.phone} onChange={(e) => handleInputChange(e.target.value, 'phone', 'individual')} required disabled={loading} /></div>
                       <div className="space-y-2"><Label htmlFor="email" className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-600" />Email *</Label><Input id="email" placeholder="Enter your email" value={individualForm.email} onChange={(e) => handleInputChange(e.target.value, 'email', 'individual')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="address" className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600" /> Address *</Label><Textarea id="address" placeholder="Enter your complete address" value={individualForm.address} onChange={(e) => handleInputChange(e.target.value, 'address', 'individual')} rows={3} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="occupation" className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-blue-600" /> Occupation *</Label><Input id="occupation" placeholder="Enter your occupation" value={individualForm.occupation} onChange={(e) => handleInputChange(e.target.value, 'occupation', 'individual')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="fatherName">Father's Name *</Label><Input id="fatherName" placeholder="Enter father's name" value={individualForm.fatherName} onChange={(e) => handleInputChange(e.target.value, 'fatherName', 'individual')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="dob" className="flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-600" /> Date of Birth *</Label><Input id="dob" type="date" value={individualForm.dob} onChange={(e) => handleInputChange(e.target.value, 'dob', 'individual')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="nationality">Nationality *</Label><Input id="nationality" placeholder="Enter your nationality" value={individualForm.nationality} onChange={(e) => handleInputChange(e.target.value, 'nationality', 'individual')} required disabled={loading} /></div>
                    </div>
                    {/* Documents & Project Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2"><FileText className="h-5 w-5 text-blue-600" /> Documents & Project Details</h3>
                      <div className="space-y-2"><Label htmlFor="aadharNumber">Aadhar Number *</Label><Input id="aadharNumber" placeholder="Enter 12-digit Aadhar number" value={individualForm.aadharNumber} onChange={(e) => handleInputChange(e.target.value, 'aadharNumber', 'individual')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="panNumber">PAN Number *</Label><Input id="panNumber" placeholder="Enter PAN number" value={individualForm.panNumber} onChange={(e) => handleInputChange(e.target.value, 'panNumber', 'individual')} required disabled={loading} /></div>
                      <div className="space-y-2">
                        <Label htmlFor="advisor" className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-blue-600" /> Advisor *</Label>
                        <Select onValueChange={(value) => handleInputChange(value, 'advisor', 'individual')} required disabled={loading} value={individualForm.advisor}>
                          <SelectTrigger><SelectValue placeholder="Select advisor" /></SelectTrigger>
                          <SelectContent className="bg-white">{advisors.map((advisor) => (<SelectItem key={advisor.adv_id} value={advisor.adv_id}>{advisor.name}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Project Selection *</Label><Select onValueChange={(value) => handleInputChange(value, 'projectSelection', 'individual')} required  value={individualForm.projectSelection}><SelectTrigger><SelectValue placeholder="Select Project" /></SelectTrigger><SelectContent className="bg-white">{projects.map((project) => (<SelectItem key={project.name} value={project.name}>{project.name}</SelectItem>))}</SelectContent></Select></div>
                      <div className="space-y-2"><Label className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-blue-600" /> Payment Plan *</Label><Select onValueChange={(value) => handleInputChange(value, 'paymentPlan', 'individual')} required disabled={loading || !individualForm.projectSelection} value={individualForm.paymentPlan}><SelectTrigger><SelectValue placeholder={!individualForm.projectSelection ? "Select Project First" : "Select Payment Plan"} /></SelectTrigger><SelectContent className="bg-white">{getPaymentPlans('individual').map((plan) => (<SelectItem key={plan} value={plan}>{plan}</SelectItem>))}</SelectContent></Select></div>
                      <div className="space-y-2"><Label>Plot Size *</Label><Select onValueChange={(value) => handleInputChange(value, 'plotSize', 'individual')} required disabled={loading || !individualForm.projectSelection} value={individualForm.plotSize}><SelectTrigger><SelectValue placeholder={!individualForm.projectSelection ? "Select Project First" : "Select Plot Size"} /></SelectTrigger><SelectContent className="bg-white">{getPlotSizes('individual').map((size) => (<SelectItem key={size} value={size}>{size}</SelectItem>))}</SelectContent></Select></div>
                      <div className="space-y-2"><Label>Preferences</Label><Select onValueChange={(value) => handleInputChange(value, 'preferences', 'individual')} disabled={loading || !individualForm.projectSelection} value={individualForm.preferences}><SelectTrigger><SelectValue placeholder={!individualForm.projectSelection ? "Select Project First" : "Select Preference"} /></SelectTrigger><SelectContent className="bg-white">{getPreferences('individual').map((preference) => (<SelectItem key={preference} value={preference}>{preference}</SelectItem>))}</SelectContent></Select></div>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><Upload className="h-5 w-5 text-blue-600" /> Document Uploads</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FileUploadField label="Aadhar Photo (Front)" icon={FileText} formType="individual" fieldName="aadharFront" previewSrc={individualForm.aadharFront} />
                      <FileUploadField label="Aadhar Photo (Back)" icon={FileText} formType="individual" fieldName="aadharBack" previewSrc={individualForm.aadharBack} />
                      <FileUploadField label="PAN Photo" icon={CreditCard} formType="individual" fieldName="panPhoto" previewSrc={individualForm.panPhoto} />
                      <FileUploadField label="Profile Photo" icon={Camera} formType="individual" fieldName="profilePhoto" previewSrc={individualForm.profilePhoto} />
                    </div>
                  </div>
                  {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
                  {success && <Alert className="bg-green-50 border-green-200 text-green-800"><CheckCircle2 className="h-4 w-4 text-green-600" /><AlertDescription>{success}</AlertDescription></Alert>}
                  <Alert className="border-blue-200 bg-blue-50"><CreditCard className="h-4 w-4 text-blue-600" /><AlertDescription className="text-blue-800"><strong>Note:</strong> The amount of ₹{getDrawCharges('individual').toLocaleString()} is refundable in case of no allotment under this scheme.</AlertDescription></Alert>
                  <Button onClick={handleIndividualSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Individual Registration'}</Button>
                </div>
              </TabsContent>

              {/* Company Form */}
              <TabsContent value="company" className="space-y-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2"><Building2 className="h-5 w-5 text-blue-600" /> Company Information</h3>
                      <div className="space-y-2"><Label htmlFor="companyName">Company Name *</Label><Input id="companyName" placeholder="Enter company name" value={companyForm.companyName} onChange={(e) => handleInputChange(e.target.value, 'companyName', 'company')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" placeholder="Enter company email" value={companyForm.email} onChange={(e) => handleInputChange(e.target.value, 'email', 'company')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="authorizedSignatory">Authorized Signatory *</Label><Input id="authorizedSignatory" placeholder="Enter authorized signatory name" value={companyForm.authorizedSignatory} onChange={(e) => handleInputChange(e.target.value, 'authorizedSignatory', 'company')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="gstNumber">GST Number *</Label><Input id="gstNumber" placeholder="Enter GST number" value={companyForm.gstNumber} onChange={(e) => handleInputChange(e.target.value, 'gstNumber', 'company')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="companyPanNumber">PAN Number *</Label><Input id="companyPanNumber" placeholder="Enter company PAN number" value={companyForm.panNumber} onChange={(e) => handleInputChange(e.target.value, 'panNumber', 'company')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="companyAddress" className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600" /> Company Address *</Label><Textarea id="companyAddress" placeholder="Enter company address" value={companyForm.companyAddress} onChange={(e) => handleInputChange(e.target.value, 'companyAddress', 'company')} rows={3} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="authorizedSignatoryAddress">Authorized Signatory Address *</Label><Textarea id="authorizedSignatoryAddress" placeholder="Enter authorized signatory address" value={companyForm.authorizedSignatoryAddress} onChange={(e) => handleInputChange(e.target.value, 'authorizedSignatoryAddress', 'company')} rows={3} required disabled={loading} /></div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2"><FileText className="h-5 w-5 text-blue-600" /> Project & Business Details</h3>
                      <div className="space-y-2">
                        <Label htmlFor="companyadvisor" className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-blue-600" /> Advisor *</Label>
                        <Select onValueChange={(value) => handleInputChange(value, 'advisor', 'company')} required disabled={loading} value={companyForm.advisor}>
                          <SelectTrigger><SelectValue placeholder="Select advisor" /></SelectTrigger>
                          <SelectContent className="bg-white">{advisors.map((advisor) => (<SelectItem key={advisor.adv_id} value={advisor.adv_id}>{advisor.name}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Project *</Label><Select onValueChange={(value) => handleInputChange(value, 'project', 'company')} required disabled={loading} value={companyForm.project}><SelectTrigger><SelectValue placeholder="Select Project" /></SelectTrigger><SelectContent className="bg-white">{projects.map((project) => (<SelectItem key={project.name} value={project.name}>{project.name}</SelectItem>))}</SelectContent></Select></div>
                      <div className="space-y-2"><Label className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-blue-600" /> Payment Plan *</Label><Select onValueChange={(value) => handleInputChange(value, 'paymentPlan', 'company')} required disabled={loading || !companyForm.project} value={companyForm.paymentPlan}><SelectTrigger><SelectValue placeholder={!companyForm.project ? "Select Project First" : "Select Payment Plan"} /></SelectTrigger><SelectContent className="bg-white">{getPaymentPlans('company').map((plan) => (<SelectItem key={plan} value={plan}>{plan}</SelectItem>))}</SelectContent></Select></div>
                      <div className="space-y-2"><Label>Plot Size *</Label><Select onValueChange={(value) => handleInputChange(value, 'plotSize', 'company')} required disabled={loading || !companyForm.project} value={companyForm.plotSize}><SelectTrigger><SelectValue placeholder={!companyForm.project ? "Select Project First" : "Select Plot Size"} /></SelectTrigger><SelectContent className="bg-white">{getPlotSizes('company').map((size) => (<SelectItem key={size} value={size}>{size}</SelectItem>))}</SelectContent></Select></div>
                      <div className="space-y-2"><Label>Preference</Label><Select onValueChange={(value) => handleInputChange(value, 'preference', 'company')} disabled={loading || !companyForm.project} value={companyForm.preference}><SelectTrigger><SelectValue placeholder={!companyForm.project ? "Select Project First" : "Select Preference"} /></SelectTrigger><SelectContent className="bg-white">{getPreferences('company').map((preference) => (<SelectItem key={preference} value={preference}>{preference}</SelectItem>))}</SelectContent></Select></div>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><Upload className="h-5 w-5 text-blue-600" /> Document Uploads</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FileUploadField label="PAN Photo" icon={CreditCard} formType="company" fieldName="panPhoto" previewSrc={companyForm.panPhoto} />
                      <FileUploadField label="Passport Photo of Signatory" icon={Camera} formType="company" fieldName="passportPhoto" previewSrc={companyForm.passportPhoto} />
                    </div>
                  </div>
                  {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
                  {success && <Alert className="bg-green-50 border-green-200 text-green-800"><CheckCircle2 className="h-4 w-4 text-green-600" /><AlertDescription>{success}</AlertDescription></Alert>}
                  <Alert className="border-blue-200 bg-blue-50"><CreditCard className="h-4 w-4 text-blue-600" /><AlertDescription className="text-blue-800"><strong>Note:</strong> The amount of ₹{getDrawCharges('company').toLocaleString()} is refundable in case of no allotment under this scheme.</AlertDescription></Alert>
                  <Button onClick={handleCompanySubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Company Registration'}</Button>
                </div>
              </TabsContent>

              {/* EOI Form (New) */}
              <TabsContent value="eoi" className="space-y-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2"><User className="h-5 w-5 text-blue-600" /> EOI Personal Information</h3>
                      <div className="space-y-2"><Label htmlFor="eoi-name">Full Name *</Label><Input id="eoi-name" placeholder="Enter your full name" value={eoiForm.name} onChange={(e) => handleInputChange(e.target.value, 'name', 'eoi')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="eoi-phone" className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-600" /> Phone Number *</Label><Input id="eoi-phone" placeholder="Enter your phone number" value={eoiForm.phone} onChange={(e) => handleInputChange(e.target.value, 'phone', 'eoi')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="eoi-email" className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-600" />Email *</Label><Input id="eoi-email" placeholder="Enter your email" value={eoiForm.email} onChange={(e) => handleInputChange(e.target.value, 'email', 'eoi')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="eoi-address" className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600" /> Address *</Label><Textarea id="eoi-address" placeholder="Enter your complete address" value={eoiForm.address} onChange={(e) => handleInputChange(e.target.value, 'address', 'eoi')} rows={3} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="eoi-occupation" className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-blue-600" /> Occupation *</Label><Input id="eoi-occupation" placeholder="Enter your occupation" value={eoiForm.occupation} onChange={(e) => handleInputChange(e.target.value, 'occupation', 'eoi')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="eoi-fatherName">Father's Name *</Label><Input id="eoi-fatherName" placeholder="Enter father's name" value={eoiForm.fatherName} onChange={(e) => handleInputChange(e.target.value, 'fatherName', 'eoi')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="eoi-dob" className="flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-600" /> Date of Birth *</Label><Input id="eoi-dob" type="date" value={eoiForm.dob} onChange={(e) => handleInputChange(e.target.value, 'dob', 'eoi')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="eoi-nationality">Nationality *</Label><Input id="eoi-nationality" placeholder="Enter your nationality" value={eoiForm.nationality} onChange={(e) => handleInputChange(e.target.value, 'nationality', 'eoi')} required disabled={loading} /></div>
                    </div>
                    {/* Documents & Project Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2"><FileText className="h-5 w-5 text-blue-600" /> EOI Documents & Project Details</h3>
                      <div className="space-y-2"><Label htmlFor="eoi-aadharNumber">Aadhar Number *</Label><Input id="eoi-aadharNumber" placeholder="Enter 12-digit Aadhar number" value={eoiForm.aadharNumber} onChange={(e) => handleInputChange(e.target.value, 'aadharNumber', 'eoi')} required disabled={loading} /></div>
                      <div className="space-y-2"><Label htmlFor="eoi-panNumber">PAN Number *</Label><Input id="eoi-panNumber" placeholder="Enter PAN number" value={eoiForm.panNumber} onChange={(e) => handleInputChange(e.target.value, 'panNumber', 'eoi')} required disabled={loading} /></div>
                      <div className="space-y-2">
                        <Label htmlFor="eoi-advisor" className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-blue-600" /> Advisor *</Label>
                        <Select onValueChange={(value) => handleInputChange(value, 'advisor', 'eoi')} required disabled={loading} value={eoiForm.advisor}>
                          <SelectTrigger><SelectValue placeholder="Select advisor" /></SelectTrigger>
                          <SelectContent className="bg-white">{advisors.map((advisor) => (<SelectItem key={advisor.adv_id} value={advisor.adv_id}>{advisor.name}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Project Selection *</Label><Select onValueChange={(value) => handleInputChange(value, 'projectSelection', 'eoi')} required  value={eoiForm.projectSelection}><SelectTrigger><SelectValue placeholder="Select Project" /></SelectTrigger><SelectContent className="bg-white">{projects.map((project) => (<SelectItem key={project.name} value={project.name}>{project.name}</SelectItem>))}</SelectContent></Select></div>
                      <div className="space-y-2"><Label className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-blue-600" /> Payment Plan *</Label><Select onValueChange={(value) => handleInputChange(value, 'paymentPlan', 'eoi')} required disabled={loading || !eoiForm.projectSelection} value={eoiForm.paymentPlan}><SelectTrigger><SelectValue placeholder={!eoiForm.projectSelection ? "Select Project First" : "Select Payment Plan"} /></SelectTrigger><SelectContent className="bg-white">{getPaymentPlans('eoi').map((plan) => (<SelectItem key={plan} value={plan}>{plan}</SelectItem>))}</SelectContent></Select></div>
                      <div className="space-y-2"><Label>Plot Size *</Label><Select onValueChange={(value) => handleInputChange(value, 'plotSize', 'eoi')} required disabled={loading || !eoiForm.projectSelection} value={eoiForm.plotSize}><SelectTrigger><SelectValue placeholder={!eoiForm.projectSelection ? "Select Project First" : "Select Plot Size"} /></SelectTrigger><SelectContent className="bg-white">{getPlotSizes('eoi').map((size) => (<SelectItem key={size} value={size}>{size}</SelectItem>))}</SelectContent></Select></div>
                      <div className="space-y-2"><Label>Preferences</Label><Select onValueChange={(value) => handleInputChange(value, 'preferences', 'eoi')} disabled={loading || !eoiForm.projectSelection} value={eoiForm.preferences}><SelectTrigger><SelectValue placeholder={!eoiForm.projectSelection ? "Select Project First" : "Select Preference"} /></SelectTrigger><SelectContent className="bg-white">{getPreferences('eoi').map((preference) => (<SelectItem key={preference} value={preference}>{preference}</SelectItem>))}</SelectContent></Select></div>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2"><Upload className="h-5 w-5 text-blue-600" /> Document Uploads</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FileUploadField label="Aadhar Photo (Front)" icon={FileText} formType="eoi" fieldName="aadharFront" previewSrc={eoiForm.aadharFront} />
                      <FileUploadField label="Aadhar Photo (Back)" icon={FileText} formType="eoi" fieldName="aadharBack" previewSrc={eoiForm.aadharBack} />
                      <FileUploadField label="PAN Photo" icon={CreditCard} formType="eoi" fieldName="panPhoto" previewSrc={eoiForm.panPhoto} />
                      <FileUploadField label="Profile Photo" icon={Camera} formType="eoi" fieldName="profilePhoto" previewSrc={eoiForm.profilePhoto} />
                    </div>
                  </div>
                  {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
                  {success && <Alert className="bg-green-50 border-green-200 text-green-800"><CheckCircle2 className="h-4 w-4 text-green-600" /><AlertDescription>{success}</AlertDescription></Alert>}
                  <Alert className="border-blue-200 bg-blue-50"><CreditCard className="h-4 w-4 text-blue-600" /><AlertDescription className="text-blue-800"><strong>Note:</strong> The amount of ₹{getDrawCharges('eoi').toLocaleString()} is refundable in case of no allotment under this scheme.</AlertDescription></Alert>
                  <Button onClick={handleEoiSubmit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit EOI Form'}</Button>
                </div>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}