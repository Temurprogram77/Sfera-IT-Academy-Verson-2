import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from 'axios';

/** Backenddan keladigan standart error */
export interface ApiError {
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
            withCredentials: false,
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        /** REQUEST */
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('auth_token');

                if (token) {
                    if (this.isValidJWTFormat(token)) {
                        config.headers.Authorization = `Bearer ${token}`;
                    } else {
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('user_role');
                        window.location.href = '/signin';
                        return Promise.reject(new Error('Invalid token format'));
                    }
                }

                return config;
            },
            (error: unknown) => {
                return Promise.reject(error);
            }
        );

        /** RESPONSE */
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError<ApiError>) => {
                if (error.response) {
                    const apiError: ApiError = {
                        message:
                            error.response.data?.message ??
                            error.message ??
                            'Server error',
                        status: error.response.status,
                        success: false,
                    };

                    if (apiError.status === 401) {
                        if (window.location.pathname !== '/signin') {
                            localStorage.removeItem('auth_token');
                            localStorage.removeItem('user_role');
                            localStorage.removeItem('last_activity');
                            window.location.href = '/signin';
                        }
                    }

                    if (apiError.status === 403) {
                        console.warn('403 Forbidden');
                    }

                    return Promise.reject(apiError);
                }

                /** Network error */
                return Promise.reject({
                    message:
                        'Tarmoq xatosi – serverga ulanish mumkin emas.',
                    status: 0,
                    success: false,
                } satisfies ApiError);
            }
        );
    }

    private isValidJWTFormat(token: string): boolean {
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        try {
            for (const part of parts) {
                atob(part.replace(/-/g, '+').replace(/_/g, '/'));
            }
            return true;
        } catch {
            return false;
        }
    }

    async get<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response: AxiosResponse<T> =
            await this.client.get(url, config);
        return response.data;
    }

    async post<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response: AxiosResponse<T> =
            await this.client.post(url, data, config);
        return response.data;
    }

    async put<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response: AxiosResponse<T> =
            await this.client.put(url, data, config);
        return response.data;
    }

    async patch<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response: AxiosResponse<T> =
            await this.client.patch(url, data, config);
        return response.data;
    }

    async delete<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response: AxiosResponse<T> =
            await this.client.delete(url, config);
        return response.data;
    }
}

export const apiClient = new ApiClient();


apiClient.post
