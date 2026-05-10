import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AppRoutes from './AppRoutes';
import ProgramsSidebar from '../components/ProgramsSidebar';

const MainLayout = ({ user, handleSignOut, handleGoogleLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isProgramsSidebarOpen, setIsProgramsSidebarOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [showSemesterSelection, setShowSemesterSelection] = useState(false);
  const [showSemesterTrigger, setShowSemesterTrigger] = useState(false);
  const [navRequest, setNavRequest] = useState(null);

  useEffect(() => {
    if (location.pathname !== '/') {
      // Don't close sidebar automatically on path change if we want it as overlay
      // but we might want to reset other states
      setSelectedSemester(null);
      setShowSemesterSelection(false);
      setShowSemesterTrigger(false);
    }
  }, [location.pathname]);

  const handleNavbarLinkClick = (link) => {
    if (link === '/') {
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

    if (link === 'programs-section') {
      setIsProgramsSidebarOpen(true);
      return;
    }

    if (link === 'about-us-section') {
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

  const handleSemesterClick = (num) => {
    setSelectedSemester(num);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <>
      <Navbar
        user={user}
        onSignOut={handleSignOut}
        onNavLinkClick={handleNavbarLinkClick}
      />
      
      <ProgramsSidebar 
        isOpen={isProgramsSidebarOpen}
        onClose={() => setIsProgramsSidebarOpen(false)}
        selectedSemester={selectedSemester}
        onSemesterClick={handleSemesterClick}
      />

      <AppRoutes 
        user={user}
        handleGoogleLogin={handleGoogleLogin}
        handleSignOut={handleSignOut}
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
    </>
  );
};

export default MainLayout;
