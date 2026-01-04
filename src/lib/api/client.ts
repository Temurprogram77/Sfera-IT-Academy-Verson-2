// src/lib/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

interface ApiError {
    message: string;
    status: number;
    success: boolean;
}

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
            // CORS uchun
            withCredentials: false,
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('auth_token');

                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
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
            (error: AxiosError<unknown>) => {
                console.error('API Error:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data,
                    url: error.config?.url,
                });

                if (error.response) {
                    // Server response bor lekin error
                    const apiError: ApiError = {
                        message: error.response.data?.message || error.message || 'Server error',
                        status: error.response.status,
                        success: false,
                    };

                    // 401 - Unauthorized
                    if (error.response.status === 401) {
                        const currentPath = window.location.pathname;
                        // Agar login sahifada bo'lmasa - logout qilish
                        if (currentPath !== '/login') {
                            localStorage.removeItem('auth_token');
                            localStorage.removeItem('user_role');
                            window.location.href = '/login';
                        }
                    }

                    return Promise.reject(apiError);
                } else if (error.request) {
                    // Request ketdi lekin response yo'q (CORS, network)
                    return Promise.reject({
                        message: 'Tarmoq xatosi – serverga ulanish mumkin emas. Iltimos, internetingizni tekshiring.',
                        status: 0,
                        success: false,
                    });
                } else {
                    // Boshqa xatolar
                    return Promise.reject({
                        message: error.message || 'Unknown error',
                        status: 0,
                        success: false,
                    });
                }
            }
        );
    }

    // GET request
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.get(url, config);
        return response.data;
    }

    // POST request
    async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.post(url, data, config);
        return response.data;
    }

    // PUT request
    async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.put(url, data, config);
        return response.data;
    }

    // PATCH request
    async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.patch(url, data, config);
        return response.data;
    }

    // DELETE request
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.client.delete(url, config);
        return response.data;
    }
}

export const apiClient = new ApiClient();