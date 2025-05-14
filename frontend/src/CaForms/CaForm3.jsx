import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo2 from "../images/Logo2.png";
import axios from "axios";

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const CaForm3 = () => {
  const [formData, setFormData] = useState({
    accountNumber: "",
    clientLegalName: "",
    doingBusinessAs: "",
    address: "",
    posCode: "",
    owner: "",
    celNumber: "",
    businessTel: "",
    email: "",
    inBusinessSince: "",
    representativeName: "",
    territoryNumber: "",
    repAddress: "",
    repTel: "",
    service: "",
    term: "",
    monthlyCost: "",
    withdrawalDate: "",
    contractCity: "",
    contractDay: "",
    contractMonth: "",
    contractYear: ""
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewRepSignature, setPreviewRepSignature] = useState(null);
  const [previewClientSignature, setPreviewClientSignature] = useState(null);
  const repSignatureRef = useRef(null);
  const clientSignatureRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignatureUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'representative') {
          setPreviewRepSignature(reader.result);
        } else {
          setPreviewClientSignature(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSignatureUpload = (type) => {
    if (type === 'representative') {
      repSignatureRef.current.click();
    } else {
      clientSignatureRef.current.click();
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
      
      // Create submission data object
      const submissionData = {
        formType: "CaForm3",
        title: `Auto Parts Service Contract - ${formData.clientLegalName}`,
        fields: {
          ...formData,
          representativeSignature: previewRepSignature,
          clientSignature: previewClientSignature
        }
      };
      
      // Set headers
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Make the API call
      const response = await api.post('/forms', submissionData, { headers });
      
      showNotificationMessage("success", "Service contract submitted successfully!");
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
        ref={clientSignatureRef}
        onChange={(e) => handleSignatureUpload(e, 'client')}
        accept="image/*"
        className="hidden"
      />

      {/* Header with Logo */}
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-2xl font-bold">AUTO PARTS SERVICE CONTRACT</h1>
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <img src={Logo2} alt="Autowiz Logo" className="h-16" />
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
        <div className="mb-8">
          <h2 className="font-bold mb-4">1) Client Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Client Legal Name: <span className="text-red-500">*</span></label>
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
              <label className="block mb-1">Doing Business As:</label>
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
                <label className="block mb-1">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
              <div className="w-24">
                <label className="block mb-1">POS Code:</label>
                <input
                  type="text"
                  name="posCode"
                  value={formData.posCode}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1">Owner: <span className="text-red-500">*</span></label>
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
                <label className="block mb-1">Cel Number:</label>
                <input
                  type="text"
                  name="celNumber"
                  value={formData.celNumber}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1">Business Tel #:</label>
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
              <label className="block mb-1">In business since:</label>
              <input
                type="text"
                name="inBusinessSince"
                value={formData.inBusinessSince}
                onChange={handleChange}
                className="w-40 border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Representative Information */}
        <div className="mb-8">
          <h2 className="font-bold mb-4">2) Representative Information</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1">Representative Name:</label>
                <input
                  type="text"
                  name="representativeName"
                  value={formData.representativeName}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
              <div className="w-24">
                <label className="block mb-1">Terr. #:</label>
                <input
                  type="text"
                  name="territoryNumber"
                  value={formData.territoryNumber}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1">Address:</label>
                <input
                  type="text"
                  name="repAddress"
                  value={formData.repAddress}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1">Tel #:</label>
                <input
                  type="text"
                  name="repTel"
                  value={formData.repTel}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="mb-8">
          <h2 className="font-bold mb-4">Service Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">SERVICE:</label>
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1">Term:</label>
                <input
                  type="text"
                  name="term"
                  value={formData.term}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1">Monthly Cost + Taxes:</label>
                <input
                  type="text"
                  name="monthlyCost"
                  value={formData.monthlyCost}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1">Date of monthly withdrawals:</label>
              <input
                type="text"
                name="withdrawalDate"
                value={formData.withdrawalDate}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* General Provisions */}
        <div className="mb-8">
          <h2 className="font-bold mb-4">General Provisions</h2>
          <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
            <p>1) Autowiz Assistance Corporation agrees to provide the client named above the access code to be able to download from www.autowizapp.com the automotive platform software.</p>
            <p>2) The client agrees to pay the sum above on a monthly basis via direct credit card debit for the term described above.</p>
            <p>3) There are no refunds on this service Contract.</p>
            <p>4) Client agrees to pay a service charge of twice the bank fee should the monthly debit be declined.</p>
            <p>5) Should the client wish to cancel this contract, a fee equivalent to two month's debits will be charged to the client's agreed form of payment, which the client agrees to pay.</p>
            <p>6) This contract renews automatically for an equivalent term unless notice is received from the client 60 days prior to the expiry of their intention not to proceed with a renewal.</p>
          </div>
        </div>

        {/* Contract Date */}
        <div className="mb-8">
          <h2 className="font-bold mb-4">Contract Date</h2>
          <div className="flex flex-wrap gap-4">
            <div className="w-64">
              <label className="block mb-1">City:</label>
              <input
                type="text"
                name="contractCity"
                value={formData.contractCity}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div className="w-16">
              <label className="block mb-1">Day:</label>
              <input
                type="text"
                name="contractDay"
                value={formData.contractDay}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div className="w-40">
              <label className="block mb-1">Month:</label>
              <input
                type="text"
                name="contractMonth"
                value={formData.contractMonth}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div className="w-16">
              <label className="block mb-1">Year:</label>
              <input
                type="text"
                name="contractYear"
                value={formData.contractYear}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <h3 className="font-medium mb-2">Representative Signature</h3>
            <div className="border-t-2 border-gray-400 pt-2 mb-4 h-40 flex items-center justify-center bg-gray-50">
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
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-sm w-full"
            >
              Upload Representative Signature
            </button>
            <p className="text-sm mt-2 text-center">Signature of Representative</p>
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium mb-2">Client Signature</h3>
            <div className="border-t-2 border-gray-400 pt-2 mb-4 h-40 flex items-center justify-center bg-gray-50">
              {previewClientSignature ? (
                <img 
                  src={previewClientSignature} 
                  alt="Client Signature" 
                  className="h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-gray-500 italic">Client signature will appear here</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => triggerSignatureUpload('client')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-sm w-full"
            >
              Upload Client Signature
            </button>
            <p className="text-sm mt-2 text-center">I am authorized to sign for the Corporation</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm border-t border-gray-300 pt-4">
          <p>CANADA – UNITED STATES Tel: 613-282-5558, www.autowizapp.com</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded"
          >
            Print Form
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-2 px-6 rounded ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
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

export default CaForm3;