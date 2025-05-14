import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../images/Logo2.png";

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const USForm4 = () => {
  const [formData, setFormData] = useState({
    date: "",
    territory: "",
    businessName: "",
    contact: "",
    address: "",
    businessPhone: "",
    cellPhone: "",
    emailAddress: "",
    callResults: {
      appointment: false,
      appointmentDate: "",
      appointmentTime: "",
      callBackDate: "",
      videoRequest: "",
      moreInfoRequest: ""
    },
    callNotes: "",
    fieldVisit: {
      sale: false,
      contractAttached: "",
      callBackRequired: false,
      callBackDate: "",
      moreInfoRequired: "",
      notInterested: false,
      notInterestedReason: ""
    },
    fieldNotes: "",
    salesAgent: "",
    salesManager: ""
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salesAgentSignature, setSalesAgentSignature] = useState(null);
  const [salesManagerSignature, setSalesManagerSignature] = useState(null);
  const salesAgentSignatureInputRef = useRef(null);
  const salesManagerSignatureInputRef = useRef(null);
  
  const navigate = useNavigate();

  // Get current date for default value
  const today = new Date().toISOString().split('T')[0];
  
  // Initialize form with default date value
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      date: today
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      // Handle nested objects
      if (name.includes('.')) {
        const [objectName, fieldName] = name.split('.');
        return {
          ...prev,
          [objectName]: {
            ...prev[objectName],
            [fieldName]: value
          }
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name.includes('.')) {
      const [objectName, fieldName] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [objectName]: {
          ...prev[objectName],
          [fieldName]: checked
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: checked }));
    }
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [objectName, fieldName] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [objectName]: {
          ...prev[objectName],
          [fieldName]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSignatureUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'salesAgent') {
          setSalesAgentSignature(event.target.result);
        } else {
          setSalesManagerSignature(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearSignature = (type) => {
    if (type === 'salesAgent') {
      setSalesAgentSignature(null);
      if (salesAgentSignatureInputRef.current) {
        salesAgentSignatureInputRef.current.value = "";
      }
    } else {
      setSalesManagerSignature(null);
      if (salesManagerSignatureInputRef.current) {
        salesManagerSignatureInputRef.current.value = "";
      }
    }
  };

  const showNotificationMessage = (type, message) => {
    setNotificationType(type);
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Basic validation
      if (!formData.businessName.trim()) {
        throw new Error("Business Name is required");
      }
      if (!formData.contact.trim()) {
        throw new Error("Contact is required");
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }
      
      // Create submission data object
      const submissionData = {
        formType: "USForm4",
        title: `Client Contact Sheet - ${formData.businessName}`,
        fields: {
          ...formData,
          salesAgentSignature: salesAgentSignature,
          salesManagerSignature: salesManagerSignature
        }
      };
      
      // Set headers
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Make the API call
      const response = await api.post('/forms', submissionData, { headers });
      
      showNotificationMessage("success", "Contact form submitted successfully!");
      setTimeout(() => navigate("/home"), 2000);
      
    } catch (err) {
      console.error("Error submitting form:", err);
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Failed to submit the form";
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

      {/* Header with Logo */}
      <div className="flex justify-between items-start mb-8">
        <img src={Logo} alt="AutoWiz Logo" className="h-16" />
        <div className="text-right">
          <h1 className="text-2xl font-bold">AUTOWIZ CLIENT CONTACT SHEET</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Client Information */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-1">DATE: <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-1">TERRITORY:</label>
            <input
              type="text"
              name="territory"
              value={formData.territory}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block mb-1">BUSINESS NAME: <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">CONTACT: <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1">ADDRESS:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">BUSINESS PHONE:</label>
              <input
                type="tel"
                name="businessPhone"
                value={formData.businessPhone}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-1">CELL PHONE:</label>
              <input
                type="tel"
                name="cellPhone"
                value={formData.cellPhone}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="block mb-1">EMAIL ADDRESS:</label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
          </div>
        </div>

        {/* Call Results Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 border-b-2 border-gray-300">CALL RESULTS:</h2>
          
          <div className="ml-4 space-y-4">
            <div className="flex items-center">
              <div className="w-8">1)</div>
              <div>
                <label className="font-semibold">APPOINTMENT:</label>
                <div className="flex items-center mt-2">
                  <div className="flex items-center mr-6">
                    <label className="inline-block mr-2">DATE:</label>
                    <input
                      type="date"
                      name="callResults.appointmentDate"
                      value={formData.callResults.appointmentDate}
                      onChange={handleChange}
                      className="border-b-2 border-gray-300 focus:border-green-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="inline-block mr-2">TIME:</label>
                    <input
                      type="time"
                      name="callResults.appointmentTime"
                      value={formData.callResults.appointmentTime}
                      onChange={handleChange}
                      className="border-b-2 border-gray-300 focus:border-green-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8">2)</div>
              <div className="flex items-center">
                <label className="mr-2">CALL BACK DATE:</label>
                <input
                  type="date"
                  name="callResults.callBackDate"
                  value={formData.callResults.callBackDate}
                  onChange={handleChange}
                  className="border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8">3)</div>
              <div>
                <label className="mr-2">VIDEO REQUEST:</label>
                <div className="inline-flex items-center ml-4">
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      name="callResults.videoRequest"
                      value="YES"
                      checked={formData.callResults.videoRequest === "YES"}
                      onChange={handleRadioChange}
                      className="mr-1"
                    />
                    <span>YES</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="callResults.videoRequest"
                      value="NO"
                      checked={formData.callResults.videoRequest === "NO"}
                      onChange={handleRadioChange}
                      className="mr-1"
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8">4)</div>
              <div>
                <label className="mr-2">MORE INFORMATION REQUEST:</label>
                <div className="inline-flex items-center ml-4">
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      name="callResults.moreInfoRequest"
                      value="YES"
                      checked={formData.callResults.moreInfoRequest === "YES"}
                      onChange={handleRadioChange}
                      className="mr-1"
                    />
                    <span>YES</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="callResults.moreInfoRequest"
                      value="NO"
                      checked={formData.callResults.moreInfoRequest === "NO"}
                      onChange={handleRadioChange}
                      className="mr-1"
                    />
                    <span>NO</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block mb-1">NOTES:</label>
            <textarea
              name="callNotes"
              value={formData.callNotes}
              onChange={handleChange}
              rows={4}
              className="w-full border-2 border-gray-300 focus:border-green-500 outline-none p-2"
            ></textarea>
          </div>
        </div>

        {/* Field Visit Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 border-b-2 border-gray-300">FIELD VISIT:</h2>
          
          <div className="ml-4 space-y-4">
            <div className="flex items-center">
              <div className="w-8">1)</div>
              <div>
                <div className="flex items-center">
                  <label className="mr-2">SALE:</label>
                  <input
                    type="checkbox"
                    name="fieldVisit.sale"
                    checked={formData.fieldVisit.sale}
                    onChange={handleCheckboxChange}
                    className="mr-4"
                  />
                  <label className="mr-2">CONTRACT & BANK INFO ATTACHED</label>
                  <div className="inline-flex items-center ml-4">
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="radio"
                        name="fieldVisit.contractAttached"
                        value="YES"
                        checked={formData.fieldVisit.contractAttached === "YES"}
                        onChange={handleRadioChange}
                        className="mr-1"
                      />
                      <span>YES</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="fieldVisit.contractAttached"
                        value="NO"
                        checked={formData.fieldVisit.contractAttached === "NO"}
                        onChange={handleRadioChange}
                        className="mr-1"
                      />
                      <span>NO</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8">2)</div>
              <div className="flex items-center">
                <label className="mr-2">CALL BACK REQUIRED:</label>
                <input
                  type="checkbox"
                  name="fieldVisit.callBackRequired"
                  checked={formData.fieldVisit.callBackRequired}
                  onChange={handleCheckboxChange}
                  className="mr-4"
                />
                <label className="mr-2">DATE:</label>
                <input
                  type="date"
                  name="fieldVisit.callBackDate"
                  value={formData.fieldVisit.callBackDate}
                  onChange={handleChange}
                  className="border-b-2 border-gray-300 focus:border-green-500 outline-none"
                  disabled={!formData.fieldVisit.callBackRequired}
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8">3)</div>
              <div className="flex items-center">
                <label className="mr-2">MORE INFORMATION REQUIRED:</label>
                <input
                  type="text"
                  name="fieldVisit.moreInfoRequired"
                  value={formData.fieldVisit.moreInfoRequired}
                  onChange={handleChange}
                  className="flex-grow border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-8">4)</div>
              <div className="flex items-center">
                <label className="mr-2">NOT INTERESTED:</label>
                <input
                  type="checkbox"
                  name="fieldVisit.notInterested"
                  checked={formData.fieldVisit.notInterested}
                  onChange={handleCheckboxChange}
                  className="mr-4"
                />
                <label className="mr-2">REASON:</label>
                <input
                  type="text"
                  name="fieldVisit.notInterestedReason"
                  value={formData.fieldVisit.notInterestedReason}
                  onChange={handleChange}
                  className="flex-grow border-b-2 border-gray-300 focus:border-green-500 outline-none"
                  disabled={!formData.fieldVisit.notInterested}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block mb-1">NOTES:</label>
            <textarea
              name="fieldNotes"
              value={formData.fieldNotes}
              onChange={handleChange}
              rows={4}
              className="w-full border-2 border-gray-300 focus:border-green-500 outline-none p-2"
            ></textarea>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between mt-8">
          <div className="w-1/2 pr-8">
            {/* Sales Agent Signature */}
            <div className="mb-2">
              {salesAgentSignature ? (
                <div className="mb-2">
                  <img 
                    src={salesAgentSignature} 
                    alt="Sales Agent Signature" 
                    className="max-h-24 max-w-full"
                  />
                  <button 
                    type="button"
                    onClick={() => handleClearSignature('salesAgent')}
                    className="text-red-500 text-sm mt-1 print:hidden"
                  >
                    Clear Signature
                  </button>
                </div>
              ) : (
                <div className="flex flex-col print:hidden">
                  <label className="text-sm text-gray-600 mb-1">Upload Sales Agent Signature:</label>
                  <input 
                    type="file" 
                    ref={salesAgentSignatureInputRef}
                    accept="image/*"
                    onChange={(e) => handleSignatureUpload(e, 'salesAgent')}
                    className="border border-gray-300 p-1 text-sm"
                  />
                </div>
              )}
            </div>
            <div className="border-t-2 border-black pt-2">
              <p>SALES AGENT</p>
              <input
                type="text"
                name="salesAgent"
                value={formData.salesAgent}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:border-green-500 outline-none mt-1"
              />
            </div>
          </div>
          <div className="w-1/2 pl-8">
            {/* Sales Manager Signature */}
            <div className="mb-2">
              {salesManagerSignature ? (
                <div className="mb-2">
                  <img 
                    src={salesManagerSignature} 
                    alt="Sales Manager Signature" 
                    className="max-h-24 max-w-full"
                  />
                  <button 
                    type="button"
                    onClick={() => handleClearSignature('salesManager')}
                    className="text-red-500 text-sm mt-1 print:hidden"
                  >
                    Clear Signature
                  </button>
                </div>
              ) : (
                <div className="flex flex-col print:hidden">
                  <label className="text-sm text-gray-600 mb-1">Upload Sales Manager Signature:</label>
                  <input 
                    type="file" 
                    ref={salesManagerSignatureInputRef}
                    accept="image/*"
                    onChange={(e) => handleSignatureUpload(e, 'salesManager')}
                    className="border border-gray-300 p-1 text-sm"
                  />
                </div>
              )}
            </div>
            <div className="border-t-2 border-black pt-2">
              <p>SALES MANAGER</p>
              <input
                type="text"
                name="salesManager"
                value={formData.salesManager}
                onChange={handleChange}
                className="w-full border-b border-gray-300 focus:border-green-500 outline-none mt-1"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm mt-12 mb-4">
          <p>UNITED STATES - CANADA Tel: 754-205-9581, Email: sales@autowizapp.com</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded"
          >
            Print Form
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </button>
        </div>
      </form>

      {/* CSS for print and animations */}
      <style>{`
        @media print {
          .print-hidden {
            display: none;
          }
          body {
            padding: 20px;
            font-size: 14px;
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

export default USForm4;