import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../images/Logo2.png";

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const USForm8 = () => {
  const [formData, setFormData] = useState({
    accountNumber: "",
    clientLegalName: "",
    doingBusinessAs: "",
    address: "",
    zipCode: "",
    owner: "",
    celNumber: "",
    businessTel: "",
    email: "",
    inBusinessSince: "",
    service: "",
    additionalServiceNotes: "",
    term: "",
    discount: "",
    location: "",
    day: "",
    month: "",
    year: ""
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [representativeSignature, setRepresentativeSignature] = useState(null);
  const [garageSignature, setGarageSignature] = useState(null);
  const repSignatureInputRef = useRef(null);
  const garageSignatureInputRef = useRef(null);
  
  const navigate = useNavigate();

  // Get current date for default values
  useEffect(() => {
    const today = new Date();
    const defaultDay = today.getDate();
    const defaultMonth = today.toLocaleString('default', { month: 'long' });
    const defaultYear = today.getFullYear().toString().slice(-2); // Get last 2 digits of year
    
    setFormData(prev => ({
      ...prev,
      day: defaultDay.toString(),
      month: defaultMonth,
      year: defaultYear
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignatureUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'representative') {
          setRepresentativeSignature(event.target.result);
        } else {
          setGarageSignature(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearSignature = (type) => {
    if (type === 'representative') {
      setRepresentativeSignature(null);
      if (repSignatureInputRef.current) {
        repSignatureInputRef.current.value = "";
      }
    } else {
      setGarageSignature(null);
      if (garageSignatureInputRef.current) {
        garageSignatureInputRef.current.value = "";
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
      if (!formData.clientLegalName.trim()) {
        throw new Error("Client Legal Name is required");
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }
      
      // Convert signatures to be sent in the API
      const signatureData = {
        representativeSignature: representativeSignature || null,
        garageSignature: garageSignature || null
      };
      
      // Create submission data object
      const submissionData = {
        formType: "USForm8", 
        title: `Garage Service Contract - ${formData.clientLegalName}`,
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
      
      showNotificationMessage("success", "Garage service contract submitted successfully!");
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
          <div className="mb-4">
            <label className="block mb-1">Account Number:</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
          </div>
          <h1 className="text-2xl font-bold">GARAGE SERVICE CONTRACT</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Client Information */}
        <div className="space-y-4 mb-8">
          <div className="flex">
            <label className="w-8">1)</label>
            <div className="flex-1">
              <label className="mr-2">Client Legal Name: <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="clientLegalName"
                value={formData.clientLegalName}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">2)</label>
            <div className="flex-1">
              <label className="mr-2">Doing Business As:</label>
              <input
                type="text"
                name="doingBusinessAs"
                value={formData.doingBusinessAs}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label className="w-8">3)</label>
            <div className="flex-1 flex">
              <div className="flex-grow">
                <label className="mr-2">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
              <div className="ml-4 w-40">
                <label className="mr-2">Zip Code:</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex">
            <label className="w-8">4)</label>
            <div className="flex-1 flex">
              <div className="flex-grow">
                <label className="mr-2">Owner:</label>
                <input
                  type="text"
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
              <div className="ml-4 w-60">
                <label className="mr-2">Cel Number:</label>
                <input
                  type="text"
                  name="celNumber"
                  value={formData.celNumber}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex">
            <label className="w-8">5)</label>
            <div className="flex-1 flex">
              <div className="w-60">
                <label className="mr-2">Business Tel #:</label>
                <input
                  type="text"
                  name="businessTel"
                  value={formData.businessTel}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
              <div className="ml-4 flex-grow">
                <label className="mr-2">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex">
            <label className="w-8">6)</label>
            <div className="flex-1">
              <label className="mr-2">In business since:</label>
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

        {/* Service Information */}
        <div className="mb-8">
          <div className="flex mb-4">
            <label className="w-8">1)</label>
            <div className="flex-1">
              <label className="mr-2">SERVICE:</label>
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
              <textarea
                name="additionalServiceNotes"
                value={formData.additionalServiceNotes}
                onChange={handleChange}
                className="w-full mt-2 border-b-2 border-gray-300 focus:border-green-500 outline-none resize-none"
                rows="2"
              />
            </div>
          </div>

          <div className="flex mb-4">
            <div className="flex w-1/2">
              <label className="w-8">2)</label>
              <div className="flex-1">
                <label className="mr-2">Term:</label>
                <input
                  type="text"
                  name="term"
                  value={formData.term}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
            <div className="flex w-1/2 ml-8">
              <label className="w-8">3)</label>
              <div className="flex-1">
                <label className="mr-2">Discount:</label>
                <input
                  type="text"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* General Provisions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">General Provisions:</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>Autowiz Corporation agrees to provide the vendor named above the access code to be able to access from www.autowizapp.com the automotive platform software.</li>
            <li>The vendor agrees to provide the discount stated above to all the members of Autowiz during the term of this contract.</li>
            <li>The garage shall provide refunds and guarantees to all Autowiz members as per the standard policies of the garage.</li>
            <li>The Garage and Autowiz agree that all client lists, garages, members, individuals, businesses or entities introduced by one to the other shall remain the property of the introducing party.</li>
            <li>All transactions between the parties may be done via the platform except for payments which shall be according to Vendor procedures.</li>
          </ol>
        </div>

        {/* Signatures */}
        <div className="mb-8">
          <div className="mb-4 flex">
            <span className="mr-2">Dated in</span>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-40 border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
            <span className="mx-2">this</span>
            <input
              type="text"
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="w-12 border-b-2 border-gray-300 focus:border-green-500 outline-none text-center"
            />
            <span className="mx-2">day of</span>
            <input
              type="text"
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="w-32 border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
            <span className="mx-2">, 20</span>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-12 border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
          </div>

          <div className="flex justify-between mt-8">
            <div className="w-1/2 pr-8">
              {/* Representative Signature */}
              <div className="mb-2">
                {representativeSignature ? (
                  <div className="mb-2">
                    <img 
                      src={representativeSignature} 
                      alt="Representative Signature" 
                      className="max-h-24 max-w-full"
                    />
                    <button 
                      type="button"
                      onClick={() => handleClearSignature('representative')}
                      className="text-red-500 text-sm mt-1 print:hidden"
                    >
                      Clear Signature
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col print:hidden">
                    <label className="text-sm text-gray-600 mb-1">Upload Representative Signature:</label>
                    <input 
                      type="file" 
                      ref={repSignatureInputRef}
                      accept="image/*"
                      onChange={(e) => handleSignatureUpload(e, 'representative')}
                      className="border border-gray-300 p-1 text-sm"
                    />
                  </div>
                )}
              </div>
              <div className="border-t-2 border-black pt-2">
                <p>Signature of Representative</p>
              </div>
            </div>
            <div className="w-1/2 pl-8">
              {/* Garage Signature */}
              <div className="mb-2">
                {garageSignature ? (
                  <div className="mb-2">
                    <img 
                      src={garageSignature} 
                      alt="Garage Signature" 
                      className="max-h-24 max-w-full"
                    />
                    <button 
                      type="button"
                      onClick={() => handleClearSignature('garage')}
                      className="text-red-500 text-sm mt-1 print:hidden"
                    >
                      Clear Signature
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col print:hidden">
                    <label className="text-sm text-gray-600 mb-1">Upload Garage Vendor Signature:</label>
                    <input 
                      type="file" 
                      ref={garageSignatureInputRef}
                      accept="image/*"
                      onChange={(e) => handleSignatureUpload(e, 'garage')}
                      className="border border-gray-300 p-1 text-sm"
                    />
                  </div>
                )}
              </div>
              <div className="border-t-2 border-black pt-2">
                <p>Signature of the garage vendor</p>
                <p>I am authorized to sign for the Corporation</p>
              </div>
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

export default USForm8;