import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
    className?: string;
    size?: number;
}

const Loader: React.FC<LoaderProps> = ({ className = '', size = 24 }) => {
    return (
        <div className={`flex justify-center items-center ${className}`}>
            <Loader2 size={size} className="animate-spin text-tetiary" />
        </div>
    );
};

export default Loader;
