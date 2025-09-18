import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import Header from '@/components/header';
import HomePage from '@/pages/HomePage';
import ChatPage from '@/pages/ChatPage';
import DanteUI from '@/pages/DanteUI';
import BaseLegal from '@/pages/BaseLegal';
import ComoFunciona from '@/pages/ComoFunciona';
import Planos from '@/pages/Planos';
import Contato from '@/pages/Contato';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
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
  );
}

export default App;