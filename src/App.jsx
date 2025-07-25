// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/theme-provider'; // Assuming you have this
import './index.css';
import './fonts.css'; // Import your global styles

// Import your pages
import EvergreenPage from './components/pages/Home'; // This is now your home page
import  LoginPage  from './components/pages/Login'; // Keep other pages as is
import SignupPage from './components/pages/Register';
import DashboardUser from './components/pages/DashboardUser';
import ProtectedRoutes from './ProtectedRoute';
import DashboardAdmin from './components/pages/DashboardAdmin';
import NotFound from './components/pages/NotFound';
import RealEstatePage from './components/pages/RealEstatePage';
import EnquiryModal from './components/pages/EnquiryModal';
import OngoingProjects from './components/pages/OngoingProjects';
import About from './components/pages/About';
import Footer from './components/pages/Footer';
import ActionButtons from './components/pages/ActionButtons';
import SmartCityShamli from './components/pages/SmartCityShamli';

function App() {
  const defaultTitle = "EverGreen Properties";
  const defaultDescription = "Build Your Future, One Property at a Time. Find your dream home with EverGreen Properties.";
  const siteUrl = "https://example.com/"; // Replace with your domain

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Helmet htmlAttributes={{ lang: 'en' }}>
          <title>{defaultTitle}</title>
          <meta name="description" content={defaultDescription} />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="canonical" href={siteUrl} />
        </Helmet>

        <ThemeProvider defaultTheme="dark" storageKey="evergreen-ui-theme">
          {/* 
            NO GLOBAL HEADER HERE! 
            The Header is now managed by individual pages like EvergreenPage.
          */}
          <main>
            <Routes>
              {/* EvergreenPage is now the home route */}
              <Route path="/" element={<EvergreenPage />} /> 
              
              {/* Other routes in your application */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<SignupPage />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoutes />}>
                <Route path="/dashboard-user" element={<DashboardUser />} />
                <Route path="/dashboard-admin" element={<DashboardAdmin />} />
                <Route path="/real-estate" element={<RealEstatePage />} />
                <Route path="/enquiry" element={<EnquiryModal />} />
                <Route path="/ongoing-projects" element={<OngoingProjects/>} />
                <Route path="/about" element={<About />} />
                <Route path="/footer" element={<Footer />} />
                <Route path="/actionbuttons" element={<ActionButtons />} />
                <Route path="/smart-city-shamli" element={<SmartCityShamli />} />
              </Route>
              
              <Route path='*' element={<NotFound />} />
            </Routes>
          </main>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;