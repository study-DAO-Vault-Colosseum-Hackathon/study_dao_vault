import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithPopup, signOut, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider } from "./firebase/firebase";
import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import EduChainNP from "./pages/EduChainNP";
import Navbar from "./components/Navbar";
import QA from "./pages/qa";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UserList from "./pages/Userlist";
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
  const showNavbar = location.pathname === '/';
  const [isProgramsSidebarOpen, setIsProgramsSidebarOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [showSemesterSelection, setShowSemesterSelection] = useState(false);
  const [showSemesterTrigger, setShowSemesterTrigger] = useState(false);
  const [navRequest, setNavRequest] = useState(null);

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
      setNavRequest({ target: 'home', id: Date.now() });
      if (location.pathname !== '/') {
        navigate('/');
      }
      return;
    }

    if (link === 'Programs') {
      if (location.pathname === '/') {
        setIsProgramsSidebarOpen(true);
      } else {
        setNavRequest({ target: 'programs', id: Date.now() });
        navigate('/');
      }
      return;
    }

    if (link === 'Semesters' && location.pathname === '/') {
      setShowSemesterTrigger(true);
      setIsProgramsSidebarOpen(true);
    }

    if (link === 'About us') {
      setIsProgramsSidebarOpen(false);
      setSelectedSemester(null);
      setShowSemesterSelection(false);
      setShowSemesterTrigger(false);
      setNavRequest({ target: 'about-us', id: Date.now() });
      if (location.pathname !== '/') {
        navigate('/');
      }
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
          element={
            <LandingPage
              onGoogleSignIn={handleGoogleLogin}
              user={user}
              onSignOut={handleSignOut}
              isProgramsSidebarOpen={isProgramsSidebarOpen}
              selectedSemester={selectedSemester}
              showSemesterSelection={showSemesterSelection}
              showSemesterTrigger={showSemesterTrigger}
              navRequest={navRequest}
              onSemesterSelect={setSelectedSemester}
              onShowSemesterSelectionChange={setShowSemesterSelection}
              onShowSemesterTriggerChange={setShowSemesterTrigger}
              onOpenProgramsSidebar={() => setIsProgramsSidebarOpen(true)}
              onCloseProgramsSidebar={() => setIsProgramsSidebarOpen(false)}
            />
          }
        />

        <Route
          path="/login"
          element={<Navigate to="/study-dao" replace />}
        />

        <Route
          path="/auth"
          element={<Navigate to="/study-dao" replace />}
        />

        <Route
          path="/educhain-np"
          element={<EduChainNP onGoogleSignIn={handleGoogleLogin} />}
        />
        <Route
          path="/qa"
          element={<QA user={user}/>}
        />
        <Route
          path="/study-dao"
          element={<EduChainNP onGoogleSignIn={handleGoogleLogin} />}
        />

        <Route
          path="/hamro-csit"
          element={<Navigate to="/" replace />}
        />

        <Route
          path="/chapters"
          element={<Navigate to="/" replace />}
        />

        <Route
          path="/userlist"
          element={<UserList user={user}/>}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
