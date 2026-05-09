// hooks/usePrivyAuth.js
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const usePrivyAuth = () => {
  const { user: privyUser, getAccessToken, logout } = usePrivy();
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [jwtToken, setJwtToken] = useState(null);
  const navigate = useNavigate();

  // Get JWT and verify user on login
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!privyUser) {
          localStorage.removeItem('jwtToken');
          setAuthLoading(false);
          return;
        }

        // Get JWT from Privy
        const token = await getAccessToken();
        setJwtToken(token);
        localStorage.setItem('jwtToken', token);

        // Verify/create user in backend (which syncs to Firestore)
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-user`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            privyUserId: privyUser.id,
            email: privyUser.email?.address,
          }),
        });

        if (!response.ok) throw new Error('Failed to verify user');
        
        const userData = await response.json();
        setIsFirstTime(!userData.hasUsername);
        setAuthLoading(false);

        // Redirect to home after auth setup
        if (userData.hasUsername) {
          navigate('/');
        }
      } catch (error) {
        console.error('Auth init error:', error);
        setAuthLoading(false);
      }
    };

    initAuth();
  }, [privyUser]);

  return {
    isAuthenticated: !!privyUser,
    isFirstTime,
    authLoading,
    jwtToken,
    logout,
    privyUser,
  };
};