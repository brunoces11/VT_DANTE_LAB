import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/header';
import ChatContato from '@/components/chat_contato';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function Contato() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <Header />
      
      <div className="pt-14 pb-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-6">
              Contato | Formulário Inteligente
            </h1>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Converse com nossa IA de atendimento e obtenha respostas instantâneas para suas dúvidas sobre funcionalidades, planos, implementação ou qualquer aspecto do Dante AI.
            </p>
          </div>

          {/* Chat Container */}
          <ChatContato />

          {/* Contact Info Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-neutral-50 rounded-xl">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Email</h4>
              <p className="text-sm text-neutral-600 mb-2">
                Para questões comerciais e suporte técnico
              </p>
              <a href="mailto:contato@dante-ai.com" className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                contato@dante-ai.com
              </a>
            </div>

            <div className="text-center p-6 bg-neutral-50 rounded-xl">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Telefone</h4>
              <p className="text-sm text-neutral-600 mb-2">
                Atendimento comercial
              </p>
              <a href="tel:+5511999999999" className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                (11) 99999-9999
              </a>
            </div>

            <div className="text-center p-6 bg-neutral-50 rounded-xl">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Localização</h4>
              <p className="text-sm text-neutral-600 mb-2">
                Sede administrativa
              </p>
              <p className="text-orange-600 font-medium text-sm">
                São Paulo, SP
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center bg-neutral-900 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Ainda tem dúvidas?
            </h2>
            <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
              Nossa equipe está pronta para ajudar você a implementar o Dante AI 
              no seu cartório. Agende uma demonstração personalizada!
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
              <MessageCircle className="mr-2 h-4 w-4" />
              Agendar Demonstração
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}