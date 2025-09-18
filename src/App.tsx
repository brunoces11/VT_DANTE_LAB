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
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<><Header /><HomePage /></>} />
          <Route path="/chat-page" element={<ChatPage />} />
          <Route path="/dante-ui" element={<><Header /><DanteUI /></>} />
          <Route path="/base-legal" element={<><Header /><BaseLegal /></>} />
          <Route path="/como-funciona" element={<><Header /><ComoFunciona /></>} />
          <Route path="/planos" element={<><Header /><Planos /></>} />
          <Route path="/contato" element={<><Header /><Contato /></>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;