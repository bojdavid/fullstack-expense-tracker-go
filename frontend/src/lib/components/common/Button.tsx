import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    mode?: 'light' | 'dark';
}

const Button: React.FC<ButtonProps> = ({
    text,
    mode = 'light',
    className = '',
    disabled,

    ...props
}) => {
    const baseStyles = "px-p5 py-p5 rounded-lg font-semibold transition-all duration-300 ease-out transform active:scale-95 text-b2 cursor-pointer";

    const modeStyles = mode === 'light'
        ? "bg-primary text-secondary hover:bg-border shadow-lg hover:shadow-primary/50"
        : "bg-transparent border-2 border-primary text-primary hover:bg-primary/10";

    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed transform-none" : "";

    return (
        <button
            className={`${baseStyles} ${modeStyles} ${disabledStyles} ${className}`}
            disabled={disabled}
            {...props}
        >
            {text}
        </button>
    );
};

export default Button;
