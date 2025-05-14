import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../images/Logo2.png";

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const USForm10 = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    inBusinessSince: "",
    alwaysAtLocation: "",
    locationNotes: "",
    servicesOffered: "",
    hoursOfOperation: "",
    doorsAndLifts: "",
    mechanicsInfo: "",
    lookingForStaff: "",
    ownerWorksInShop: "",
    businessSpecialties: "",
    busiestPeriods: "",
    canHandleExtraVolume: "",
    schedulingPlatform: "",
    paymentMethods: {
      cash: false,
      mastercard: false,
      visa: false,
      amex: false
    },
    hasTowTruck: "",
    partsSupplier: "",
    sellsParts: "",
    buysSellsCars: "",
    additionalNotes: "",
    interviewerName: "",
    interviewDate: "",
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessSignature, setBusinessSignature] = useState(null);
  const [interviewerSignature, setInterviewerSignature] = useState(null);
  const businessSignatureInputRef = useRef(null);
  const interviewerSignatureInputRef = useRef(null);
  
  const navigate = useNavigate();

  // Get current date for default values
  useEffect(() => {
    const today = new Date();
    const defaultDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    
    setFormData(prev => ({
      ...prev,
      interviewDate: defaultDate
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [name]: checked
      }
    }));
  };

  const handleSignatureUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'business') {
          setBusinessSignature(event.target.result);
        } else {
          setInterviewerSignature(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearSignature = (type) => {
    if (type === 'business') {
      setBusinessSignature(null);
      if (businessSignatureInputRef.current) {
        businessSignatureInputRef.current.value = "";
      }
    } else {
      setInterviewerSignature(null);
      if (interviewerSignatureInputRef.current) {
        interviewerSignatureInputRef.current.value = "";
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
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }
      
      // Convert signatures to be sent in the API
      const signatureData = {
        businessSignature: businessSignature || null,
        interviewerSignature: interviewerSignature || null
      };
      
      // Create submission data object
      const submissionData = {
        formType: "USForm10", 
        title: `Garage Interview - ${formData.businessName}`,
        fields: {
          ...formData,
          ...signatureData
        }
      };
      
      // Set headers
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Make the API call
      const response = await api.post('/forms', submissionData, { headers });
      
      showNotificationMessage("success", "Interview form submitted successfully!");
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
          <h1 className="text-2xl font-bold">GARAGE INTERVIEW QUESTIONS</h1>
          <div className="mt-2">
            <label className="mr-2">Date:</label>
            <input
              type="text"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
              className="border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Business Information */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-lg font-semibold mb-4">Business Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Business Name: <span className="text-red-500">*</span></label>
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
              <label className="block mb-1">Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-1">Contact Person:</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-1">Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-1">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-1">Interviewer Name:</label>
              <input
                type="text"
                name="interviewerName"
                value={formData.interviewerName}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Interview Questions */}
        <div className="space-y-4 mb-8">
          <div className="flex">
            <label className="w-8">1)</label>
            <div className="flex-1">
              <label className="mr-2">How long have you been in business?</label>
              <input
                type="text"
                name="inBusinessSince"
                value={formData.inBusinessSince}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">2)</label>
            <div className="flex-1">
              <label className="block mb-1">Have you always been at this location?</label>
              <select
                name="alwaysAtLocation"
                value={formData.alwaysAtLocation}
                onChange={handleChange}
                className="mb-2 p-1 border border-gray-300 rounded"
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <label className="block mb-1 text-sm text-gray-600">
                If yes, observation about traffic/visibility. If no, previous location and reason for move:
              </label>
              <textarea
                name="locationNotes"
                value={formData.locationNotes}
                onChange={handleChange}
                className="w-full h-20 border border-gray-300 rounded p-2 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">3)</label>
            <div className="flex-1">
              <label className="mr-2">What are the services you offer?</label>
              <textarea
                name="servicesOffered"
                value={formData.servicesOffered}
                onChange={handleChange}
                className="w-full h-20 border border-gray-300 rounded p-2 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">4)</label>
            <div className="flex-1">
              <label className="mr-2">What are your hours of operation?</label>
              <input
                type="text"
                name="hoursOfOperation"
                value={formData.hoursOfOperation}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">5)</label>
            <div className="flex-1">
              <label className="mr-2">How many doors and lifts do you have?</label>
              <input
                type="text"
                name="doorsAndLifts"
                value={formData.doorsAndLifts}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">6)</label>
            <div className="flex-1">
              <label className="mr-2">How many mechanics are working for you and how long have they been here?</label>
              <textarea
                name="mechanicsInfo"
                value={formData.mechanicsInfo}
                onChange={handleChange}
                className="w-full h-20 border border-gray-300 rounded p-2 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">7)</label>
            <div className="flex-1">
              <label className="mr-2">Is the business looking for additional staff?</label>
              <input
                type="text"
                name="lookingForStaff"
                value={formData.lookingForStaff}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">8)</label>
            <div className="flex-1">
              <label className="mr-2">Does the owner also work in the shop fixing cars?</label>
              <input
                type="text"
                name="ownerWorksInShop"
                value={formData.ownerWorksInShop}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">9)</label>
            <div className="flex-1">
              <label className="mr-2">Does the business have specialties such as foreign cars, custom vehicles etc?</label>
              <textarea
                name="businessSpecialties"
                value={formData.businessSpecialties}
                onChange={handleChange}
                className="w-full h-20 border border-gray-300 rounded p-2 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">10)</label>
            <div className="flex-1">
              <label className="mr-2">What time of the month or week are you busiest?</label>
              <textarea
                name="busiestPeriods"
                value={formData.busiestPeriods}
                onChange={handleChange}
                className="w-full h-20 border border-gray-300 rounded p-2 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">11)</label>
            <div className="flex-1">
              <label className="mr-2">If our article brings you more business can you handle the extra volume?</label>
              <input
                type="text"
                name="canHandleExtraVolume"
                value={formData.canHandleExtraVolume}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">12)</label>
            <div className="flex-1">
              <label className="mr-2">Do you use a scheduling platform if someone wants an appointment? Could somebody book an appointment with you if they want a service?</label>
              <textarea
                name="schedulingPlatform"
                value={formData.schedulingPlatform}
                onChange={handleChange}
                className="w-full h-20 border border-gray-300 rounded p-2 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">13)</label>
            <div className="flex-1">
              <label className="block mb-2">What types of payment do you accept?</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="cash"
                    checked={formData.paymentMethods.cash}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  Cash
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="mastercard"
                    checked={formData.paymentMethods.mastercard}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  Mastercard
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="visa"
                    checked={formData.paymentMethods.visa}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  Visa
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="amex"
                    checked={formData.paymentMethods.amex}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  Amex
                </label>
              </div>
            </div>
          </div>

          <div className="flex">
            <label className="w-8">14)</label>
            <div className="flex-1">
              <label className="mr-2">Do you have a tow truck or a contract with a tow truck company?</label>
              <input
                type="text"
                name="hasTowTruck"
                value={formData.hasTowTruck}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">15)</label>
            <div className="flex-1">
              <label className="mr-2">What parts supplier do you use the most?</label>
              <input
                type="text"
                name="partsSupplier"
                value={formData.partsSupplier}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">16)</label>
            <div className="flex-1">
              <label className="mr-2">Do you sell parts such as tires, wipers, rims?</label>
              <input
                type="text"
                name="sellsParts"
                value={formData.sellsParts}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">17)</label>
            <div className="flex-1">
              <label className="mr-2">Do you buy and sell cars?</label>
              <input
                type="text"
                name="buysSellsCars"
                value={formData.buysSellsCars}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8"></label>
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Notes:</label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                className="w-full h-20 border border-gray-300 rounded p-2 focus:border-green-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="mb-8">
          <div className="flex justify-between mt-8">
            <div className="w-1/2 pr-8">
              {/* Business Owner Signature */}
              <div className="mb-2">
                {businessSignature ? (
                  <div className="mb-2">
                    <img 
                      src={businessSignature} 
                      alt="Business Owner Signature" 
                      className="max-h-24 max-w-full"
                    />
                    <button 
                      type="button"
                      onClick={() => handleClearSignature('business')}
                      className="text-red-500 text-sm mt-1 print:hidden"
                    >
                      Clear Signature
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col print:hidden">
                    <label className="text-sm text-gray-600 mb-1">Upload Business Owner Signature:</label>
                    <input 
                      type="file" 
                      ref={businessSignatureInputRef}
                      accept="image/*"
                      onChange={(e) => handleSignatureUpload(e, 'business')}
                      className="border border-gray-300 p-1 text-sm"
                    />
                  </div>
                )}
              </div>
              <div className="border-t-2 border-black pt-2">
                <p>Signature of Business Owner</p>
              </div>
            </div>
            <div className="w-1/2 pl-8">
              {/* Interviewer Signature */}
              <div className="mb-2">
                {interviewerSignature ? (
                  <div className="mb-2">
                    <img 
                      src={interviewerSignature} 
                      alt="Interviewer Signature" 
                      className="max-h-24 max-w-full"
                    />
                    <button 
                      type="button"
                      onClick={() => handleClearSignature('interviewer')}
                      className="text-red-500 text-sm mt-1 print:hidden"
                    >
                      Clear Signature
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col print:hidden">
                    <label className="text-sm text-gray-600 mb-1">Upload Interviewer Signature:</label>
                    <input 
                      type="file" 
                      ref={interviewerSignatureInputRef}
                      accept="image/*"
                      onChange={(e) => handleSignatureUpload(e, 'interviewer')}
                      className="border border-gray-300 p-1 text-sm"
                    />
                  </div>
                )}
              </div>
              <div className="border-t-2 border-black pt-2">
                <p>Signature of Interviewer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm mt-12 mb-4">
          <p>UNITED STATES - CANADA Tel: 754-205-9581, www.autowizapp.com</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8 print:hidden">
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

      {/* Print-specific styles and animations */}
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

export default USForm10;