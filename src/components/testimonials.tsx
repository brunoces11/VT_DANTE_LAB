import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Dr. Carlos Mendes",
      role: "Oficial de Registro de Imóveis",
      location: "São Paulo, SP",
      content: "O conteúdo de atualização semanal (WEBINAR) com transmissões de novas normatizações e questões de Registro de Imóveis completas, onde qualificação de registrar das mais complexas às mais simples foi exemplar.",
      rating: 5,
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Ana Paula Silva",
      role: "Registradora Titular",
      location: "Rio de Janeiro, RJ", 
      content: "Dante eficientemente, sempre foi útil quando precisei consultá-lo sobre procedimentos de registros imobiliários. Tudo que eu quero de resposta é realmente o que Dante me fornece sempre eficiente e específico.",
      rating: 5,
      image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      name: "Roberto Costa",
      role: "Diretor de Cartório",
      location: "Belo Horizonte, MG",
      content: "Sempre o cliente está sendo atendido pela primeira vez. O atendimento é sempre melhor do que simplesmente apresentar os documentos exigidos, pois é sempre questionado cada passo e o objetivo é sempre a satisfação total do cliente.",
      rating: 5,
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-orange-600 font-medium text-sm uppercase tracking-wide mb-4">
            Confiado por profissionais de cartório
          </p>
          <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl mb-4">
            Confiado por profissionais de cartório
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Veja como profissionais estão transformando seus procedimentos registrais 
            com o Dante AI.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-neutral-50 rounded-2xl p-8 relative">
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="h-6 w-6 text-orange-200" />
              </div>

              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-neutral-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-neutral-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-neutral-500">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-neutral-600 mb-8">
            Confiado por mais de 500 cartórios no Brasil
          </p>
          
          {/* Logo Grid */}
          <div className="flex justify-center items-center space-x-8 opacity-40">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-neutral-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm text-neutral-600 mb-4">
            ★★★★★ • Avaliado por 450 profissionais de cartório
          </p>
        </div>
      </div>
    </section>
  );
}