import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo2 from "../images/Logo2.png";
import axios from "axios";

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const CaForm4 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    territory: '',
    businessName: '',
    contact: '',
    address: '',
    businessPhone: '',
    cellPhone: '',
    emailAddress: '',
    callResults: {
      appointment: false,
      appointmentDate: '',
      appointmentTime: '',
      callBackDate: '',
      videoRequest: '',
      moreInfoRequest: ''
    },
    callResultsNotes: '',
    fieldVisit: {
      sale: false,
      contractAttached: '',
      callBackRequired: false,
      callBackDate: '',
      moreInfoRequired: '',
      notInterested: false,
      notInterestedReason: ''
    },
    fieldVisitNotes: '',
    salesAgentSignature: null,
    salesManagerSignature: null
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewAgentSignature, setPreviewAgentSignature] = useState(null);
  const [previewManagerSignature, setPreviewManagerSignature] = useState(null);
  const agentSignatureRef = useRef(null);
  const managerSignatureRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSignatureUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (event) => {
        const base64String = event.target.result;
        if (field === 'salesAgentSignature') {
          setPreviewAgentSignature(base64String);
        } else {
          setPreviewManagerSignature(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSignatureUpload = (type) => {
    if (type === 'agent') {
      agentSignatureRef.current.click();
    } else {
      managerSignatureRef.current.click();
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
      if (!formData.businessName.trim() || !formData.contact.trim()) {
        throw new Error("Business name and contact information are required");
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }
      
      // Create submission data with all fields and base64 signatures
      const submissionData = {
        formType: "CaForm4",
        title: `Client Contact Sheet - ${formData.businessName}`,
        fields: {
          ...formData,
          salesAgentSignature: previewAgentSignature,
          salesManagerSignature: previewManagerSignature
        }
      };
      
      // Set headers with authorization token
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Make the API call
      const response = await api.post('/forms', submissionData, { headers });
      
      showNotificationMessage("success", "Contact sheet submitted successfully!");
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error("Error submitting form:", err);
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Failed to submit contact sheet";
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
        ref={agentSignatureRef}
        onChange={(e) => handleSignatureUpload(e, 'salesAgentSignature')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={managerSignatureRef}
        onChange={(e) => handleSignatureUpload(e, 'salesManagerSignature')}
        accept="image/*"
        className="hidden"
      />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AUTOWIZ CLIENT CONTACT SHEET</h1>
        <img src={Logo2} alt="Autowiz Logo" className="h-16" />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <label className="font-medium w-24">DATE: <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="border p-2 flex-grow"
              required
            />
          </div>
          <div className="flex items-center">
            <label className="font-medium w-24">TERRITORY:</label>
            <input
              type="text"
              name="territory"
              value={formData.territory}
              onChange={handleInputChange}
              className="border p-2 flex-grow"
            />
          </div>
        </div>
        
        {/* Business Information */}
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="font-medium w-40">BUSINESS NAME: <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              className="border p-2 flex-grow"
              required
            />
          </div>
          
          <div className="flex items-center">
            <label className="font-medium w-40">CONTACT: <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className="border p-2 flex-grow"
              required
            />
          </div>
          
          <div className="flex items-center">
            <label className="font-medium w-40">ADDRESS:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="border p-2 flex-grow"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <label className="font-medium w-40">BUSINESS PHONE:</label>
              <input
                type="tel"
                name="businessPhone"
                value={formData.businessPhone}
                onChange={handleInputChange}
                className="border p-2 flex-grow"
              />
            </div>
            
            <div className="flex items-center">
              <label className="font-medium w-40">CELL PHONE:</label>
              <input
                type="tel"
                name="cellPhone"
                value={formData.cellPhone}
                onChange={handleInputChange}
                className="border p-2 flex-grow"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="font-medium w-40">EMAIL ADDRESS:</label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleInputChange}
              className="border p-2 flex-grow"
            />
          </div>
        </div>
        
        {/* Call Results Section */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-bold mb-4">CALL RESULTS:</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="font-medium mr-4">1) APPOINTMENT:</label>
              <input
                type="checkbox"
                name="callResults.appointment"
                checked={formData.callResults.appointment}
                onChange={handleInputChange}
                className="mr-2"
              />
              
              <label className="font-medium ml-4 mr-2">DATE:</label>
              <input
                type="date"
                name="callResults.appointmentDate"
                value={formData.callResults.appointmentDate}
                onChange={handleInputChange}
                className="border p-2 mr-4"
              />
              
              <label className="font-medium mr-2">TIME:</label>
              <input
                type="time"
                name="callResults.appointmentTime"
                value={formData.callResults.appointmentTime}
                onChange={handleInputChange}
                className="border p-2"
              />
            </div>
            
            <div className="flex items-center">
              <label className="font-medium w-40">2) CALL BACK DATE:</label>
              <input
                type="date"
                name="callResults.callBackDate"
                value={formData.callResults.callBackDate}
                onChange={handleInputChange}
                className="border p-2"
              />
            </div>
            
            <div className="flex items-center">
              <label className="font-medium w-40">3) VIDEO REQUEST:</label>
              <div className="flex items-center">
                <label className="mr-2">YES</label>
                <input
                  type="radio"
                  name="callResults.videoRequest"
                  value="yes"
                  checked={formData.callResults.videoRequest === 'yes'}
                  onChange={handleInputChange}
                  className="mr-4"
                />
                
                <label className="mr-2">NO</label>
                <input
                  type="radio"
                  name="callResults.videoRequest"
                  value="no"
                  checked={formData.callResults.videoRequest === 'no'}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="font-medium w-40">4) MORE INFORMATION REQUEST:</label>
              <div className="flex items-center">
                <label className="mr-2">YES</label>
                <input
                  type="radio"
                  name="callResults.moreInfoRequest"
                  value="yes"
                  checked={formData.callResults.moreInfoRequest === 'yes'}
                  onChange={handleInputChange}
                  className="mr-4"
                />
                
                <label className="mr-2">NO</label>
                <input
                  type="radio"
                  name="callResults.moreInfoRequest"
                  value="no"
                  checked={formData.callResults.moreInfoRequest === 'no'}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <label className="font-medium block mb-2">NOTES:</label>
              <textarea
                name="callResultsNotes"
                value={formData.callResultsNotes}
                onChange={handleInputChange}
                className="border p-2 w-full h-24"
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Field Visit Section */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-bold mb-4">FIELD VISIT:</h2>
          
          <div className="space-y-4">
            <div className="flex items-center flex-wrap">
              <label className="font-medium mr-4">1) SALE:</label>
              <input
                type="checkbox"
                name="fieldVisit.sale"
                checked={formData.fieldVisit.sale}
                onChange={handleInputChange}
                className="mr-4"
              />
              
              <label className="font-medium mr-2">CONTRACT & BANK INFO ATTACHED</label>
              <div className="flex items-center">
                <label className="mr-1">YES</label>
                <input
                  type="radio"
                  name="fieldVisit.contractAttached"
                  value="yes"
                  checked={formData.fieldVisit.contractAttached === 'yes'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                
                <label className="mr-1">NO</label>
                <input
                  type="radio"
                  name="fieldVisit.contractAttached"
                  value="no"
                  checked={formData.fieldVisit.contractAttached === 'no'}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="font-medium mr-4">2) CALL BACK REQUIRED:</label>
              <input
                type="checkbox"
                name="fieldVisit.callBackRequired"
                checked={formData.fieldVisit.callBackRequired}
                onChange={handleInputChange}
                className="mr-4"
              />
              
              <label className="font-medium mr-2">DATE:</label>
              <input
                type="date"
                name="fieldVisit.callBackDate"
                value={formData.fieldVisit.callBackDate}
                onChange={handleInputChange}
                className="border p-2"
              />
            </div>
            
            <div className="flex items-center">
              <label className="font-medium w-64">3) MORE INFORMATION REQUIRED:</label>
              <input
                type="text"
                name="fieldVisit.moreInfoRequired"
                value={formData.fieldVisit.moreInfoRequired}
                onChange={handleInputChange}
                className="border p-2 flex-grow"
              />
            </div>
            
            <div className="flex items-center">
              <label className="font-medium mr-4">4) NOT INTERESTED:</label>
              <input
                type="checkbox"
                name="fieldVisit.notInterested"
                checked={formData.fieldVisit.notInterested}
                onChange={handleInputChange}
                className="mr-4"
              />
              
              <label className="font-medium mr-2">REASON:</label>
              <input
                type="text"
                name="fieldVisit.notInterestedReason"
                value={formData.fieldVisit.notInterestedReason}
                onChange={handleInputChange}
                className="border p-2 flex-grow"
              />
            </div>
            
            <div>
              <label className="font-medium block mb-2">NOTES:</label>
              <textarea
                name="fieldVisitNotes"
                value={formData.fieldVisitNotes}
                onChange={handleInputChange}
                className="border p-2 w-full h-24"
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Signatures Section */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-medium block mb-2">SALES AGENT SIGNATURE:</label>
              <div className="border h-40 mb-2 flex items-center justify-center">
                {previewAgentSignature ? (
                  <img 
                    src={previewAgentSignature} 
                    alt="Sales Agent Signature" 
                    className="h-full max-w-full object-contain"
                  />
                ) : (
                  <p className="text-gray-500 italic">Agent signature will appear here</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => triggerSignatureUpload('agent')}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
              >
                Upload Agent Signature
              </button>
            </div>
            
            <div>
              <label className="font-medium block mb-2">SALES MANAGER SIGNATURE:</label>
              <div className="border h-40 mb-2 flex items-center justify-center">
                {previewManagerSignature ? (
                  <img 
                    src={previewManagerSignature} 
                    alt="Sales Manager Signature" 
                    className="h-full max-w-full object-contain"
                  />
                ) : (
                  <p className="text-gray-500 italic">Manager signature will appear here</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => triggerSignatureUpload('manager')}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
              >
                Upload Manager Signature
              </button>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
          >
            Print Form
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 ${
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

export default CaForm4;