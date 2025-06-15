import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import InventoryManagement from './components/Inventory/InventoryManagement';
import InventoryTracking from './components/Inventory/InventoryTracking';
import RoastingOperations from './components/Roasting/RoastingOperations';
import RoastingProfileManager from './components/Roasting/RoastingProfileManager';
import QualityControl from './components/Quality/QualityControl';
import ProductionPlanning from './components/Production/ProductionPlanning';
import PricingCalculator from './components/Pricing/PricingCalculator';
import SalesManagement from './components/Sales/SalesManagement';
import FinancialReports from './components/Reports/FinancialReports';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import UserManagement from './components/Users/UserManagement';
import SystemSettings from './components/Settings/SystemSettings';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-4 mx-auto">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">BeansHub</h2>
        <p className="text-gray-600">Loading your coffee management system...</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { state } = useAppContext();
  const { user, loading, initialized } = state;

  if (!initialized || loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:ml-64">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<InventoryManagement />} />
              <Route path="/inventory/tracking" element={<InventoryTracking />} />
              <Route path="/roasting" element={<RoastingOperations />} />
              <Route path="/roasting/profiles" element={<RoastingProfileManager />} />
              <Route path="/quality" element={<QualityControl />} />
              <Route path="/production" element={<ProductionPlanning />} />
              <Route path="/pricing" element={<PricingCalculator />} />
              <Route path="/sales" element={<SalesManagement />} />
              <Route path="/reports" element={<FinancialReports />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/settings" element={<SystemSettings />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;