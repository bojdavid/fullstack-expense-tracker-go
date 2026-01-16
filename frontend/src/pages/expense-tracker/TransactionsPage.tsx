import React, { useState, useEffect } from 'react';
import { useExpenseStore } from '../../store/useExpenseStore';
import { useModalStore } from '../../store/useModalStore';
import { Trash2, Pencil } from 'lucide-react';

const TransactionsPage: React.FC = () => {
    const { transactions, categories, deleteTransaction, fetchData } = useExpenseStore();
    const { openModal } = useModalStore();

    // Filters
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        const matchMonth = tDate.getMonth().toString() === selectedMonth;
        const matchYear = tDate.getFullYear().toString() === selectedYear;
        const matchType = selectedType === 'all' || t.type === selectedType;
        return matchMonth && matchYear && matchType;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';

    return (
        <div className="flex flex-col gap-p4">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-h3 font-bold text-text-main mb-1">Transactions</h2>
                    <p className="text-subtext text-b2">Manage your income and expenses.</p>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <select
                        value={selectedYear}
                        onChange={e => setSelectedYear(e.target.value)}
                        className="bg-tetiary2/30 text-text-main border border-white/10 rounded-lg p-2 text-b3 focus:outline-none"
                    >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <select
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(e.target.value)}
                        className="bg-tetiary2/30 text-text-main border border-white/10 rounded-lg p-2 text-b3 focus:outline-none"
                    >
                        {Array.from({ length: 12 }, (_, i) => i).map(month => (
                            <option key={month} value={month}>{new Date(0, month).toLocaleString('default', { month: 'long' })}</option>
                        ))}
                    </select>
                    <select
                        value={selectedType}
                        onChange={e => setSelectedType(e.target.value as any)}
                        className="bg-tetiary2/30 text-text-main border border-white/10 rounded-lg p-2 text-b3 focus:outline-none"
                    >
                        <option value="all">All</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
            </header>

            {filteredTransactions.length > 0 ? (
                <div className="grid gap-2">
                    {filteredTransactions.map(t => (
                        <div key={t.id} className="bg-tetiary2/10 hover:bg-tetiary2/20 transition-colors p-p3 rounded-xl border border-white/5 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-12 rounded-full ${t.type === 'income' ? 'bg-success' : 'bg-error'}`} />
                                <div>
                                    <p className="text-text-main font-medium">{t.note || 'Untitled'}</p>
                                    <p className="text-subtext text-b3">
                                        {new Date(t.date).toLocaleDateString()} • {getCategoryName(t.categoryId)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`font-bold ${t.type === 'income' ? 'text-success' : 'text-text-main'}`}>
                                    {t.type === 'expense' ? '-' : '+'}${t.amount.toFixed(2)}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => openModal('EDIT_TRANSACTION', { initialData: t }, 'Edit Transaction')}
                                        className="p-2 text-subtext hover:text-primary opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                        title="Edit"
                                        aria-label="Edit transaction"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteTransaction(t.id)}
                                        className="p-2 text-subtext hover:text-error opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                        title="Delete"
                                        aria-label="Delete transaction"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                    <h3 className="text-h4 text-subtext mb-2">No transactions yet</h3>
                    <p className="text-subtext/50">Try changing filters or add a new transaction.</p>
                </div>
            )}
        </div>
    );
};

export default TransactionsPage;
