// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';       // ← add these
import { motion, useScroll } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { ThemeProvider } from '@/components/theme-provider';
import './index.css';
import Home from './components/pages/Home';
import LoginPage from './components/pages/Login';
import SignupPage from './components/pages/Register';
import DashboardUser from './components/pages/DashboardUser';
import ProtectedRoutes from './ProtectedRoute';
import DashboardAdmin from './components/pages/DashboardAdmin';
import NotFound from './components/pages/NotFound';


function App() {
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    document.documentElement.classList.add('has-scroll-smooth');
    return () => {
      document.documentElement.classList.remove('has-scroll-smooth');
    };
  }, []);

  const defaultTitle = "Navbharat Niwas";
  const defaultDescription = "Navbharat Niwas: Leading Contruction and Real Estate Company in India, specializing in Plot Sales, Construction, and Real Estate Development. Explore our innovative solutions for your construction needs.";
  const siteUrl = "https://navbharatniwas.in/";

  return (
    <HelmetProvider>
      <BrowserRouter> {/* ← wrap with your Router */}
        <Helmet htmlAttributes={{ lang: 'en-IN' }}>
          <title>{defaultTitle}</title>
          <meta name="description" content={defaultDescription} />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="canonical" href={siteUrl} />
          {/* …other meta tags… */}
        </Helmet>

        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          {/* scroll progress bar */}
          <motion.div
            className="scroll-progress-bar"
            style={{ scaleX: scrollYProgress }}
          />

          <main>
              <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Public routes with auth redirect */}
            <Route 
                path="/login" 
                element={
                    <AuthRedirect>
                        <LoginPage />
                    </AuthRedirect>
                } 
            />
            <Route 
                path="/register" 
                element={
                    <AuthRedirect>
                        <SignupPage />
                    </AuthRedirect>
                } 
            />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoutes />}>
                <Route path="/dashboard-user" element={<DashboardUser />} />
                <Route path="/dashboard-admin" element={<DashboardAdmin />} />
            </Route>
            
            <Route path='*' element={<NotFound />} />
        </Routes>
          </main>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

const AuthRedirect = ({ children }) => {
    const token = localStorage.getItem("isAuthenticated");
    const userdata = JSON.parse(localStorage.getItem("userdata") || "{}");
    
    // If user is already logged in, redirect to appropriate dashboard
    if (token) {
        // Assuming you have user role information
        if (userdata.role == 1) {
            return <Navigate to="/dashboard-admin" replace />;
        } else {
            return <Navigate to="/dashboard-user" replace />;
        }
    }
    
    return children;
};

export default App;
