import React from 'react';
import Button from '../../common/Button';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section className="min-h-[90vh]  flex flex-col items-center justify-center text-center p-p1 relative overflow-hidden">
            {/* Background Gradient Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />

            <h1 className="text-h1 font-bold text-primary leading-tight mb-p3 max-w-4xl">
                Master Your Money <span className="text-primary">Vibed.</span>
            </h1>
            <p className="text-b1 text-subtext max-w-2xl mb-m2">
                Experience the next generation of expense tracking. Intuitive, beautiful, and designed to keep your financial life in harmony.
            </p>

            <div className="flex gap-p4 mt-m3">
                <Button text="Get Started" mode="light" onClick={() => navigate('/signup')} />
                <Button text="Learn More" mode="dark" onClick={() => navigate('/login')} />
            </div>
        </section>
    );
};

export default Hero;
