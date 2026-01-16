import { apiClient, clearAuthData, getUserData, setUserData, AUTH_TOKEN_KEY } from './client';
import Cookies from 'js-cookie';

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    createdAt?: string;
}

interface LoginResponse {
    message: string;
    token: string;
    status: boolean;
}

interface RegisterResponse {
    message: string;
    data: User;
    status: boolean;
}

export const authApi = {
    async signup(user: Omit<User, 'id'>): Promise<User> {
        const response = await apiClient.post<RegisterResponse>('/register', user, false);

        if (!response.status) {
            throw new Error(response.message || 'Registration failed');
        }

        return response.data;
    },
    async login(email: string, password: string): Promise<User> {
        const response = await apiClient.post<LoginResponse>('/login', { email, password }, false);

        if (!response.status) {
            throw new Error(response.message || 'Login failed');
        }

        // Decode the JWT to get expiration (exp) and user_id
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        const userId = payload.user_id;
        const expiryTimestamp = payload.exp; // JWT 'exp' is in seconds

        // Calculate the cookie expiration
        const expirationDate = new Date(expiryTimestamp * 1000);

        // Store the JWT in a Cookie
        Cookies.set('auth_token', response.token, {
            expires: expirationDate,
            secure: true,       // Only send over HTTPS
            sameSite: 'strict'  // Prevent CSRF
        });

        // Store user data for later use
        setUserData({ userId });

        // Return a user object (we only have userId from JWT, email from login)
        return {
            id: userId,
            name: '', // Not available from login response
            email: email,
        };
    },

    async logout(): Promise<void> {
        clearAuthData();
        Cookies.remove('auth_token');
    },

    getCurrentUser(): User | null {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (!token) return null;

        const userData = getUserData();
        if (!userData) return null;

        // Return minimal user info from stored data
        return {
            id: userData.userId,
            name: '',
            email: '',
        };
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        const token = Cookies.get('auth_token');

        // If no cookie, they are definitely not logged in
        if (!token) return false;

        try {
            // Optional: Check if the token is expired before saying "true"
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isExpired = Date.now() >= payload.exp * 1000;

            return !isExpired;
        } catch (e) {
            return false;
        }
        //  return !!localStorage.getItem(AUTH_TOKEN_KEY);
    },

    /**
     * Get the current user ID
     */
    getUserId(): string | null {
        const userData = getUserData();
        return userData?.userId || null;
    },
};
