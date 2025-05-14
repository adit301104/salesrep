import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo2 from "../images/Logo2.png";
import axios from "axios";

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const CaForm10Fr = () => {
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
      if (!formData.businessTime.trim() || !formData.services.trim()) {
        throw new Error("Les champs d'années en affaire et services sont obligatoires");
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Token d'authentification non trouvé. Veuillez vous connecter à nouveau.");
      }
      
      // Create submission data object
      const submissionData = {
        formType: "CaForm10Fr",
        title: `Questions Garage - ${formData.businessTime} ans en affaire`,
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
      
      showNotificationMessage("success", "Questionnaire de garage soumis avec succès!");
      
      // Redirect after a short delay
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error("Erreur lors de la soumission:", err);
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Échec de la soumission du formulaire";
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

      <div className="print:hidden">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">QUESTIONS - GARAGE</h1>
            <img src={Logo2} alt="Company Logo" className="h-16" />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="font-medium">1) Combien d'années êtes-vous en affaire? <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="businessTime"
                value={formData.businessTime}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                required
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">2) Avez-vous opéré de votre endroit depuis l'ouverture? Si non, quelle est l'ancienne addresse?</label>
              <textarea
                name="locationInfo"
                value={formData.locationInfo}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 h-20"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">3) Quels services offrez-vous? <span className="text-red-500">*</span></label>
              <textarea
                name="services"
                value={formData.services}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 h-20"
                required
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">4) Quels sont vos heures d'opération?</label>
              <input
                type="text"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">5) Combien de portes et ascenseurs?</label>
              <input
                type="text"
                name="doorsAndLifts"
                value={formData.doorsAndLifts}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">6) Combien de mécaniciens avez-vous et quels est leurs expérience?</label>
              <textarea
                name="mechanics"
                value={formData.mechanics}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 h-20"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">7) Cherchez-vous d'autres employés?</label>
              <input
                type="text"
                name="lookingForStaff"
                value={formData.lookingForStaff}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">8) Est ce que le propriétaire est aussi mécanicien?</label>
              <input
                type="text"
                name="ownerWorks"
                value={formData.ownerWorks}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">9) Est ce que l'entreprise a des spécialités tel autos Europeens ou services uniques?</label>
              <textarea
                name="specialties"
                value={formData.specialties}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 h-20"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">10) Quand durant le mois ou la semaine êtes-vous le plus occupé?</label>
              <textarea
                name="busiestTime"
                value={formData.busiestTime}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 h-20"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">11) Pouvez-vous accepter plus de clientèle?</label>
              <input
                type="text"
                name="handleExtraVolume"
                value={formData.handleExtraVolume}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">12) Pouvez-vous céduler des rendez-vous? Utilisez-vous un logiciel?</label>
              <textarea
                name="scheduling"
                value={formData.scheduling}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 h-20"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">13) Quels forme de paiement acceptez-vous?</label>
              <div className="flex flex-wrap space-x-4 mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="cash"
                    checked={formData.payment.cash}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Comptant
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="mastercard"
                    checked={formData.payment.mastercard}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Mastercard
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="visa"
                    checked={formData.payment.visa}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Visa
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="amex"
                    checked={formData.payment.amex}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Amex
                </label>
              </div>
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">14) Avez-vous une remorque ou un contrat avec une compagnie de remorques?</label>
              <input
                type="text"
                name="towTruck"
                value={formData.towTruck}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">15) De qui achetez-vous vos pièces?</label>
              <textarea
                name="partsSupplier"
                value={formData.partsSupplier}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 h-20"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">16) Vendez-vous des pièces tel pneus, batteries?</label>
              <input
                type="text"
                name="sellParts"
                value={formData.sellParts}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">17) Est ce que vous achetez et vendez des automobiles?</label>
              <input
                type="text"
                name="buySellCars"
                value={formData.buySellCars}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-medium">Notes:</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full border p-2 mt-1 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 h-24"
              />
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 font-bold"
            >
              Imprimer
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 font-bold ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Soumission...' : 'Soumettre'}
            </button>
          </div>
        </form>
      </div>

      {/* Print version */}
      <div className="hidden print:block">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">QUESTIONS - GARAGE</h1>
          <img src={Logo2} alt="Company Logo" className="h-16" />
        </div>

        {/* Print version of all form fields */}
        <div className="space-y-4 mb-8">
          <p className="font-bold">1) Combien d'années êtes-vous en affaire? <span className="font-normal">{formData.businessTime}</span></p>
          <p className="font-bold">2) Avez-vous opéré de votre endroit depuis l'ouverture? <span className="font-normal">{formData.locationInfo}</span></p>
          <p className="font-bold">3) Quels services offrez-vous? <span className="font-normal">{formData.services}</span></p>
          <p className="font-bold">4) Quels sont vos heures d'opération? <span className="font-normal">{formData.hours}</span></p>
          <p className="font-bold">5) Combien de portes et ascenseurs? <span className="font-normal">{formData.doorsAndLifts}</span></p>
          <p className="font-bold">6) Combien de mécaniciens avez-vous et quels est leurs expérience? <span className="font-normal">{formData.mechanics}</span></p>
          <p className="font-bold">7) Cherchez-vous d'autres employés? <span className="font-normal">{formData.lookingForStaff}</span></p>
          <p className="font-bold">8) Est ce que le propriétaire est aussi mécanicien? <span className="font-normal">{formData.ownerWorks}</span></p>
          <p className="font-bold">9) Est ce que l'entreprise a des spécialités tel autos Europeens ou services uniques? <span className="font-normal">{formData.specialties}</span></p>
          <p className="font-bold">10) Quand durant le mois ou la semaine êtes-vous le plus occupé? <span className="font-normal">{formData.busiestTime}</span></p>
          <p className="font-bold">11) Pouvez-vous accepter plus de clientèle? <span className="font-normal">{formData.handleExtraVolume}</span></p>
          <p className="font-bold">12) Pouvez-vous céduler des rendez-vous? Utilisez-vous un logiciel? <span className="font-normal">{formData.scheduling}</span></p>
          <p className="font-bold">13) Quels forme de paiement acceptez-vous? <span className="font-normal">
            {formData.payment.cash ? 'Comptant ' : ''}
            {formData.payment.mastercard ? 'Mastercard ' : ''}
            {formData.payment.visa ? 'Visa ' : ''}
            {formData.payment.amex ? 'Amex' : ''}
          </span></p>
          <p className="font-bold">14) Avez-vous une remorque ou un contrat avec une compagnie de remorques? <span className="font-normal">{formData.towTruck}</span></p>
          <p className="font-bold">15) De qui achetez-vous vos pièces? <span className="font-normal">{formData.partsSupplier}</span></p>
          <p className="font-bold">16) Vendez-vous des pièces tel pneus, batteries? <span className="font-normal">{formData.sellParts}</span></p>
          <p className="font-bold">17) Est ce que vous achetez et vendez des automobiles? <span className="font-normal">{formData.buySellCars}</span></p>
          
          {formData.notes && (
            <div>
              <p className="font-bold">Notes:</p>
              <p>{formData.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm mb-6 mt-8">
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

export default CaForm10Fr;