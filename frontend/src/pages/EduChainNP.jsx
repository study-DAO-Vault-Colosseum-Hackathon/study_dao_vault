import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import LoginPage from '../components/ui/gaming-login';

export default function EduChainNP() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    const result = await signInWithPopup(auth, provider);
    if (result?.user) {
      navigate('/', { replace: true });
    }
  };

  const handleQuickAccessLogin = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12">
      <LoginPage.VideoBackground imageUrl="/image.png" />

      <div className="relative z-20 w-full max-w-md">
        <LoginPage.LoginForm onSubmit={handleLogin} onQuickAccess={handleQuickAccessLogin} />
      </div>
    </div>
  );
}
