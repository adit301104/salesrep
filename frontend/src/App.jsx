import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Data from './components/Data';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Canada from './components/CanadaForms';
import USA from './components/UsaForms';

// Canadian Forms (English)
import CaForm1 from './CaForms/CaForm1';
import CaForm2 from './CaForms/CaForm2';
import CaForm3 from './CaForms/CaForm3';
import CaForm4 from './CaForms/CaForm4';
import CaForm5 from './CaForms/CaForm5';
import CaForm6 from './CaForms/CaForm6';
import CaForm7 from './CaForms/CaForm7';
import CaForm8 from './CaForms/CaForm8';
import CaForm9 from './CaForms/CaForm9';
import CaForm10 from './CaForms/CaForm10';

// Canadian Forms (French)
import CaForm1Fr from './CaForms/CaForm1Fr';
import CaForm2Fr from './CaForms/CaForm2Fr';
import CaForm3Fr from './CaForms/CaForm3Fr';
import CaForm4Fr from './CaForms/CaForm4Fr';
import CaForm5Fr from './CaForms/CaForm5Fr';
import CaForm6Fr from './CaForms/CaForm6Fr';
import CaForm7Fr from './CaForms/CaForm7Fr';
import CaForm8Fr from './CaForms/CaForm8Fr';
import CaForm9Fr from './CaForms/CaForm9Fr';
import CaForm10Fr from './CaForms/CaForm10Fr';

// US Forms (English only)
import USForm1 from './USForms/USForm1';
import USForm2 from './USForms/USForm2';
import USForm3 from './USForms/USForm3';
import USForm4 from './USForms/USForm4';
import USForm5 from './USForms/USForm5';
import USForm6 from './USForms/USForm6';
import USForm7 from './USForms/USForm7';
import USForm8 from './USForms/USForm8';
import USForm9 from './USForms/USForm9';
import USForm10 from './USForms/USForm10';

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route element={<Layout />}>
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          >
            <Route path="canada" element={<Canada />} />
            <Route path="usa" element={<USA />} />
            <Route index element={<Canada />} />
          </Route>
          
          <Route 
            path="/home" 
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          >
            <Route path="canada" element={<Canada />} />
            <Route path="usa" element={<USA />} />
            <Route index element={<Canada />} />
          </Route>
          
          <Route 
            path="/data" 
            element={
              <PrivateRoute>
                <Data />
              </PrivateRoute>
            } 
          />
          
          {/* Canadian Forms - English */}
          <Route path="/CaForm1" element={<PrivateRoute><CaForm1 /></PrivateRoute>} />
          <Route path="/CaForm2" element={<PrivateRoute><CaForm2 /></PrivateRoute>} />
          <Route path="/CaForm3" element={<PrivateRoute><CaForm3 /></PrivateRoute>} />
          <Route path="/CaForm4" element={<PrivateRoute><CaForm4 /></PrivateRoute>} />
          <Route path="/CaForm5" element={<PrivateRoute><CaForm5 /></PrivateRoute>} />
          <Route path="/CaForm6" element={<PrivateRoute><CaForm6 /></PrivateRoute>} />
          <Route path="/CaForm7" element={<PrivateRoute><CaForm7 /></PrivateRoute>} />
          <Route path="/CaForm8" element={<PrivateRoute><CaForm8 /></PrivateRoute>} />
          <Route path="/CaForm9" element={<PrivateRoute><CaForm9 /></PrivateRoute>} />
          <Route path="/CaForm10" element={<PrivateRoute><CaForm10 /></PrivateRoute>} />
          
          {/* Canadian Forms - French */}
          <Route path="/CaForm1Fr" element={<PrivateRoute><CaForm1Fr /></PrivateRoute>} />
          <Route path="/CaForm2Fr" element={<PrivateRoute><CaForm2Fr /></PrivateRoute>} />
          <Route path="/CaForm3Fr" element={<PrivateRoute><CaForm3Fr /></PrivateRoute>} />
          <Route path="/CaForm4Fr" element={<PrivateRoute><CaForm4Fr /></PrivateRoute>} />
          <Route path="/CaForm5Fr" element={<PrivateRoute><CaForm5Fr /></PrivateRoute>} />
          <Route path="/CaForm6Fr" element={<PrivateRoute><CaForm6Fr /></PrivateRoute>} />
          <Route path="/CaForm7Fr" element={<PrivateRoute><CaForm7Fr /></PrivateRoute>} />
          <Route path="/CaForm8Fr" element={<PrivateRoute><CaForm8Fr /></PrivateRoute>} />
          <Route path="/CaForm9Fr" element={<PrivateRoute><CaForm9Fr /></PrivateRoute>} />
          <Route path="/CaForm10Fr" element={<PrivateRoute><CaForm10Fr /></PrivateRoute>} />
          
          {/* US Forms - English */}
          <Route path="/USForm1" element={<PrivateRoute><USForm1 /></PrivateRoute>} />
          <Route path="/USForm2" element={<PrivateRoute><USForm2 /></PrivateRoute>} />
          <Route path="/USForm3" element={<PrivateRoute><USForm3 /></PrivateRoute>} />
          <Route path="/USForm4" element={<PrivateRoute><USForm4 /></PrivateRoute>} />
          <Route path="/USForm5" element={<PrivateRoute><USForm5 /></PrivateRoute>} />
          <Route path="/USForm6" element={<PrivateRoute><USForm6 /></PrivateRoute>} />
          <Route path="/USForm7" element={<PrivateRoute><USForm7 /></PrivateRoute>} />
          <Route path="/USForm8" element={<PrivateRoute><USForm8 /></PrivateRoute>} />
          <Route path="/USForm9" element={<PrivateRoute><USForm9 /></PrivateRoute>} />
          <Route path="/USForm10" element={<PrivateRoute><USForm10 /></PrivateRoute>} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<div className="p-8 text-center">404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;