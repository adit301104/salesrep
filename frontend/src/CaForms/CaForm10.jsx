import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Logo2 from "../images/Logo2.png"; // Assuming you have the same logo import

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const CaForm10 = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");

  const [formData, setFormData] = useState({
    businessTime: '',
    locationInfo: '',
    services: '',
    hours: '',
    doorsAndLifts: '',
    mechanics: '',
    lookingForStaff: '',
    ownerWorks: '',
    specialties: '',
    busiestTime: '',
    handleExtraVolume: '',
    scheduling: '',
    payment: {
      cash: false,
      mastercard: false,
      visa: false,
      amex: false
    },
    towTruck: '',
    partsSupplier: '',
    sellParts: '',
    buySellCars: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        payment: {
          ...formData.payment,
          [name]: checked
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
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
      if (!formData.businessTime.trim()) {
        throw new Error("Business time is required");
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }
      
      // Create submission data object
      const submissionData = {
        formType: "CaForm10",
        title: `Garage Interview - ${new Date().toLocaleDateString()}`,
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
      
      showNotificationMessage("success", "Garage interview form submitted successfully!");
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
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg print:p-0 print:shadow-none">
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">INTERVIEW QUESTIONS - GARAGE</h1>
            <img src={Logo2} alt="Company Logo" className="h-16" />
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="font-medium mb-1">1) How long have you been in business? <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="businessTime"
                value={formData.businessTime}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">2) Have you always been at this location? If yes, do an observation about the amount of traffic or the excellent visibility etc… If no, discuss the previous location and what made them move to the current location?</label>
              <textarea
                name="locationInfo"
                value={formData.locationInfo}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">3) What are the services you offer?</label>
              <textarea
                name="services"
                value={formData.services}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">4) What are your hours of operation?</label>
              <input
                type="text"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">5) How many doors and lifts do you have?</label>
              <input
                type="text"
                name="doorsAndLifts"
                value={formData.doorsAndLifts}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">6) How many mechanics are working for you and how long have they been here?</label>
              <textarea
                name="mechanics"
                value={formData.mechanics}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">7) Is the business looking for additional staff?</label>
              <input
                type="text"
                name="lookingForStaff"
                value={formData.lookingForStaff}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">8) Does the owner also work in the shop fixing cars?</label>
              <input
                type="text"
                name="ownerWorks"
                value={formData.ownerWorks}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">9) Does the business have specialties such as foreign cars, custom vehicles etc…</label>
              <textarea
                name="specialties"
                value={formData.specialties}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">10) What time of the month or week are you busiest?</label>
              <textarea
                name="busiestTime"
                value={formData.busiestTime}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">11) If our article brings you more business can you handle the extra volume?</label>
              <input
                type="text"
                name="handleExtraVolume"
                value={formData.handleExtraVolume}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">12) Do you use a scheduling platform if someone wants an appointment? Could somebody book an appointment with you if they want a service?</label>
              <textarea
                name="scheduling"
                value={formData.scheduling}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">13) What types of payment do you accept?</label>
              <div className="flex flex-wrap gap-4 mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="cash"
                    checked={formData.payment.cash}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4"
                  />
                  Cash
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="mastercard"
                    checked={formData.payment.mastercard}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4"
                  />
                  Mastercard
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="visa"
                    checked={formData.payment.visa}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4"
                  />
                  Visa
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="amex"
                    checked={formData.payment.amex}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4"
                  />
                  Amex
                </label>
              </div>
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">14) Do you have a tow truck or a contract with a tow truck company?</label>
              <input
                type="text"
                name="towTruck"
                value={formData.towTruck}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">15) What parts supplier do you use the most? (do they support local suppliers?)</label>
              <textarea
                name="partsSupplier"
                value={formData.partsSupplier}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">16) Do you sell parts such as tires, wipers, rims?</label>
              <input
                type="text"
                name="sellParts"
                value={formData.sellParts}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">17) Do you buy and sell cars?</label>
              <input
                type="text"
                name="buySellCars"
                value={formData.buySellCars}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium mb-1">Notes:</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="border p-2 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-32"
              />
            </div>
          </div>

          <div className="flex justify-between mt-8 gap-4">
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
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {/* Print version */}
      <div className="hidden print:block">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">INTERVIEW QUESTIONS - GARAGE</h1>
          <img src={Logo2} alt="Company Logo" className="h-16" />
        </div>

        <div className="space-y-4">
          <p className="font-bold">1) How long have you been in business? <span className="font-normal">{formData.businessTime}</span></p>
          
          <p className="font-bold">2) Have you always been at this location? <span className="font-normal">{formData.locationInfo}</span></p>
          
          <p className="font-bold">3) What are the services you offer? <span className="font-normal">{formData.services}</span></p>
          
          <p className="font-bold">4) What are your hours of operation? <span className="font-normal">{formData.hours}</span></p>
          
          <p className="font-bold">5) How many doors and lifts do you have? <span className="font-normal">{formData.doorsAndLifts}</span></p>
          
          <p className="font-bold">6) How many mechanics are working for you and how long have they been here? <span className="font-normal">{formData.mechanics}</span></p>
          
          <p className="font-bold">7) Is the business looking for additional staff? <span className="font-normal">{formData.lookingForStaff}</span></p>
          
          <p className="font-bold">8) Does the owner also work in the shop fixing cars? <span className="font-normal">{formData.ownerWorks}</span></p>
          
          <p className="font-bold">9) Does the business have specialties such as foreign cars, custom vehicles etc… <span className="font-normal">{formData.specialties}</span></p>
          
          <p className="font-bold">10) What time of the month or week are you busiest? <span className="font-normal">{formData.busiestTime}</span></p>
          
          <p className="font-bold">11) If our article brings you more business can you handle the extra volume? <span className="font-normal">{formData.handleExtraVolume}</span></p>
          
          <p className="font-bold">12) Do you use a scheduling platform if someone wants an appointment? <span className="font-normal">{formData.scheduling}</span></p>
          
          <p className="font-bold">13) What types of payment do you accept? <span className="font-normal">
            {formData.payment.cash ? 'Cash, ' : ''}
            {formData.payment.mastercard ? 'Mastercard, ' : ''}
            {formData.payment.visa ? 'Visa, ' : ''}
            {formData.payment.amex ? 'Amex' : ''}
          </span></p>
          
          <p className="font-bold">14) Do you have a tow truck or a contract with a tow truck company? <span className="font-normal">{formData.towTruck}</span></p>
          
          <p className="font-bold">15) What parts supplier do you use the most? <span className="font-normal">{formData.partsSupplier}</span></p>
          
          <p className="font-bold">16) Do you sell parts such as tires, wipers, rims? <span className="font-normal">{formData.sellParts}</span></p>
          
          <p className="font-bold">17) Do you buy and sell cars? <span className="font-normal">{formData.buySellCars}</span></p>
          
          <div className="mt-6">
            <p className="font-bold">Notes:</p>
            <p>{formData.notes}</p>
          </div>
        </div>
      </div>

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

export default CaForm10;