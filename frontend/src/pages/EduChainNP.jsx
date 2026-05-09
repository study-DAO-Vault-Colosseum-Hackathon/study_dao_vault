import { useNavigate } from 'react-router-dom';
import LoginPage from '../components/ui/gaming-login';

export default function EduChainNP({ user }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleQuickAccessLogin = () => {
    navigate('/', { replace: true });
  };

  // If user is already logged in, we could redirect or show content
  // But usually this page is for login

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12">
      <LoginPage.VideoBackground imageUrl="/image.png" />

      <div className="relative z-20 w-full max-w-md">
        <LoginPage.LoginForm onSubmit={handleLogin} onQuickAccess={handleQuickAccessLogin} />
      </div>
    </div>
  );
}
