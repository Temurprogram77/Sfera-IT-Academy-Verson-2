import { apiClient } from "../lib/api/client";
import { LoginRequest, LoginResponse, User, UserRole } from "../types/api";
import { tokenManager } from "../utils/tokenManager";

class AuthService {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>(
            `/auth/login?phone=${credentials.phone}&password=${credentials.password}`
        );

        if (response.success && response.data) {
            tokenManager.saveToken(response.data, response.message as UserRole);
            tokenManager.initialize();
        }

        return response;
    }

    decodeToken(token: string): User | null {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Token decode error:', error);
            return null;
        }
    }

    logout(): void {
        tokenManager.clearToken();
        window.location.href = '/signin';
    }

    isAuthenticated(): boolean {
        return !!tokenManager.getToken() && !tokenManager.isTokenExpired();
    }

    getToken(): string | null {
        return tokenManager.getToken();
    }

    getRole(): UserRole | null {
        return tokenManager.getRole() as UserRole | null;
    }

    isTokenExpired(): boolean {
        return tokenManager.isTokenExpired();
    }
}

export const authService = new AuthService();
