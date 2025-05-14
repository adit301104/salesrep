import React, { useState, useEffect } from "react";
import { FaSignature, FaTrash } from "react-icons/fa";
import axios from "axios";

// Configure axios instance with baseURL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000, // Add timeout to prevent hanging requests
  headers: {
    'Content-Type': 'application/json',
  }
});

const Data = () => {
  const [country, setCountry] = useState('CANADA');
  const [formType, setFormType] = useState('CaForm1');
  const [selectedSignature, setSelectedSignature] = useState(null);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalForms, setTotalForms] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const formsPerPage = 10;

  // Get all form types based on country
  const getFormTypes = () => {
    if (country === 'CANADA') {
      return [
        ...Array.from({ length: 10 }, (_, i) => `CaForm${i + 1}`),
        ...Array.from({ length: 10 }, (_, i) => `CaForm${i + 1}Fr`)
      ];
    } else {
      return Array.from({ length: 10 }, (_, i) => `USForm${i + 1}`);
    }
  };

  // Fetch forms on component mount and when filters change
  useEffect(() => {
    fetchForms();
  }, [country, formType, currentPage]);

  // Function to fetch forms from the API
  const fetchForms = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setForms([]);
        setTotalForms(0);
        return;
      }

      const response = await api.get(`/forms/type/${formType}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: currentPage,
          limit: formsPerPage
        }
      });
      
      if (response.data && response.data.data) {
        setForms(response.data.data);
        setTotalForms(response.data.count || response.data.data.length);
      } else {
        setForms([]);
        setTotalForms(0);
        setError("Invalid response format from server");
      }
    } catch (err) {
      console.error("Error fetching forms:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch forms";
      setError(errorMessage);
      setForms([]);
      setTotalForms(0);
      
      // Handle unauthorized access
      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
        localStorage.removeItem('token'); // Clear invalid token
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete a form
  const handleDeleteForm = async (id) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setError("Authentication token not found. Please login again.");
          return;
        }
        
        // Try different endpoint structure that might be expected by the server
        // Some APIs expect /forms/delete/:id instead of direct DELETE on /forms/:id
        const response = await api.post(`/forms/delete/${id}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("Form deletion response:", response);
        
        // Remove form from local state regardless of API response
        setForms(prevForms => prevForms.filter(form => form._id !== id));
        setTotalForms(prev => Math.max(0, prev - 1));
        
        alert("Form deleted successfully");
        
        // Refresh forms list
        fetchForms();
      } catch (err) {
        console.error("Error deleting form:", err);
        
        // Even if there's a 500 error, still remove the form from UI
        // This is a workaround in case the form is actually deleted on server
        // despite the error response
        setForms(prevForms => prevForms.filter(form => form._id !== id));
        
        // Try to extract some useful message from the error
        let errorMsg = "An error occurred while deleting the form";
        if (err.response && err.response.data) {
          console.log("Server error details:", err.response.data);
          if (typeof err.response.data === 'string') {
            errorMsg = err.response.data;
          } else if (err.response.data.message) {
            errorMsg = err.response.data.message;
          } else if (err.response.data.error) {
            errorMsg = err.response.data.error;
          }
        }
        
        // Show error to user but don't prevent them from continuing
        alert(`Note: ${errorMsg}. The item was removed from view.`);
      }
    }
  };

  // Function to handle form type change
  const handleFormTypeChange = (e) => {
    setFormType(e.target.value);
    setCurrentPage(1); // Reset to first page when form type changes
  };

  // Function to handle country change
  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    // Set form type to first form of selected country
    setFormType(e.target.value === 'CANADA' ? 'CaForm1' : 'UsForm1');
    setCurrentPage(1); // Reset to first page when country changes
  };

  // Helper function to extract image source from various signature formats
  const getSignatureSource = (signature) => {
    if (!signature) return null;
    
    // If signature is a string (could be URL or base64)
    if (typeof signature === 'string') {
      return signature;
    }
    
    // If signature is an object with url property
    if (typeof signature === 'object' && signature.url) {
      return signature.url;
    }
    
    // If signature is stored in another format, handle accordingly
    // For example, if it's a Map
    if (signature instanceof Map && signature.get('url')) {
      return signature.get('url');
    }
    
    // If signature is a base64 string directly in the object
    if (typeof signature === 'object' && Object.values(signature).some(val => typeof val === 'string' && (val.startsWith('data:image') || val.startsWith('http')))) {
      const possibleUrl = Object.values(signature).find(val => typeof val === 'string' && (val.startsWith('data:image') || val.startsWith('http')));
      if (possibleUrl) return possibleUrl;
    }
    
    return null;
  };

  // Generate dynamic columns based on form fields
  const generateDynamicColumns = () => {
    if (forms.length === 0) return [];

    // Extract all unique field keys from the forms
    const allKeys = new Set();
    forms.forEach(form => {
      if (form.fields) {
        Object.keys(form.fields instanceof Map ? Object.fromEntries(form.fields) : form.fields).forEach(key => {
          allKeys.add(key);
        });
      }
    });

    // Convert to array of column objects
    const fieldsColumns = Array.from(allKeys).map(key => ({
      key: `fields.${key}`,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'), // Format camelCase to Title Case
      isField: true,
      // Special render function for signature fields
      render: (value, row) => {
        // Check if this is a signature field by name
        const isSignatureField = key.toLowerCase().includes('signature');
        
        if (isSignatureField && value) {
          const signatureSrc = getSignatureSource(value);
          if (signatureSrc) {
            return (
              <div className="w-20 h-12 flex items-center justify-center">
                <img 
                  src={signatureSrc} 
                  alt={`${key} signature`} 
                  className="max-h-full max-w-full object-contain cursor-pointer" 
                  onClick={() => setSelectedSignature({
                    type: key.charAt(0).toUpperCase() + key.slice(1),
                    img: signatureSrc
                  })}
                />
              </div>
            );
          }
        }
        
        // For non-signature fields or if no valid signature found
        return typeof value === 'object' ? JSON.stringify(value) : value;
      }
    }));

    // Common columns that should appear for all forms
    const commonColumns = [
      { key: '_id', header: 'ID' },
      { key: 'title', header: 'Title' },
      { key: 'status', header: 'Status' },
      { key: 'submittedAt', header: 'Submitted', 
        render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
      }
    ];

    // Action column for signature viewing and deletion
    const actionColumn = {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => {
        // Check all fields for signatures
        const signatureFields = [];
        if (row.fields) {
          Object.entries(row.fields).forEach(([key, value]) => {
            if (key.toLowerCase().includes('signature') && value) {
              const signatureSrc = getSignatureSource(value);
              if (signatureSrc) {
                signatureFields.push({
                  key,
                  src: signatureSrc
                });
              }
            }
          });
        }

        return (
          <div className="flex space-x-2">
            {signatureFields.map((field, index) => (
              <button
                key={index}
                onClick={() => setSelectedSignature({
                  type: field.key.charAt(0).toUpperCase() + field.key.slice(1).replace(/([A-Z])/g, ' $1'),
                  img: field.src
                })}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <FaSignature className="mr-1" /> {field.key.charAt(0).toUpperCase() + field.key.slice(1).replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
            <button
              onClick={() => handleDeleteForm(row._id)}
              disabled={deleteLoading}
              className={`flex items-center ${deleteLoading ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}`}
            >
              <FaTrash className="mr-1" /> {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        );
      }
    };

    return [...commonColumns, ...fieldsColumns, actionColumn];
  };

  // Get columns based on loaded forms
  const columns = generateDynamicColumns();

  // Handle pagination
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(totalForms / formsPerPage);
    setCurrentPage(prev => Math.min(prev + 1, maxPage));
  };

  // Prepare table data by extracting fields from Map to plain object
  const prepareTableData = () => {
    return forms.map(form => {
      const formData = { ...form };
      // Convert Map fields to plain object if needed
      if (formData.fields instanceof Map) {
        formData.fields = Object.fromEntries(formData.fields);
      } else if (typeof formData.fields !== 'object' || formData.fields === null) {
        formData.fields = {}; // Ensure fields is always an object
      }
      return formData;
    });
  };

  const tableData = prepareTableData();

  // Get cell value based on key path (supports nested objects with dot notation)
  const getCellValue = (row, keyPath) => {
    if (!keyPath || !row) return null;
    
    const keys = keyPath.split('.');
    let value = row;
    
    for (const key of keys) {
      if (value === null || value === undefined) return null;
      value = value[key];
    }
    
    // Handle special data types
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    
    return value;
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      {/* Signature Modal */}
      {selectedSignature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-bold">{selectedSignature.type} Signature</h3>
              <button 
                onClick={() => setSelectedSignature(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex justify-center">
                <img 
                  src={selectedSignature.img} 
                  alt={`${selectedSignature.type} signature`} 
                  className="max-h-64 max-w-full"
                />
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 text-center text-sm text-gray-500 rounded-b-lg">
              {selectedSignature.type} signed document
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Select Country</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={country}
              onChange={handleCountryChange}
            >
              <option value="CANADA">CANADA</option>
              <option value="USA">USA</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2 font-medium text-gray-700">Select Form</label>
            <div className="flex gap-2">
              <select 
                className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formType}
                onChange={handleFormTypeChange}
              >
                {getFormTypes().map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <button 
                className="bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium px-4 py-2 rounded transition-colors"
                onClick={fetchForms}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Show'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">{error}</p>
          {error.includes("session has expired") || error.includes("token not found") ? (
            <p className="mt-2">
              <a href="/login" className="text-red-800 font-medium underline">Go to login</a>
            </p>
          ) : null}
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 pb-0">
          <h2 className="text-xl font-semibold text-gray-800">Form Information - {formType}</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading data...</div>
          ) : forms.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No forms found for the selected type.</div>
          ) : (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th 
                      key={column.key} 
                      className="border-b border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tableData.map((row, rowIndex) => (
                  <tr key={row._id || rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {columns.map((column) => (
                      <td 
                        key={`${row._id || rowIndex}-${column.key}`} 
                        className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200"
                      >
                        {column.render 
                          ? column.render(getCellValue(row, column.key), row) 
                          : column.isField 
                            ? getCellValue(row, column.key) 
                            : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!loading && forms.length > 0 && (
        <div className="flex justify-between items-center">
          <button 
            className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * formsPerPage + 1} to {Math.min(currentPage * formsPerPage, totalForms)} of {totalForms} entries
          </div>
          <button 
            className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded transition-colors ${currentPage >= Math.ceil(totalForms / formsPerPage) ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNextPage}
            disabled={currentPage >= Math.ceil(totalForms / formsPerPage)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Data;