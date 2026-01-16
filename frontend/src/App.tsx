import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Modal from './lib/components/ui/Modal';
import { useAuthStore } from './store/useAuthStore';
import { Login, Signup } from './pages/auth';
import DashboardLayout from './pages/expense-tracker/DashboardLayout';
import Dashboard from './pages/expense-tracker/Dashboard';
import TransactionsPage from './pages/expense-tracker/TransactionsPage';
import CategoriesPage from './pages/expense-tracker/CategoriesPage';

const App: React.FC = () => {
  const { checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <Router>
      <div className="min-h-screen bg-secondary selection:bg-primary selection:text-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Modal />
      </div>
    </Router>
  );
};

export default App;
