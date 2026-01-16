import { create } from 'zustand';
import { authApi } from '../api/auth.api';
import type { User } from '../api/auth.api';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    signup: (data: Omit<User, 'id'>) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    checkSession: () => void;
    getUserId: () => string | null;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: authApi.isAuthenticated(),
    isLoading: false,
    error: null,

    signup: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await authApi.signup(data);
            // After signup, user needs to login to get token
            set({ isLoading: false });
            // Optionally auto-login after signup
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
            throw err;
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const user = await authApi.login(email, password);
            set({ user, isAuthenticated: true, isLoading: false });
        } catch (err) {
            set({ error: (err as Error).message, isLoading: false });
            throw err;
        }
    },

    logout: async () => {
        set({ isLoading: true });
        await authApi.logout();
        set({ user: null, isAuthenticated: false, isLoading: false });
    },

    checkSession: () => {
        const user = authApi.getCurrentUser();
        if (user) {
            set({ user, isAuthenticated: true });
        }
    },

    getUserId: () => {
        return authApi.getUserId();
    },
}));
