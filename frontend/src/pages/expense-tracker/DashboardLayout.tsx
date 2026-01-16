import React, { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LayoutDashboard, Receipt, Tags, LogOut, Plus, Menu, X } from 'lucide-react';
import { useModalStore } from '../../store/useModalStore';
import Button from '../../lib/components/common/Button';
import { authApi } from '../../api/auth.api';
import { useNavigate } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuthStore();
    const { openModal } = useModalStore();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // Heartbeat to detect session expiration (since backend token is short-lived for testing)
    useEffect(() => {
        const interval = setInterval(() => {
            if (isAuthenticated && !authApi.isAuthenticated()) {
                openModal('SESSION_EXPIRED', {}, 'Session Expired');
                logout();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isAuthenticated, logout]);

    /*
    useEffect(() => {
        if (!isAuthenticated) {
            openModal('SESSION_EXPIRED', {}, 'Session Expired');
            navigate('/login');
        }
    }, [isAuthenticated, openModal]);
*/
    if (!isAuthenticated) navigate('/login');

    const navItems = [
        { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Transactions', path: '/dashboard/transactions', icon: <Receipt size={20} /> },
        { label: 'Categories', path: '/dashboard/categories', icon: <Tags size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-secondary flex">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-secondary border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-p4 border-b border-white/5 flex justify-between items-center bg-secondary">
                    <div>
                        <h1 className="text-h4 font-bold text-primary">Vibed.</h1>
                        <p className="text-b3 text-subtext truncate max-w-[150px]">{user?.name}</p>
                    </div>
                    {/* Cloud Button for Mobile */}
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-subtext hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-p3 flex flex-col gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-p3 py-p4 rounded-lg text-b2 transition-colors ${location.pathname === item.path
                                ? 'bg-primary/10 text-primary'
                                : 'text-subtext hover:text-text-main hover:bg-white/5'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-p3 border-t border-white/5">
                    <Button
                        text="Add Transaction"
                        onClick={() => openModal('ADD_TRANSACTION', {}, 'Add Transaction')}
                        className="w-full mb-p5 flex justify-center items-center gap-2"
                    />
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-p3 py-p5 w-full text-subtext hover:text-error transition-colors rounded-lg hover:bg-error/5"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen">
                <header className="md:hidden flex justify-between items-center p-p3 border-b border-white/5 bg-secondary/80 backdrop-blur-md sticky top-0 z-30">
                    <h1 className="text-h4 font-bold text-primary">Vibed.</h1>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                        <Menu size={24} className="text-subtext" />
                    </button>
                </header>

                <div className="p-p2 md:p-p4 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Mobile FAB */}
            <button
                onClick={() => openModal('ADD_TRANSACTION', {}, 'Add Transaction')}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/30 flex items-center justify-center text-white z-40 active:scale-95 transition-transform"
            >
                <Plus size={28} />
            </button>

        </div>
    );
};

export default DashboardLayout;
