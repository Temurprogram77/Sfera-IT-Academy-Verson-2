import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService ';
import { AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const checkAuth = () => {
    const storedToken = authService.getToken();
    const storedRole = authService.getRole();

    if (!storedToken) {
      setIsAuthenticated(false);
      setIsVerifying(false);
      return;
    }

    setToken(storedToken);
    setRole(storedRole);
    setIsAuthenticated(authService.isAuthenticated());
    setIsVerifying(false);
  };

  const refreshAuth = () => {
    checkAuth();
  };

  useEffect(() => {
    checkAuth();
  }, []);

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