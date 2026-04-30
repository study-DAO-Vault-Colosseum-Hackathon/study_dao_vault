import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebase/firebase";
import { useState, useEffect } from "react";
import StudyDAO from "./pages/StudyDAO";
import CosmicBook from "./pages/CosmicBook";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
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
      Loading...
    </div>
  );

  return (
    <BrowserRouter>
      {user && <Navbar user={user} onGoogleSignIn={handleGoogleLogin} onSignOut={handleSignOut} />}
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/cosmic-book" /> : <StudyDAO user={user} onSignOut={handleSignOut} />} 
        />

        <Route 
          path="/cosmic-book" 
          element={user ? <CosmicBook /> : <Navigate to="/" />} 
        />

        <Route 
          path="/login" 
          element={user ? <Navigate to="/cosmic-book" /> : <Login onLogin={handleGoogleLogin} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
