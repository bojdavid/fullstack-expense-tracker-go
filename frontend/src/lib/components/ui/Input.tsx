import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && <label className="text-b2 text-subtext font-medium">{label}</label>}
            <input
                className={`bg-tetiary2/5 text-text-main border border-border/30 rounded-lg p-p5 focus:outline-none focus:border-primary transition-colors ${className}`}
                {...props}
            />
            {error && <span className="text-error text-b3">{error}</span>}
        </div>
    );
};

export default Input;
