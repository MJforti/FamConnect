
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/components/LandingPage';
import AuthModal from '@/components/AuthModal';
import Dashboard from '@/components/Dashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <>
      <LandingPage onShowAuth={() => setShowAuthModal(true)} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
