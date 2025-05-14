import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo2 from "../images/Logo2.png";
import axios from "axios";

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const CaForm3Fr = () => {
  const [formData, setFormData] = useState({
    accountNumber: "",
    clientLegalName: "",
    doingBusinessAs: "",
    address: "",
    postalCode: "",
    owner: "",
    cellNumber: "",
    businessTel: "",
    email: "",
    inBusinessSince: "",
    representativeName: "",
    territoryNumber: "",
    repAddress: "",
    repTel: "",
    service: "",
    term: "",
    monthlyCost: "",
    withdrawalDate: "",
    dateCity: "",
    contractDay: "",
    contractMonth: "",
    contractYear: ""
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewRepSignature, setPreviewRepSignature] = useState(null);
  const [previewClientSignature, setPreviewClientSignature] = useState(null);
  const repSignatureRef = useRef(null);
  const clientSignatureRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignatureUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'representative') {
          setPreviewRepSignature(reader.result);
        } else {
          setPreviewClientSignature(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSignatureUpload = (type) => {
    if (type === 'representative') {
      repSignatureRef.current.click();
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
      if (!formData.clientLegalName.trim() || !formData.owner.trim()) {
        throw new Error("Le nom légal du client et les informations du propriétaire sont requis");
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Jeton d'authentification introuvable. Veuillez vous reconnecter.");
      }
      
      // Create submission data object
      const submissionData = {
        formType: "CaForm3Fr",
        title: `Contrat Vendeur de Pièces - ${formData.clientLegalName}`,
        fields: {
          ...formData,
          representativeSignature: previewRepSignature,
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
      
      showNotificationMessage("success", "Contrat de service soumis avec succès !");
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error("Erreur lors de la soumission du formulaire:", err);
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Échec de la soumission du contrat";
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

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={repSignatureRef}
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

      {/* Header with Logo */}
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-2xl font-bold">CONTRAT VENDEUR DE PIÈCES</h1>
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <img src={Logo2} alt="Logo de l'entreprise" className="h-16" />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Numéro de compte */}
        <div className="mb-6">
          <label className="block mb-1">Numéro de compte:</label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            className="w-40 border-b-2 border-gray-300 focus:border-green-500 outline-none"
          />
        </div>

        {/* Informations du client */}
        <div className="mb-8">
          <h2 className="font-bold mb-4">1) Informations du client</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Nom légal du client: <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="clientLegalName"
                value={formData.clientLegalName}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Opérant sous le nom:</label>
              <input
                type="text"
                name="doingBusinessAs"
                value={formData.doingBusinessAs}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1">Adresse:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
              <div className="w-24">
                <label className="block mb-1">Code postal:</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1">Propriétaire: <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1">Cellulaire:</label>
                <input
                  type="text"
                  name="cellNumber"
                  value={formData.cellNumber}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1">Téléphone d'affaires:</label>
                <input
                  type="text"
                  name="businessTel"
                  value={formData.businessTel}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1">Courriel:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1">En affaires depuis:</label>
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

        {/* Informations du représentant */}
        <div className="mb-8">
          <h2 className="font-bold mb-4">2) Informations du représentant</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1">Nom du représentant:</label>
                <input
                  type="text"
                  name="representativeName"
                  value={formData.representativeName}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
              <div className="w-24">
                <label className="block mb-1">Terr. #:</label>
                <input
                  type="text"
                  name="territoryNumber"
                  value={formData.territoryNumber}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1">Adresse:</label>
                <input
                  type="text"
                  name="repAddress"
                  value={formData.repAddress}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1">Tél. #:</label>
                <input
                  type="text"
                  name="repTel"
                  value={formData.repTel}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Détails du service */}
        <div className="mb-8">
          <h2 className="font-bold mb-4">Détails du service</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">SERVICE:</label>
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1">Terme:</label>
                <input
                  type="text"
                  name="term"
                  value={formData.term}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1">Coût mensuel + taxes:</label>
                <input
                  type="text"
                  name="monthlyCost"
                  value={formData.monthlyCost}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1">Date des retraits mensuels:</label>
              <input
                type="text"
                name="withdrawalDate"
                value={formData.withdrawalDate}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Clauses générales */}
        <div className="mb-8">
          <h2 className="font-bold mb-4">Clauses générales</h2>
          <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
            <p>1) La Corporation Autowiz Assistance est d'accord d'octroyer au client ci-haut nommé le code d'accès afin de télécharger depuis www.autowizapp.com le logiciel de la plateforme automobile.</p>
            <p>2) Le client accepte de payer la somme ci-dessus sur une base mensuelle par carte de crédit pour la durée décrite ci-dessus.</p>
            <p>3) Il n'y a aucun remboursement disponible sur ce contrat de service.</p>
            <p>4) Le client accepte de payer des frais de service de deux fois les frais bancaires si le débit mensuel est refusé.</p>
            <p>5) Si le client souhaite résilier ce contrat, des frais équivalant à deux mois de débit seront débités sur la forme de paiement fournie par le client, ce que le client accepte de payer.</p>
            <p>6) Ce contrat se renouvelle automatiquement pour une durée équivalente sauf si un avis est reçu du client 60 jours avant l'expiration de son intention de ne pas procéder à un renouvellement.</p>
          </div>
        </div>

        {/* Date du contrat */}
        <div className="mb-8">
          <h2 className="font-bold mb-4">Date du contrat</h2>
          <div className="flex flex-wrap gap-4">
            <div className="w-64">
              <label className="block mb-1">Ville:</label>
              <input
                type="text"
                name="dateCity"
                value={formData.dateCity}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div className="w-16">
              <label className="block mb-1">Jour:</label>
              <input
                type="text"
                name="contractDay"
                value={formData.contractDay}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div className="w-40">
              <label className="block mb-1">Mois:</label>
              <input
                type="text"
                name="contractMonth"
                value={formData.contractMonth}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div className="w-16">
              <label className="block mb-1">Année:</label>
              <input
                type="text"
                name="contractYear"
                value={formData.contractYear}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <h3 className="font-medium mb-2">Signature du représentant</h3>
            <div className="border-t-2 border-gray-400 pt-2 mb-4 h-40 flex items-center justify-center bg-gray-50">
              {previewRepSignature ? (
                <img 
                  src={previewRepSignature} 
                  alt="Signature du représentant" 
                  className="h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-gray-500 italic">La signature du représentant apparaîtra ici</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => triggerSignatureUpload('representative')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-sm w-full"
            >
              Télécharger signature du représentant
            </button>
            <p className="text-sm mt-2 text-center">Signature du représentant</p>
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium mb-2">Signature du client</h3>
            <div className="border-t-2 border-gray-400 pt-2 mb-4 h-40 flex items-center justify-center bg-gray-50">
              {previewClientSignature ? (
                <img 
                  src={previewClientSignature} 
                  alt="Signature du client" 
                  className="h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-gray-500 italic">La signature du client apparaîtra ici</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => triggerSignatureUpload('client')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-sm w-full"
            >
              Télécharger signature du client
            </button>
            <p className="text-sm mt-2 text-center">Je suis autorisé à signer pour l'entreprise</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm border-t border-gray-300 pt-4">
          <p>CANADA – ÉTATS-UNIS Tél: 613-282-5558, www.autowizapp.com</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded"
          >
            Imprimer formulaire
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-2 px-6 rounded ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Soumission...' : 'Soumettre formulaire'}
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

export default CaForm3Fr;