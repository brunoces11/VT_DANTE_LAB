import React from 'react';
import Header from '@/components/header';
import Hero from '@/components/hero';
import Features from '@/components/features';
import Testimonials from '@/components/testimonials';
import Assinatura from '@/components/assinatura';
import { AuthProvider } from '@/components/auth/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <main className="min-h-screen bg-white">
        <Header />
        <Hero />
        <Features />
        <Testimonials />
        <Assinatura />
      </main>
    </AuthProvider>
  );
}

export default App;