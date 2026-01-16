import { apiClient } from './client';
import { authApi } from './auth.api';

interface UserId {
    "String": string,
    "Valid": boolean
}

export interface Category {
    id: string;
    userId?: UserId;
    name: string;
    type: 'income' | 'expense';
    isDefault?: boolean;
}

interface CategoryResponse {
    message: string;
    Data: Category;
}

interface GetAllCategoriesResponse {
    message: string;
    Total: number;
    Data: Category[];
}

export const categoriesApi = {
    /**
     * Get all categories for the current user
     * GET /api/get-categories?userId=X
     */
    async getCategories(): Promise<Category[]> {
        const userId = authApi.getUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const response = await apiClient.get<GetAllCategoriesResponse>(
            `/api/get-categories?userId=${userId}`
        );

        return response.Data || [];
    },

    /**
     * Add a new category
     * POST /api/add-category
     */
    async addCategory(category: Omit<Category, 'id'>): Promise<Category> {
        const userId = authApi.getUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const payload = {
            userId: {
                String: userId,
                Valid: true
            },
            name: category.name,
            type: category.type,
            isDefault: false,
        };

        const response = await apiClient.post<CategoryResponse>('/api/add-category', payload);
        return response.Data;
    },

    /**
     * Update an existing category
     * POST /api/update-category
     */
    async updateCategory(category: Category): Promise<Category> {
        const response = await apiClient.post<CategoryResponse>('/api/update-category', category);
        return response.Data;
    },

    /**
     * Delete a category
     * POST /api/delete-category
     */
    async deleteCategory(id: string): Promise<void> {
        await apiClient.post<CategoryResponse>('/api/delete-category', { id });
    },
};
