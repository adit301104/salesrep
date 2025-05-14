import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo2 from "../images/Logo2.png";
import axios from "axios";

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const CaForm7 = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  
  const [formData, setFormData] = useState({
    garageName: '',
    tmName: '',
    services: {
      oilChanges: false,
      diagnostic: false,
      airConditioning: false,
      transmission: false,
      brakes: false,
      glassReplacement: false,
      suspension: false,
      engine: false,
      pipesAndExhaust: false,
      electricals: false,
      tuneUps: false,
      wheelAlignment: false,
      tireChanges: false,
      steering: false,
      tankReplacement: false,
      batteryChanges: false,
      hosesAndBelts: false,
      radiator: false,
      wipers: false,
      towing: false,
      doorLocks: false,
      gasoline: false,
      boost: false,
      trailerHitches: false
    },
    facilities: {
      publicWashrooms: false,
      shuttle: false,
      autoLoaner: false,
      childrenArea: false,
      publicTransit: false,
      drinks: false,
      nearRestaurant: false,
      openWeekends: false,
      multipleBays: false,
      waitingArea: false,
      openEvenings: false,
      safeArea: false,
      franchise: false
    },
    specialtyServices: {
      windowTinting: false,
      magWheels: false,
      painting: false,
      handicapServices: false,
      customWork: false,
      automaticStarters: false,
      carAlarms: false,
      recycling: false,
      rustProofing: false,
      carWash: false,
      detailing: false
    },
    expertise: {
      northAmericanCars: false,
      europeanCars: false,
      japaneseKoreanCars: false,
      other: false,
      bodyShop: false,
      trucksVans: false,
      diesel: false,
      electric: false,
      hybrid: false,
      manualTrans: false,
      autoTrans: false
    },
    pictures: {
      pic1: false,
      pic2: false,
      pic3: false
    },
    notes: ''
  });

  // Refs for file uploads
  const salesRepSignatureRef = useRef(null);
  const vendorSignatureRef = useRef(null);
  
  // State for signature previews
  const [previewSalesRepSignature, setPreviewSalesRepSignature] = useState(null);
  const [previewVendorSignature, setPreviewVendorSignature] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (category, item) => {
    setFormData({
      ...formData,
      [category]: {
        ...formData[category],
        [item]: !formData[category][item]
      }
    });
  };

  const handleSignatureUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'salesRep') {
          setPreviewSalesRepSignature(reader.result);
        } else {
          setPreviewVendorSignature(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSignatureUpload = (type) => {
    if (type === 'salesRep') {
      salesRepSignatureRef.current.click();
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
      if (!formData.garageName.trim() || !formData.tmName.trim()) {
        throw new Error("Garage name and T.M. name are required");
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }
      
      // Create submission data object
      const submissionData = {
        formType: "CaForm7",
        title: `Garage Checklist - ${formData.garageName}`,
        fields: {
          ...formData,
          salesRepSignature: previewSalesRepSignature,
          vendorSignature: previewVendorSignature
        }
      };
      
      // Set headers
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Make the API call
      const response = await api.post('/forms', submissionData, { headers });
      
      showNotificationMessage("success", "Garage checklist submitted successfully!");
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error("Error submitting form:", err);
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Failed to submit checklist";
      showNotificationMessage("error", errorMessage);
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        setTimeout(() => navigate("/login"), 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const CheckboxGroup = ({ title, items, category }) => (
    <div className="mb-4">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.entries(items).map(([key, value]) => (
          <div key={key} className="flex items-center">
            <input
              type="checkbox"
              id={key}
              checked={value}
              onChange={() => handleCheckboxChange(category, key)}
              className="mr-2"
            />
            <label htmlFor={key} className="text-sm">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

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
        ref={salesRepSignatureRef}
        onChange={(e) => handleSignatureUpload(e, 'salesRep')}
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

      <div className="print:hidden">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">GARAGE CHECKLIST</h1>
            <img src={Logo2} alt="Company Logo" className="h-16" />
          </div>

          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="flex-1 mb-2 md:mb-0 md:mr-4">
              <label htmlFor="garageName" className="block mb-1">Garage Name: <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="garageName"
                name="garageName"
                value={formData.garageName}
                onChange={handleInputChange}
                className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="tmName" className="block mb-1">T.M. Name: <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="tmName"
                name="tmName"
                value={formData.tmName}
                onChange={handleInputChange}
                className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <CheckboxGroup
            title="SERVICES"
            items={formData.services}
            category="services"
          />

          <CheckboxGroup
            title="FACILITIES"
            items={formData.facilities}
            category="facilities"
          />

          <CheckboxGroup
            title="SPECIALTY SERVICES"
            items={formData.specialtyServices}
            category="specialtyServices"
          />

          <CheckboxGroup
            title="EXPERTISE"
            items={formData.expertise}
            category="expertise"
          />

          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">PICTURES</h3>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pic1"
                  checked={formData.pictures.pic1}
                  onChange={() => handleCheckboxChange("pictures", "pic1")}
                  className="mr-2"
                />
                <label htmlFor="pic1">#1</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pic2"
                  checked={formData.pictures.pic2}
                  onChange={() => handleCheckboxChange("pictures", "pic2")}
                  className="mr-2"
                />
                <label htmlFor="pic2">#2</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pic3"
                  checked={formData.pictures.pic3}
                  onChange={() => handleCheckboxChange("pictures", "pic3")}
                  className="mr-2"
                />
                <label htmlFor="pic3">#3</label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="notes" className="block font-bold mb-1">Notes:</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full border p-2 h-20 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
            ></textarea>
          </div>

          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="flex-1 mb-4 md:mb-0 md:mr-4">
              <label className="block font-bold mb-1">Sales Rep Signature:</label>
              <div className="border p-2 h-32 flex items-center justify-center bg-gray-50 rounded">
                {previewSalesRepSignature ? (
                  <img 
                    src={previewSalesRepSignature} 
                    alt="Sales Rep Signature" 
                    className="h-full max-w-full object-contain" 
                  />
                ) : (
                  <p className="text-gray-500 italic">Sales Rep signature will appear here</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => triggerSignatureUpload('salesRep')}
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
              >
                Upload Sales Rep Signature
              </button>
            </div>
            <div className="flex-1">
              <label className="block font-bold mb-1">Vendor Signature:</label>
              <div className="border p-2 h-32 flex items-center justify-center bg-gray-50 rounded">
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
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
              >
                Upload Vendor Signature
              </button>
              <p className="text-sm text-gray-600 mt-2 text-center">I am authorized to sign for the Garage</p>
            </div>
          </div>

          <div className="flex justify-between mt-6 gap-4">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 font-bold"
            >
              Print Checklist
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 font-bold ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Checklist'}
            </button>
          </div>
        </form>
      </div>

      {/* Print version */}
      <div className="hidden print:block">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">GARAGE CHECKLIST</h1>
          <img src={Logo2} alt="Company Logo" className="h-16" />
        </div>

        <div className="flex justify-between mb-6">
          <div className="flex-1 mr-4">
            <p className="font-bold">Garage Name: <span className="font-normal">{formData.garageName}</span></p>
          </div>
          <div className="flex-1">
            <p className="font-bold">T.M. Name: <span className="font-normal">{formData.tmName}</span></p>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">SERVICES</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(formData.services)
              .filter(([_, value]) => value)
              .map(([key]) => (
                <div key={key} className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Facilities Section */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">FACILITIES</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(formData.facilities)
              .filter(([_, value]) => value)
              .map(([key]) => (
                <div key={key} className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Specialty Services Section */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">SPECIALTY SERVICES</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(formData.specialtyServices)
              .filter(([_, value]) => value)
              .map(([key]) => (
                <div key={key} className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Expertise Section */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">EXPERTISE</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(formData.expertise)
              .filter(([_, value]) => value)
              .map(([key]) => (
                <div key={key} className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Pictures Section */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">PICTURES</h3>
          <div className="flex space-x-4">
            {Object.entries(formData.pictures)
              .filter(([_, value]) => value)
              .map(([key]) => (
                <span key={key} className="font-normal">Picture #{key.replace('pic', '')}</span>
              ))}
          </div>
        </div>

        {/* Notes Section */}
        {formData.notes && (
          <div className="mb-6">
            <h3 className="font-bold mb-1">Notes:</h3>
            <p className="whitespace-pre-line">{formData.notes}</p>
          </div>
        )}

        {/* Signatures Section */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="flex-1 mb-4 md:mb-0 md:mr-4">
            <p className="font-bold mb-1">Sales Rep Signature:</p>
            <div className="border-t-2 border-gray-400 pt-2">
              {previewSalesRepSignature && (
                <img 
                  src={previewSalesRepSignature} 
                  alt="Sales Rep Signature" 
                  className="h-24 object-contain" 
                />
              )}
            </div>
          </div>
          <div className="flex-1">
            <p className="font-bold mb-1">Vendor Signature:</p>
            <div className="border-t-2 border-gray-400 pt-2">
              {previewVendorSignature && (
                <img 
                  src={previewVendorSignature} 
                  alt="Vendor Signature" 
                  className="h-24 object-contain" 
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 pt-4 border-t">
          <p>CANADA – United States Tel: 613-282-5558, Email: sales@autowizapp.com</p>
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

export default CaForm7;