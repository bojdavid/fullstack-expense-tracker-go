import { apiClient } from './client';
import { authApi } from './auth.api';

export interface Transaction {
    id: string;
    userId: string;
    categoryId: string;
    type: 'income' | 'expense';
    amount: number;
    date: string; // ISO String - backend parses this to *time.Time
    note?: string;
    description?: string;
    createdAt?: string;
}

interface TransactionResponse {
    Total: number;
    Transactions: Transaction[];
}

interface AddTransactionResponse {
    message: string;
    data: Transaction;
}

export const transactionsApi = {
    /**
     * Get all transactions for the current user
     * GET /api/get-transactions?userId=X
     */
    async getTransactions(): Promise<Transaction[]> {
        const userId = authApi.getUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const response = await apiClient.get<TransactionResponse>(
            `/api/get-transactions?userId=${userId}`
        );

        return response.Transactions || [];
    },

    /**
     * Add a new transaction
     * POST /api/add-transactions
     */
    async addTransaction(transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'date'> & { date: string | Date }): Promise<Transaction> {
        const userId = authApi.getUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const payload: Omit<Transaction, 'id' | 'createdAt'> = {
            userId: userId,
            categoryId: transaction.categoryId,
            type: transaction.type,
            amount: transaction.amount,
            date: new Date(transaction.date).toISOString(),
            note: transaction.note,
            description: transaction.description,
        };

        const response = await apiClient.post<AddTransactionResponse>('/api/add-transactions', payload);
        return response.data;
    },

    /**
     * Update an existing transaction
     * PUT /api/update-transaction
     */
    async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
        const userId = authApi.getUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const payload = {
            id,
            userId,
            ...updates,
        };

        if (updates.date) {
            payload.date = new Date(updates.date).toISOString();
        }

        const response = await apiClient.put<AddTransactionResponse>('/api/update-transaction', payload);
        return response.data;
    },

    /**
     * Delete a transaction
     * DELETE /api/delete-transaction
     */
    async deleteTransaction(id: string): Promise<void> {
        const userId = authApi.getUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        await apiClient.delete<AddTransactionResponse>('/api/delete-transaction', { id, userId });
    },
};
