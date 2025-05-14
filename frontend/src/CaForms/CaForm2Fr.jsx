import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo2 from "../images/Logo2.png";
import axios from "axios";

// Configuration d'axios pour les appels API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const CaForm2Fr = () => {
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
    service: "",
    term: "",
    discount: "",
    dateCity: "",
    contractDay: "",
    contractMonth: "",
    contractYear: "",
    representativeSignature: null,
    vendorSignature: null
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewRepSignature, setPreviewRepSignature] = useState(null);
  const [previewVendorSignature, setPreviewVendorSignature] = useState(null);
  const repSignatureRef = useRef(null);
  const vendorSignatureRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignatureUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'representative') {
          // On stocke seulement la chaîne base64 pour la soumission
          setPreviewRepSignature(reader.result);
        } else {
          // On stocke seulement la chaîne base64 pour la soumission
          setPreviewVendorSignature(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSignatureUpload = (type) => {
    if (type === 'representative') {
      repSignatureRef.current.click();
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
      // Validation de base
      if (!formData.clientLegalName.trim() || !formData.owner.trim()) {
        throw new Error("Le nom légal du client et les informations du propriétaire sont obligatoires");
      }
      
      // Récupération du token depuis localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Token d'authentification non trouvé. Veuillez vous reconnecter.");
      }
      
      // Création d'un objet JSON standard avec tous les champs, y compris les signatures en base64
      const submissionData = {
        formType: "CaForm2Fr",
        title: `Contrat Vendeur de Pièces - ${formData.clientLegalName}`,
        fields: {
          accountNumber: formData.accountNumber,
          clientLegalName: formData.clientLegalName,
          doingBusinessAs: formData.doingBusinessAs,
          address: formData.address,
          postalCode: formData.postalCode,
          owner: formData.owner,
          cellNumber: formData.cellNumber,
          businessTel: formData.businessTel,
          email: formData.email,
          inBusinessSince: formData.inBusinessSince,
          service: formData.service,
          term: formData.term,
          discount: formData.discount,
          dateCity: formData.dateCity,
          contractDay: formData.contractDay,
          contractMonth: formData.contractMonth,
          contractYear: formData.contractYear,
          representativeSignature: previewRepSignature,
          vendorSignature: previewVendorSignature
        }
      };
      
      // Configuration des en-têtes pour l'envoi JSON
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Appel API
      const response = await api.post('/forms', submissionData, { headers });
      
      showNotificationMessage("success", "Contrat soumis avec succès!");
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error("Erreur lors de la soumission du formulaire:", err);
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Échec de la soumission du contrat";
      showNotificationMessage("error", errorMessage);
      
      // Si non autorisé, redirection vers la page de connexion
      if (err.response?.status === 401) {
        setTimeout(() => navigate("/login"), 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white">
      {/* Système de notification */}
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

      {/* Champs de fichier cachés */}
      <input
        type="file"
        ref={repSignatureRef}
        onChange={(e) => handleSignatureUpload(e, 'representative')}
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

      {/* En-tête avec Logo */}
      <div className="flex justify-between items-start mb-8">
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <img src={Logo2} alt="Logo de l'entreprise" className="h-16" />
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold">CONTRAT VENDEUR DE PIÈCES</h1>
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
        <div className="space-y-4 mb-8">
          <div>
            <label className="block mb-1">1) Client Nom Légal: <span className="text-red-500">*</span></label>
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
            <label className="block mb-1">2) Opérant sous le nom:</label>
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
              <label className="block mb-1">3) Adresse:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
              />
            </div>
            <div className="w-24">
              <label className="block mb-1">Code Post:</label>
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
              <label className="block mb-1">4) Propriétaire: <span className="text-red-500">*</span></label>
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
              <label className="block mb-1">5) Entreprise Tel #:</label>
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
            <label className="block mb-1">6) En affaire depuis:</label>
            <input
              type="text"
              name="inBusinessSince"
              value={formData.inBusinessSince}
              onChange={handleChange}
              className="w-40 border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
          </div>
        </div>

        {/* Détails du service */}
        <div className="mb-8">
          <label className="block font-semibold mb-2">1) SERVICE</label>
          <textarea
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full h-20 border-2 border-gray-300 rounded p-2 focus:border-green-500 outline-none"
          />
        </div>

        {/* Terme et Rabais */}
        <div className="flex gap-8 mb-8">
          <div className="flex-1">
            <label className="block font-semibold mb-2">2) Terme:</label>
            <input
              type="text"
              name="term"
              value={formData.term}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-2">3) Rabais:</label>
            <input
              type="text"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
          </div>
        </div>

        {/* Clauses Contractuelles (lecture seule) */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Clauses Contractuelles:</h2>
          <ol className="list-decimal pl-5 space-y-4">
            <li>La Corporation Autowiz est d'accord d'octroyer au vendeur ci-haut nommé le code d'accès afin d'utiliser le logiciel de la plateforme automobile Autowiz trouvé chez www.autowizapp.com</li>
            <li>Le client accepte de donner le rabais ci-haut mentionné à tous les garages et clients d'Autowiz durant le terme de ce contrat.</li>
            <li>Le vendeur de pièces accepte de donner des remboursements aux garages et clients d'Autowiz suivant la politique historique du vendeur.</li>
            <li>Le vendeur et Autowiz sont d'accord et acceptent que tout client, garage, individu, entreprise(s) ou autres introduit par un parti à l'autre demeure la propriété du parti faisant l'introduction.</li>
            <li>Toute transaction entre les parties doivent être complétés en utilisant la plateforme d'Autowiz sauf pour les paiements entre parties.</li>
            <li>Ce contrat se renouvelle automatiquement pour une durée équivalente sauf si le client ou Autowiz désire annuler ce contrat dans les 30 jours avant la date du renouvellement.</li>
          </ol>
        </div>

        {/* Date du contrat */}
        <div className="mb-8">
          <p className="mb-4">Daté à 
            <input
              type="text"
              name="dateCity"
              value={formData.dateCity}
              onChange={handleChange}
              className="w-40 mx-2 border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
            ce 
            <input
              type="text"
              name="contractDay"
              value={formData.contractDay}
              onChange={handleChange}
              className="w-10 mx-2 border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
            jour de 
            <input
              type="text"
              name="contractMonth"
              value={formData.contractMonth}
              onChange={handleChange}
              className="w-40 mx-2 border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
            , 20
            <input
              type="text"
              name="contractYear"
              value={formData.contractYear}
              onChange={handleChange}
              className="w-10 ml-2 border-b-2 border-gray-300 focus:border-green-500 outline-none"
            />
          </p>
        </div>

        {/* Signatures */}
        <div className="flex justify-between mb-8">
          <div className="w-1/2 pr-4">
            <div className="border-t-2 border-gray-400 pt-2 mb-2 h-40">
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
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-4 rounded text-sm"
            >
              Télécharger signature du représentant
            </button>
            <p className="mt-2">Signature du représentant</p>
          </div>
          <div className="w-1/2 pl-4">
            <div className="border-t-2 border-gray-400 pt-2 mb-2 h-40">
              {previewVendorSignature ? (
                <img 
                  src={previewVendorSignature} 
                  alt="Signature du licencié" 
                  className="h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-gray-500 italic">La signature du licencié apparaîtra ici</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => triggerSignatureUpload('vendor')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-4 rounded text-sm"
            >
              Télécharger signature du licencié
            </button>
            <p className="mt-2">Signature du Licencié</p>
            <p className="text-sm mt-2">Je suis autorisé à signer pour l'entreprise</p>
          </div>
        </div>

        {/* Pied de page */}
        <div className="text-center text-sm">
          <p>Canada – États Unis, Tél : 613-282-5558 Web : www.autowizapp.com</p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded"
          >
            Imprimer contrat
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-2 px-6 rounded ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Soumission...' : 'Soumettre contrat'}
          </button>
        </div>
      </form>

      {/* Styles spécifiques pour l'impression */}
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

export default CaForm2Fr;