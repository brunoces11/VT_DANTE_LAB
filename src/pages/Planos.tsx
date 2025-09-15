import React from 'react';
import Header from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Check, 
  X, 
  Zap, 
  Crown, 
  Building2,
  ArrowRight,
  Star,
  Scale
} from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: "R$ 0",
    period: "/mês",
    description: "Perfeito para cartórios pequenos e testes iniciais",
    icon: Zap,
    features: [
      { name: "100 consultas por mês", included: true },
      { name: "Acesso à base legal básica", included: true },
      { name: "Suporte por email", included: true },
      { name: "Documentação online", included: true },
      { name: "Consultas ilimitadas", included: false },
      { name: "Suporte prioritário", included: false },
      { name: "Treinamento personalizado", included: false },
      { name: "API access", included: false }
    ],
    cta: "Começar grátis",
    popular: false
  },
  {
    name: "Profissional",
    price: "R$ 149",
    period: "/mês",
    description: "Para cartórios que precisam de mais recursos e suporte",
    icon: Crown,
    features: [
      { name: "Consultas ilimitadas", included: true },
      { name: "Base legal completa", included: true },
      { name: "Suporte prioritário", included: true },
      { name: "Chat ao vivo", included: true },
      { name: "Relatórios de uso", included: true },
      { name: "Treinamento online", included: true },
      { name: "API access", included: true },
      { name: "Consultoria jurídica", included: false }
    ],
    cta: "Começar teste grátis",
    popular: true
  },
  {
    name: "Enterprise",
    price: "R$ 499",
    period: "/mês",
    description: "Para grandes cartórios e redes que precisam de máxima performance",
    icon: Building2,
    features: [
      { name: "Consultas ilimitadas", included: true },
      { name: "Base legal completa", included: true },
      { name: "Suporte 24/7", included: true },
      { name: "Gerente de conta dedicado", included: true },
      { name: "Treinamento personalizado", included: true },
      { name: "API access completa", included: true },
      { name: "Consultoria jurídica", included: true },
      { name: "SLA garantido", included: true }
    ],
    cta: "Falar com vendas",
    popular: false
  }
];

const faqs = [
  {
    question: "Posso cancelar minha assinatura a qualquer momento?",
    answer: "Sim, você pode cancelar sua assinatura a qualquer momento. Não há taxas de cancelamento e você continuará tendo acesso aos recursos até o final do período pago."
  },
  {
    question: "O Dante AI substitui a consulta a um advogado?",
    answer: "Não. O Dante AI é uma ferramenta de apoio que fornece informações baseadas na legislação, mas não substitui a consulta a um profissional do direito para casos complexos."
  },
  {
    question: "Como funciona o período de teste gratuito?",
    answer: "Oferecemos 14 dias de teste gratuito do plano Profissional. Durante este período, você tem acesso completo a todos os recursos sem necessidade de cartão de crédito."
  },
  {
    question: "A base legal é atualizada automaticamente?",
    answer: "Sim! Nossa equipe jurídica monitora constantemente mudanças na legislação e atualiza a base de conhecimento do Dante AI automaticamente."
  },
  {
    question: "Há desconto para múltiplas licenças?",
    answer: "Sim, oferecemos descontos progressivos para cartórios que precisam de múltiplas licenças. Entre em contato conosco para uma proposta personalizada."
  }
];

export default function Planos() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 to-white pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6">
              Planos
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
              Planos que se adaptam ao{" "}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                seu cartório
              </span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-neutral-600">
              Escolha o plano ideal para o tamanho e necessidades do seu cartório. 
              Todos os planos incluem 14 dias de teste grátis.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className="relative overflow-hidden border-neutral-200 hover:shadow-lg transition-all duration-300"
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-2 text-sm font-medium">
                    <Star className="inline h-4 w-4 mr-1" />
                    Mais Popular
                  </div>
                )}
                
                <CardContent className={`p-8 ${plan.popular ? 'pt-16' : ''}`}>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      plan.popular ? 'bg-orange-500' : 'bg-neutral-100'
                    }`}>
                      <plan.icon className={`h-5 w-5 ${
                        plan.popular ? 'text-white' : 'text-neutral-600'
                      }`} />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900">
                      {plan.name}
                    </h3>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-neutral-900">
                        {plan.price}
                      </span>
                      <span className="text-neutral-500 ml-1">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-neutral-600 mt-2">
                      {plan.description}
                    </p>
                  </div>

                  <Button 
                    className={`w-full mb-8 ${
                      plan.popular 
                        ? 'bg-orange-500 text-white hover:bg-orange-600' 
                        : 'bg-neutral-900 text-white hover:bg-neutral-800'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-start space-x-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-neutral-300 mt-0.5 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${
                          feature.included ? 'text-neutral-700' : 'text-neutral-400'
                        }`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Perguntas Frequentes
            </h2>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              Tire suas dúvidas sobre nossos planos e funcionalidades
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-neutral-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-neutral-600">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Pronto para começar?
            </h2>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              Experimente o Dante AI gratuitamente por 14 dias. Sem cartão de crédito necessário.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="bg-neutral-900 text-white hover:bg-neutral-800">
                Começar teste grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Falar com vendas
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}