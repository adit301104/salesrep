import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo2 from "../images/Logo2.png";
import axios from "axios";

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const CaForm6 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountNumber: "",
    clientLegalName: "",
    doingBusinessAs: "",
    address: "",
    postalCode: "",
    owner: "",
    celNumber: "",
    businessTel: "",
    email: "",
    inBusinessSince: "",
    representativeName: "",
    territoryNumber: "",
    representativeAddress: "",
    representativeTel: "",
    service: "",
    term: "",
    monthlyCost: "",
    dateOfWithdrawals: "",
    location: "",
    day: "",
    month: "",
    year: ""
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewRepSignature, setPreviewRepSignature] = useState(null);
  const [previewDealerSignature, setPreviewDealerSignature] = useState(null);
  const repSignatureRef = useRef(null);
  const dealerSignatureRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSignatureUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'representative') {
          setPreviewRepSignature(reader.result);
        } else {
          setPreviewDealerSignature(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSignatureUpload = (type) => {
    if (type === 'representative') {
      repSignatureRef.current.click();
    } else {
      dealerSignatureRef.current.click();
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
        formType: "CaForm6",
        title: `Dealer Service Contract - ${formData.clientLegalName}`,
        fields: {
          ...formData,
          representativeSignature: previewRepSignature,
          dealershipSignature: previewDealerSignature
        }
      };
      
      // Set headers
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Make the API call
      const response = await api.post('/forms', submissionData, { headers });
      
      showNotificationMessage("success", "Dealer Service Contract submitted successfully!");
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

  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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
        ref={dealerSignatureRef}
        onChange={(e) => handleSignatureUpload(e, 'dealer')}
        accept="image/*"
        className="hidden"
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">DEALER SERVICE CONTRACT</h1>
        <img src={Logo2} alt="Autowiz Logo" className="h-16" />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Number */}
        <div className="flex items-center justify-end mb-4">
          <label className="font-medium mr-2">Account Number:</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 w-40"
          />
        </div>
        
        {/* Client Information */}
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="font-medium w-40">1) Client Legal Name: <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="clientLegalName"
              value={formData.clientLegalName}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 flex-grow"
              required
            />
          </div>
          
          <div className="flex items-center">
            <label className="font-medium w-40">2) Doing Business As:</label>
            <input
              type="text"
              name="doingBusinessAs"
              value={formData.doingBusinessAs}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 flex-grow"
            />
          </div>
          
          <div className="flex items-center flex-wrap">
            <label className="font-medium w-40">3) Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 flex-grow mr-2"
            />
            <label className="font-medium mx-2">Postal Code:</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 w-28"
            />
          </div>
          
          <div className="flex items-center flex-wrap">
            <label className="font-medium w-40">4) Owner: <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="owner"
              value={formData.owner}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 flex-grow mr-2"
              required
            />
            <label className="font-medium mx-2">Cel Number:</label>
            <input
              type="tel"
              name="celNumber"
              value={formData.celNumber}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 w-40"
            />
          </div>
          
          <div className="flex items-center flex-wrap">
            <label className="font-medium w-40">5) Business Tel #:</label>
            <input
              type="tel"
              name="businessTel"
              value={formData.businessTel}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 w-40 mr-2"
            />
            <label className="font-medium mx-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 flex-grow"
            />
          </div>
          
          <div className="flex items-center">
            <label className="font-medium w-40">6) In business since:</label>
            <input
              type="text"
              name="inBusinessSince"
              value={formData.inBusinessSince}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 w-40"
            />
          </div>
        </div>
        
        {/* Representative Information */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center flex-wrap">
            <label className="font-medium w-40">1) Representative Name:</label>
            <input
              type="text"
              name="representativeName"
              value={formData.representativeName}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 flex-grow mr-2"
            />
            <label className="font-medium mx-2">Terr. #</label>
            <input
              type="text"
              name="territoryNumber"
              value={formData.territoryNumber}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 w-28"
            />
          </div>
          
          <div className="flex items-center flex-wrap">
            <label className="font-medium w-40">2) Address:</label>
            <input
              type="text"
              name="representativeAddress"
              value={formData.representativeAddress}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 flex-grow mr-2"
            />
            <label className="font-medium mx-2">Tel #:</label>
            <input
              type="tel"
              name="representativeTel"
              value={formData.representativeTel}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 w-40"
            />
          </div>
        </div>
        
        {/* Service Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-start">
            <label className="font-medium w-40">SERVICE:</label>
            <textarea
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 flex-grow h-20"
            ></textarea>
          </div>
          
          <div className="flex items-center flex-wrap">
            <label className="font-medium w-40">Term:</label>
            <input
              type="text"
              name="term"
              value={formData.term}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 w-40 mr-4"
            />
            
            <label className="font-medium mx-2">Monthly Cost + Taxes:</label>
            <input
              type="text"
              name="monthlyCost"
              value={formData.monthlyCost}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 flex-grow"
            />
          </div>
          
          <div className="flex items-center">
            <label className="font-medium w-40">Date of monthly withdrawals:</label>
            <input
              type="text"
              name="dateOfWithdrawals"
              value={formData.dateOfWithdrawals}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none p-1 flex-grow"
            />
          </div>
          
          <hr className="border-t border-gray-300" />
        </div>
        
        {/* General Provisions */}
        <div className="pt-4">
          <h2 className="text-xl font-bold mb-4">General Provisions:</h2>
          
          <div className="space-y-4 text-sm bg-gray-50 p-4 rounded-lg">
            <p>1) Autowiz Assistance Corporation agrees to provide the client named above the access code to be able to download from www.autowizapp.com the automotive platform software.</p>
            
            <p>2) The client agrees to pay the sum above on a monthly basis via direct credit card debit for the term described above.</p>
            
            <p>3) There are no refunds on this service Contract.</p>
            
            <p>4) Client agrees to pay a service charge of twice the bank fee should the monthly debit be declined.</p>
            
            <p>5) Should the client wish to cancel this contract, a fee equivalent to two month's debits will be charged to the client's agreed form of payment, which the client agrees to pay.</p>
            
            <p>6) This contract renews automatically for an equivalent term unless notice is received from the client 60 days prior to the expiry of their intention not to proceed with a renewal.</p>
          </div>
        </div>
        
        {/* Date and Signatures */}
        <div className="pt-4">
          <div className="flex items-center flex-wrap mb-6">
            <span className="mr-2">Dated in</span>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none mx-2 w-40 text-center"
            />
            <span className="mx-2">this</span>
            <input
              type="text"
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none w-10 text-center mx-1"
            />
            <span className="mx-1">day of</span>
            <input
              type="text"
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none w-32 text-center mx-1"
            />
            <span className="mx-1">, 20</span>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none w-10 text-center"
              placeholder={currentYear.toString().substr(-2)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-medium block mb-2">Signature of Representative:</label>
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
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm w-full"
              >
                Upload Representative Signature
              </button>
            </div>
            
            <div>
              <label className="font-medium block mb-2">Signature for the dealership:</label>
              <div className="border-t-2 border-gray-400 pt-2 mb-4 h-40 flex items-center justify-center bg-gray-50">
                {previewDealerSignature ? (
                  <img 
                    src={previewDealerSignature} 
                    alt="Dealership Signature" 
                    className="h-full max-w-full object-contain"
                  />
                ) : (
                  <p className="text-gray-500 italic">Dealership signature will appear here</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => triggerSignatureUpload('dealer')}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm w-full"
              >
                Upload Dealership Signature
              </button>
              <p className="text-sm text-gray-600 mt-2 text-center">I am authorized to sign for the Corporation</p>
            </div>
          </div>
        </div>
        
        {/* Footer Information */}
        <div className="text-center text-sm text-gray-600 pt-4 border-t">
          <p>CANADA – UNITED STATES Tel: 613-282-5558, www.autowizapp.com</p>
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
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded ${
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

export default CaForm6;