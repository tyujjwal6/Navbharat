'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Send, Download } from 'lucide-react';
import React, {  forwardRef, useImperativeHandle } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

// --- UI Components ---
import { Button } from '@/components/ui/button';

// --- Letterhead Background Image ---
import letterheadBg from '../../../assets/letterhead.jpg' // IMPORTANT: UPDATE THIS PATH
import { axiosInstance } from '../../baseurl/axiosInstance';

// --- Helper Functions ---
const formatCurrency = (amount) => `Rs ${new Intl.NumberFormat('en-IN').format(parseFloat(amount).toFixed(0))}`;

// Get current date in dd/mm/yyyy format
const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
};

// Get current date in ddmmyyyy format
const getCurrentDateFormatted = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}${month}${year}`;
};

// Generate dynamic receipt number
const generateReceiptNumber = (userName) => {
    const dateFormatted = getCurrentDateFormatted();
    const firstLetter = userName ? userName.charAt(0).toUpperCase() : 'X';
    return `NN${dateFormatted}${firstLetter}01`;
};

 function PaymentRecipt({user}) {
    const currentDate = getCurrentDate();
    const dynamicReceiptNo = generateReceiptNumber(user?.name);

    const [isSending, setIsSending] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [paymentMode, setPaymentMode] = useState('Online');

    // Updated payment receipt data with dynamic values
    const receiptData = {
        date: currentDate,
        receiptNo: dynamicReceiptNo,
        gstNo: "09AAKCN0817B1ZQ",
        receivedFrom: {
            name: user?.name,
            address: user?.address,
            mobile: user?.phone
        },
        paymentDetails: {
            bookingAmount: user?.advance,
            total: user?.advance
        },
        paymentInfo: {
            amountReceived: user?.advance,
            paymentMode: paymentMode,
            transactionDate: currentDate
        },
        purpose: `Booking/Partial Payment for ${user?.project} under the Navbharat Niwas Smart City Development Plan - ${user?.project}`,
       
    };

    // --- Generate PDF Blob ---
    const generatePdfBlob = async () => {
        const receiptPage = document.querySelector('.receipt-page');
        if (!receiptPage) return null;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const canvas = await html2canvas(receiptPage, { 
            scale: 2, 
            useCORS: true, 
            logging: false,
            backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

        // Convert PDF to blob
        const pdfBlob = pdf.output('blob');
        return pdfBlob;
    };

    // --- Download PDF ---
    const handleDownloadPdf = async () => {
        setIsDownloading(true);
        try {
            const receiptPage = document.querySelector('.receipt-page');
            if (!receiptPage) {
                throw new Error('Receipt page not found');
            }

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const canvas = await html2canvas(receiptPage, { 
                scale: 2, 
                useCORS: true, 
                logging: false,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

            // Generate filename
            const fileName = `Payment-Receipt-${receiptData?.receiptNo}.pdf`;
            
            // Download the PDF
            pdf.save(fileName);
            
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Error downloading PDF. Please try again.');
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
            const fileName = `Payment-Receipt-${receiptData?.receiptNo}.pdf`;
            formData.append('file', pdfBlob, fileName);
            
            // Add additional data
            formData.append('name', receiptData?.receivedFrom?.name);
            formData.append('email', user?.email);
            
            // Send to API
            const response = await axiosInstance.post(
                '/send-recipt', 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Payment receipt sent successfully:', response);
            alert('Payment receipt sent successfully via email!');
            
        } catch (error) {
            console.error('Error sending payment receipt:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="font-sans">
            <div className=" mx-auto">
                {/* Action Buttons */}
                <div className="text-center mb-6 flex justify-center gap-4 flex-wrap">
                    {/* Payment Mode Input */}
                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                        <label className="font-medium text-sm">Payment Mode:</label>
                        <input 
                            type="text"
                            value={paymentMode} 
                            onChange={(e) => setPaymentMode(e.target.value)}
                            placeholder="Enter payment mode"
                            className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
                        />
                    </div>
                    
                    <Button 
                        onClick={handleDownloadPdf} 
                        disabled={isDownloading} 
                        className="text-lg py-6 px-8 bg-green-600 hover:bg-green-700"
                        size="lg"
                    >
                        {isDownloading ? 'Downloading...' : <><Download size={20} className="mr-2"/> Download PDF</>}
                    </Button>
                    
                    <Button 
                        onClick={handleSendPdf} 
                        disabled={isSending} 
                        className="text-lg py-6 px-8"
                        size="lg"
                    >
                        {isSending ? 'Sending...' : <><Send size={20} className="mr-2"/> Send via Email</>}
                    </Button>
                </div>
                
                {/* PAYMENT RECEIPT PREVIEW */}
                <div 
                    className="receipt-page w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto relative overflow-hidden"
                    style={{ backgroundImage: `url(${letterheadBg})`, backgroundSize: 'cover' }}
                >
                    {/* Header area with date */}
                   

                    {/* Content */}
                    <div className="px-[1.5cm] pt-[8cm] pb-8 text-sm">
                        {/* Title */}
                        <div className="text-center  flex justify-between">
                            <h2 className="text-xl font-bold underline">PAYMENT RECEIPT</h2>
                             <div className="text-right flex gap-2 text-xs font-bold">
                                <div className="text-lg ">DATE</div>
                                <div className="text-lg font-semibold">{receiptData.date}</div>
                            </div>
                        </div>

                        {/* Receipt Details */}
                        <div className="mb-4">
                            <p className="font-bold">PAYMENT RECEIPT NO. – {receiptData.receiptNo}</p>
                            <p className="font-bold">GST No. - {receiptData.gstNo}</p>
                        </div>

                        <div className="mb-4">
                            <p><span className="font-bold">Date:</span> {receiptData.date}</p>
                        </div>

                        {/* Received From */}
                        <div className="mb-6">
                            <p className="font-bold">Received From:</p>
                            <div className="ml-4">
                                <p>Sh./Smt./M/s <span className="font-bold">{receiptData.receivedFrom.name}</span></p>
                                <p><span className="font-bold">Address:</span> {receiptData.receivedFrom.address}</p>
                                <p><span className="font-bold">Mobile:</span> {receiptData.receivedFrom.mobile}</p>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="mb-6">
                            <p className="font-bold mb-2">Payment Details:</p>
                            <table className="border-collapse border-2 border-black w-1/2">
                                <thead>
                                    <tr>
                                        <th className="border-2 border-black p-2 text-left font-bold">Booking Amount</th>
                                        <th className="border-2 border-black p-2 text-left font-bold">Amount (Rs.)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border-2 border-black p-2">Booking Amount</td>
                                        <td className="border-2 border-black p-2">{receiptData.paymentDetails.bookingAmount}</td>
                                    </tr>
                                    <tr>
                                        <td className="border-2 border-black p-2 font-bold">Total</td>
                                        <td className="border-2 border-black p-2 font-bold">{receiptData.paymentDetails.total}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Payment Information */}
                        <div className="mb-6">
                            <p className="font-bold mb-2">Payment Information:</p>
                            <div className="ml-4">
                                <p>❖ <span className="font-bold">Amount Received:</span> {receiptData.paymentInfo.amountReceived}</p>
                                <p>❖ <span className="font-bold">Payment Mode:</span> {receiptData.paymentInfo.paymentMode}</p>
                                {/* <p>❖ <span className="font-bold">(Last four digits of Payment Method/Cheque No.):</span> {receiptData.paymentInfo.lastFourDigits}</p> */}
                                <p>❖ <span className="font-bold">Transaction Date:</span> {receiptData.paymentInfo.transactionDate}</p>
                            </div>
                        </div>

                        {/* Purpose */}
                        <div className="mb-6">
                            <p>➔ <span className="font-bold">Purpose:</span> {receiptData.purpose}</p>
                        </div>

                        {/* Acknowledgment */}
                        <div className="mb-8">
                            <p>We acknowledge the receipt of the above-mentioned amount with thanks. The amount will be fully refunded only in the event of no allotment.</p>
                        </div>

                        {/* Footer Contact Information */}
                       
                    </div>
                </div>
            </div>
        </div>
    );
}




// Simple Dialog Component
const SimpleDialog = forwardRef(({data}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
console.log(data)
  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  }));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[100vw] max-h-[100vh] overflow-y-auto bg-white">
    <PaymentRecipt user={data}/>
      </DialogContent>
    </Dialog>
  );
});

export default SimpleDialog;