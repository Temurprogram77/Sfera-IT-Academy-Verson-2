import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService ';

interface AuthContextType {
  isAuthenticated: boolean;
  isVerifying: boolean;
  token: string | null;
  role: string | null;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const verifyTokenOnce = async () => {

    const storedToken = authService.getToken();
    const storedRole = authService.getRole();

    if (!storedToken) {
      setIsAuthenticated(false);
      setIsVerifying(false);
      return;
    }

    setToken(storedToken);
    setRole(storedRole);

    try {
      const isValid = await authService.verifyToken();
      setIsAuthenticated(isValid);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const refreshAuth = async () => {
    await verifyTokenOnce();
  };

  useEffect(() => {
    verifyTokenOnce();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;


    const interval = setInterval(async () => {
      const storedToken = authService.getToken();

      if (storedToken) {
        const isValid = await authService.verifyToken();
        if (!isValid) {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    }, 5 * 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isVerifying,
        token,
        role,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};