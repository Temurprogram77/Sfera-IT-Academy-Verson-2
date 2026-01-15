// src/lib/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface ApiError {
    message: string;
    status: number;
    success: boolean;
}

class ApiClient {
    private client: AxiosInstance;
    private tokenVerificationInProgress = false;

    constructor() {
        this.client = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: false,
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('auth_token');

                // ✅ Token formatini tekshirish
                if (token) {
                    // JWT format validation
                    if (this.isValidJWTFormat(token)) {
                        config.headers.Authorization = `Bearer ${token}`;
                    } else {
                        console.warn('Invalid token format detected');
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('user_role');
                        window.location.href = '/signin';
                        return Promise.reject(new Error('Invalid token format'));
                    }
                }

                return config;
            },
            (error) => {
                console.error('Request error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => {
                return response;
            },
            (error: AxiosError<any>) => {
                console.error('API Error:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data,
                    url: error.config?.url,
                });

                if (error.response) {
                    const apiError: ApiError = {
                        message: error.response.data?.message || error.message || 'Server error',
                        status: error.response.status,
                        success: false,
                    };

                    // 401 - Unauthorized (Token invalid yoki expired)
                    if (error.response.status === 401) {
                        const currentPath = window.location.pathname;

                        if (currentPath !== '/signin') {
                            console.log('401 Unauthorized - clearing auth data');
                            localStorage.removeItem('auth_token');
                            localStorage.removeItem('user_role');
                            localStorage.removeItem('last_activity');
                            window.location.href = '/signin';
                        }
                    }

                    // 403 - Forbidden (Token valid lekin ruxsat yo'q)
                    if (error.response.status === 403) {
                        console.log('403 Forbidden - insufficient permissions');
                    }

                    return Promise.reject(apiError);
                } else if (error.request) {
                    return Promise.reject({
                        message: 'Tarmoq xatosi – serverga ulanish mumkin emas. Iltimos, internetingizni tekshiring.',
                        status: 0,
                        success: false,
                    });
                } else {
                    return Promise.reject({
                        message: error.message || 'Unknown error',
                        status: 0,
                        success: false,
                    });
                }
            }
        );
    }

    // ✅ JWT format validation
    private isValidJWTFormat(token: string): boolean {
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        try {
            for (const part of parts) {
                if (!part || part.length === 0) return false;
                atob(part.replace(/-/g, '+').replace(/_/g, '/'));
            }
            return true;
        } catch {
            return false;
        }
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.get(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.post(url, data, config);
        return response.data;
    }

    async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.put(url, data, config);
        return response.data;
    }

    async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.patch(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.delete(url, config);
        return response.data;
    }
}

export const apiClient = new ApiClient();