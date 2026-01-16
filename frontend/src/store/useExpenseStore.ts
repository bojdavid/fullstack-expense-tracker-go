import { create } from 'zustand';
import { transactionsApi } from '../api/transactions.api';
import type { Transaction } from '../api/transactions.api';
import { categoriesApi } from '../api/categories.api';
import type { Category } from '../api/categories.api';

interface ExpenseState {
    transactions: Transaction[];
    categories: Category[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchData: () => Promise<void>;
    addTransaction: (data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
    updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    addCategory: (data: Omit<Category, 'id'>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;

    // Computed (Getters) - implemented as functions to call on filtered data
    getStats: (transactions?: Transaction[]) => { income: number; expense: number; balance: number };
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
    transactions: [],
    categories: [],
    isLoading: false,
    error: null,

    fetchData: async () => {
        set({ isLoading: true, error: null });
        try {
            const [transactions, categories] = await Promise.all([
                transactionsApi.getTransactions(),
                categoriesApi.getCategories(),
            ]);
            console.log("Store fetchData - categories received:", categories);
            console.log("Store fetchData - categories type:", typeof categories);
            console.log("Store fetchData - categories is array:", Array.isArray(categories));
            set({ transactions, categories, isLoading: false });
            console.log("Store fetchData - after set, current state:", get().categories);
        } catch (err) {
            console.error("Store fetchData - error:", err);
            set({ error: (err as Error).message, isLoading: false });
        }
    },

    addTransaction: async (data) => {
        await transactionsApi.addTransaction(data);
        // Refresh transactions from server
        const transactions = await transactionsApi.getTransactions();
        set({ transactions });
    },

    updateTransaction: async (id, updates) => {
        await transactionsApi.updateTransaction(id, updates);
        // Refresh transactions from server
        const transactions = await transactionsApi.getTransactions();
        set({ transactions });
    },

    deleteTransaction: async (id) => {
        await transactionsApi.deleteTransaction(id);
        // Refresh transactions from server
        const transactions = await transactionsApi.getTransactions();
        set({ transactions });
    },

    addCategory: async (data) => {
        const newCategory = await categoriesApi.addCategory(data);
        set((state) => ({ categories: [...state.categories, newCategory] }));
    },

    deleteCategory: async (id) => {
        await categoriesApi.deleteCategory(id);
        set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
        }));
    },

    getStats: (transactions = get().transactions) => {
        return transactions.reduce(
            (acc, curr) => {
                if (curr.type === 'income') {
                    acc.income += curr.amount;
                    acc.balance += curr.amount;
                } else {
                    acc.expense += curr.amount;
                    acc.balance -= curr.amount;
                }
                return acc;
            },
            { income: 0, expense: 0, balance: 0 }
        );
    },
}));
