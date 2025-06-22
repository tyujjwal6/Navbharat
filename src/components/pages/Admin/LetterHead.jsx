'use client'; // Required for Next.js App Router

import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Trash2, PlusCircle, Download, Send } from 'lucide-react';

// --- UI Components (assuming shadcn/ui, but can be replaced) ---
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// --- Letterhead Background Image ---
import letterheadBg from '../../../assets/letterhead.jpg' // IMPORTANT: UPDATE THIS PATH
import { axiosInstance } from '../../baseurl/axiosInstance';

// --- Helper Functions ---
const formatCurrency = (amount) => `Rs ${new Intl.NumberFormat('en-IN').format(parseFloat(amount).toFixed(2))}`;

export default function DynamicLetterhead({user}) {
    const INITIAL_DATA = {
        date: '30/05/2025',
        clientName: user?.name,
        projectName: user?.project,
        unitNumber: user?.allot,
        gift: user?.gift,
        costDetails: {
            allottedArea: 0,
            paymentPlan: user?.paymentPlan,
            basicSalePrice: 0,
            edcIdc: 0,
            plcPercent: 0,
        },
        paymentSchedule: [],
        note: {
            paymentDueDate: '01/06/2025',
        },
        accountManager: {
            name: '',
            phone: '',
        },
    };

    const [data, setData] = useState(INITIAL_DATA);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // --- Calculated Values ---
    const totalBasicPrice = data.costDetails.allottedArea * data.costDetails.basicSalePrice;
    const totalEdcIdc = data.costDetails.allottedArea * data.costDetails.edcIdc;
    const plcAmount = totalBasicPrice * (data.costDetails.plcPercent / 100);
    const totalCost = totalBasicPrice + totalEdcIdc + plcAmount;
    const bookingAmount = totalCost * 0.10;

    // --- Handlers for Form Inputs ---
    const handleDataChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (category, name, value) => {
        setData(prev => ({
            ...prev,
            [category]: { ...prev[category], [name]: value },
        }));
    };

    const handleScheduleChange = (index, name, value) => {
        const newSchedule = [...data.paymentSchedule];
        newSchedule[index][name] = value;
        setData(prev => ({ ...prev, paymentSchedule: newSchedule }));
    };

    const addScheduleRow = () => {
        const newId = data.paymentSchedule.length > 0 ? Math.max(...data.paymentSchedule.map(r => r.id)) + 1 : 1;
        setData(prev => ({
            ...prev,
            paymentSchedule: [...prev.paymentSchedule, { id: newId, time: '', percent: 0 }],
        }));
    };

    const removeScheduleRow = (index) => {
        setData(prev => ({
            ...prev,
            paymentSchedule: data.paymentSchedule.filter((_, i) => i !== index),
        }));
    };

    // --- Generate PDF Blob ---
    const generatePdfBlob = async () => {
        const letterPages = document.querySelectorAll('.letter-page');
        if (letterPages.length === 0) return null;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        for (let i = 0; i < letterPages.length; i++) {
            const page = letterPages[i];
            const canvas = await html2canvas(page, { scale: 2, useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/png');
            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        }

        // Convert PDF to blob
        const pdfBlob = pdf.output('blob');
        return pdfBlob;
    };

    // --- Download PDF (Original functionality) ---
    const handleDownloadPdf = async () => {
        setIsDownloading(true);
        try {
            const pdfBlob = await generatePdfBlob();
            if (pdfBlob) {
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Allotment-Letter-${data.clientName.replace(/\s/g, '-')}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    // --- Send PDF via API ---
    const handleSendPdf = async () => {
        setIsSending(true);
        try {
            const pdfBlob = await generatePdfBlob();
            if (!pdfBlob) {
                throw new Error('Failed to generate PDF');
            }

            // Create FormData
            const formData = new FormData();
            
            // Add PDF file
            const fileName = `Allotment-Letter-${data.clientName.replace(/\s/g, '-')}.pdf`;
            formData.append('file', pdfBlob, fileName);
            console.log(pdfBlob)
            // Add additional data if needed
            formData.append('name', data.clientName);
            formData.append('email', user?.email || ''); // Assuming user has email
            formData.append('project', data.projectName);
            
            // Send to API
             const response = await axiosInstance.post(
                '/send-allotment', 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // if (!response.ok) {
            //     throw new Error(`API Error: ${response.status} ${response.statusText}`);
            // }

            // const result = await response.json();
            console.log('Email sent successfully:', response);
            alert('PDF sent successfully via email!');
            
        } catch (error) {
            console.error('Error sending PDF:', error);
            alert(`Error sending PDF: ${error.message}`);
        } finally {
            setIsSending(false);
        }
    };

    // --- The Main Render ---
    return (
        <div className="bg-gray-100 p-8 font-sans">
            <h1 className="text-3xl font-bold text-center mb-4">Letterhead Generator</h1>
            <p className="text-center text-gray-600 mb-8">Edit the details in the form below. The preview on the right will update automatically.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FORM / CONTROLS */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md space-y-6 overflow-y-auto max-h-[80vh]">
                    <h2 className="text-xl font-bold border-b pb-2">Edit Letter Details</h2>
                    
                    {/* General Info */}
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Input name="date" value={data.date} onChange={handleDataChange} />
                        <Label>Client Name</Label>
                        <Input name="clientName" value={data.clientName} onChange={handleDataChange} />
                    </div>

                    {/* Allotment Details */}
                    <div className="space-y-2 border-t pt-4">
                         <h3 className="font-semibold">Allotment Details</h3>
                        <Label>Project Name</Label>
                        <Input name="projectName" value={data.projectName} onChange={handleDataChange} />
                         <Label>Unit Number</Label>
                        <Input name="unitNumber" value={data.unitNumber} onChange={handleDataChange} />
                         <Label>Gift</Label>
                        <Input name="gift" value={data?.gift} onChange={handleDataChange} />
                    </div>

                    {/* Cost Details */}
                    <div className="space-y-2 border-t pt-4">
                         <h3 className="font-semibold">Cost Details</h3>
                        <Label>Allotted Area (Sq. Yd)</Label>
                        <Input type="number" value={data.costDetails.allottedArea} onChange={(e) => handleNestedChange('costDetails', 'allottedArea', e.target.value)} />
                        <Label>Basic Sales Price (Per Sq. Yd)</Label>
                        <Input type="number" value={data.costDetails.basicSalePrice} onChange={(e) => handleNestedChange('costDetails', 'basicSalePrice', e.target.value)} />
                        <Label>EDC/IDC (Per Sq. Yd)</Label>
                        <Input type="number" value={data.costDetails.edcIdc} onChange={(e) => handleNestedChange('costDetails', 'edcIdc', e.target.value)} />
                        <Label>PLC (%)</Label>
                        <Input type="number" value={data.costDetails.plcPercent} onChange={(e) => handleNestedChange('costDetails', 'plcPercent', e.target.value)} />
                    </div>
                    
                    {/* Payment Schedule */}
                    <div className="space-y-2 border-t pt-4">
                        <h3 className="font-semibold">Payment Schedule</h3>
                        {data.paymentSchedule.map((row, index) => (
                            <div key={row.id} className="grid grid-cols-12 gap-2 items-center">
                                <Input className="col-span-5" placeholder="Time" value={row.time} onChange={(e) => handleScheduleChange(index, 'time', e.target.value)} />
                                <Input className="col-span-5" type="number" placeholder="Percent %" value={row.percent} onChange={(e) => handleScheduleChange(index, 'percent', e.target.value)} />
                                <Button variant="destructive" size="icon" className="col-span-2" onClick={() => removeScheduleRow(index)}><Trash2 size={16}/></Button>
                            </div>
                        ))}
                        <Button variant="outline" onClick={addScheduleRow} className="w-full mt-2"><PlusCircle size={16} className="mr-2" /> Add Row</Button>
                    </div>

                    {/* Page 2 Details */}
                    <div className="space-y-2 border-t pt-4">
                        <h3 className="font-semibold">Page 2 Details</h3>
                        <Label>Payment Due Date (in Note)</Label>
                        <Input value={data.note.paymentDueDate} onChange={(e) => handleNestedChange('note', 'paymentDueDate', e.target.value)} />
                        <Label>Account Manager Name</Label>
                        <Input value={data.accountManager.name} onChange={(e) => handleNestedChange('accountManager', 'name', e.target.value)} />
                         <Label>Account Manager Phone</Label>
                        <Input value={data.accountManager.phone} onChange={(e) => handleNestedChange('accountManager', 'phone', e.target.value)} />
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button onClick={handleDownloadPdf} disabled={isDownloading} className="w-full text-lg py-6">
                            {isDownloading ? 'Downloading...' : <><Download size={20} className="mr-2"/> Download PDF</>}
                        </Button>
                        
                        <Button onClick={handleSendPdf} disabled={isSending} variant="secondary" className="w-full text-lg py-6">
                            {isSending ? 'Sending...' : <><Send size={20} className="mr-2"/> Send PDF via Email</>}
                        </Button>
                    </div>
                </div>
                
                {/* LETTERHEAD PREVIEW */}
                <div className="lg:col-span-2">
                    <div id="letterhead-container" className="space-y-1">
                        {/* PAGE 1 */}
                        <div
                            className="letter-page w-[210mm] h-[297mm] bg-white shadow-lg p-[1cm] box-border relative"
                            style={{ backgroundImage: `url(${letterheadBg})`, backgroundSize: 'cover' }}
                        >
                            <div className="pt-[6.2cm] px-[1.5cm] text-xs leading-relaxed">
                                <div className='flex w-full justify-between'>
                                <p className="mb-1">Dear Mr/Mrs/Ms. {data.clientName},</p>
                                <div className=" text-xs font-bold">DATE <br /> {data.date}</div> 
                                </div>
                                <p>It is a perfect choice and you are one of the few lucky ones to get a unit at such a reasonable rate. We at Navbharat Niwas feel privileged to be part of your great investment.</p>
                                <p >We thank you for giving us an opportunity to assist you in making this very investment. We sincerely hope that you are satisfied with our services and will refer us in your circle.</p>

                                <div className="font-bold my-1">
                                    Your Lucky Draw Allotment is as Follows:
                                    <div className="font-normal pl-2">
                                        <p>Project Name: {data.projectName}</p>
                                        <p>Unit Number: {data.unitNumber}</p>
                                        <p>Gift: {data.gift}</p>
                                    </div>
                                </div>
                                <p>Brief details about the total cost of the unit and payment plan are as follows:</p>

                                {/* Cost Table */}
                                <table className="w-[35vw] border-collapse border border-gray-400 my-2 text-xs" style={{ borderCollapse: 'collapse' }}>
                                    <thead className="bg-blue-100 text-xs font-bold">
                                        <tr>
                                            <th className="border text-xs border-gray-400 p-1" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center', backgroundColor: '#dbeafe' }}>Client Name</th>
                                            <th className="border text-xs border-gray-400 p-1" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center', backgroundColor: '#dbeafe' }}>Allotted Area (Sq. Yd)</th>
                                            <th className="border border-gray-400 p-1" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center', backgroundColor: '#dbeafe' }}>Payment Plan</th>
                                            <th className="border border-gray-400 p-1" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center', backgroundColor: '#dbeafe' }}>Basic Sales Price (Per Sq. Yd.)</th>
                                            <th className="border border-gray-400 p-1" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center', backgroundColor: '#dbeafe' }}>EDC/IDC (Per Sq. Yd)</th>
                                            <th className="border border-gray-400 p-1" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center', backgroundColor: '#dbeafe' }}>PLC = {data.costDetails.plcPercent}%</th>
                                            <th className="border border-gray-400 p-1" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center', backgroundColor: '#dbeafe' }}>Total Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border  border-gray-400 p-1 text-center" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center' }}>{data.clientName}</td>
                                            <td className="border border-gray-400 p-1 text-center" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center' }}>{data.costDetails.allottedArea}</td>
                                            <td className="border border-gray-400 p-1 text-center" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center' }}>{data.costDetails.paymentPlan}</td>
                                            <td className="border border-gray-400 p-1 text-center" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center' }}>{formatCurrency(data.costDetails.basicSalePrice)}</td>
                                            <td className="border border-gray-400 p-1 text-center" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center' }}>{formatCurrency(data.costDetails.edcIdc)}</td>
                                            <td className="border border-gray-400 p-1 text-center" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center' }}>{formatCurrency(plcAmount)}</td>
                                            <td className="border border-gray-400 p-1 text-center font-bold" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center', fontWeight: 'bold' }}>{formatCurrency(totalCost)}</td>
                                        </tr>
                                         <tr>
                                            <td colSpan="3"></td>
                                            <td className="border border-gray-400 p-1 text-center font-bold" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center', fontWeight: 'bold' }}>{formatCurrency(totalBasicPrice)}</td>
                                            <td className="border border-gray-400 p-1 text-center font-bold" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center', fontWeight: 'bold' }}>{formatCurrency(totalEdcIdc)}</td>
                                            <td colSpan="2"></td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Payment Schedule */}
                                <p className="font-bold ">Payment schedule</p>
                                <table className="w-[35vw] border-collapse border border-gray-400 my-1 text-xs" style={{ borderCollapse: 'collapse' }}>
                                     <thead className="bg-blue-100 font-bold">
                                        <tr>
                                            {['Installment No.', 'Time', 'Payment %', 'Amount'].map(h => 
                                                <th key={h} className="border border-gray-400 p-1" style={{ border: '1px solid #999', paddingBlock: '14px', textAlign: 'center', backgroundColor: '#dbeafe' }}>{h}</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.paymentSchedule.map((row, index) => {
                                            const amount = totalCost * (row.percent / 100);
                                            return (
                                                <tr key={row.id}>
                                                    <td className="border border-gray-400 p-1 text-center" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center' }}>{index + 1}</td>
                                                    <td className="border border-gray-400 p-1 text-center" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center' }}>{row.time}</td>
                                                    <td className="border border-gray-400 p-1 text-center" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center' }}>{row.percent}%</td>
                                                    <td className="border border-gray-400 p-1 text-center" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center' }}>{formatCurrency(amount)}</td>
                                                </tr>
                                            );
                                        })}
                                        <tr className="font-bold">
                                             <td className="border border-gray-400 p-1 text-center" colSpan="2" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center', fontWeight: 'bold' }}>Total</td>
                                             <td className="border border-gray-400 p-1 text-center" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                                                {data.paymentSchedule.reduce((acc, row) => acc + Number(row.percent || 0), 0)}%
                                             </td>
                                             <td className="border border-gray-400 p-1 text-center" style={{ border: '1px solid #999', paddingBlock: '10px', textAlign: 'center', fontWeight: 'bold' }}>{formatCurrency(totalCost)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* PAGE 2 */}
                        <div className="letter-page w-[210mm] min-h-[297mm] bg-white shadow-lg p-[2.5cm] box-border text-xs">
                            <p className="font-bold">Note: <span className="font-normal">
                                Allotment under Navbharat Niwas Smart City Development Plan - (NNSCDP) - {data.projectName} will only be confirmed in case of 10% ({formatCurrency(bookingAmount)}) payment received by {data.note.paymentDueDate}.
                            </span></p>

                            <p className="font-bold mt-6 mb-2">Payment can be transferred online using the following details:</p>
                            <div className="pl-4">
                                <p><span className="font-semibold">Account Name:</span> NAVBHARAT NIWAS PRIVATE LIMITED</p>
                                <p><span className="font-semibold">Account Number:</span> 924020056702191</p>
                                <p><span className="font-semibold">Bank:</span> AXIS BANK</p>
                                <p><span className="font-semibold">Branch:</span> Mayur Vihar Phase-1</p>
                                <p><span className="font-semibold">IFSC CODE:</span> UTIB0001540</p>
                            </div>
                            
                            <p className="font-bold mt-6">Note: <span className="font-normal">For credit card transactions, an additional 2% processing fee will be applied..</span></p>

                            <p className="mt-6">Your account manager is <span className="font-bold">{data.accountManager.name}</span> and will be reachable on <span className="font-bold">{data.accountManager.phone}</span> for any queries.</p>

                            <div className="mt-12">
                                <p>With Best Regards</p>
                                <p className="mt-4 font-semibold">Gaurav Gupta</p>
                                <p>Accounts Manager</p>
                                <p>Navbharat Niwas Private Limited</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}