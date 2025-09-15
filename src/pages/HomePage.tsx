import React from 'react';
import Header from '@/components/header';
import Hero from '@/components/hero';
import Features from '@/components/features';
import Testimonials from '@/components/testimonials';
import Assinatura from '@/components/assinatura';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white pt-16">
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Assinatura />
    </main>
  );
}