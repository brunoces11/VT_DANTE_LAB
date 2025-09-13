import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import HomePage from '@/pages/HomePage';
import ChatPage from '@/pages/ChatPage';
import ChatPage2 from '@/pages/ChatPage2';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat-page" element={<ChatPage />} />
          <Route path="/chat-page2" element={<ChatPage2 />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;