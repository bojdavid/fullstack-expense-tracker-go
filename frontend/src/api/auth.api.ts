import { apiClient, setAuthToken, clearAuthData, getUserData, setUserData, AUTH_TOKEN_KEY } from './client';

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
    /**
     * Register a new user
     */
    async signup(user: Omit<User, 'id'>): Promise<User> {
        const response = await apiClient.post<RegisterResponse>('/register', user, false);

        if (!response.status) {
            throw new Error(response.message || 'Registration failed');
        }

        return response.data;
    },

    /**
     * Login user and get JWT token
     */
    async login(email: string, password: string): Promise<User> {
        const response = await apiClient.post<LoginResponse>('/login', { email, password }, false);

        if (!response.status) {
            throw new Error(response.message || 'Login failed');
        }

        // Store the JWT token
        setAuthToken(response.token);

        // Decode the JWT to extract user_id (basic decode - no verification needed on client)
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        const userId = payload.user_id;

        // Store user data for later use
        setUserData({ userId });

        // Return a user object (we only have userId from JWT, email from login)
        return {
            id: userId,
            name: '', // Not available from login response
            email: email,
        };
    },

    /**
     * Logout - clear stored auth data
     */
    async logout(): Promise<void> {
        clearAuthData();
    },

    /**
     * Get current user from stored data
     */
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
        return !!localStorage.getItem(AUTH_TOKEN_KEY);
    },

    /**
     * Get the current user ID
     */
    getUserId(): string | null {
        const userData = getUserData();
        return userData?.userId || null;
    },
};
