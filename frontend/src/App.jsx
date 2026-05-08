import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithPopup, signOut, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider } from "./firebase/firebase";
import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import EduChainNP from "./pages/EduChainNP";
import HamoCSIT from "./pages/HamoCSIT";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import EduChainNP from "./pages/EduChainNP";
import HamoCSIT from "./pages/HamoCSIT";
import Navbar from "./components/Navbar";
import QA from "./pages/qa";
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for redirect result from Google login
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          setUser(result.user);
        }
      } catch (error) {
        console.error('Redirect result error:', error);
      }
    };

    handleRedirectResult();

    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      // Try popup first
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      // If popup fails (CORS), fallback to redirect
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        console.log('Popup blocked, using redirect...');
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error('Redirect login error:', redirectError);
          alert('Login failed: ' + redirectError.message);
        }
      } else {
        console.error('Popup login error:', error);
        alert('Login failed: ' + error.message);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      alert('Sign out failed: ' + error.message);
    }
  };

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.5rem',
      background: '#1a2940',
      color: 'white'
    }}>
      Loading....
    </div>
  );

  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <AppContent 
        user={user} 
        handleSignOut={handleSignOut} 
        handleGoogleLogin={handleGoogleLogin} 
      />
    </BrowserRouter>
  );
}

function AppContent({ user, handleSignOut, handleGoogleLogin }) {
  const location = useLocation();
  const navigate = useNavigate();
  const showNavbar = location.pathname !== '/hamro-csit';
  const [isProgramsSidebarOpen, setIsProgramsSidebarOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [showSemesterSelection, setShowSemesterSelection] = useState(false);
  const [showSemesterTrigger, setShowSemesterTrigger] = useState(false);

  useEffect(() => {
    if (location.pathname !== '/') {
      setIsProgramsSidebarOpen(false);
      setSelectedSemester(null);
      setShowSemesterSelection(false);
      setShowSemesterTrigger(false);
    }
  }, [location.pathname]);

  const handleNavbarLinkClick = (link) => {
    if (link === 'Home') {
      setIsProgramsSidebarOpen(false);
      setSelectedSemester(null);
      setShowSemesterSelection(false);
      setShowSemesterTrigger(false);
      if (location.pathname !== '/') {
        navigate('/');
      }
      return;
    }

    if (link === 'Programs' && location.pathname === '/') {
      setSelectedSemester(null);
      setShowSemesterSelection(false);
      setShowSemesterTrigger(false);
      setIsProgramsSidebarOpen(true);
    }
  };

  return (
    <>
      {showNavbar && (
        <Navbar
          user={user}
          onSignOut={handleSignOut}
          onNavLinkClick={handleNavbarLinkClick}
        />
      )}
      <Routes>
        <Route 
          path="/" 
          element={user ? <Home user={user} onSignOut={handleSignOut} /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login onLogin={handleGoogleLogin} />} 
        />
      </Routes>
    </>
  );
}

export default App;
