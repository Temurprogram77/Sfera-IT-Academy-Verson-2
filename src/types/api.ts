
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
}

export interface LoginRequest {
    phone: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: string;
}

export type UserRole =
    | 'ROLE_SUPER_ADMIN'
    | 'ROLE_ADMIN'
    | 'ROLE_TEACHER'
    | 'ROLE_STUDENT'
    | 'ROLE_PARENT';


export interface User {
    phone: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}

export interface AuthState {
    token: string | null;
    role: UserRole | null;
    isAuthenticated: boolean;
}