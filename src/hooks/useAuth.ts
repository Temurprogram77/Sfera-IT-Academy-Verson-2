// src/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import { LoginRequest } from '../types/api';
import { authService } from '../services/authService ';

export const useLogin = () => {
    return useMutation({
        mutationFn: (credentials: LoginRequest) => {
            return authService.login(credentials);
        },
    });
};

export const useLogout = () => {
    return () => {
        console.log('Logging out...');
        authService.logout();
    };
};

export const useAuth = () => {
    const token = authService.getToken();
    const role = authService.getRole();
    const isTokenExpired = authService.isTokenExpired();
    const isAuthenticated = !!token && !isTokenExpired;

    return {
        isAuthenticated,
        token,
        role,
        isTokenExpired,
    };
};