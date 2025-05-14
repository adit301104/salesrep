import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo2 from "../images/Logo2.png";
import axios from "axios";

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const CaForm9Fr = () => {
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
    licensier: '',
    territoryNumber: '',
    licensierAddress: '',
    licensierTel: '',
    service: '',
    term: '',
    monthlyCost: '',
    deductionDate: '',
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
        throw new Error("Le nom légal du client et l'adresse sont requis");
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Jeton d'authentification non trouvé. Veuillez vous connecter à nouveau.");
      }
      
      // Create submission data object
      const submissionData = {
        formType: "CaForm9Fr",
        title: `Contrat de Service Garage - ${formData.clientLegalName}`,
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
      
      showNotificationMessage("success", "Contrat de service garage soumis avec succès!");
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
            <h1 className="text-2xl font-bold">GARAGE - CONTRAT DE SERVICE</h1>
            <img src={Logo2} alt="Logo de l'entreprise" className="h-16" />
          </div>

          <div className="mb-6">
            <div className="flex justify-end mb-2">
              <div className="w-1/2">
                <label htmlFor="accountNumber" className="block mb-1">Numéro de compte:</label>
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
                <label htmlFor="clientLegalName" className="block mb-1">1) Client Nom Légal: <span className="text-red-500">*</span></label>
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
                <label htmlFor="doingBusinessAs" className="block mb-1">2) Opérant sous le nom:</label>
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
                <label htmlFor="address" className="block mb-1">3) Adresse: <span className="text-red-500">*</span></label>
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
                <label htmlFor="postalCode" className="block mb-1">Code Post:</label>
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
                <label htmlFor="owner" className="block mb-1">4) Propriétaire:</label>
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
                <label htmlFor="celNumber" className="block mb-1">Cellulaire:</label>
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
                <label htmlFor="businessTel" className="block mb-1">5) Entreprise Tel #:</label>
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
                <label htmlFor="email" className="block mb-1">Courriel:</label>
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
                <label htmlFor="inBusinessSince" className="block mb-1">6) En affaire depuis:</label>
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

          {/* Licensier Information */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col md:flex-row md:gap-4">
              <div className="flex-1">
                <label htmlFor="licensier" className="block mb-1">1) Licensier:</label>
                <input
                  type="text"
                  id="licensier"
                  name="licensier"
                  value={formData.licensier}
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
                <label htmlFor="licensierAddress" className="block mb-1">2) Adresse:</label>
                <input
                  type="text"
                  id="licensierAddress"
                  name="licensierAddress"
                  value={formData.licensierAddress}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div className="md:w-1/3">
                <label htmlFor="licensierTel" className="block mb-1">Tel #:</label>
                <input
                  type="text"
                  id="licensierTel"
                  name="licensierTel"
                  value={formData.licensierTel}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Service, Term, Monthly Cost */}
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
                <label htmlFor="term" className="block mb-1">Terme:</label>
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
                <label htmlFor="monthlyCost" className="block mb-1">Coût mensuel+Taxes:</label>
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
              <label htmlFor="deductionDate" className="block mb-1">Date des déductions mensuels:</label>
              <input
                type="text"
                id="deductionDate"
                name="deductionDate"
                value={formData.deductionDate}
                onChange={handleInputChange}
                className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
          </div>

          {/* General Provisions */}
          <div className="mb-8">
            <h3 className="font-bold mb-3">Clauses Contractuelles:</h3>
            <div className="space-y-3 text-sm">
              <p>1) La Corporation Autowiz est d'accord d'octroyer au client ci-haut nommé le code d'accès afin télécharger depuis www.autowizapp.com le logiciel de la plateforme automobile.</p>
              <p>2) Le client accepte de payer la somme ci-dessus sur une base mensuelle par carte de crédit pour la durée décrite ci-dessus.</p>
              <p>3) Il n'y a aucun remboursement disponible sur ce contrat.</p>
              <p>4) Le client accepte de payer des frais de service de deux fois les frais bancaires si le débit mensuel est refusé.</p>
              <p>5) Si le client souhaite résilier ce contrat, des frais équivalant à deux mois de débit seront débités au client sur la forme de paiement fourni par le client, ce que le client accepte de payer.</p>
              <p>6) Ce contrat se renouvelle automatiquement pour une durée équivalente sauf si un avis est reçu du client 60 jours avant l'expiration de son intention de ne pas procéder à un renouvellement.</p>
            </div>
          </div>

          {/* Signature Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="datingSigned" className="block mb-1">Daté à:</label>
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
                <label htmlFor="dateDaySigned" className="block mb-1">ce</label>
                <input
                  type="text"
                  id="dateDaySigned"
                  name="dateDaySigned"
                  value={formData.dateDaySigned}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="jour"
                />
              </div>
              <div className="md:w-1/4">
                <label htmlFor="dateMonthSigned" className="block mb-1">jour de</label>
                <input
                  type="text"
                  id="dateMonthSigned"
                  name="dateMonthSigned"
                  value={formData.dateMonthSigned}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="mois"
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
                  placeholder="AA"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between mb-8">
              <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                <label className="block font-bold mb-1">Signature du Licensier:</label>
                <div className="border p-2 h-32 flex items-center justify-center bg-gray-50 rounded">
                  {previewRepresentativeSignature ? (
                    <img 
                      src={previewRepresentativeSignature} 
                      alt="Signature du Licensier" 
                      className="h-full max-w-full object-contain" 
                    />
                  ) : (
                    <p className="text-gray-500 italic">La signature du licensier apparaîtra ici</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => triggerSignatureUpload('representative')}
                  className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
                >
                  Télécharger Signature du Licensier
                </button>
              </div>
              <div className="flex-1">
                <label className="block font-bold mb-1">Signature du Client:</label>
                <div className="border p-2 h-32 flex items-center justify-center bg-gray-50 rounded">
                  {previewClientSignature ? (
                    <img 
                      src={previewClientSignature} 
                      alt="Signature du Client" 
                      className="h-full max-w-full object-contain" 
                    />
                  ) : (
                    <p className="text-gray-500 italic">La signature du client apparaîtra ici</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => triggerSignatureUpload('client')}
                  className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
                >
                  Télécharger Signature du Client
                </button>
                <p className="text-sm text-gray-600 mt-2 text-center">Je suis autorisé à signer pour l'entreprise</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm mb-6">
            <p>CANADA – ÉTATS-UNIS - Tél : 613-282-5558 Web : www.autowizapp.com</p>
          </div>

          <div className="flex justify-between mt-6 gap-4">
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
          <h1 className="text-2xl font-bold">GARAGE - CONTRAT DE SERVICE</h1>
          <img src={Logo2} alt="Logo de l'entreprise" className="h-16" />
        </div>

        <div className="mb-6 text-right">
          <p className="font-bold">Numéro de compte: <span className="font-normal">{formData.accountNumber}</span></p>
        </div>

        {/* Print version of client information */}
        <div className="space-y-4 mb-8">
          <p className="font-bold">1) Client Nom Légal: <span className="font-normal">{formData.clientLegalName}</span></p>
          <p className="font-bold">2) Opérant sous le nom: <span className="font-normal">{formData.doingBusinessAs}</span></p>
          <p className="font-bold">3) Adresse: <span className="font-normal">{formData.address}</span> Code Post: <span className="font-normal">{formData.postalCode}</span></p>
          <p className="font-bold">4) Propriétaire: <span className="font-normal">{formData.owner}</span> Cellulaire: <span className="font-normal">{formData.celNumber}</span></p>
          <p className="font-bold">5) Entreprise Tel #: <span className="font-normal">{formData.businessTel}</span> Courriel: <span className="font-normal">{formData.email}</span></p>
          <p className="font-bold">6) En affaire depuis: <span className="font-normal">{formData.inBusinessSince}</span></p>
        </div>

        {/* Print version of licensier information */}
        <div className="space-y-4 mb-8">
          <p className="font-bold">1) Licensier: <span className="font-normal">{formData.licensier}</span> Terr. #: <span className="font-normal">{formData.territoryNumber}</span></p>
          <p className="font-bold">2) Adresse: <span className="font-normal">{formData.licensierAddress}</span> Tel #: <span className="font-normal">{formData.licensierTel}</span></p>
        </div>

        {/* Print version of service, term, monthly cost */}
        <div className="space-y-4 mb-8">
          <p className="font-bold">SERVICE: <span className="font-normal">{formData.service}</span></p>
          <p className="font-bold">Terme: <span className="font-normal">{formData.term}</span> Coût mensuel+Taxes: <span className="font-normal">{formData.monthlyCost}</span></p>
          <p className="font-bold">Date des déductions mensuels: <span className="font-normal">{formData.deductionDate}</span></p>
        </div>

        {/* Print version of General Provisions */}
        <div className="mb-8">
          <h3 className="font-bold mb-3">Clauses Contractuelles:</h3>
          <div className="space-y-3 text-sm">
            <p>1) La Corporation Autowiz est d'accord d'octroyer au client ci-haut nommé le code d'accès afin télécharger depuis www.autowizapp.com le logiciel de la plateforme automobile.</p>
            <p>2) Le client accepte de payer la somme ci-dessus sur une base mensuelle par carte de crédit pour la durée décrite ci-dessus.</p>
            <p>3) Il n'y a aucun remboursement disponible sur ce contrat.</p>
            <p>4) Le client accepte de payer des frais de service de deux fois les frais bancaires si le débit mensuel est refusé.</p>
            <p>5) Si le client souhaite résilier ce contrat, des frais équivalant à deux mois de débit seront débités au client sur la forme de paiement fourni par le client, ce que le client accepte de payer.</p>
            <p>6) Ce contrat se renouvelle automatiquement pour une durée équivalente sauf si un avis est reçu du client 60 jours avant l'expiration de son intention de ne pas procéder à un renouvellement.</p>
          </div>
        </div>

        {/* Print version of signature section */}
        <div className="mb-8">
          <p>Daté à {formData.datingSigned} ce {formData.dateDaySigned} jour de {formData.dateMonthSigned}, 20{formData.dateYearSigned}</p>
          
          <div className="flex justify-between mt-4">
            <div>
              {previewRepresentativeSignature && (
                <img src={previewRepresentativeSignature} alt="Signature du Licensier" className="h-16" />
              )}
              <p className="mt-1 border-t border-black pt-1">Signature du Licensier</p>
            </div>
            <div>
              {previewClientSignature && (
                <img src={previewClientSignature} alt="Signature du Client" className="h-16" />
              )}
              <p className="mt-1 border-t border-black pt-1">Signature du Client</p>
              <p className="text-sm">Je suis autorisé à signer pour l'entreprise</p>
            </div>
          </div>
        </div>

        {/* Print version of footer */}
        <div className="text-center text-sm mb-6">
          <p>CANADA – ÉTATS-UNIS - Tél : 613-282-5558 Web : www.autowizapp.com</p>
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

export default CaForm9Fr;