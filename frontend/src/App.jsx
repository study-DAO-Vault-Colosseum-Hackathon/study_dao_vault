import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { magic } from "./utils/magic";
import { auth } from "./firebase/firebase";
import { signInWithCustomToken } from "firebase/auth";
import LandingPage from "./pages/LandingPage";
import EduChainNP from "./pages/EduChainNP";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import UserList from "./pages/Userlist";
import AdminDashboard from "./pages/AdminDashboard";
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!magic || !magic.user) {
          setLoading(false);
          return;
        }

        const queryParams = new URLSearchParams(window.location.search);
        const isRedirect = queryParams.has('magic_oauth_request_id') || queryParams.has('magic_credential');

        // 1. Handle OAuth Redirect
        if (isRedirect) {
          console.log('OAuth redirect detected, handling result...');
          try {
            const result = await magic.oauth.getRedirectResult();
            if (result) {
              // Only get the token. Backend will do the rest.
              const didToken = result.magic.idToken;
              
              // Optional: Try to get Solana account if possible
              let solAddress = null;
              try {
                solAddress = await magic.solana.getAccount();
              } catch (e) { console.warn('Solana extension account check skipped'); }

              await verifyWithBackend(didToken, solAddress);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error('OAuth sync error:', err);
          }
        }

        // 2. Regular Session Check
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          console.log('Active session found, verifying...');
          try {
            const didToken = await magic.user.getIdToken();
            
            let solAddress = null;
            try {
              solAddress = await magic.solana.getAccount();
            } catch (e) { console.warn('Solana extension account check skipped'); }

            await verifyWithBackend(didToken, solAddress);
          } catch (tokenErr) {
            console.error('Failed to get DID token:', tokenErr);
          }
        } else {
          console.log('No user session.');
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const verifyWithBackend = async (didToken, solanaAddressOverride = null) => {
    try {
      console.log('Syncing identity with backend...');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${didToken}`
        },
        body: JSON.stringify({
          walletAddress: solanaAddressOverride 
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Handshake successful:', data);
        
        if (data.firebaseToken) {
          try {
            await signInWithCustomToken(auth, data.firebaseToken);
          } catch (fbErr) {
            console.error('Firebase bridge failed:', fbErr);
          }
        }

        setUser({
          ...data,
          uid: data.userId,
          // Prioritize the detected Solana address if we have it
          walletAddress: solanaAddressOverride || data.walletAddress
        });
      } else {
        console.error('Backend rejected handshake:', response.status);
      }
    } catch (err) {
      console.error('Backend sync failed:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      if (magic) await magic.user.logout();
      await auth.signOut();
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="app-loading-screen">
      <div className="loader-container">
        <div className="loader-orbit">
          <div className="loader-planet"></div>
        </div>
        <h2 className="loader-text">EduChainNP</h2>
        <p className="loader-subtext">Initializing secure Solana session...</p>
      </div>
    </div>
  );

  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AppContent 
        user={user} 
        handleSignOut={handleSignOut} 
      />
    </BrowserRouter>
  );
}

function AppContent({ user, handleSignOut }) {
  const location = useLocation();
  const navigate = useNavigate();
  const showNavbar = location.pathname !== '/login' && location.pathname !== '/auth';
  
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
      if (location.pathname !== '/') navigate('/');
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
      if (location.pathname !== '/') navigate('/');
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
              onGoogleSignIn={() => navigate('/auth')}
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
          element={<Navigate to="/auth" replace />}
        />

        <Route
          path="/auth"
          element={user ? <Navigate to="/study-dao" replace /> : <Auth onLoginSuccess={(u) => setUser(u)} />}
        />

        <Route
          path="/educhain-np"
          element={user ? <EduChainNP user={user} /> : <Navigate to="/auth" />}
        />

        <Route
          path="/study-dao"
          element={user ? <EduChainNP user={user} /> : <Navigate to="/auth" />}
        />

        <Route
          path="/userlist"
          element={<UserList user={user}/>}
        />
        <Route
          path="/admindashboard"
          element={<AdminDashboard user={user}/>}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
