import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { MaterialHeader } from './components/layout/MaterialHeader';
import { Footer } from './components/layout/Footer';
import { CartSidebar } from './components/cart/CartSidebar';
import { CookieBanner } from './components/cookies/CookieBanner';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SellerDashboard } from './components/seller/SellerDashboard';
import { CheckoutProcess } from './components/checkout/CheckoutProcess';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfService } from './components/legal/TermsOfService';

// Protected Route Component
function ProtectedRoute({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode; 
  requiredRole?: 'admin' | 'seller' | 'client';
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Layout avec Header/Footer
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MaterialHeader />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* Routes publiques avec layout */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/men" element={<MainLayout><ProductsPage category="men" /></MainLayout>} />
        <Route path="/women" element={<MainLayout><ProductsPage category="women" /></MainLayout>} />
        <Route path="/kids" element={<MainLayout><ProductsPage category="kids" /></MainLayout>} />
        <Route path="/brands" element={<MainLayout><ProductsPage /></MainLayout>} />
        <Route path="/new" element={<MainLayout><ProductsPage filter="new" /></MainLayout>} />
        <Route path="/product/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
        <Route path="/legal/privacy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
        <Route path="/legal/terms" element={<MainLayout><TermsOfService /></MainLayout>} />
        
        {/* Routes protégées avec layout */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout><ProfilePage /></MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Routes sans layout */}
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutProcess />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/seller" element={
          <ProtectedRoute requiredRole="seller">
            <SellerDashboard />
          </ProtectedRoute>
        } />
        
        {/* Route 404 */}
        <Route path="*" element={
          <MainLayout>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page non trouvée</h2>
                <p className="text-gray-600 mb-8">La page que vous recherchez n'existe pas.</p>
                <a href="/" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
                  Retour à l'accueil
                </a>
              </div>
            </div>
          </MainLayout>
        } />
      </Routes>
      
      <CartSidebar />
      <CookieBanner />
    </div>
  );
}

export default App;