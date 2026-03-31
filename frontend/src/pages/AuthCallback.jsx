import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const AuthCallback = () => {
  const { processGoogleAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      try {
        // Extract session_id from URL fragment
        const hash = location.hash;
        const sessionIdMatch = hash.match(/session_id=([^&]+)/);
        
        if (!sessionIdMatch) {
          navigate('/login');
          return;
        }

        const sessionId = sessionIdMatch[1];
        const userData = await processGoogleAuth(sessionId);
        
        // Navigate to admin dashboard with user data
        navigate('/admin', { state: { user: userData }, replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login');
      }
    };

    processAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-[#C29B57] animate-spin mx-auto mb-4" />
        <p className="text-[#4A5D54]">Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
