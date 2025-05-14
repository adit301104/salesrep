import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo2 from "../images/Logo2.png";
import axios from "axios";

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const CaForm4Fr = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    territoire: '',
    nomAffaire: '',
    contact: '',
    addresse: '',
    telephoneAffaire: '',
    cellulaire: '',
    addresseCourriel: '',
    resultats: {
      rendezVous: false,
      rendezVousDate: '',
      rendezVousHeure: '',
      dateRappel: '',
      demandeVideo: '',
      demandePlusInfo: ''
    },
    resultatsNotes: '',
    visiteEntreprise: {
      vente: false,
      contratAttache: '',
      rappelRequis: false,
      rappelDate: '',
      plusInfoRequis: '',
      pasInteresse: false,
      pasInteresseRaison: ''
    },
    visiteEntrepriseNotes: ''
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewRepresentantSignature, setPreviewRepresentantSignature] = useState(null);
  const [previewDirecteurSignature, setPreviewDirecteurSignature] = useState(null);
  const representantSignatureRef = useRef(null);
  const directeurSignatureRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSignatureUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (event) => {
        const base64String = event.target.result;
        if (field === 'representantSignature') {
          setPreviewRepresentantSignature(base64String);
        } else {
          setPreviewDirecteurSignature(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSignatureUpload = (type) => {
    if (type === 'representant') {
      representantSignatureRef.current.click();
    } else {
      directeurSignatureRef.current.click();
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
      if (!formData.nomAffaire.trim() || !formData.contact.trim()) {
        throw new Error("Le nom d'affaire et les informations de contact sont obligatoires");
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Jeton d'authentification introuvable. Veuillez vous reconnecter.");
      }
      
      // Create submission data with all fields and base64 signatures
      const submissionData = {
        formType: "CaForm4Fr",
        title: `Fiche de Contact Client - ${formData.nomAffaire}`,
        fields: {
          ...formData,
          representantSignature: previewRepresentantSignature,
          directeurSignature: previewDirecteurSignature
        }
      };
      
      // Set headers with authorization token
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Make the API call
      const response = await api.post('/forms', submissionData, { headers });
      
      showNotificationMessage("success", "Fiche de contact soumise avec succès!");
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error("Erreur lors de la soumission du formulaire:", err);
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Échec de la soumission de la fiche de contact";
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
        ref={representantSignatureRef}
        onChange={(e) => handleSignatureUpload(e, 'representantSignature')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={directeurSignatureRef}
        onChange={(e) => handleSignatureUpload(e, 'directeurSignature')}
        accept="image/*"
        className="hidden"
      />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CLIENT AUTOWIZ PAGE INFO</h1>
        <img src={Logo2} alt="Logo Autowiz" className="h-16" />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <label className="font-medium w-24">DATE: <span className="text-red-500">*</span></label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="border p-2 flex-grow"
              required
            />
          </div>
          <div className="flex items-center">
            <label className="font-medium w-24">TERRITOIRE:</label>
            <input
              type="text"
              name="territoire"
              value={formData.territoire}
              onChange={handleInputChange}
              className="border p-2 flex-grow"
            />
          </div>
        </div>
        
        {/* Business Information */}
        <div className="space-y-4">
          <div className="flex items-center">
            <label className="font-medium w-40">NOM D'AFFAIRE: <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="nomAffaire"
              value={formData.nomAffaire}
              onChange={handleInputChange}
              className="border p-2 flex-grow"
              required
            />
          </div>
          
          <div className="flex items-center">
            <label className="font-medium w-40">CONTACT: <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className="border p-2 flex-grow"
              required
            />
          </div>
          
          <div className="flex items-center">
            <label className="font-medium w-40">ADDRESSE:</label>
            <input
              type="text"
              name="addresse"
              value={formData.addresse}
              onChange={handleInputChange}
              className="border p-2 flex-grow"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <label className="font-medium w-40">TÉLÉPHONE AFFAIRE:</label>
              <input
                type="tel"
                name="telephoneAffaire"
                value={formData.telephoneAffaire}
                onChange={handleInputChange}
                className="border p-2 flex-grow"
              />
            </div>
            
            <div className="flex items-center">
              <label className="font-medium w-40">CELLULAIRE:</label>
              <input
                type="tel"
                name="cellulaire"
                value={formData.cellulaire}
                onChange={handleInputChange}
                className="border p-2 flex-grow"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <label className="font-medium w-40">ADDRESSE COURRIEL:</label>
            <input
              type="email"
              name="addresseCourriel"
              value={formData.addresseCourriel}
              onChange={handleInputChange}
              className="border p-2 flex-grow"
            />
          </div>
        </div>
        
        {/* Résultats Section */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-bold mb-4">RÉSULTATS:</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="font-medium mr-4">1) RENDEZ-VOUS:</label>
              <input
                type="checkbox"
                name="resultats.rendezVous"
                checked={formData.resultats.rendezVous}
                onChange={handleInputChange}
                className="mr-2"
              />
              
              <label className="font-medium ml-4 mr-2">DATE:</label>
              <input
                type="date"
                name="resultats.rendezVousDate"
                value={formData.resultats.rendezVousDate}
                onChange={handleInputChange}
                className="border p-2 mr-4"
              />
              
              <label className="font-medium mr-2">HEURE:</label>
              <input
                type="time"
                name="resultats.rendezVousHeure"
                value={formData.resultats.rendezVousHeure}
                onChange={handleInputChange}
                className="border p-2"
              />
            </div>
            
            <div className="flex items-center">
              <label className="font-medium w-40">2) DATE DE RAPPEL:</label>
              <input
                type="date"
                name="resultats.dateRappel"
                value={formData.resultats.dateRappel}
                onChange={handleInputChange}
                className="border p-2"
              />
            </div>
            
            <div className="flex items-center">
              <label className="font-medium w-40">3) DEMANDE VIDÉO:</label>
              <div className="flex items-center">
                <label className="mr-2">OUI</label>
                <input
                  type="radio"
                  name="resultats.demandeVideo"
                  value="oui"
                  checked={formData.resultats.demandeVideo === 'oui'}
                  onChange={handleInputChange}
                  className="mr-4"
                />
                
                <label className="mr-2">NON</label>
                <input
                  type="radio"
                  name="resultats.demandeVideo"
                  value="non"
                  checked={formData.resultats.demandeVideo === 'non'}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="font-medium w-40">4) DEMANDE PLUS D'INFORMATION:</label>
              <div className="flex items-center">
                <label className="mr-2">OUI</label>
                <input
                  type="radio"
                  name="resultats.demandePlusInfo"
                  value="oui"
                  checked={formData.resultats.demandePlusInfo === 'oui'}
                  onChange={handleInputChange}
                  className="mr-4"
                />
                
                <label className="mr-2">NON</label>
                <input
                  type="radio"
                  name="resultats.demandePlusInfo"
                  value="non"
                  checked={formData.resultats.demandePlusInfo === 'non'}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <label className="font-medium block mb-2">NOTES:</label>
              <textarea
                name="resultatsNotes"
                value={formData.resultatsNotes}
                onChange={handleInputChange}
                className="border p-2 w-full h-24"
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Visite Entreprise Section */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-bold mb-4">VISITE CHEZ L'ENTREPRISE:</h2>
          
          <div className="space-y-4">
            <div className="flex items-center flex-wrap">
              <label className="font-medium mr-4">1) VENTE:</label>
              <input
                type="checkbox"
                name="visiteEntreprise.vente"
                checked={formData.visiteEntreprise.vente}
                onChange={handleInputChange}
                className="mr-4"
              />
              
              <label className="font-medium mr-2">CONTRAT & INFO ATTACHÉ</label>
              <div className="flex items-center">
                <label className="mr-1">OUI</label>
                <input
                  type="radio"
                  name="visiteEntreprise.contratAttache"
                  value="oui"
                  checked={formData.visiteEntreprise.contratAttache === 'oui'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                
                <label className="mr-1">NON</label>
                <input
                  type="radio"
                  name="visiteEntreprise.contratAttache"
                  value="non"
                  checked={formData.visiteEntreprise.contratAttache === 'non'}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <label className="font-medium mr-4">2) RAPPEL REQUIS:</label>
              <input
                type="checkbox"
                name="visiteEntreprise.rappelRequis"
                checked={formData.visiteEntreprise.rappelRequis}
                onChange={handleInputChange}
                className="mr-4"
              />
              
              <label className="font-medium mr-2">DATE:</label>
              <input
                type="date"
                name="visiteEntreprise.rappelDate"
                value={formData.visiteEntreprise.rappelDate}
                onChange={handleInputChange}
                className="border p-2"
              />
            </div>
            
            <div className="flex items-center">
              <label className="font-medium w-64">3) PLUS INFORMATION REQUIS:</label>
              <input
                type="text"
                name="visiteEntreprise.plusInfoRequis"
                value={formData.visiteEntreprise.plusInfoRequis}
                onChange={handleInputChange}
                className="border p-2 flex-grow"
              />
            </div>
            
            <div className="flex items-center">
              <label className="font-medium mr-4">4) PAS INTERESSÉ:</label>
              <input
                type="checkbox"
                name="visiteEntreprise.pasInteresse"
                checked={formData.visiteEntreprise.pasInteresse}
                onChange={handleInputChange}
                className="mr-4"
              />
              
              <label className="font-medium mr-2">RAISON:</label>
              <input
                type="text"
                name="visiteEntreprise.pasInteresseRaison"
                value={formData.visiteEntreprise.pasInteresseRaison}
                onChange={handleInputChange}
                className="border p-2 flex-grow"
              />
            </div>
            
            <div>
              <label className="font-medium block mb-2">NOTES:</label>
              <textarea
                name="visiteEntrepriseNotes"
                value={formData.visiteEntrepriseNotes}
                onChange={handleInputChange}
                className="border p-2 w-full h-24"
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Signatures Section */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-medium block mb-2">REPRÉSENTANT DU TERRITOIRE:</label>
              <div className="border h-40 mb-2 flex items-center justify-center">
                {previewRepresentantSignature ? (
                  <img 
                    src={previewRepresentantSignature} 
                    alt="Signature du Représentant" 
                    className="h-full max-w-full object-contain"
                  />
                ) : (
                  <p className="text-gray-500 italic">La signature du représentant apparaîtra ici</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => triggerSignatureUpload('representant')}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
              >
                Télécharger la signature du représentant
              </button>
            </div>
            
            <div>
              <label className="font-medium block mb-2">DIRECTEUR:</label>
              <div className="border h-40 mb-2 flex items-center justify-center">
                {previewDirecteurSignature ? (
                  <img 
                    src={previewDirecteurSignature} 
                    alt="Signature du Directeur" 
                    className="h-full max-w-full object-contain"
                  />
                ) : (
                  <p className="text-gray-500 italic">La signature du directeur apparaîtra ici</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => triggerSignatureUpload('directeur')}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
              >
                Télécharger la signature du directeur
              </button>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
          >
            Imprimer
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Soumission...' : 'Soumettre'}
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

export default CaForm4Fr;