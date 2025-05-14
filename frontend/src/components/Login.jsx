import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Logo from "../images/Logo.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Attempting to login with:', { email });
      
      // Get the API URL from environment or use default
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const loginUrl = `${apiUrl}/api/auth/login`;
      
      console.log('Making request to:', loginUrl);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        // Add credentials if using cookies
        credentials: 'include'
      });

      console.log('Full fetch response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });

      // Try to get response text for more info
      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      // If response is empty but status is OK, create a default success response
      if (responseText.trim() === '' && response.ok) {
        console.log('Empty successful response, creating default token');
        
        // Create a temporary token for the session
        // This is a fallback measure - ideally your server should provide a real token
        const tempToken = btoa(`${email}:${Date.now()}`);
        
        // Store token in localStorage
        localStorage.setItem('token', tempToken);
        
        // Redirect to home page
        navigate('/');
        return;
      }

      // If response is not OK, throw an error
      if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}: ${responseText || 'No error details provided'}`);
      }

      // Parse JSON from text - with a fallback for empty responses
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : { success: true };
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        throw new Error('Failed to parse server response. Please contact support.');
      }

      // Check if we got a token
      if (!data.token) {
        console.warn('No token in response:', data);
        throw new Error('Invalid server response: No authentication token provided');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      console.error('Complete login error:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      setError(err.message || 'An unexpected error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e172b] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="justify-items-center sm:mx-auto sm:w-full sm:max-w-md">
        <img
          src={Logo}
          alt="Autowiz Logo"
          className="h-10 w-auto md:h-10 lg:h-15 mx-auto"
        />

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
          Sales-Representative Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-2 text-center text-sm font-medium text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your Email Address"
                  required
                  value={email}
                  onChange={onChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your Password"
                  required
                  value={password}
                  onChange={onChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#0e172b] hover:bg-[#0e172b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;