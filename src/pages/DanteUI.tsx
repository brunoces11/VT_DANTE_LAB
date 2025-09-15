import React from 'react';
import Header from '@/components/header';

export default function DanteUI() {
  const colors = [
    { bg: 'bg-white', name: 'white', hex: '#FFFFFF' },
    { bg: 'bg-neutral-50', name: 'neutral-50', hex: '#FAFAFA' },
    { bg: 'bg-neutral-100', name: 'neutral-100', hex: '#F5F5F5' },
    { bg: 'bg-neutral-200', name: 'neutral-200', hex: '#E5E5E5' },
    { bg: 'bg-neutral-300', name: 'neutral-300', hex: '#D4D4D4' },
    { bg: 'bg-neutral-400', name: 'neutral-400', hex: '#A3A3A3' },
    { bg: 'bg-neutral-500', name: 'neutral-500', hex: '#737373' },
    { bg: 'bg-neutral-600', name: 'neutral-600', hex: '#525252' },
    { bg: 'bg-neutral-700', name: 'neutral-700', hex: '#404040' },
    { bg: 'bg-neutral-800', name: 'neutral-800', hex: '#262626' },
    { bg: 'bg-neutral-900', name: 'neutral-900', hex: '#171717' },
    { bg: 'bg-gray-50', name: 'gray-50', hex: '#F9FAFB' },
    { bg: 'bg-gray-100', name: 'gray-100', hex: '#F3F4F6' },
    { bg: 'bg-gray-200', name: 'gray-200', hex: '#E5E7EB' },
    { bg: 'bg-orange-50', name: 'orange-50', hex: '#FFF7ED' },
    { bg: 'bg-orange-100', name: 'orange-100', hex: '#FFEDD5' },
    { bg: 'bg-orange-200', name: 'orange-200', hex: '#FED7AA' },
    { bg: 'bg-orange-300', name: 'orange-300', hex: '#FDBA74' },
    { bg: 'bg-orange-400', name: 'orange-400', hex: '#FB923C' },
    { bg: 'bg-orange-500', name: 'orange-500', hex: '#F97316' },
    { bg: 'bg-orange-600', name: 'orange-600', hex: '#EA580C' },
    { bg: 'bg-red-50', name: 'red-50', hex: '#FEF2F2' },
    { bg: 'bg-red-600', name: 'red-600', hex: '#DC2626' },
    { bg: 'bg-green-50', name: 'green-50', hex: '#F0FDF4' },
    { bg: 'bg-green-500', name: 'green-500', hex: '#22C55E' },
    { bg: 'bg-amber-900', name: 'amber-900', hex: '#78350F' },
  ];

  return (
    <div className="min-h-screen bg-white pt-16">
      <Header />
      
      <div className="pt-4 pb-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              Dante UI - Paleta de Cores
            </h1>
            <p className="text-lg text-neutral-600">
              Paleta de cores oficial do sistema Dante AI
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full max-w-sm mx-auto">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 w-16">
                      Cor
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-900">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-900">
                      Hexadecimal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {colors.map((color, index) => (
                    <tr key={index} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <div 
                          className={`w-8 h-8 rounded border border-neutral-300 ${color.bg}`}
                        ></div>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-neutral-700">
                        {color.name}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-neutral-700">
                        {color.hex}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              Cores baseadas na paleta oficial do Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}