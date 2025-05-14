import React, { useState } from "react";
import Logo from "../images/Logo.png";
import { FaFileAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const SideBar = ({ activeButton, setActiveButton }) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log('Attempting to logout');
      
      // Get the API URL from environment or use default
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const logoutUrl = `${apiUrl}/api/auth/logout`;
      
      console.log('Making logout request to:', logoutUrl);
      
      const response = await fetch(logoutUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        credentials: 'include' // Include credentials if using cookies
      });

      console.log('Logout response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      // Handle any response - regardless of content
      if (response.ok) {
        // Try to get response text for logging purposes
        try {
          const responseText = await response.text();
          console.log('Logout response text:', responseText);
          
          // Only try to parse if there's actual content
          if (responseText && responseText.trim() !== '') {
            try {
              const data = JSON.parse(responseText);
              console.log('Parsed logout response:', data);
            } catch (parseError) {
              console.log('No JSON to parse in logout response, continuing with logout');
            }
          }
        } catch (textError) {
          console.log('Could not read response text, continuing with logout');
        }
        
        // Complete logout regardless of response content
        localStorage.removeItem('token');
        navigate('/login');
        setActiveButton('Sales Forms');
        console.log('Logout successful, redirected to login');
      } else {
        // Handle error response
        let errorMessage = 'Logout failed';
        try {
          const errorText = await response.text();
          console.error('Logout error response:', errorText);
          
          if (errorText && errorText.trim() !== '') {
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.message || errorMessage;
            } catch (parseError) {
              console.error('Error response not in JSON format');
            }
          }
        } catch (textError) {
          console.error('Could not read error response text');
        }
        
        console.error(errorMessage);
        // Force logout anyway on client side for better user experience
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during logout process:', error);
      // Force logout anyway on client side
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-full md:w-64 lg:w-72 bg-[#0e172b] p-4 md:p-6 shadow-md flex-shrink-0">
      <div className="flex flex-col h-full">
        {/* Logo with responsive sizing */}
        <div className="mb-6 md:mb-8 flex justify-center md:justify-start">
          <img
            src={Logo}
            alt="Autowiz Logo"
            className="h-12 w-auto object-contain"
          />
        </div>
        
        {/* Sidebar buttons with consistent sizing */}
        <div className="space-y-2">
          <Link to="/home">
            <button
              onClick={() => setActiveButton("Sales Forms")}
              className={`flex items-center w-full text-base md:text-lg font-medium py-2 md:py-3 px-3 md:px-4 rounded transition-colors ${
                activeButton === "Sales Forms"
                  ? "bg-[#90EE90] text-black"
                  : "text-gray-200 hover:bg-gray-700"
              }`}
            >
              <FaFileAlt className="mr-3 flex-shrink-0" size={18} />
              <span className="truncate">Sales Forms</span>
            </button>
          </Link>
          
          <Link to="/data">
            <button
              onClick={() => setActiveButton("My Data")}
              className={`flex items-center w-full text-base md:text-lg font-medium py-2 md:py-3 px-3 md:px-4 rounded transition-colors ${
                activeButton === "My Data"
                  ? "bg-[#90EE90] text-black"
                  : "text-gray-200 hover:bg-gray-700"
              }`}
            >
              <FaUser className="mr-3 flex-shrink-0" size={18} />
              <span className="truncate">My Data</span>
            </button>
          </Link>
          
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center w-full text-base md:text-lg font-medium py-2 md:py-3 px-3 md:px-4 rounded transition-colors ${
              isLoggingOut
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : activeButton === "Logout"
                ? "bg-[#90EE90] text-black"
                : "text-gray-200 hover:bg-gray-700"
            }`}
          >
            <FaSignOutAlt className="mr-3 flex-shrink-0" size={18} />
            <span className="truncate">{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;