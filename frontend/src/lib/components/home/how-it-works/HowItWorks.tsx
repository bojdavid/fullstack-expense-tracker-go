import React from 'react';

const steps = [
    { step: '01', title: 'Sign Up', description: 'Create your free account in seconds.' },
    { step: '02', title: 'Connect Accounts', description: 'Securely link your bank cards.' },
    { step: '03', title: 'Track & Save', description: 'Watch your savings grow automatically.' },
];

const HowItWorks: React.FC = () => {
    return (
        <section className="py-p1 px-p2">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-h2 font-bold mb-p2 text-text-main">
                    Simple as <span className="text-primary">1, 2, 3</span>
                </h2>

                <div className="flex flex-col md:flex-row justify-between items-center gap-p3 mt-p2">
                    {steps.map((item, index) => (
                        <div key={index} className="flex flex-col items-center max-w-sm relative group">
                            <div className="text-[8rem] font-bold text-tetiary2 absolute -top-10 -z-10 select-none group-hover:text-primary/10 transition-colors">
                                {item.step}
                            </div>
                            <h4 className="text-h4 font-semibold mb-p4 text-text-main mt-8">{item.title}</h4>
                            <p className="text-b1 text-subtext">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
