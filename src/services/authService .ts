import { AxiosError } from "axios";
import { API_ENDPOINTS, buildUrlWithParams } from "../constants/apiEndpoints";
import { apiClient } from "../lib/api/client";
import { LoginRequest, LoginResponse, User, UserRole } from "../types/api";
import { TokenVerifyResponse } from "../types/verify";
import { tokenManager } from "../utils/tokenManager";


class AuthService {
    private static verificationPromise: Promise<boolean> | null = null;

    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const url = buildUrlWithParams(API_ENDPOINTS.AUTH.LOGIN, {
            phone: credentials.phone,
            password: credentials.password,
        });
        console.log(url);


        const response = await apiClient.post<LoginResponse>(url);

        if (response.success && response.data) {
            tokenManager.saveToken(response.data, response.message as UserRole);
            tokenManager.initialize();
        }

        return response;
    }

    async verifyToken(): Promise<boolean> {
        if (AuthService.verificationPromise) {
            return AuthService.verificationPromise;
        }

        const token = this.getToken();

        if (!token) {
            return false;
        }

        if (!this.isValidJWTFormat(token)) {
            this.logout();
            return false;
        }

        AuthService.verificationPromise = (async () => {
            try {
                const response = await apiClient.post<TokenVerifyResponse>(
                    API_ENDPOINTS.AUTH.VERIFY,
                    { token }
                );


                if (response.success) {
                    return true;
                } else {
                    this.logout();
                    return false;
                }
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    const status = error.response?.status;

                    if (status === 401 || status === 403) {
                        this.logout();
                    }
                }

                return false;
            } finally {
                setTimeout(() => {
                    AuthService.verificationPromise = null;
                }, 2000);
            }
        })();

        return AuthService.verificationPromise;
    }

    private isValidJWTFormat(token: string): boolean {
        const parts = token.split('.');

        if (parts.length !== 3) {
            return false;
        }

        try {
            for (const part of parts) {
                if (!part || part.length === 0) {
                    return false;
                }
                atob(part.replace(/-/g, '+').replace(/_/g, '/'));
            }
            return true;
        } catch {
            return false;
        }
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
        const token = tokenManager.getToken();

        if (!token) {
            return false;
        }

        if (!this.isValidJWTFormat(token)) {
            this.logout();
            return false;
        }

        return !tokenManager.isTokenExpired();
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