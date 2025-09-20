import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import HomePage from '@/pages/HomePage';
import ChatPage from '@/pages/ChatPage';
import DanteUI from '@/pages/DanteUI';
import BaseLegal from '@/pages/BaseLegal';
import ComoFunciona from '@/pages/ComoFunciona';
import Planos from '@/pages/Planos';
import Contato from '@/pages/Contato';

function ErrorFallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Algo deu errado!</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button 
          onClick={resetErrorBoundary}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat-page" element={<ChatPage />} />
            <Route path="/dante-ui" element={<DanteUI />} />
            <Route path="/base-legal" element={<BaseLegal />} />
            <Route path="/como-funciona" element={<ComoFunciona />} />
            <Route path="/planos" element={<Planos />} />
            <Route path="/contato" element={<Contato />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;