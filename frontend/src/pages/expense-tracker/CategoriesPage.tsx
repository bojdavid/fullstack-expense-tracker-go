import React, { useState, useEffect } from 'react';
import { useExpenseStore } from '../../store/useExpenseStore';
import { Trash2 } from 'lucide-react';
import Button from '../../lib/components/common/Button';
import Input from '../../lib/components/ui/Input';
import Loader from '../../lib/components/common/Loader';

const CategoriesPage: React.FC = () => {
    const { categories, addCategory, deleteCategory, fetchData, isLoading } = useExpenseStore();
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense'>('expense');

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        console.log("This is the category data in categorues page ------", categories)
    }, [isLoading])

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        await addCategory({ name: newCategoryName, type: newCategoryType });
        setNewCategoryName('');
    };

    const CategoryList = ({ type }: { type: 'income' | 'expense' }) => (
        <div className="flex flex-col gap-2">
            <h3 className="text-h5 font-semibold text-subtext mb-2 capitalize">{type} Categories</h3>
            <div className="grid gap-2">
                {categories.filter(c => c.type === type).map(c => (
                    <div key={c.id} className="bg-tetiary2/20 p-p3 rounded-lg border border-white/5 flex justify-between items-center group">
                        <span className="text-text-main font-medium">{c.name}</span>
                        {!c.isDefault && (
                            <button
                                onClick={() => deleteCategory(c.id)}
                                className="p-2 text-subtext hover:text-error transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                        {c.isDefault && <span className="text-xs text-subtext/50 px-2 py-1 bg-white/5 rounded">Default</span>}
                    </div>
                ))}
            </div>
        </div>
    );


    return (
        <div className="flex flex-col gap-p4">
            <header>
                <h2 className="text-h3 font-bold text-text-main mb-1">Categories</h2>
                <p className="text-subtext text-b2">Manage your income and expense categories.</p>
            </header>

            <div className="grid md:grid-cols-2 gap-p4">
                {/* Add Category Form */}
                <div className="bg-white/5 p-p4 rounded-2xl border border-white/10 h-fit">
                    <h3 className="text-h4 font-bold text-text-main mb-p3">Add Category</h3>
                    <form onSubmit={handleAdd} className="flex flex-col gap-p3">
                        <Input
                            label="Category Name"
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                            required
                        />
                        <div className="flex bg-tetiary2/30 p-1 rounded-lg">
                            {(['expense', 'income'] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setNewCategoryType(t)}
                                    className={`flex-1 py-p2 rounded-md font-medium text-b2 transition-all ${newCategoryType === t
                                        ? t === 'income' ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                                        : 'text-subtext hover:text-text-main'
                                        }`}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                        <Button
                            text="Add Category"
                            type="submit"
                            className="mt-2"
                        />
                    </form>
                </div>

                {/* Lists */}
                {isLoading && (
                    <div className="flex h-full items-center justify-center p-p5">
                        <Loader size={48} />
                    </div>
                )
                }
                {!isLoading && (

                    <div className="flex flex-col gap-p4">
                        <CategoryList type="income" />
                        <CategoryList type="expense" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoriesPage;
