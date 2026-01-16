import React from 'react';
import Button from '../../common/Button';
import { useNavigate } from 'react-router-dom';

const CallToAction: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section className="py-p1 px-p2">
            <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary to-border rounded-3xl p-p2 text-center text-white shadow-2xl relative overflow-hidden">
                {/* Decorative Circle */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                <h2 className="text-h2 font-bold mb-p3 relative z-10 text-white">
                    Ready to Vibe with Your Finances?
                </h2>
                <p className="text-b1 mb-p2 max-w-2xl mx-auto text-white/90 relative z-10">
                    Join thousands of users who have transformed their financial health. Start your journey today for free.
                </p>

                <div className="relative z-10">
                    <Button
                        text="Create Free Account"
                        className="bg-white text-primary hover:bg-white/90 border-transparent"
                        onClick={() => navigate('/signup')}
                    />
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
