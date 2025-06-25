import React, { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Local Components ---
// Ensure this path is correct based on your file structure
import PrintableAgreement from './PrintableAgreement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Home, Pen, Eraser, Save, ChevronLeft, ChevronRight, Download, Loader2, Clock } from 'lucide-react';
import { axiosInstance } from '../../baseurl/axiosInstance';

const Allotments = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [signatures, setSignatures] = useState(['', '', '']);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [allotdata, setallotdata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const canvasRefs = [useRef(null), useRef(null), useRef(null)];
  const printableComponentRef = useRef(null);

  const [userData, setuserdata] = useState({
    name: '',
    fatherName: '',
    address: '',
    phone: '',
    email: '',
    panCard: '',
    aadhar: '',
    dateOfBirth: '',
    nationality: 'Indian',
    profession: '',
    ticket_id: '',
    profilePic: 'https://i.pravatar.cc/150?u=ravi.kishore'
  });

  const [bookingData, setbookingdata] = useState({
    unitNumber:'',
    area: '',
    project: '',
    developmentCharge: '',
    bookingAmount: '',
    registrationAmount: '',
    totalCost: '',
    plcAmount: '',
    preferentialLocationCharges: '',
    paymentPlan: '',
    modeOfPayment: '',
    createdAt: '',
    updatedAt: ''
  });

  useEffect(()=>{
    const getdata = async()=>{
      try {
        setIsLoading(true);
        const userdata = JSON.parse(localStorage.getItem("userdata"));
        const response = await axiosInstance.get('/draft', {
          params: { alloted: true, allotment_done: true, user_id: userdata?.user_id, signed: false }
        });
        
        const rows = response?.data?.data?.rows;
        
        if (!rows || rows.length === 0) {
          setIsPending(true);
          setIsLoading(false);
          return;
        }
        
        const alldata = rows[rows.length - 1];
        
        if (!alldata || Object.keys(alldata).length === 0) {
          setIsPending(true);
          setIsLoading(false);
          return;
        }
        
        setallotdata(alldata);
        
        setuserdata({
          name: alldata?.name || '',
          fatherName: alldata?.father_name || '',
          address: alldata?.address || '',
          phone: alldata?.phone || '',
          email: alldata?.email || '',
          panCard: alldata?.pan || '',
          aadhar: alldata?.aadhar || '',
          dateOfBirth: alldata?.dob || '',
          profilePic: alldata?.profile_image || 'https://i.pravatar.cc/150?u=default',
          ticket_id: alldata?.ticket_id || ''
        });

        setbookingdata({
          unitNumber: alldata?.allot || '',
          project: alldata?.project || '',
          area: alldata?.area || '',
          totalCost: alldata?.total_cost || '',
          bookingAmount: alldata?.booking_amount || '',
          paymentPlan: alldata?.payment_plan || '',
          modeOfPayment: alldata?.mode || ''
        });
        
        setIsPending(false);
      } catch (error) {
        console.error('Error fetching allotment data:', error);
        setIsPending(true);
      } finally {
        setIsLoading(false);
      }
    }
    getdata()
  }, [])

  // --- Sample Data ---
  const pages = ['Agreement Details', 'Terms & Conditions', 'Declaration'];

  const termsAndConditions = [
    'The Intending Buyer has applied for the registration of Plot/Farm House with full knowledge and subject to all laws, notifications and rules applicable to this area.',
    'The intending buyer has fully satisfied himself/herself about the interest and title of the company in the land, understands all limitations and obligations in respect of it and does not have any objection.',
    'For preferential situated Plot/Farm House, extra charges as applicable will be payable by the intending buyer.',
    'The cost of Development Charges for a Plot/Farm House whatever is applicable will be payable by the customer.',
    'If any applicant wants to cancel his/her registration once they have applied for a Plot/Farm House under this scheme, then the company will refund his/her registration money after deducting 50% from the total paid.',
    'The applicant has to pay the maintenance & Security charges as applicable.',
    'In case if any client fails to pay the maintenance & security charges on time, then the company will not be responsible for the security of his/her property.',
    'The company reserves the right to cancel the registration/allotment of the Plot/Farm House in case if any cheque bounced/dishonoured due to customer\'s fault.',
    'All allotments shall be made on free hold basis. However, the title shall be transferred only when Sale Deed/Registry is executed in favour of the allottee.',
    'The Company reserves the right to alter/amend/modify any of the terms & conditions at its sole discretion.',
    'Cheque/DD/Payorder to be in the name of Navbharat Niwas Private Limited.',
    'A penalty of Rs. 1000 will be charged for cheque bouncing, and a 12% annual interest will be applied on any delayed payments.',
    'Possession will be given within 24 months after booking. In case possession is not given, 18% interest will be paid to the buyer.',
    'All PDC Cheques need to be deposited at the time of agreement in Noida Office.'
  ];

  const declarations = [
    'I/WE declare that I/We have read & understood the above-mentioned terms and conditions of the project and shall abide by them.',
    'The Plot/Farm Houses allotted to me by the company under the rules shall be acceptable to me/us. I/We shall have no objection.',
    'In case of cancellation of registration done by me/us, I/We shall accept the deduction made by the company as per rules.',
    'I agree that the measurement/number and area of Plot/Farm House required by me/us can vary at the time of Registry as per the Govt. Rules/Approved Map and Availability.',
    'I/We hereby declare that all information on the application form has been given by me/us and is true to the best of knowledge and belief.'
  ];

  // --- Loading Component ---
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-gray-600">Loading allotment details...</p>
    </div>
  );

  // --- Pending Component ---
  const renderPending = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center">
        <Clock className="h-16 w-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Allotment Pending</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Your allotment is currently being processed. Please check back later or contact our support team for updates.
        </p>
      <Badge variant="outline" className="px-4 py-2 text-orange-600 border-orange-200">
        Status: Pending
      </Badge>
    </div>
  );

  // --- PDF Generation ---
  const handleDownloadPdf = async () => {
    const input = printableComponentRef.current;
    if (!input || !isSaved) {
      alert("Please save your signature first.");
      return;
    }

    setIsGenerating(true);

    try {
      const canvas = await html2canvas(input, {
        scale: 2, useCORS: true, logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / pdfWidth;
      const totalPdfHeight = canvasHeight / ratio;
      const pdfPageHeight = pdf.internal.pageSize.getHeight();

      let heightLeft = totalPdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
      heightLeft -= pdfPageHeight;

      while (heightLeft > 0) {
        position = -heightLeft;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, totalPdfHeight);
        heightLeft -= pdfPageHeight;
      }
      pdf.save(`Agreement-${userData?.ticket_id}.pdf`);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please check the console.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Signature Pad Logic ---
  const startDrawing = (e, pageIndex) => {
    if (isSaved) return;
    setIsDrawing(true);
    const canvas = canvasRefs[pageIndex].current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    // Support both mouse and touch events
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e, pageIndex) => {
    if (!isDrawing || isSaved) return;
    e.preventDefault(); // Prevent scrolling on touch devices
    const canvas = canvasRefs[pageIndex].current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = (pageIndex) => {
    if (!isDrawing || isSaved) return;
    setIsDrawing(false);
    const canvas = canvasRefs[pageIndex].current;
    const signatureData = canvas.toDataURL('image/png');

    const newSignatures = [...signatures];
    newSignatures.fill(signatureData);
    setSignatures(newSignatures);
    
    canvasRefs.forEach((ref) => {
      if (ref.current) {
        const ctx = ref.current.getContext('2d');
        ctx.clearRect(0, 0, ref.current.width, ref.current.height);
        if (signatureData) {
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0);
          img.src = signatureData;
        }
      }
    });
  };
  
  const clearSignature = () => {
    if (isSaved) return;
    canvasRefs.forEach((ref) => {
      if (ref.current) {
        const ctx = ref.current.getContext('2d');
        ctx.clearRect(0, 0, ref.current.width, ref.current.height);
      }
    });
    setSignatures(['', '', '']);
  };

  const saveSignature = async() => {
    await axiosInstance.put(`/draft/${allotdata?.ticket_id}`,{signed:true});
    setIsSaved(true);
  };

  // --- Render Functions for UI ---
  const renderAgreementDetails = () => (
    <div className="space-y-6">
      <div className="text-center border-b pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">PROPERTY PURCHASE AGREEMENT</h1>
        <p className="text-gray-600 mt-2">Navbharat Niwas Private Limited</p>
        <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString('en-IN')}</p>
      </div>
      {/* RESPONSIVE: Stacks to 1 column on mobile, 2 on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5" />Buyer Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center mb-4">
              <img
                src={userData.profilePic}
                alt={`${userData.name}'s profile picture`}
                className="h-24 w-24 rounded-full object-cover border-4 border-gray-200 shadow-sm"
              />
            </div>
            {/* RESPONSIVE: Stacks to 1 column on mobile, 2 on small screens+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4"><Label className="text-sm font-medium text-gray-600">Full Name</Label><p className="text-gray-800 border-b pb-1">{userData.name}</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4"><Label className="text-sm font-medium text-gray-600">S/o / D/o</Label><p className="text-gray-800 border-b pb-1">{userData.fatherName}</p></div>
            <div><Label className="text-sm font-medium text-gray-600">Address</Label><p className="text-gray-800 border-b pb-1 break-words">{userData.address}</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4"><Label className="text-sm font-medium text-gray-600">Phone</Label><p className="text-gray-800 border-b pb-1">{userData.phone}</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4"><Label className="text-sm font-medium text-gray-600">Email</Label><p className="text-gray-800 border-b pb-1 break-words">{userData.email}</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4"><Label className="text-sm font-medium text-gray-600">PAN</Label><p className="text-gray-800 border-b pb-1">{userData.panCard}</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4"><Label className="text-sm font-medium text-gray-600">Aadhaar</Label><p className="text-gray-800 border-b pb-1">{userData.aadhar}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Home className="h-5 w-5" />Booking Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {/* RESPONSIVE: Stacks to 1 column on mobile, 2 on small screens+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4"><Label className="text-sm font-medium text-gray-600">Project</Label><p className="text-gray-800 border-b pb-1">{bookingData.project}</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4"><Label className="text-sm font-medium text-gray-600">Unit No.</Label><p className="text-gray-800 border-b pb-1">{bookingData.unitNumber}</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4"><Label className="text-sm font-medium text-gray-600">Area</Label><p className="text-gray-800 border-b pb-1">{bookingData.area}</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4"><Label className="text-sm font-medium text-gray-600">Total Cost</Label><p className="text-gray-800 font-semibold border-b pb-1">{bookingData.totalCost}</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4"><Label className="text-sm font-medium text-gray-600">Booking Amount</Label><p className="text-gray-800 font-semibold border-b pb-1">{bookingData.bookingAmount}</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4"><Label className="text-sm font-medium text-gray-600">Payment Plan</Label><p className="text-gray-800 border-b pb-1">{bookingData.paymentPlan}</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4"><Label className="text-sm font-medium text-gray-600">Mode</Label><p className="text-gray-800 border-b pb-1">{bookingData.modeOfPayment}</p></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTermsAndConditions = () => (
    <div className="space-y-6">
      <div className="text-center border-b pb-4"><h2 className="text-xl font-bold text-gray-800">TERMS & CONDITIONS</h2></div>
      <div className="space-y-4">
        {termsAndConditions.map((term, index) => (
          <div key={index} className="flex gap-3"><span className="text-blue-600 font-semibold text-sm mt-1">{index + 1}.</span><p className="text-gray-700 text-sm leading-relaxed">{term}</p></div>
        ))}
      </div>
    </div>
  );

  const renderDeclaration = () => (
    <div className="space-y-6">
      <div className="text-center border-b pb-4"><h2 className="text-xl font-bold text-gray-800">DECLARATION</h2></div>
      <div className="space-y-4">
        {declarations.map((declaration, index) => (
          <div key={index} className="flex gap-3"><span className="text-blue-600 font-semibold text-sm mt-1">•</span><p className="text-gray-700 text-sm leading-relaxed">{declaration}</p></div>
        ))}
      </div>
    </div>
  );

  const renderSignatureSection = () => (
    <Card className="mt-8">
      <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Pen className="h-5 w-5" />Digital Signature</CardTitle></CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-3 text-center">Draw your signature in the box below. It will be applied to all pages.</p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-4 bg-gray-50">
          <canvas
            ref={canvasRefs[currentPage]}
            width={400}
            height={120}
            // RESPONSIVE: w-full makes canvas scale with its container. touch-none helps with drawing on mobile.
            className="border bg-white rounded cursor-crosshair w-full touch-none"
            onMouseDown={(e) => startDrawing(e, currentPage)}
            onMouseMove={(e) => draw(e, currentPage)}
            onMouseUp={() => stopDrawing(currentPage)}
            onMouseLeave={() => stopDrawing(currentPage)}
            onTouchStart={(e) => startDrawing(e, currentPage)}
            onTouchMove={(e) => draw(e, currentPage)}
            onTouchEnd={() => stopDrawing(currentPage)}
          />
        </div>
        <div className="flex gap-2 justify-center mt-4">
          <Button variant="outline" size="sm" onClick={clearSignature} disabled={isSaved}><Eraser className="h-4 w-4 mr-2" />Clear</Button>
          <Button onClick={saveSignature} disabled={isSaved || signatures[currentPage] === ''}><Save className="h-4 w-4 mr-2" />{isSaved ? 'Saved' : 'Save Signature'}</Button>
        </div>
        {isSaved && <div className="text-center mt-2"><Badge variant="secondary" className="bg-green-100 text-green-800">Signature saved and synchronized</Badge></div>}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      // RESPONSIVE: Use responsive padding for the container
      <div className="w-full p-2 sm:p-4 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* RESPONSIVE: Use responsive padding for the card */}
          <div className="bg-white shadow-lg rounded-lg p-4 sm:p-8">
            {renderLoading()}
          </div>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="w-full p-2 sm:p-4 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-4 sm:p-8">
            {renderPending()}
          </div>
        </div>
      </div>
    );
  }

  return (
    // RESPONSIVE: Use responsive padding for the container
    <div className="w-full p-2 sm:p-4 overflow-y-scroll bg-gray-50 max-h-screen">
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <PrintableAgreement
          ref={printableComponentRef}
          userData={userData}
          bookingData={bookingData}
          termsAndConditions={termsAndConditions}
          declarations={declarations}
          signatureDataUrl={signatures[0]}
        />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex w-full justify-between items-center mb-6">
           {/* RESPONSIVE: Hides button text on small screens, shows only icon */}
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0}>
            <ChevronLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <Badge variant="secondary" className="px-3 py-2 text-xs sm:text-sm text-center">{pages[currentPage]} ({currentPage + 1}/{pages.length})</Badge>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))} disabled={currentPage === pages.length - 1}>
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 sm:ml-2" />
          </Button>
        </div>

        {/* RESPONSIVE: Use responsive padding for the card */}
        <div className="bg-white shadow-lg rounded-lg p-4 md:p-8 min-h-[600px]">
          {currentPage === 0 && renderAgreementDetails()}
          {currentPage === 1 && renderTermsAndConditions()}
          {currentPage === 2 && renderDeclaration()}
          {renderSignatureSection()}
        </div>

        {isSaved && (
          <div className="mt-8 text-center">
            <Button size="lg" className="px-6 sm:px-8" onClick={handleDownloadPdf} disabled={isGenerating}>
              {isGenerating ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating PDF...</>
              ) : (
                <><Download className="mr-2 h-4 w-4" />Download Agreement</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Allotments;