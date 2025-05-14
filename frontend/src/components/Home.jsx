import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Home = () => {
  const [selectedCountry, setSelectedCountry] = useState("CANADA");
  const navigate = useNavigate();

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    navigate(`/home/${country.toLowerCase()}`);
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sales Forms - Create a new form</h1>
        </div>
      </div>

      {/* Country Selection Buttons */}
      <div className="flex justify-center mb-6 md:mb-8 gap-4">
        <button
          onClick={() => handleCountryChange("CANADA")}
          className={`px-6 py-2 text-sm md:text-base font-medium rounded-lg border border-gray-200 ${
            selectedCountry === "CANADA"
              ? "bg-[#4CAF50] text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          CANADA
        </button>
        <button
          onClick={() => handleCountryChange("USA")}
          className={`px-6 py-2 text-sm md:text-base font-medium rounded-lg border border-gray-200 ${
            selectedCountry === "USA"
              ? "bg-[#4CAF50] text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          USA
        </button>
      </div>

      {/* Dynamic content area */}
      <div className="max-w-4xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;