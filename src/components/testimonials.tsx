import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

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

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 bg-white hover:bg-orange-50 text-neutral-700 hover:text-orange-600 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Depoimento anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 bg-white hover:bg-orange-50 text-neutral-700 hover:text-orange-600 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Próximo depoimento"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Testimonial Card */}
          <div className="bg-neutral-50 rounded-2xl p-12 relative transition-all duration-300">
            {/* Quote Icon */}
            <div className="absolute top-8 right-8">
              <Quote className="h-8 w-8 text-orange-200" />
            </div>

            {/* Rating */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-1">
                {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-orange-400 text-orange-400" />
                ))}
              </div>
            </div>

            {/* Content */}
            <blockquote className="text-neutral-700 text-lg leading-relaxed mb-8 text-center max-w-3xl mx-auto">
              "{currentTestimonial.content}"
            </blockquote>

            {/* Author */}
            <div className="flex flex-col items-center space-y-4">
              <img
                src={currentTestimonial.image}
                alt={currentTestimonial.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-center">
                <div className="font-semibold text-neutral-900 text-lg">
                  {currentTestimonial.name}
                </div>
                <div className="text-sm text-neutral-600 mt-1">
                  {currentTestimonial.role}
                </div>
                <div className="text-sm text-neutral-500">
                  {currentTestimonial.location}
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-orange-500'
                    : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`Ir para depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm text-neutral-600 mb-4">
            ★★★★★ • Testado e Aprovado por profissionais de cartório • Eficiência e Segurança jurídica para sua operação • ★★★★★
          </p>
        </div>
      </div>
    </section>
  );
}
