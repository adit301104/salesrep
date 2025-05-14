import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo2 from "../images/Logo2.png";
import axios from "axios";

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const CaForm2 = () => {
  const [formData, setFormData] = useState({
    accountNumber: "",
    clientLegalName: "",
    doingBusinessAs: "",
    address: "",
    postalCode: "",
    owner: "",
    cellNumber: "",
    businessTel: "",
    email: "",
    inBusinessSince: "",
    service: "",
    term: "",
    discount: "",
    dateCity: "",
    contractDay: "",
    contractMonth: "",
    contractYear: "",
    representativeSignature: null,
    vendorSignature: null
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewRepSignature, setPreviewRepSignature] = useState(null);
  const [previewVendorSignature, setPreviewVendorSignature] = useState(null);
  const repSignatureRef = useRef(null);
  const vendorSignatureRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignatureUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'representative') {
          // Don't store the file object, just the base64 string for submission
          setPreviewRepSignature(reader.result);
        } else {
          // Don't store the file object, just the base64 string for submission
          setPreviewVendorSignature(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSignatureUpload = (type) => {
    if (type === 'representative') {
      repSignatureRef.current.click();
    } else {
      vendorSignatureRef.current.click();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const showNotificationMessage = (type, message) => {
    setNotificationType(type);
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Basic validation
      if (!formData.clientLegalName.trim() || !formData.owner.trim()) {
        throw new Error("Client legal name and owner information are required");
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }
      
      // Based on the error message, let's adjust our approach to match CaForm1
      // Instead of using FormData for file uploads directly, we'll convert signatures to base64
      // and send everything as a standard JSON object
      
      // Convert signature files to base64 strings if they exist
      let repSignatureBase64 = null;
      let vendorSignatureBase64 = null;
      
      if (previewRepSignature) {
        // We already have the base64 from the preview
        repSignatureBase64 = previewRepSignature;
      }
      
      if (previewVendorSignature) {
        // We already have the base64 from the preview
        vendorSignatureBase64 = previewVendorSignature;
      }
      
      // Create a standard JSON object with all fields including base64 signatures
      const submissionData = {
        formType: "CaForm2",
        title: `Auto Parts Vendor Contract - ${formData.clientLegalName}`,
        fields: {
          accountNumber: formData.accountNumber,
          clientLegalName: formData.clientLegalName,
          doingBusinessAs: formData.doingBusinessAs,
          address: formData.address,
          postalCode: formData.postalCode,
          owner: formData.owner,
          cellNumber: formData.cellNumber,
          businessTel: formData.businessTel,
          email: formData.email,
          inBusinessSince: formData.inBusinessSince,
          service: formData.service,
          term: formData.term,
          discount: formData.discount,
          dateCity: formData.dateCity,
          contractDay: formData.contractDay,
          contractMonth: formData.contractMonth,
          contractYear: formData.contractYear,
          representativeSignature: repSignatureBase64,
          vendorSignature: vendorSignatureBase64
        }
      };
      
      // We're sending JSON, so set the Content-Type header accordingly
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Make the API call
      const response = await api.post('/forms', submissionData, { headers });
      
      showNotificationMessage("success", "Contract submitted successfully!");
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error("Error submitting form:", err);
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Failed to submit contract";
      showNotificationMessage("error", errorMessage);
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        setTimeout(() => navigate("/login"), 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white">
      {/* Notification System */}
      {showNotification && (
        <div 
          className={`fixed top-4 right-4 ${
            notificationType === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in flex justify-between items-center`}
        >
          <span>{notificationMessage}</span>
          <button 
            onClick={() => setShowNotification(false)}
            className="ml-4 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={repSignatureRef}
        onChange={(e) => handleSignatureUpload(e, 'representative')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={vendorSignatureRef}
        onChange={(e) => handleSignatureUpload(e, 'vendor')}
        accept="image/*"
        className="hidden"
      />

      {/* Header with Logo */}
      <div className="flex justify-between items-start mb-8">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <img src={Logo2} alt="Company Logo" className="h-16" />
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold">AUTO PARTS VENDOR CONTRACT</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Account Number */}
        <div className="mb-6">
          <label className="block mb-1">Account Number:</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            className="w-40 border-b-2 border-gray-300 focus:border-green-500 outline-none"
          />
        </div>

        {/* Client Information */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block mb-1">1) Client Legal Name: <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="clientLegalName"
              value={formData.clientLegalName}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-1">2) Doing Business As:</label>
            <input
              type="text"
              name="doingBusinessAs"
              value={formData.doingBusinessAs}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">3) Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div className="w-24">
              <label className="block mb-1">Postal Code:</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">4) Owner: <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">Cell Number:</label>
              <input
                type="text"
                name="cellNumber"
                value={formData.cellNumber}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1">5) Business Tel #:</label>
              <input
                type="text"
                name="businessTel"
                value={formData.businessTel}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1">6) In business since:</label>
            <input
              type="text"
              name="inBusinessSince"
              value={formData.inBusinessSince}
              onChange={handleChange}
              className="w-40 border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
          </div>
        </div>

        {/* Service Details */}
        <div className="mb-8">
          <label className="block font-semibold mb-2">1) SERVICE</label>
          <textarea
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full h-20 border-2 border-gray-300 rounded p-2 focus:border-green-500 outline-none"
          />
        </div>

        {/* Term and Discount */}
        <div className="flex gap-8 mb-8">
          <div className="flex-1">
            <label className="block font-semibold mb-2">2) Term</label>
            <input
              type="text"
              name="term"
              value={formData.term}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-2">3) Discount</label>
            <input
              type="text"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
          </div>
        </div>

        {/* General Provisions (readonly) */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">General Provisions:</h2>
          <ol className="list-decimal pl-5 space-y-4">
            <li>Autowiz Corporation agrees to provide the vendor named above the access code to be able to access from www.autowizapp.com the automotive platform software.</li>
            <li>The vendor agrees to provide the discount stated above to all the garages and clients of Autowiz during the term of this contract.</li>
            <li>The Auto Parts Vendor shall provide refunds to all Autowiz garages and clients as per the standard policies of the Vendor.</li>
            <li>Auto Parts Vendor and Autowiz agree that all client lists, garages, individuals, businesses or entities introduced by one to the other shall remain the property of the introducing party.</li>
            <li>All transactions between the parties must be done via the platform except for payments which shall be according to Vendor procedures.</li>
            <li>This contract renews automatically for an equivalent term unless notice is received from the client 60 days prior to the expiry of their intention not to proceed with a renewal.</li>
          </ol>
        </div>

        {/* Contract Date */}
        <div className="mb-8">
          <p className="mb-4">Dated in 
            <input
              type="text"
              name="dateCity"
              value={formData.dateCity}
              onChange={handleChange}
              className="w-40 mx-2 border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
            this 
            <input
              type="text"
              name="contractDay"
              value={formData.contractDay}
              onChange={handleChange}
              className="w-10 mx-2 border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
            day of 
            <input
              type="text"
              name="contractMonth"
              value={formData.contractMonth}
              onChange={handleChange}
              className="w-40 mx-2 border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
            , 20
            <input
              type="text"
              name="contractYear"
              value={formData.contractYear}
              onChange={handleChange}
              className="w-10 ml-2 border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
          </p>
        </div>

        {/* Signatures */}
        <div className="flex justify-between mb-8">
          <div className="w-1/2 pr-4">
            <div className="border-t-2 border-gray-400 pt-2 mb-2 h-40">
              {previewRepSignature ? (
                <img 
                  src={previewRepSignature} 
                  alt="Representative Signature" 
                  className="h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-gray-500 italic">Representative signature will appear here</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => triggerSignatureUpload('representative')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-4 rounded text-sm"
            >
              Upload Representative Signature
            </button>
            <p className="mt-2">Signature of Representative</p>
          </div>
          <div className="w-1/2 pl-4">
            <div className="border-t-2 border-gray-400 pt-2 mb-2 h-40">
              {previewVendorSignature ? (
                <img 
                  src={previewVendorSignature} 
                  alt="Vendor Signature" 
                  className="h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-gray-500 italic">Vendor signature will appear here</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => triggerSignatureUpload('vendor')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-4 rounded text-sm"
            >
              Upload Vendor Signature
            </button>
            <p className="mt-2">Signature of vendor</p>
            <p className="text-sm mt-2">I am authorized to sign for the Corporation</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm">
          <p>CANADA – United States Tel: 613-282-5558, Email: sales@autowizapp.com</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded"
          >
            Print Contract
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-2 px-6 rounded ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Contract'}
          </button>
        </div>
      </form>

      {/* Print-specific styles */}
      <style>{`
        @media print {
          .print-hidden {
            display: none;
          }
          body {
            padding: 20px;
            font-size: 14px;
          }
          button {
            display: none;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CaForm2;