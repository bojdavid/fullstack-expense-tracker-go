import React from 'react';
import { BarChart, Brain, Cloud, LockKeyhole } from 'lucide-react';

const features = [
    { title: 'Real-time Analytics', description: 'See where your money goes as you spend it.', icon: <BarChart /> },
    { title: 'Smart Budgeting', description: 'AI-powered suggestions to help you save more.', icon: <Brain /> },
    { title: 'Cloud Sync', description: 'Access your data from any device, anywhere.', icon: <Cloud /> },
    { title: 'Secure & Private', description: 'Your financial data is encrypted and safe.', icon: <LockKeyhole /> },
];

const Features: React.FC = () => {
    return (
        <section className="py-p1 px-p2 bg-secondary/50">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-h2 font-bold text-center mb-p2 text-text-main">
                    Why Choose <span className="text-primary">Vibed?</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-p3">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-p3 rounded-2xl bg-tetiary/5 border border-white/5 hover:border-primary/50 transition-colors duration-300 backdrop-blur-sm"
                        >
                            <div className="text-4xl mb-p4">{feature.icon}</div>
                            <h5 className="text-h5 font-semibold mb-p4 text-text-main">{feature.title}</h5>
                            <p className="text-b2 text-subtext">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
