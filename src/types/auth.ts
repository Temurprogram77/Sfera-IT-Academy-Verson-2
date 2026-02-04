export interface AuthContextType {
  isAuthenticated: boolean;
  isVerifying: boolean;
  token: string | null;
  role: string | null;
  refreshAuth: () => void;
}
