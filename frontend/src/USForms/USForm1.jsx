import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../images/Logo2.png";
import axios from "axios";

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const USForm1 = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");

  const [formData, setFormData] = useState({
    bizName: "",
    tmName: "",
    partsType: "",
    northAmericanCars: [],
    europeanCars: [],
    asianCars: [],
    northAmericanParts: [],
    europeanParts: [],
    asianParts: [],
    northAmericanOther: "",
    europeanOther: "",
    asianOther: "",
    pictures: [],
    notes: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      const field = name.split('-')[0];
      const option = name.split('-')[1];
      
      setFormData(prev => {
        const currentOptions = [...prev[field]];
        if (checked) {
          return { ...prev, [field]: [...currentOptions, option] };
        } else {
          return { ...prev, [field]: currentOptions.filter(item => item !== option) };
        }
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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
      if (!formData.bizName.trim()) {
        throw new Error("Business name is required");
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }
      
      // Create submission data object
      const submissionData = {
        formType: "USForm1",
        title: `Auto Parts Checklist - ${formData.bizName}`,
        fields: {
          ...formData
        }
      };
      
      // Set headers
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Make the API call
      const response = await api.post('/forms', submissionData, { headers });
      
      showNotificationMessage("success", "Auto Parts Checklist submitted successfully!");
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

  const partsList = [
    'Oil', 'Filters', 'Belts', 'Hoses', 'Batteries', 'Tires', 'Shocks', 'Struts',
    'Lubricants', 'Wipers', 'Antifreeze', 'Heating', 'Air Conditioning', 'Electricals',
    'Spark Plugs', 'Gaskets', 'Brake Pads', 'Rotors', 'Calipers', 'Paints'
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
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

      <div className="print:hidden">
        <form onSubmit={handleSubmit}>
          {/* Header with Logo */}
          <div className="flex justify-between items-start mb-8">
            <img src={Logo} alt="Company Logo" className="h-16" />
            <div className="text-right">
              <h1 className="text-2xl font-bold">AUTO PARTS CHECKLIST</h1>
            </div>
          </div>

          {/* Business Info */}
          <div className="flex justify-between mb-8">
            <div className="w-1/2 pr-4">
              <label className="block mb-1">A.P. Biz Name: <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="bizName"
                value={formData.bizName}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                required
              />
            </div>
            <div className="w-1/2 pl-4">
              <label className="block mb-1">T.M. Name:</label>
              <input
                type="text"
                name="tmName"
                value={formData.tmName}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          {/* Parts Type */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">PARTS</h2>
            <div className="flex space-x-8">
              {['New', 'Used', 'Rebuilt/Reconditioned'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="radio"
                    name="partsType"
                    value={type}
                    checked={formData.partsType === type}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* North American Cars */}
          <div className="mb-8">
            <h3 className="font-semibold mb-2">North American cars:</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              {['Chrysler', 'Ford', 'GM', 'Tesla'].map((car) => (
                <label key={car} className="flex items-center">
                  <input
                    type="checkbox"
                    name={`northAmericanCars-${car}`}
                    checked={formData.northAmericanCars.includes(car)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {car}
                </label>
              ))}
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {partsList.map((part) => (
                <label key={part} className="flex items-center">
                  <input
                    type="checkbox"
                    name={`northAmericanParts-${part}`}
                    checked={formData.northAmericanParts.includes(part)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {part}
                </label>
              ))}
            </div>
            
            <div className="mt-4">
              <label className="block">Other:</label>
              <input
                type="text"
                name="northAmericanOther"
                value={formData.northAmericanOther}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          {/* European Cars */}
          <div className="mb-8">
            <h3 className="font-semibold mb-2">European Cars:</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              {['Alfa Romeo', 'Audi', 'BMW', 'Ferrari', 'Fiat', 'Jaguar', 'Mercedes', 'Peugeot',
                'Range Rover', 'Renault', 'Volvo', 'Volkswagen'].map((car) => (
                <label key={car} className="flex items-center">
                  <input
                    type="checkbox"
                    name={`europeanCars-${car}`}
                    checked={formData.europeanCars.includes(car)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {car}
                </label>
              ))}
              <div className="flex items-center">
                <span className="mr-2">Other:</span>
                <input
                  type="text"
                  name="europeanOther"
                  value={formData.europeanOther}
                  onChange={handleChange}
                  className="border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {partsList.map((part) => (
                <label key={`european-${part}`} className="flex items-center">
                  <input
                    type="checkbox"
                    name={`europeanParts-${part}`}
                    checked={formData.europeanParts.includes(part)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {part}
                </label>
              ))}
            </div>
            
            <div className="mt-4">
              <label className="block">Other:</label>
              <input
                type="text"
                name="europeanOtherParts"
                value={formData.europeanOtherParts}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          {/* Asian Cars */}
          <div className="mb-8">
            <h3 className="font-semibold mb-2">Asian Cars:</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              {['Honda', 'Hyundai', 'Isuzu', 'Kia', 'Mazda', 'Mitsubishi', 'Nissan', 'Subaru', 'Toyota'].map((car) => (
                <label key={car} className="flex items-center">
                  <input
                    type="checkbox"
                    name={`asianCars-${car}`}
                    checked={formData.asianCars.includes(car)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {car}
                </label>
              ))}
              <div className="flex items-center">
                <span className="mr-2">Other:</span>
                <input
                  type="text"
                  name="asianOther"
                  value={formData.asianOther}
                  onChange={handleChange}
                  className="border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {partsList.map((part) => (
                <label key={`asian-${part}`} className="flex items-center">
                  <input
                    type="checkbox"
                    name={`asianParts-${part}`}
                    checked={formData.asianParts.includes(part)}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {part}
                </label>
              ))}
            </div>
            
            <div className="mt-4">
              <label className="block">Other:</label>
              <input
                type="text"
                name="asianOtherParts"
                value={formData.asianOtherParts}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          {/* Pictures */}
          <div className="mb-8">
            <h3 className="font-semibold mb-2">PICTURES</h3>
            <div className="flex space-x-8">
              {[1, 2, 3].map((num) => (
                <label key={num} className="flex items-center">
                  <input
                    type="checkbox"
                    name={`pictures-${num}`}
                    checked={formData.pictures.includes(num.toString())}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  #{num}
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label className="block font-semibold mb-2">Notes:</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full h-32 border-2 border-gray-300 rounded p-2 focus:border-green-500 outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
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
      </div>

      {/* Print version */}
      <div className="hidden print:block">
        <div className="flex justify-between items-start mb-8">
          <img src={Logo} alt="Company Logo" className="h-16" />
          <div className="text-right">
            <h1 className="text-2xl font-bold">AUTO PARTS CHECKLIST</h1>
          </div>
        </div>

        {/* Business Info */}
        <div className="flex justify-between mb-8">
          <div className="w-1/2 pr-4">
            <p className="font-bold">A.P. Biz Name: <span className="font-normal">{formData.bizName}</span></p>
          </div>
          <div className="w-1/2 pl-4">
            <p className="font-bold">T.M. Name: <span className="font-normal">{formData.tmName}</span></p>
          </div>
        </div>

        {/* Parts Type */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">PARTS</h2>
          <p className="font-bold">Type: <span className="font-normal">{formData.partsType}</span></p>
        </div>

        {/* North American Cars */}
        <div className="mb-8">
          <h3 className="font-semibold mb-2">North American cars:</h3>
          <p className="font-bold">Makes: <span className="font-normal">{formData.northAmericanCars.join(', ')}</span></p>
          <p className="font-bold">Parts: <span className="font-normal">{formData.northAmericanParts.join(', ')}</span></p>
          {formData.northAmericanOther && (
            <p className="font-bold">Other: <span className="font-normal">{formData.northAmericanOther}</span></p>
          )}
        </div>

        {/* European Cars */}
        <div className="mb-8">
          <h3 className="font-semibold mb-2">European Cars:</h3>
          <p className="font-bold">Makes: <span className="font-normal">{formData.europeanCars.join(', ')}</span></p>
          {formData.europeanOther && (
            <p className="font-bold">Other Makes: <span className="font-normal">{formData.europeanOther}</span></p>
          )}
          <p className="font-bold">Parts: <span className="font-normal">{formData.europeanParts.join(', ')}</span></p>
          {formData.europeanOtherParts && (
            <p className="font-bold">Other Parts: <span className="font-normal">{formData.europeanOtherParts}</span></p>
          )}
        </div>

        {/* Asian Cars */}
        <div className="mb-8">
          <h3 className="font-semibold mb-2">Asian Cars:</h3>
          <p className="font-bold">Makes: <span className="font-normal">{formData.asianCars.join(', ')}</span></p>
          {formData.asianOther && (
            <p className="font-bold">Other Makes: <span className="font-normal">{formData.asianOther}</span></p>
          )}
          <p className="font-bold">Parts: <span className="font-normal">{formData.asianParts.join(', ')}</span></p>
          {formData.asianOtherParts && (
            <p className="font-bold">Other Parts: <span className="font-normal">{formData.asianOtherParts}</span></p>
          )}
        </div>

        {/* Pictures */}
        {formData.pictures.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold mb-2">PICTURES</h3>
            <p className="font-bold">Selected: <span className="font-normal">{formData.pictures.map(p => `#${p}`).join(', ')}</span></p>
          </div>
        )}

        {/* Notes */}
        {formData.notes && (
          <div className="mb-8">
            <h3 className="font-semibold mb-2">Notes:</h3>
            <p>{formData.notes}</p>
          </div>
        )}
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

export default USForm1;