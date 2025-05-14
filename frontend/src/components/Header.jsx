import React, { useState, useEffect } from "react";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";

const Header = () => {
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Fetch user data from API
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUserEmail(userData.data.email);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="text-sm font-medium text-gray-500">
              CANADA | USA
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="relative inline-block text-left">
              <div className="flex items-center">
                <FaUserCircle className="h-8 w-8 text-gray-400" />
                <span className="ml-2 text-gray-700">
                  {isLoading ? 'Loading...' : userEmail || 'Guest'}
                </span>
                <FaChevronDown className="ml-1 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;