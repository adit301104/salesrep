import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../images/Logo2.png";
import axios from "axios";

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const CaForm1Fr = () => {
  const [formData, setFormData] = useState({
    garageNom: "",
    licencieNom: "",
    services: [],
    description: [],
    servicesSpecialises: [],
    expertiseVehicules: [],
    transmissionType: [],
    vehiculeType: [],
    pictures: [],
    notes: ""
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      const [field, option] = name.split('-');
      
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
      if (!formData.garageNom.trim() || !formData.licencieNom.trim()) {
        throw new Error("Le nom du garage et le nom du licencié sont requis");
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Jeton d'authentification non trouvé. Veuillez vous reconnecter.");
      }
      
      // Prepare data in the format expected by the backend
      const submissionData = {
        formType: "CaForm1Fr",
        title: `Services du Garage - ${formData.garageNom}`,
        fields: {
          garageNom: formData.garageNom,
          licencieNom: formData.licencieNom,
          services: formData.services,
          description: formData.description,
          servicesSpecialises: formData.servicesSpecialises,
          expertiseVehicules: formData.expertiseVehicules,
          transmissionType: formData.transmissionType,
          vehiculeType: formData.vehiculeType,
          pictures: formData.pictures,
          notes: formData.notes
        }
      };

      // Make the API call with authentication
      const response = await api.post('/forms', submissionData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      showNotificationMessage("success", "Formulaire soumis avec succès!");
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error("Erreur lors de la soumission du formulaire:", err);
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
        <img src={Logo} alt="Logo de l'entreprise" className="h-16" />
        <div className="text-right">
          <h1 className="text-2xl font-bold">SERVICES DU GARAGE</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Garage Info */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="w-full md:w-1/2 md:pr-4 mb-4 md:mb-0">
            <label className="block mb-1">
              Nom du Garage: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="garageNom"
              value={formData.garageNom}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              required
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-4">
            <label className="block mb-1">
              Nom du Licencié: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="licencieNom"
              value={formData.licencieNom}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Services */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">SERVICES</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              'Changement d\'huile', 'Diagnostique', 'Air Conditionnée', 'Transmission',
              'Freins', 'Réparation vitrine', 'Amortisseurs', 'Moteur',
              'Tuyaux échappements', 'Electriques', 'Mise au point', 'Alignement roues',
              'Changement de pneus', 'Volant', 'Réparation réservoir', 'Batteries',
              'Tuyaux et courroies', 'Radiateur', 'Essuies glace', 'Remorquage',
              'Serrures', 'Gasoline', 'Charger la batterie', 'Attelage de remorque'
            ].map((service) => (
              <label key={service} className="flex items-center">
                <input
                  type="checkbox"
                  name={`services-${service}`}
                  checked={formData.services.includes(service)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {service}
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="font-semibold mb-2">Description:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              'Toilettes publique', 'Service de transport', 'Véhicule disponible', 'Section des jeunes',
              'Autobus', 'Breuvages', 'Restaurants à proximité', 'Ouvert fin de semaine',
              'Plusieurs portes 3+', 'Centre d\'attente', 'Ouvert en soirée', 'Endroit paisible',
              'Franchise'
            ].map((desc) => (
              <label key={desc} className="flex items-center">
                <input
                  type="checkbox"
                  name={`description-${desc}`}
                  checked={formData.description.includes(desc)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {desc}
              </label>
            ))}
          </div>
        </div>

        {/* Services Spécialisés */}
        <div className="mb-8">
          <h3 className="font-semibold mb-2">SERVICES SPÉCIALISÉS:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              'Teinture de fenêtre', 'Roues Mag', 'Peinture', 'Services pour handicapés',
              'Travail sur mesure', 'Démarreurs Automatique', 'Alarmes', 'Recyclage'
            ].map((specialService) => (
              <label key={specialService} className="flex items-center">
                <input
                  type="checkbox"
                  name={`servicesSpecialises-${specialService}`}
                  checked={formData.servicesSpecialises.includes(specialService)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {specialService}
              </label>
            ))}
          </div>
        </div>

        {/* Expertise de Véhicules */}
        <div className="mb-8">
          <h3 className="font-semibold mb-2">EXPERTISE DE VÉHICULES:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {['Nord Américain', 'Europeen', 'Asiatique', 'Autre'].map((expertise) => (
              <label key={expertise} className="flex items-center">
                <input
                  type="checkbox"
                  name={`expertiseVehicules-${expertise}`}
                  checked={formData.expertiseVehicules.includes(expertise)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {expertise}
              </label>
            ))}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {['Centre de débossage', 'Camions/Fourgonnettes', 'Diesel', 'Electrique', 'Hybride'].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  name={`vehiculeType-${type}`}
                  checked={formData.vehiculeType.includes(type)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {type}
              </label>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Transmission Manuelle', 'Transmission Automatique'].map((trans) => (
              <label key={trans} className="flex items-center">
                <input
                  type="checkbox"
                  name={`transmissionType-${trans}`}
                  checked={formData.transmissionType.includes(trans)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {trans}
              </label>
            ))}
          </div>
        </div>

        {/* Pictures */}
        <div className="mb-8">
          <h3 className="font-semibold mb-2">Photos</h3>
          <div className="flex flex-wrap gap-4">
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
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded"
          >
            Imprimer le formulaire
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-2 px-6 rounded ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Soumission...' : 'Soumettre le formulaire'}
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

export default CaForm1Fr;