import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FixNearProvider } from './context/FixNearContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { DemoRoleBanner } from './components/common/DemoRoleBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';

import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ProviderDetailPage } from './pages/ProviderDetailPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { WorkerPage } from './pages/WorkerPage';
import { AdminPage } from './pages/AdminPage';
import { RegisterSelectionPage } from './pages/RegisterSelectionPage';
import { RegisterHelperPage } from './pages/RegisterHelperPage';
import { RegisterCustomerPage } from './pages/RegisterCustomerPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Layout wrapper to show/hide standard customer navbar on worker screen if appropriate
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isWorkerMode = location.pathname.startsWith('/worker') || location.pathname.startsWith('/helper/dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F5] text-[#172033]">
      {/* Demonstration Role Switcher Banner */}
      <DemoRoleBanner />

      {/* Customer Header (Shown everywhere except Worker Mode) */}
      {!isWorkerMode && <Navbar />}

      {/* Main Content protected by Error Boundary */}
      <main className="flex-1">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>

      {/* Footer (Shown everywhere except Worker Mode) */}
      {!isWorkerMode && <Footer />}

      {/* Global Toast Alerts */}
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <FixNearProvider>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                {/* Home & Directory */}
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:id" element={<ProviderDetailPage />} />
                <Route path="/book-service/:id" element={<ProviderDetailPage />} />

                {/* Customer Routes */}
                <Route path="/my-bookings" element={<MyBookingsPage />} />
                <Route path="/customer/dashboard" element={<MyBookingsPage />} />

                {/* Auth & Registration */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterSelectionPage />} />
                <Route path="/choose-role" element={<RegisterSelectionPage />} />
                <Route path="/register-customer" element={<RegisterCustomerPage />} />
                <Route path="/need-help" element={<RegisterCustomerPage />} />
                <Route path="/register-helper" element={<RegisterHelperPage />} />
                <Route path="/join-as-helper" element={<RegisterHelperPage />} />
                <Route path="/i-am-a-helper" element={<RegisterHelperPage />} />

                {/* Worker / Helper Portals */}
                <Route path="/worker" element={<WorkerPage />} />
                <Route path="/worker/profile" element={<WorkerPage />} />
                <Route path="/helper/dashboard" element={<WorkerPage />} />

                {/* Admin Portal */}
                <Route path="/admin" element={<AdminPage />} />

                {/* 404 Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </FixNearProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
