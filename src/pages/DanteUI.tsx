import React from 'react';
import Header from '@/components/header';
import UserProfilePanel from '@/components/user_profile_panel';
import UserProfileIcon from '@/components/user_profile_icon';

export default function DanteUI() {
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);

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
    { bg: 'bg-orange-700', name: 'orange-700', hex: '#C2410C' },
    { bg: 'bg-orange-800', name: 'orange-800', hex: '#9A3412' },
    { bg: 'bg-orange-900', name: 'orange-900', hex: '#7C2D12' },
    { bg: 'bg-red-50', name: 'red-50', hex: '#FEF2F2' },
    { bg: 'bg-red-600', name: 'red-600', hex: '#DC2626' },
    { bg: 'bg-green-50', name: 'green-50', hex: '#F0FDF4' },
    { bg: 'bg-green-500', name: 'green-500', hex: '#22C55E' },
    { bg: 'bg-green-600', name: 'green-600', hex: '#16A34A' },
    { bg: 'bg-green-700', name: 'green-700', hex: '#15803D' },
    { bg: 'bg-green-800', name: 'green-800', hex: '#166534' },
    { bg: 'bg-green-900', name: 'green-900', hex: '#14532D' },
    { bg: 'bg-slate-500', name: 'slate-500', hex: '#64748B' },
    { bg: 'bg-slate-600', name: 'slate-600', hex: '#475569' },
    { bg: 'bg-slate-700', name: 'slate-700', hex: '#334155' },
    { bg: 'bg-slate-800', name: 'slate-800', hex: '#1E293B' },
    { bg: 'bg-slate-900', name: 'slate-900', hex: '#0F172A' },
    { bg: 'bg-sky-500', name: 'sky-500', hex: '#0EA5E9' },
    { bg: 'bg-sky-600', name: 'sky-600', hex: '#0284C7' },
    { bg: 'bg-sky-700', name: 'sky-700', hex: '#0369A1' },
    { bg: 'bg-sky-800', name: 'sky-800', hex: '#075985' },
    { bg: 'bg-sky-900', name: 'sky-900', hex: '#0C4A6E' },
    { bg: 'bg-purple-500', name: 'purple-500', hex: '#A855F7' },
    { bg: 'bg-purple-600', name: 'purple-600', hex: '#9333EA' },
    { bg: 'bg-purple-700', name: 'purple-700', hex: '#7C3AED' },
    { bg: 'bg-purple-800', name: 'purple-800', hex: '#6B21A8' },
    { bg: 'bg-purple-900', name: 'purple-900', hex: '#581C87' },
    { bg: 'bg-amber-900', name: 'amber-900', hex: '#78350F' },
  ];

  // Dividir cores em duas colunas para layout lado a lado
  const leftColors = colors.slice(0, Math.ceil(colors.length / 2));
  const rightColors = colors.slice(Math.ceil(colors.length / 2));
  return (
    <div className="min-h-screen bg-white pt-16">
      <Header />
      
      <div className="pt-14 pb-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              Dante UI - Paleta de Cores
            </h1>
            <p className="text-lg text-neutral-600">
              Paleta de cores oficial do sistema Dante AI
            </p>
          </div>

          {/* User Profile Panel Demo */}
          <div className="mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Componentes de Perfil do Usuário
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                Demonstração do ícone de perfil e painel de configurações
              </p>
              
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <p className="text-sm text-neutral-600 mb-3">Ícone de Perfil (Pequeno)</p>
                  <UserProfileIcon size="sm" />
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-neutral-600 mb-3">Ícone de Perfil (Médio)</p>
                  <UserProfileIcon size="md" />
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-neutral-600 mb-3">Ícone de Perfil (Grande)</p>
                  <UserProfileIcon size="lg" />
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setIsPanelOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Abrir Painel Diretamente
                </button>
              </div>
              
              <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-600">
                  <strong>Como usar:</strong> Clique no ícone de perfil acima para ver o dropdown menu com as opções "Painel do Usuário" e "Sair".
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
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
                  {leftColors.map((leftColor, index) => {
                    const rightColor = rightColors[index];
                    return (
                    <tr key={index} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <div 
                          className={`w-8 h-8 rounded border border-neutral-300 ${leftColor.bg}`}
                        ></div>
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-neutral-700">
                        {leftColor.name}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-neutral-700">
                        {leftColor.hex}
                      </td>
                      <td className="px-4 py-3">
                        {rightColor ? (
                          <div 
                            className={`w-8 h-8 rounded border border-neutral-300 ${rightColor.bg}`}
                          ></div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-neutral-700">
                        {rightColor ? rightColor.name : ''}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-neutral-700">
                        {rightColor ? rightColor.hex : ''}
                      </td>
                    </tr>
                    );
                  })}
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

      <UserProfilePanel 
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
}