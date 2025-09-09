import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import HomePage from '@/pages/HomePage';
import ChatPrincipal from '@/pages/ChatPrincipal';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import TestResetPage from '@/pages/TestResetPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/test-reset" element={<TestResetPage />} />
          <Route 
            path="/chat-principal" 
            element={
              <ProtectedRoute>
                <ChatPrincipal />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;