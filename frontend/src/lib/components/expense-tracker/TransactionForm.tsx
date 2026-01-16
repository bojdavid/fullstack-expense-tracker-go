import React, { useState } from 'react';
import { useExpenseStore } from '../../../store/useExpenseStore';
import { useModalStore } from '../../../store/useModalStore';
import Input from '../ui/Input';
import Button from '../common/Button';

interface TransactionFormProps {
    type?: 'income' | 'expense';
    initialData?: any;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type = 'expense', initialData }) => {
    const { categories, addTransaction, updateTransaction } = useExpenseStore();
    const { closeModal } = useModalStore();
    const [formData, setFormData] = useState({
        type: initialData?.type || type,
        amount: initialData?.amount || '',
        categoryId: initialData?.categoryId || '',
        date: initialData?.date || new Date().toISOString().split('T')[0],
        note: initialData?.note || '',
        description: initialData?.description || '' // Only used for expense
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredCategories = categories.filter(c => c.type === formData.type);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = {
                ...formData,
                amount: Number(formData.amount),
                type: formData.type as 'income' | 'expense'
            };

            if (initialData?.id) {
                await updateTransaction(initialData.id, data);
            } else {
                await addTransaction(data);
            }
            closeModal();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-p3">
            {/* Type Toggle */}
            <div className="flex bg-tetiary2/30 p-1 rounded-lg">
                {(['expense', 'income'] as const).map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: t, categoryId: '' })}
                        className={`flex-1 py-p2 rounded-md font-medium text-b2 transition-all ${formData.type === t
                            ? t === 'income' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                            : 'text-subtext hover:text-text-main'
                            }`}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            <Input
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, amount: e.target.value })}
                required
                placeholder="0.00"
            />

            <div className="flex flex-col gap-1">
                <label className="text-b2 text-subtext font-medium">Category</label>
                <select
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                    className="bg-tetiary2/5 text-text-main border border-border/30 rounded-lg p-p3 focus:outline-none focus:border-primary transition-colors appearance-none"
                >
                    <option value="" disabled>Select Category</option>
                    {filteredCategories.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <Input
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, date: e.target.value })}
                required
            />

            <Input
                label="Note"
                value={formData.note}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Short description..."
            />

            {formData.type === 'expense' && (
                <Input
                    label="Description (Optional)"
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description..."
                />
            )}

            <Button
                text={isSubmitting ? 'Saving...' : 'Save Transaction'}
                mode="light"
                type="submit"
                disabled={isSubmitting}
                className="mt-p2"
            />
        </form>
    );
};

export default TransactionForm;
