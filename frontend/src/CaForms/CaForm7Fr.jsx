import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo2 from "../images/Logo2.png";
import axios from "axios";

// Configure axios defaults for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const CaForm7Fr = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    garageName: '',
    licenseeName: '',
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
      batteryCharging: false,
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
      recycling: false
    },
    expertise: {
      northAmericanCars: false,
      europeanCars: false,
      asianCars: false,
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

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salesRepSignature, setSalesRepSignature] = useState(null);
  const [vendorSignature, setVendorSignature] = useState(null);
  
  const salesRepSignatureRef = useRef(null);
  const vendorSignatureRef = useRef(null);

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

  const handleSignatureUpload = (e, signatureType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (signatureType === 'salesRepSignature') {
          setSalesRepSignature(reader.result);
        } else {
          setVendorSignature(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSignatureUpload = (type) => {
    if (type === 'salesRepSignature') {
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
      if (!formData.garageName.trim() || !formData.licenseeName.trim()) {
        throw new Error("Nom du Garage et Nom du Licencié sont requis");
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Jeton d'authentification non trouvé. Veuillez vous connecter à nouveau.");
      }
      
      // Create submission data object
      const submissionData = {
        formType: "CaForm7Fr",
        title: `Services du Garage - ${formData.garageName}`,
        fields: {
          ...formData,
          salesRepSignature,
          vendorSignature
        }
      };
      
      // Set headers
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Make the API call
      const response = await api.post('/forms', submissionData, { headers });
      
      showNotificationMessage("success", "Formulaire des services du garage soumis avec succès!");
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

  // French labels for checkboxes
  const servicesLabels = {
    oilChanges: "Changement d'huile",
    diagnostic: "Diagnostique",
    airConditioning: "Air Conditionnée",
    transmission: "Transmission",
    brakes: "Freins",
    glassReplacement: "Réparation vitrine",
    suspension: "Amortisseurs",
    engine: "Moteur",
    pipesAndExhaust: "Tuyaux échappements",
    electricals: "Electriques",
    tuneUps: "Mise au point",
    wheelAlignment: "Alignement roues",
    tireChanges: "Changement de pneus",
    steering: "Volant",
    tankReplacement: "Réparation réservoir",
    batteryChanges: "Batteries",
    hosesAndBelts: "Tuyaux et courroies",
    radiator: "Radiateur",
    wipers: "Essuies glace",
    towing: "Remorquage",
    doorLocks: "Serrures",
    gasoline: "Gasoline",
    batteryCharging: "Charger la batterie",
    trailerHitches: "Attelage de remorque"
  };

  const facilitiesLabels = {
    publicWashrooms: "Toilettes publique",
    shuttle: "Service de transport",
    autoLoaner: "Véhicule disponible",
    childrenArea: "Section des jeunes",
    publicTransit: "Autobus",
    drinks: "Breuvages",
    nearRestaurant: "Restaurants à proximité",
    openWeekends: "Ouvert fin de semaine",
    multipleBays: "Plusieurs portes 3+",
    waitingArea: "Centre d'attente",
    openEvenings: "Ouvert en soirée",
    safeArea: "Endroit paisible",
    franchise: "Franchise"
  };

  const specialtyServicesLabels = {
    windowTinting: "Teinture de fenêtre",
    magWheels: "Roues Mag",
    painting: "Peinture",
    handicapServices: "Services pour handicapés",
    customWork: "Travail sur mesure",
    automaticStarters: "Démarreurs Automatique",
    carAlarms: "Alarmes",
    recycling: "Recyclage"
  };

  const expertiseLabels = {
    northAmericanCars: "Nord Américain",
    europeanCars: "Europeen",
    asianCars: "Asiatique",
    other: "Autre",
    bodyShop: "Centre de débossage",
    trucksVans: "Camions/Fourgonnettes",
    diesel: "Diesel",
    electric: "Electrique",
    hybrid: "Hybride",
    manualTrans: "Transmission Manuelle",
    autoTrans: "Transmission Automatique"
  };

  const CheckboxGroup = ({ title, items, category, labels }) => (
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
              {labels[key]}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  // Hidden file inputs
  const hiddenInputs = (
    <>
      <input
        type="file"
        ref={salesRepSignatureRef}
        onChange={(e) => handleSignatureUpload(e, 'salesRepSignature')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={vendorSignatureRef}
        onChange={(e) => handleSignatureUpload(e, 'vendorSignature')}
        accept="image/*"
        className="hidden"
      />
    </>
  );

  // Notification component
  const notification = showNotification && (
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
  );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg print:p-0 print:shadow-none">
      {notification}
      {hiddenInputs}

      <div className="print:hidden">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">SERVICES DU GARAGE</h1>
            <img src={Logo2} alt="Logo de l'entreprise" className="h-16" />
          </div>

          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="flex-1 mb-2 md:mb-0 md:mr-4">
              <label htmlFor="garageName" className="block mb-1">Nom du Garage: <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="garageName"
                name="garageName"
                value={formData.garageName}
                onChange={handleInputChange}
                className="w-full border p-2 focus:border-green-500 outline-none"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="licenseeName" className="block mb-1">Nom du Licencié: <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="licenseeName"
                name="licenseeName"
                value={formData.licenseeName}
                onChange={handleInputChange}
                className="w-full border p-2 focus:border-green-500 outline-none"
                required
              />
            </div>
          </div>

          <CheckboxGroup
            title="SERVICES"
            items={formData.services}
            category="services"
            labels={servicesLabels}
          />

          <CheckboxGroup
            title="DESCRIPTION"
            items={formData.facilities}
            category="facilities"
            labels={facilitiesLabels}
          />

          <CheckboxGroup
            title="SERVICES SPÉCIALISÉS"
            items={formData.specialtyServices}
            category="specialtyServices"
            labels={specialtyServicesLabels}
          />

          <CheckboxGroup
            title="EXPERTISE DE VÉHICULES"
            items={formData.expertise}
            category="expertise"
            labels={expertiseLabels}
          />

          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">PHOTOS</h3>
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
              className="w-full border p-2 h-20 focus:border-green-500 outline-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block font-bold mb-1">Signature du Représentant:</label>
              <div className="border-2 border-gray-300 p-2 h-32 flex items-center justify-center bg-gray-50">
                {salesRepSignature ? (
                  <img 
                    src={salesRepSignature} 
                    alt="Signature du Représentant" 
                    className="max-h-28 object-contain" 
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 italic mb-2">La signature du représentant apparaîtra ici</p>
                    <button
                      type="button"
                      onClick={() => triggerSignatureUpload('salesRepSignature')}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                    >
                      Télécharger signature
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block font-bold mb-1">Signature du Licencié:</label>
              <div className="border-2 border-gray-300 p-2 h-32 flex items-center justify-center bg-gray-50">
                {vendorSignature ? (
                  <img 
                    src={vendorSignature} 
                    alt="Signature du Licencié" 
                    className="max-h-28 object-contain" 
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 italic mb-2">La signature du licencié apparaîtra ici</p>
                    <button
                      type="button"
                      onClick={() => triggerSignatureUpload('vendorSignature')}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                    >
                      Télécharger signature
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">Je suis autorisé à signer pour l'entreprise</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Imprimer
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${
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
          <h1 className="text-2xl font-bold">SERVICES DU GARAGE</h1>
          <img src={Logo2} alt="Logo de l'entreprise" className="h-16" />
        </div>

        <div className="flex justify-between mb-6">
          <div className="flex-1 mr-4">
            <p className="font-bold">Nom du Garage: <span className="font-normal">{formData.garageName}</span></p>
          </div>
          <div className="flex-1">
            <p className="font-bold">Nom du Licencié: <span className="font-normal">{formData.licenseeName}</span></p>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">SERVICES</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(formData.services).map(([key, value]) => 
              value ? (
                <div key={key} className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>{servicesLabels[key]}</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">DESCRIPTION</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(formData.facilities).map(([key, value]) => 
              value ? (
                <div key={key} className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>{facilitiesLabels[key]}</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Specialty Services Section */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">SERVICES SPÉCIALISÉS</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(formData.specialtyServices).map(([key, value]) => 
              value ? (
                <div key={key} className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>{specialtyServicesLabels[key]}</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Expertise Section */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">EXPERTISE DE VÉHICULES</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(formData.expertise).map(([key, value]) => 
              value ? (
                <div key={key} className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>{expertiseLabels[key]}</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Pictures Section */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">PHOTOS</h3>
          <div className="flex space-x-4">
            {formData.pictures.pic1 && <span className="mr-4">✓ #1</span>}
            {formData.pictures.pic2 && <span className="mr-4">✓ #2</span>}
            {formData.pictures.pic3 && <span className="mr-4">✓ #3</span>}
          </div>
        </div>

        {/* Notes Section */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Notes:</h3>
          <p>{formData.notes}</p>
        </div>

        {/* Signatures */}
        <div className="flex justify-between mb-4">
          <div className="flex-1 mr-4">
            <p className="font-bold mb-2">Signature du Représentant:</p>
            {salesRepSignature && (
              <img 
                src={salesRepSignature} 
                alt="Signature du Représentant" 
                className="h-20" 
              />
            )}
          </div>
          <div className="flex-1">
            <p className="font-bold mb-2">Signature du Licencié:</p>
            {vendorSignature && (
              <img 
                src={vendorSignature} 
                alt="Signature du Licencié" 
                className="h-20" 
              />
            )}
            <p className="text-sm mt-1">Je suis autorisé à signer pour l'entreprise</p>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
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

export default CaForm7Fr;