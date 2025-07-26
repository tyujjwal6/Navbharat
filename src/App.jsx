// src/App.jsx (Corrected)

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/theme-provider';
import './index.css';
import './fonts.css';

// Import your pages
import EvergreenPage from './components/pages/Home';
import LoginPage from './components/pages/Login';
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
import KhatuShyamJi from './components/pages/KhatuShyamJi';
// IMPORTANT: You will also need to import the component for your other project
// import KhatuShyamJi from './components/pages/KhatuShyamJi'; // Example

function App() {
  const defaultTitle = "EverGreen Properties";
  const defaultDescription = "Build Your Future, One Property at a Time. Find your dream home with EverGreen Properties.";
  const siteUrl = "https://example.com/";

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Helmet htmlAttributes={{ lang: 'en' }}>
          {/* ... helmet content ... */}
        </Helmet>

        <ThemeProvider defaultTheme="dark" storageKey="evergreen-ui-theme">
          <main>
            <Routes>
              {/* --- PUBLIC ROUTES (Accessible to Everyone) --- */}
              <Route path="/" element={<EvergreenPage />} /> 
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="/about" element={<About />} /> {/* MOVED HERE - About page should be public */}
              <Route path="/ongoing-projects" element={<OngoingProjects />} /> {/* MOVED HERE - Project listing should be public */}
              
              {/* Project Detail Pages should be public */}
              <Route path="/smart-city-shamli" element={<SmartCityShamli />} />
              <Route path='/khatu-shyam-ji' element={<KhatuShyamJi />} /> {/* Example path for your other project */}
              {/* Don't forget to add a route for your other project! */}
              {/* <Route path="/khatu-shyam-ji" element={<KhatuShyamJi />} /> */}


              {/* --- PROTECTED ROUTES (Requires Login) --- */}
              <Route element={<ProtectedRoutes />}>
                <Route path="/dashboard-user" element={<DashboardUser />} />
                <Route path="/dashboard-admin" element={<DashboardAdmin />} />
                <Route path="/real-estate" element={<RealEstatePage />} />
                
                {/* Note: These probably shouldn't be routes, but components used inside other pages */}
                <Route path="/enquiry" element={<EnquiryModal />} /> 
                <Route path="/footer" element={<Footer />} />
                <Route path="/actionbuttons" element={<ActionButtons />} />
              </Route>
              
              {/* Catch-all Not Found Route */}
              <Route path='*' element={<NotFound />} />
            </Routes>
          </main>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;