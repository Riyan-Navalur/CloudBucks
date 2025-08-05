import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import ServiceForm from './components/ServiceForm';
import ComparisonDashboard from './components/ComparisonDashboard';
import Footer from './components/Footer';
import AuthPage from './components/auth/AuthPage';

// Main App Content - Free to use, login only required for PDF generation
const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Configuration Form */}
          <div className="lg:col-span-1">
            <ServiceForm />
          </div>
          
          {/* Comparison Dashboard */}
          <div className="lg:col-span-2">
            <ComparisonDashboard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Provider>
  );
}

export default App;
