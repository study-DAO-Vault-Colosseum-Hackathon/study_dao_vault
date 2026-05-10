import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from "../pages/LandingPage";
import EduChainNP from "../pages/EduChainNP";
import QA from "../pages/qa";
import UserList from "../pages/Userlist";
import AdminDashboard from "../pages/AdminDashboard";

const AppRoutes = ({ 
  user, 
  handleGoogleLogin, 
  handleSignOut, 
  isProgramsSidebarOpen,
  selectedSemester,
  showSemesterSelection,
  showSemesterTrigger,
  navRequest,
  onSemesterSelect,
  onShowSemesterSelectionChange,
  onShowSemesterTriggerChange,
  onOpenProgramsSidebar,
  onCloseProgramsSidebar
}) => {
  return (
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
            onSemesterSelect={onSemesterSelect}
            onShowSemesterSelectionChange={onShowSemesterSelectionChange}
            onShowSemesterTriggerChange={onShowSemesterTriggerChange}
            onOpenProgramsSidebar={onOpenProgramsSidebar}
            onCloseProgramsSidebar={onCloseProgramsSidebar}
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
      <Route
        path="/admindashboard"
        element={<AdminDashboard user={user}/>}
      />
      <Route
        path="/qa"
        element={<QA user={user} />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
