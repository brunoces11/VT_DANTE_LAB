import React from 'react';
import Header from '@/components/header';
import SupabaseTest from '@/components/SupabaseTest';

export default function TestePage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <Header />
      <div className="pt-14">
        <SupabaseTest />
      </div>
    </div>
  );
}