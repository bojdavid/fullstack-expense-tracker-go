import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Input from '../../lib/components/ui/Input';
import Button from '../../lib/components/common/Button';

export const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signup({ name, email, password });
            navigate('/dashboard');
        } catch (err) {
            // Error handled by store
        }
    };

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-p3">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 p-p4 rounded-2xl shadow-xl">
                <h2 className="text-h2 font-bold text-center text-text-main mb-p3">Create Account</h2>

                {error && <div className="bg-error/10 text-error p-p3 rounded-lg mb-p3 text-b2">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-p3">
                    <Input
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        text={isLoading ? 'Creating Account...' : 'Sign Up'}
                        type="submit"
                        disabled={isLoading}
                        className="mt-p2"
                    />
                </form>

                <p className="mt-p3 text-center text-subtext text-b3">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};
