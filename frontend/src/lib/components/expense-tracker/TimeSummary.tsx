import React from 'react';
import { useExpenseStore } from '../../../store/useExpenseStore';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

interface SummaryCardProps {
    label: string;
    amount: number;
    type: 'income' | 'expense' | 'balance';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, amount, type }) => {
    const isPositive = amount >= 0;
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(Math.abs(amount));

    // Custom mapping for styles based on type
    const styles = {
        income: {
            bg: 'bg-success/10',
            text: 'text-success',
            icon: <ArrowUpCircle size={24} className="text-success" />,
            border: 'border-success/20'
        },
        expense: {
            bg: 'bg-error/10',
            text: 'text-error',
            icon: <ArrowDownCircle size={24} className="text-error" />,
            border: 'border-error/20'
        },
        balance: {
            bg: 'bg-primary/10',
            text: 'text-primary',
            icon: <Wallet size={24} className="text-primary" />,
            border: 'border-primary/20'
        }
    };

    const style = styles[type];

    return (
        <div className={`p-p3 rounded-xl border ${style.border} ${style.bg} flex items-center justify-between`}>
            <div>
                <p className="text-b2 text-subtext font-medium mb-1">{label}</p>
                <h3 className={`text-h4 font-bold ${style.text}`}>
                    {type === 'balance' && !isPositive ? '-' : ''}{formattedAmount}
                </h3>
            </div>
            <div className={`p-2 rounded-full bg-white/10`}>
                {style.icon}
            </div>
        </div>
    );
};

const TimeSummary: React.FC = () => {
    // This component currently just displays total stats.
    // In a real implementation with filters, this would accept props or selector
    // for specific time ranges.
    const { getStats } = useExpenseStore();
    const stats = getStats();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-p3 mb-p4">
            <SummaryCard label="Total Income" amount={stats.income} type="income" />
            <SummaryCard label="Total Expenses" amount={stats.expense} type="expense" />
            <SummaryCard label="Current Balance" amount={stats.balance} type="balance" />
        </div>
    );
};

export default TimeSummary;
