import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import HomePage from '@/pages/HomePage';
import ChatPage from '@/pages/ChatPage';
import DanteUI from '@/pages/DanteUI';
import BaseLegal from '@/pages/BaseLegal';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat-page" element={<ChatPage />} />
          <Route path="/dante-ui" element={<DanteUI />} />
          <Route path="/base-legal" element={<BaseLegal />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;