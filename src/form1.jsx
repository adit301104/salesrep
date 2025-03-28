import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFileAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import Logo from "./images/Logo.png";

const Form1 = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [activeButton, setActiveButton] = useState("Sales Forms");
  const [formData, setFormData] = useState({
    accountNumber: "",
    clientLegalName: "",
    doingBusinessAs: "",
    address: "",
    postalCode: "",
    ownerName: "",
    email: "",
    businessContact: "",
    cellNumber: "",
    businessTel: "",
    inBusinessSince: "",
    serviceDetails: "",
    monthlyInvoice: "",
    monthlyWithdrawalDate: "",
    term: "",
    discount: "",
    clientSignature: null,
    salesRepSignature: null
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const allFieldsFilled = () => {
    return Object.entries(formData).every(([key, value]) => {
      if (key === 'clientSignature' || key === 'salesRepSignature') {
        return value !== null;
      }
      return value.toString().trim() !== "";
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (allFieldsFilled()) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        navigate("/home");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Notification Popup */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-md shadow-lg animate-bounce">
            Form Submitted Successfully!
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <div className="w-full md:w-64 lg:w-72 bg-[#0e172b] p-4 md:p-6 shadow-md flex-shrink-0">
        <div className="flex flex-col h-full">
          <div className="mb-6 md:mb-8 flex justify-center md:justify-start">
            <img src={Logo} alt="Autowiz Logo" className="h-12 w-auto object-contain" />
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => setActiveButton("Sales Forms")}
              className={`flex items-center w-full text-base md:text-lg font-medium py-2 md:py-3 px-3 md:px-4 rounded transition-colors ${
                activeButton === "Sales Forms"
                  ? "bg-[#90EE90] text-black"
                  : "text-gray-200 hover:bg-gray-700"
              }`}
            >
              <FaFileAlt className="mr-3 flex-shrink-0" size={18} />
             <Link to="/home" > <span className="truncate">Sales Forms</span></Link>
            </button>
            
            <button
              onClick={() => setActiveButton("My Data")}
              className={`flex items-center w-full text-base md:text-lg font-medium py-2 md:py-3 px-3 md:px-4 rounded transition-colors ${
                activeButton === "My Data"
                  ? "bg-[#90EE90] text-black"
                  : "text-gray-200 hover:bg-gray-700"
              }`}
            >
              <FaUser className="mr-3 flex-shrink-0" size={18} />
              <span className="truncate">My Data</span>
            </button>
            
            <Link to="/" className="block w-full">
              <button
                onClick={() => setActiveButton("Logout")}
                className={`flex items-center w-full text-base md:text-lg font-medium py-2 md:py-3 px-3 md:px-4 rounded transition-colors ${
                  activeButton === "Logout"
                    ? "bg-[#90EE90] text-black"
                    : "text-gray-200 hover:bg-gray-700"
                }`}
              >
                <FaSignOutAlt className="mr-3 flex-shrink-0" size={18} />
                <span className="truncate">Logout</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">AUTOWIZ</h1>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number*</label>
              <input 
                type="text" 
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded" 
                required
              />
            </div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-semibold text-center mb-6 md:mb-8">AUTOWIZ GARAGE - SERVICE AGREEMENT</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h3 className="text-lg md:text-xl font-medium mb-4">Welcome to Autowiz Onboarding</h3>
              
              {/* Client Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                {[
                  { label: "Client Legal Name*", name: "clientLegalName" },
                  { label: "Doing Business As*", name: "doingBusinessAs" },
                  { label: "Address*", name: "address" },
                  { label: "Postal Code*", name: "postalCode" },
                  { label: "Owner Name*", name: "ownerName" },
                  { label: "Email Address*", name: "email", type: "email" },
                  { label: "Business Contact*", name: "businessContact" },
                  { label: "Cell Number*", name: "cellNumber", type: "tel" },
                  { label: "Business Tel*", name: "businessTel", type: "tel" },
                  { label: "In Business Since*", name: "inBusinessSince", type: "date" }
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                  </div>
                ))}
              </div>
              
              {/* Service Details */}
              <div className="mb-6">
                <h4 className="text-md md:text-lg font-medium mb-2">Service Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Service Details*", name: "serviceDetails" },
                    { label: "Monthly Invoice*", name: "monthlyInvoice" },
                    { label: "Withdrawal Date*", name: "monthlyWithdrawalDate", type: "date" },
                    { label: "Term*", name: "term" },
                    { label: "Discount*", name: "discount" }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* General Provisions */}
              <div className="mb-8">
                <h4 className="text-md md:text-lg font-medium mb-2">General Provisions</h4>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  {[
                    "Autowiz International Corporation agrees to provide the client named above the access code to be able to download from www.autowiz.us the automotive platform software.",
                    "The client agrees to pay the sum above on a monthly basis via direct credit card debit for the term described above.",
                    "There are no refunds on this service Contract.",
                    "Client agrees to pay a service charge of twice the bank fee should the monthly debit be declined.",
                    "Should the client wish to cancel this contract, a fee equivalent to two month's debits will be charged to the client's agreed form of payment, which the client agrees to pay."
                  ].map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
                <p className="mt-2 text-sm">
                  This contract renews automatically for an equivalent term unless notice is received from the client 60 days prior to the expiry of their intention not to proceed with a renewal.
                </p>
              </div>
              
              {/* Signatures Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                  <input 
                    type="text" 
                    placeholder="Bob Kenan" 
                    
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100" 
                  />
                  <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Client Signature*</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      name="clientSignature"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      id="client-signature"
                      required
                    />
                    <label 
                      htmlFor="client-signature" 
                      className="w-full p-2 border border-gray-300 rounded inline-block bg-white"
                    >
                      {formData.clientSignature ? formData.clientSignature.name : "No file chosen"}
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sales Representative</label>
                  <input 
                    type="text" 
                    placeholder="Simmi Sharma" 
                    
                    className="w-full p-2 border border-gray-300 rounded bg-gray-100" 
                  />
                  <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Sales Rep Signature*</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      name="salesRepSignature"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      id="salesrep-signature"
                      required
                    />
                    <label 
                      htmlFor="salesrep-signature" 
                      className="w-full p-2 border border-gray-300 rounded inline-block bg-white"
                    >
                      {formData.salesRepSignature ? formData.salesRepSignature.name : "No file chosen"}
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-center">
                <button 
                  type="submit"
                  className={`bg-[#0e172b] text-white py-2 px-6 rounded-md hover:bg-[#1a2238] transition-colors ${
                    !allFieldsFilled() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!allFieldsFilled()}
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
          
          {/* Footer */}
          <div className="text-center text-xs text-gray-500">
            <p>CANADA – UNITED STATES Tel: 613-282-5558, www.autowiz.us</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form1;
