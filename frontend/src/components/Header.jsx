import React, { useState, useEffect } from "react";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";

const Header = () => {
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No authentication token found');
          setIsLoading(false);
          return;
        }
        
        // Get the API URL from environment or use default
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const userUrl = `${apiUrl}/api/auth/me`;
        
        console.log('Fetching user data from:', userUrl);
        
        const response = await fetch(userUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          credentials: 'include' // Include credentials if using cookies
        });

        console.log('User data response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (response.ok) {
          try {
            // Get response text first
            const responseText = await response.text();
            console.log('User data response text:', responseText);
            
            // Only try to parse if there's actual content
            if (responseText && responseText.trim() !== '') {
              try {
                const userData = JSON.parse(responseText);
                console.log('Parsed user data:', userData);
                
                // Check if we have the expected data structure
                if (userData && userData.data && userData.data.email) {
                  setUserEmail(userData.data.email);
                } else if (userData && userData.email) {
                  // Alternative data structure
                  setUserEmail(userData.email);
                } else {
                  console.warn('Unexpected user data format:', userData);
                  setError('Invalid user data format');
                }
              } catch (parseError) {
                console.error('JSON parsing error:', parseError);
                setError('Failed to parse user data');
              }
            } else {
              console.warn('Empty response received from user data endpoint');
              setError('No user data received');
            }
          } catch (textError) {
            console.error('Error reading response text:', textError);
            setError('Error processing response');
          }
        } else {
          // Handle error response
          let errorMessage = 'Failed to fetch user data';
          try {
            const errorText = await response.text();
            console.error('Error response text:', errorText);
            
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
          setError(errorMessage);
          
          // If unauthorized (401), could redirect to login
          if (response.status === 401) {
            console.warn('User is unauthorized, token may be invalid');
          }
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
        setError('Network error while fetching user data');
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
                  {isLoading ? 'Loading...' : (userEmail || 'Guest')}
                </span>
                <FaChevronDown className="ml-1 h-4 w-4 text-gray-400" />
              </div>
              
              {error && !isLoading && (
                <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 invisible group-hover:visible">
                  <div className="py-1">
                    <p className="px-4 py-2 text-xs text-red-500">
                      {error}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;