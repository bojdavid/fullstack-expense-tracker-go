/**
 * Shared API client with JWT authentication support using Axios
 */

import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

// Storage keys
export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_DATA_KEY = 'user_data';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string; error?: string }>) => {
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'An error occurred';
        return Promise.reject(new Error(message));
    }
);

/**
 * Get the stored auth token
 */
export function getAuthToken(): string | null {
    return Cookies.get(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Store the auth token
 */
export function setAuthToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Clear auth data (used on logout)
 */
export function clearAuthData(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
}

/**
 * Get stored user data
 */
export function getUserData(): { userId: string } | null {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
}

/**
 * Store user data
 */
export function setUserData(data: { userId: string }): void {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
}

/**
 * API client with methods for all HTTP verbs
 */
export const apiClient = {
    /**
     * GET request (protected by default)
     */
    async get<T>(endpoint: string): Promise<T> {
        const response = await axiosInstance.get<T>(endpoint);
        return response.data;
    },

    /**
     * POST request
     */
    async post<T>(endpoint: string, body: unknown, includeAuth: boolean = true): Promise<T> {
        const config = includeAuth ? {} : { headers: { Authorization: undefined } };
        const response = await axiosInstance.post<T>(endpoint, body, config);
        return response.data;
    },

    /**
     * PUT request (protected by default)
     */
    async put<T>(endpoint: string, body: unknown): Promise<T> {
        const response = await axiosInstance.put<T>(endpoint, body);
        return response.data;
    },

    /**
     * DELETE request (protected by default)
     */
    async delete<T>(endpoint: string, body?: unknown): Promise<T> {
        const response = await axiosInstance.delete<T>(endpoint, { data: body });
        return response.data;
    },
};
