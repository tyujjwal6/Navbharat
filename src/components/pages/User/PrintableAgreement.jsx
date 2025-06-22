// src/components/PrintableAgreement.js

import React from 'react';
import pdflogo from '../../../assets/logopdf.png';
import userimage from '../../../assets/kishor.jpg';

// This component is designed specifically for printing/PDF generation.
// It lays out all content onto separate "pages" using CSS.
const PrintableAgreement = React.forwardRef(({ userData, bookingData, termsAndConditions, declarations, signatureDataUrl }, ref) => {
  const today = new Date().toLocaleDateString('en-IN');

  return (
    <div ref={ref} className="printable-agreement-container">
      {/* We use a style tag here for simplicity, but these styles can be moved to your global CSS file */}
      <style type="text/css">
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
          .printable-agreement-container {
            font-family: 'Roboto', sans-serif;
            color: #333;
            background-color: white; /* Ensure background is white for html2canvas */
          }
          .pdf-page {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            margin: 10mm auto;
            background: white;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            position: relative;
            display: flex;
            flex-direction: column;
            page-break-after: always; /* Crucial for printing */
            box-sizing: border-box; /* <<< FIX 1: Ensures padding is included in the height/width */
          }
          /* <<< FIX 2: Prevents a page break after the final page */
          .pdf-page:last-child {
            page-break-after: auto;
          }
          .pdf-header, .pdf-footer {
            width: 100%;
            text-align: center;
            font-size: 10px;
            color: #777;
          }
          .pdf-header {
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
          }
          .company-logo {
            height: 40px;
            width: 100px;
            object-fit: contain;
          }
          .logo-fallback {
            height: 40px;
            width: 100px;
            background: #2563eb;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 10px;
            text-align: center;
            line-height: 1.2;
          }
          .pdf-footer {
            margin-top: auto; /* Pushes footer to the bottom */
            border-top: 1px solid #eee;
            padding-top: 10px;
          }
          .pdf-page h1 { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 8px; }
          .pdf-page h2 { font-size: 18px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 25px; margin-bottom: 15px; }
          .pdf-section { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
          .pdf-section .full-width { grid-column: 1 / -1; }
          .data-item { font-size: 12px; }
          .data-item label { font-weight: 500; color: #555; display: block; margin-bottom: 2px; }
          .data-item p { border-bottom: 1px dotted #aaa; padding-bottom: 4px; min-height: 22px; }
          .terms-list, .declarations-list { list-style-position: outside; padding-left: 20px; font-size: 12px; line-height: 1.6; }
          .terms-list li, .declarations-list li { margin-bottom: 10px; }
          .signature-section { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; margin-top: 20px; }
          .signature-block { text-align: center; }
          .signature-image { border: 1px solid #eee; width: 250px; height: 80px; object-fit: contain; margin: 0 auto; display: block; }
          .signature-line { border-top: 1px solid #333; margin-top: 10px; padding-top: 5px; font-size: 12px; }
          
          /* --- STYLES FOR PROFILE PICTURE --- */
          .buyer-info-container {
            display: flex;
            align-items: flex-start; /* Aligns items to the top */
            gap: 20px;
          }
          .profile-pic-pdf {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #ddd;
            flex-shrink: 0; /* Prevents the image from shrinking */
          }
          .buyer-details {
            flex-grow: 1;
          }
          .buyer-details .pdf-section {
            margin-bottom: 0; /* Remove margin from inner section since container has it */
          }
        `}
      </style>
      
      {/* Page 1: Agreement Details */}
      <div className="pdf-page">
        <div className="pdf-header">
          {pdflogo ? (
            <img src={pdflogo} alt="Company Logo" style={{height:'50px',width:'100px'}} className="company-logo" />
          ) : (
            <div className="logo-fallback">NAVBHARAT<br/>NIWAS</div>
          )}
          <span>Navbharat Niwas Private Limited - Property Purchase Agreement</span>
        </div>
        <h1>PROPERTY PURCHASE AGREEMENT</h1>
        <p style={{textAlign: 'center', fontSize: '12px', color: '#666', marginBottom: '20px'}}>Date: {today}</p>
        
        <h2>Buyer Information</h2>
        <div className="buyer-info-container">
            <img src={userimage} alt="Buyer Profile"  className="profile-pic-pdf" />
          <div className="buyer-details">
            <div className="pdf-section">
              <div className="data-item"><label>Full Name</label><p>{userData.name}</p></div>
              <div className="data-item"><label>S/o / D/o</label><p>{userData.fatherName}</p></div>
              <div className="data-item full-width"><label>Address</label><p>{userData.address}</p></div>
              <div className="data-item"><label>Phone Number</label><p>{userData.phone}</p></div>
              <div className="data-item"><label>Email</label><p>{userData.email}</p></div>
              <div className="data-item"><label>PAN Card</label><p>{userData.panCard}</p></div>
              <div className="data-item"><label>Aadhaar</label><p>{userData.aadhar}</p></div>
            </div>
          </div>
        </div>

        <h2>Booking Details</h2>
        <div className="pdf-section">
          <div className="data-item"><label>Project</label><p>{bookingData.project}</p></div>
          <div className="data-item"><label>Unit Number</label><p>{bookingData.unitNumber}</p></div>
          <div className="data-item"><label>Area</label><p>{bookingData.area}</p></div>
          <div className="data-item"><label>Total Cost</label><p>{bookingData.totalCost}</p></div>
          <div className="data-item"><label>Booking Amount</label><p>{bookingData.bookingAmount}</p></div>
          <div className="data-item"><label>Payment Plan</label><p>{bookingData.paymentPlan}</p></div>
        </div>

        <h2 style={{marginTop: '40px'}}>Agreement Acknowledgment</h2>
        <div className="signature-section">
          <div className="signature-block">
            <p style={{fontSize: '12px', color: '#555', marginBottom: '10px'}}>Buyer's Signature:</p>
            {signatureDataUrl && <img src={signatureDataUrl} alt="Buyer's Signature" className="signature-image" />}
            <div className="signature-line">{userData.name}</div>
          </div>
          <div className="signature-block">
            <p style={{fontSize: '12px', color: '#555', marginBottom: '10px'}}>For Navbharat Niwas Private Limited:</p>
            <div style={{height: '80px'}}></div>
            <div className="signature-line">Authorized Signatory</div>
          </div>
        </div>

        <div className="pdf-footer">Page 1 of 3</div>
      </div>

      {/* Page 2: Terms & Conditions */}
      <div className="pdf-page">
        <div className="pdf-header">
          {pdflogo ? (
            <img src={pdflogo} alt="Company Logo" style={{height:'50px',width:'100px'}} className="company-logo" />
          ) : (
            <div className="logo-fallback">NAVBHARAT<br/>NIWAS</div>
          )}
          <span>Terms & Conditions</span>
        </div>
        <h2>Terms & Conditions</h2>
        <ol className="terms-list">
          {termsAndConditions.map((term, index) => <li key={index}>{term}</li>)}
        </ol>

        <h2 style={{marginTop: '40px'}}>Terms & Conditions Acceptance</h2>
        <div className="signature-section">
          <div className="signature-block">
            <p style={{fontSize: '12px', color: '#555', marginBottom: '10px'}}>Buyer's Signature:</p>
            {signatureDataUrl && <img src={signatureDataUrl} alt="Buyer's Signature" className="signature-image" />}
            <div className="signature-line">{userData.name}</div>
          </div>
          <div className="signature-block">
            <p style={{fontSize: '12px', color: '#555', marginBottom: '10px'}}>For Navbharat Niwas Private Limited:</p>
            <div style={{height: '80px'}}></div>
            <div className="signature-line">Authorized Signatory</div>
          </div>
        </div>

        <div className="pdf-footer">Page 2 of 3</div>
      </div>

      {/* Page 3: Declaration & Final Signature */}
      <div className="pdf-page">
        <div className="pdf-header">
          {pdflogo ? (
            <img src={pdflogo} alt="Company Logo" style={{height:'50px',width:'100px'}} className="company-logo" />
          ) : (
            <div className="logo-fallback">NAVBHARAT<br/>NIWAS</div>
          )}
          <span>Declaration & Final Agreement</span>
        </div>
        <h2>Declaration</h2>
        <ul className="declarations-list">
          {declarations.map((dec, index) => <li key={index}>{dec}</li>)}
        </ul>

        <h2 style={{marginTop: '40px'}}>Final Signatures</h2>
        <div className="signature-section">
          <div className="signature-block">
            <p style={{fontSize: '12px', color: '#555', marginBottom: '10px'}}>Buyer's Signature:</p>
            {signatureDataUrl && <img src={signatureDataUrl} alt="Buyer's Signature" className="signature-image" />}
            <div className="signature-line">{userData.name}</div>
          </div>
          <div className="signature-block">
            <p style={{fontSize: '12px', color: '#555', marginBottom: '10px'}}>For Navbharat Niwas Private Limited:</p>
            <div style={{height: '80px'}}></div>
            <div className="signature-line">Authorized Signatory</div>
          </div>
        </div>
        <p style={{fontSize: '11px', color: '#777', marginTop: '30px', textAlign: 'center'}}>
          By signing, all parties acknowledge they have read, understood, and agree to the terms herein.
        </p>

        <div className="pdf-footer">Page 3 of 3</div>
      </div>
    </div>
  );
});

export default PrintableAgreement;