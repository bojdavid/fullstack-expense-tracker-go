import React from 'react';
import Hero from '../lib/components/home/hero/Hero';
import Features from '../lib/components/home/features/Features';
import HowItWorks from '../lib/components/home/how-it-works/HowItWorks';
import CallToAction from '../lib/components/home/cta/CallToAction';

const HomePage: React.FC = () => {
    return (
        <main className="min-h-screen bg-secondary overflow-x-hidden">
            <Hero />
            <Features />
            <HowItWorks />
            <CallToAction />

            <footer className="py-8 text-center text-subtext text-b3">
                © {new Date().getFullYear()} Expense Tracker Vibed. All rights reserved.
            </footer>
        </main>
    );
};

export default HomePage;
