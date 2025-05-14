import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo2 from "../images/Logo2.png";
import axios from "axios";

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const CaForm9 = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");

  const [formData, setFormData] = useState({
    accountNumber: '',
    clientLegalName: '',
    doingBusinessAs: '',
    address: '',
    postalCode: '',
    owner: '',
    celNumber: '',
    businessTel: '',
    email: '',
    inBusinessSince: '',
    representativeName: '',
    territoryNumber: '',
    representativeAddress: '',
    representativeTel: '',
    service: '',
    term: '',
    monthlyCost: '',
    dateOfWithdrawals: '',
    datingSigned: '',
    dateDaySigned: '',
    dateMonthSigned: '',
    dateYearSigned: ''
  });

  // Refs for file uploads
  const representativeSignatureRef = useRef(null);
  const clientSignatureRef = useRef(null);

  // State for signature previews
  const [previewRepresentativeSignature, setPreviewRepresentativeSignature] = useState(null);
  const [previewClientSignature, setPreviewClientSignature] = useState(null);

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
          setPreviewRepresentativeSignature(reader.result);
        } else {
          setPreviewClientSignature(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSignatureUpload = (type) => {
    if (type === 'representative') {
      representativeSignatureRef.current.click();
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
      if (!formData.clientLegalName.trim() || !formData.address.trim()) {
        throw new Error("Client legal name and address are required");
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }
      
      // Create submission data object
      const submissionData = {
        formType: "CaForm9",
        title: `Garage Service Contract - ${formData.clientLegalName}`,
        fields: {
          ...formData,
          representativeSignature: previewRepresentativeSignature,
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
      
      showNotificationMessage("success", "Garage service contract submitted successfully!");
      
      // Redirect after a short delay
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
        ref={representativeSignatureRef}
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

      <div className="print:hidden">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">GARAGE SERVICE CONTRACT</h1>
            <img src={Logo2} alt="Company Logo" className="h-16" />
          </div>

          <div className="mb-6">
            <div className="flex justify-end mb-2">
              <div className="w-1/2">
                <label htmlFor="accountNumber" className="block mb-1">Account Number:</label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="flex-1">
                <label htmlFor="clientLegalName" className="block mb-1">1) Client Legal Name: <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="clientLegalName"
                  name="clientLegalName"
                  value={formData.clientLegalName}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="flex-1">
                <label htmlFor="doingBusinessAs" className="block mb-1">2) Doing Business As:</label>
                <input
                  type="text"
                  id="doingBusinessAs"
                  name="doingBusinessAs"
                  value={formData.doingBusinessAs}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="flex-1">
                <label htmlFor="address" className="block mb-1">3) Address: <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>
              <div className="md:w-1/3">
                <label htmlFor="postalCode" className="block mb-1">POS Code:</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="flex-1">
                <label htmlFor="owner" className="block mb-1">4) Owner:</label>
                <input
                  type="text"
                  id="owner"
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div className="md:w-1/3">
                <label htmlFor="celNumber" className="block mb-1">Cel Number:</label>
                <input
                  type="text"
                  id="celNumber"
                  name="celNumber"
                  value={formData.celNumber}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="flex-1">
                <label htmlFor="businessTel" className="block mb-1">5) Business Tel #:</label>
                <input
                  type="text"
                  id="businessTel"
                  name="businessTel"
                  value={formData.businessTel}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="email" className="block mb-1">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="flex-1">
                <label htmlFor="inBusinessSince" className="block mb-1">6) In business since:</label>
                <input
                  type="text"
                  id="inBusinessSince"
                  name="inBusinessSince"
                  value={formData.inBusinessSince}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Representative Information */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="flex-1">
                <label htmlFor="representativeName" className="block mb-1">1) Representative Name:</label>
                <input
                  type="text"
                  id="representativeName"
                  name="representativeName"
                  value={formData.representativeName}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div className="md:w-1/3">
                <label htmlFor="territoryNumber" className="block mb-1">Terr. #:</label>
                <input
                  type="text"
                  id="territoryNumber"
                  name="territoryNumber"
                  value={formData.territoryNumber}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="flex-1">
                <label htmlFor="representativeAddress" className="block mb-1">2) Address:</label>
                <input
                  type="text"
                  id="representativeAddress"
                  name="representativeAddress"
                  value={formData.representativeAddress}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div className="md:w-1/3">
                <label htmlFor="representativeTel" className="block mb-1">Tel #:</label>
                <input
                  type="text"
                  id="representativeTel"
                  name="representativeTel"
                  value={formData.representativeTel}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Service, Term, Cost */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col">
              <label htmlFor="service" className="block mb-1">SERVICE:</label>
              <textarea
                id="service"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                rows="2"
                className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
              ></textarea>
            </div>

            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="flex-1">
                <label htmlFor="term" className="block mb-1">Term:</label>
                <input
                  type="text"
                  id="term"
                  name="term"
                  value={formData.term}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="monthlyCost" className="block mb-1">Monthly Cost + Taxes:</label>
                <input
                  type="text"
                  id="monthlyCost"
                  name="monthlyCost"
                  value={formData.monthlyCost}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="dateOfWithdrawals" className="block mb-1">Date of monthly withdrawals:</label>
              <input
                type="text"
                id="dateOfWithdrawals"
                name="dateOfWithdrawals"
                value={formData.dateOfWithdrawals}
                onChange={handleInputChange}
                className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          {/* General Provisions */}
          <div className="mb-8">
            <h3 className="font-bold mb-3">General Provisions:</h3>
            <div className="space-y-3 text-sm">
              <p>1) Autowiz Assistance Corporation agrees to provide the client named above the access code to be able to download from www.autowizapp.com the automotive platform software.</p>
              <p>2) The client agrees to pay the sum above on a monthly basis via direct credit card debit for the term described above.</p>
              <p>3) There are no refunds on this service Contract.</p>
              <p>4) Client agrees to pay a service charge of twice the bank fee should the monthly debit be declined.</p>
              <p>5) Should the client wish to cancel this contract, a fee equivalent to two month's debits will be charged to the client's agreed form of payment, which the client agrees to pay.</p>
              <p>6) This contract renews automatically for an equivalent term unless notice is received from the client 60 days prior to the expiry of their intention not to proceed with a renewal.</p>
            </div>
          </div>

          {/* Signature Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="datingSigned" className="block mb-1">Dated in:</label>
                <input
                  type="text"
                  id="datingSigned"
                  name="datingSigned"
                  value={formData.datingSigned}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div className="md:w-1/6">
                <label htmlFor="dateDaySigned" className="block mb-1">this</label>
                <input
                  type="text"
                  id="dateDaySigned"
                  name="dateDaySigned"
                  value={formData.dateDaySigned}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="day"
                />
              </div>
              <div className="md:w-1/4">
                <label htmlFor="dateMonthSigned" className="block mb-1">day of</label>
                <input
                  type="text"
                  id="dateMonthSigned"
                  name="dateMonthSigned"
                  value={formData.dateMonthSigned}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="month"
                />
              </div>
              <div className="md:w-1/6">
                <label htmlFor="dateYearSigned" className="block mb-1">, 20</label>
                <input
                  type="text"
                  id="dateYearSigned"
                  name="dateYearSigned"
                  value={formData.dateYearSigned}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="YY"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between mb-8">
              <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                <label className="block font-bold mb-1">Signature of Representative:</label>
                <div className="border p-2 h-32 flex items-center justify-center bg-gray-50 rounded">
                  {previewRepresentativeSignature ? (
                    <img 
                      src={previewRepresentativeSignature} 
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
                  className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
                >
                  Upload Representative Signature
                </button>
              </div>
              <div className="flex-1">
                <label className="block font-bold mb-1">Signature of Client:</label>
                <div className="border p-2 h-32 flex items-center justify-center bg-gray-50 rounded">
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
                  className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
                >
                  Upload Client Signature
                </button>
                <p className="text-center text-sm mt-2 text-gray-600">I am authorized to sign for the Corporation</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm mb-6">
            <p>CANADA – UNITED STATES Tel: 613-282-5558, www.autowizapp.com</p>
          </div>

          <div className="flex justify-between mt-6 gap-4">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 font-bold"
            >
              Print Contract
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 font-bold ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Contract'}
            </button>
          </div>
        </form>
      </div>

      {/* Print version */}
      <div className="hidden print:block">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">GARAGE SERVICE CONTRACT</h1>
          <img src={Logo2} alt="Company Logo" className="h-16" />
        </div>

        <div className="mb-6 text-right">
          <p className="font-bold">Account Number: <span className="font-normal">{formData.accountNumber}</span></p>
        </div>

        {/* Print version of client information */}
        <div className="space-y-4 mb-8">
          <p className="font-bold">1) Client Legal Name: <span className="font-normal">{formData.clientLegalName}</span></p>
          <p className="font-bold">2) Doing Business As: <span className="font-normal">{formData.doingBusinessAs}</span></p>
          <p className="font-bold">3) Address: <span className="font-normal">{formData.address}</span> POS Code: <span className="font-normal">{formData.postalCode}</span></p>
          <p className="font-bold">4) Owner: <span className="font-normal">{formData.owner}</span> Cel Number: <span className="font-normal">{formData.celNumber}</span></p>
          <p className="font-bold">5) Business Tel #: <span className="font-normal">{formData.businessTel}</span> Email: <span className="font-normal">{formData.email}</span></p>
          <p className="font-bold">6) In business since: <span className="font-normal">{formData.inBusinessSince}</span></p>
        </div>

        {/* Print version of representative information */}
        <div className="space-y-4 mb-8">
          <p className="font-bold">1) Representative Name: <span className="font-normal">{formData.representativeName}</span> Terr. #: <span className="font-normal">{formData.territoryNumber}</span></p>
          <p className="font-bold">2) Address: <span className="font-normal">{formData.representativeAddress}</span> Tel #: <span className="font-normal">{formData.representativeTel}</span></p>
        </div>

        {/* Print version of service, term, cost */}
        <div className="space-y-4 mb-8">
          <p className="font-bold">SERVICE: <span className="font-normal">{formData.service}</span></p>
          <p className="font-bold">Term: <span className="font-normal">{formData.term}</span> Monthly Cost + Taxes: <span className="font-normal">{formData.monthlyCost}</span></p>
          <p className="font-bold">Date of monthly withdrawals: <span className="font-normal">{formData.dateOfWithdrawals}</span></p>
        </div>

        {/* Print version of General Provisions */}
        <div className="mb-8">
          <h3 className="font-bold mb-3">General Provisions:</h3>
          <div className="space-y-3 text-sm">
            <p>1) Autowiz Assistance Corporation agrees to provide the client named above the access code to be able to download from www.autowizapp.com the automotive platform software.</p>
            <p>2) The client agrees to pay the sum above on a monthly basis via direct credit card debit for the term described above.</p>
            <p>3) There are no refunds on this service Contract.</p>
            <p>4) Client agrees to pay a service charge of twice the bank fee should the monthly debit be declined.</p>
            <p>5) Should the client wish to cancel this contract, a fee equivalent to two month's debits will be charged to the client's agreed form of payment, which the client agrees to pay.</p>
            <p>6) This contract renews automatically for an equivalent term unless notice is received from the client 60 days prior to the expiry of their intention not to proceed with a renewal.</p>
          </div>
        </div>

        {/* Print version of signature section */}
        <div className="mb-8">
          <p>Dated in {formData.datingSigned} this {formData.dateDaySigned} day of {formData.dateMonthSigned}, 20{formData.dateYearSigned}</p>
          
          <div className="flex justify-between mt-4">
            <div>
              {previewRepresentativeSignature && (
                <img src={previewRepresentativeSignature} alt="Representative Signature" className="h-16" />
              )}
              <p className="mt-1 border-t border-black pt-1">Signature of Representative</p>
            </div>
            <div>
              {previewClientSignature && (
                <img src={previewClientSignature} alt="Client Signature" className="h-16" />
              )}
              <p className="mt-1 border-t border-black pt-1">Signature of Client</p>
              <p className="text-sm">I am authorized to sign for the Corporation</p>
            </div>
          </div>
        </div>

        {/* Print version of footer */}
        <div className="text-center text-sm mb-6">
          <p>CANADA – UNITED STATES Tel: 613-282-5558, www.autowizapp.com</p>
        </div>
      </div>

      {/* CSS for animations */}
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

export default CaForm9;