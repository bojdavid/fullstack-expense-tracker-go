import React, { useEffect } from 'react';
import { useExpenseStore } from '../../store/useExpenseStore';
import TimeSummary from '../../lib/components/expense-tracker/TimeSummary';

const Dashboard: React.FC = () => {
    const { transactions, fetchData, isLoading } = useExpenseStore();

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    return (
        <div className="flex flex-col gap-p4">
            <header>
                <h2 className="text-h3 font-bold text-text-main mb-1">Overview</h2>
                <p className="text-subtext text-b2">Here's what's happening with your finances.</p>
            </header>

            <TimeSummary />

            <section>
                <h3 className="text-h4 font-semibold text-text-main mb-p3">Recent Transactions</h3>
                {isLoading ? (
                    <p className="text-subtext">Loading...</p>
                ) : recentTransactions.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {recentTransactions.map(t => (
                            <div key={t.id} className="bg-tetiary2/30 p-p3 rounded-xl border border-white/5 flex justify-between items-center">
                                <div>
                                    <p className="text-text-main font-medium">{t.note || 'Untitled Transaction'}</p>
                                    <p className="text-subtext text-b3">{new Date(t.date).toLocaleDateString()}</p>
                                </div>
                                <span className={`font-bold ${t.type === 'income' ? 'text-success' : 'text-text-main'}`}>
                                    {t.type === 'expense' ? '-' : '+'}${t.amount.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white/5 rounded-xl border border-white/5 border-dashed">
                        <p className="text-subtext">No transactions found.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;
