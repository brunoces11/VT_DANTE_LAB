import React from 'react';
import { useState } from 'react';
import { useRef, useEffect } from 'react';
import ChatMsgHeader from '@/components/chat_msg_header';
import ChatMsgList from '@/components/chat_msg_list';
import ChatInput from '@/components/chat_input';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
  loadingText?: string;
}

interface ChatAreaProps {
}

export default function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "# Olá! 👋\n\nComo posso ajudá-lo com questões de **Registro de Imóveis** hoje?\n\nEstou aqui para esclarecer dúvidas sobre:\n- Procedimentos registrais\n- Qualificação de títulos\n- Legislação vigente\n- Normas do CNJ",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático para o final quando novas mensagens são adicionadas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (inputValue: string) => {
    if (!inputValue.trim() || isLoading) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Scroll imediato após enviar mensagem do usuário
    setTimeout(scrollToBottom, 100);

    // Iniciar sequência de loading
    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: '',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true,
      loadingText: 'Consultando Base Legal vigente...',
    };

    setMessages(prev => [...prev, loadingMessage]);

    // Scroll para mostrar mensagem de loading
    setTimeout(scrollToBottom, 200);

    // Sequência de loading com tempos específicos
    const loadingSequence = [
      { text: 'Consultando Base Legal vigente...', delay: 1500 },
      { text: 'Acessando Leis Federais...', delay: 1000 },
      { text: 'Acessando Leis Estaduais...', delay: 700 },
      { text: 'Acessando Documentos normativos:', delay: 800 },
      { text: 'Provimentos, Codigo de Normas...', delay: 500 },
      { text: 'Consolidando fundamentos jurídicos...', delay: 600 },
      { text: 'O Dante está processando sua resposta, por favor aguarde...', delay: 0 }
    ];

    let currentDelay = 0;
    loadingSequence.forEach((step, index) => {
      currentDelay += step.delay;
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.isLoading ? { ...msg, loadingText: step.text } : msg
        ));
      }, currentDelay);
    });

    // Simular resposta da IA após a sequência completa + tempo adicional
    const totalLoadingTime = loadingSequence.reduce((sum, step) => sum + step.delay, 0);
    setTimeout(() => {
      const responses = [
        "## Análise Legal - Lei 6.015/73\n\nCom base na **legislação vigente**, especificamente na **Lei 6.015/73** (Lei de Registros Públicos), posso orientá-lo sobre esse procedimento.\n\n### Para essa situação específica, é necessário verificar:\n\n#### 📋 Documentação Exigida\n- Título hábil para registro\n- Certidões atualizadas\n- Comprovantes fiscais\n\n#### ⏰ Prazos Legais\n- Prazo de apresentação\n- Validade das certidões\n- Prazos processuais\n\n#### 💰 Tributos Incidentes\n- ITBI quitado\n- Emolumentos devidos\n- Taxas cartoriais\n\n#### ✅ Qualificação Registral\n- Análise da cadeia dominial\n- Verificação de vícios\n- Conformidade legal\n\n> **Pergunta**: Poderia fornecer mais detalhes sobre o caso específico?",
        
        "# Procedimento Registral - Art. 167 da Lei 6.015/73\n\nSegundo o **artigo 167** da Lei 6.015/73 e as **normas do CNJ**, esse procedimento requer atenção especial aos seguintes aspectos:\n\n## 🔍 Aspectos Fundamentais\n\n### 1. Análise da Cadeia Dominial\n- Verificação de **continuidade registral**\n- Conferência de **titularidade**\n- Análise de **vícios anteriores**\n\n### 2. Verificação de Ônus e Gravames\n- **Hipotecas** existentes\n- **Penhoras** judiciais\n- **Usufrutos** e servidões\n\n### 3. Conferência da Documentação\n- **Autenticidade** dos documentos\n- **Validade** das certidões\n- **Completude** da instrução\n\n### 4. Cálculo de Emolumentos\n- Tabela oficial vigente\n- Valores corretos\n- Recolhimentos devidos\n\n> ⚖️ **Importante**: A qualificação registral deve ser **rigorosa** para garantir a **segurança jurídica** do ato.",
        
        "## 📚 Legislação de Registro de Imóveis\n\nDe acordo com a **legislação de Registro de Imóveis**, essa questão envolve procedimentos específicos que devem ser observados:\n\n### 📖 Fontes Normativas\n\n#### Base Legal Principal\n- **Lei 6.015/73** - Lei de Registros Públicos\n- **Código Civil** - Arts. 1.245 a 1.247\n- **Lei 8.935/94** - Lei dos Cartórios\n\n#### Normas Complementares\n- **CNJ** - Provimentos e Resoluções\n- **Corregedorias Estaduais**\n- **ANOREG** - Orientações técnicas\n\n#### Jurisprudência Consolidada\n- **STJ** - Superior Tribunal de Justiça\n- **Tribunais Estaduais**\n- **Enunciados** do CJF\n\n---\n\n### 🎯 Análise Individualizada\n\n> Cada caso possui **particularidades** que devem ser analisadas individualmente.\n\n**Precisa de orientação sobre algum aspecto específico?**\n\n*Estou aqui para ajudar com questões detalhadas sobre seu caso.*",
        
        "# ⚖️ Princípios do Registro de Imóveis\n\nPara essa questão registral, é **fundamental** observar os princípios do Registro de Imóveis:\n\n## 🏛️ Princípios Fundamentais\n\n### 1. 📋 Princípio da Legalidade\n- Todos os atos devem estar em **conformidade com a lei**\n- Observância rigorosa da legislação\n- Vedação a atos contrários ao ordenamento\n\n### 2. 🔗 Princípio da Continuidade\n- **Manutenção da cadeia dominial**\n- Sequência lógica de transmissões\n- Impossibilidade de \"saltos\" registrais\n\n### 3. 🎯 Princípio da Especialidade\n- **Identificação precisa do imóvel**\n- Descrição detalhada e inequívoca\n- Confrontações e características\n\n### 4. 🛡️ Princípio da Publicidade\n- **Acesso público** aos registros\n- Transparência dos atos\n- Oponibilidade erga omnes\n\n### 5. ✅ Princípio da Presunção de Veracidade\n- **Fé pública** registral\n- Presunção juris tantum\n- Proteção ao terceiro de boa-fé\n\n---\n\n> ⚠️ **Atenção**: A análise deve ser **criteriosa** para evitar vícios que possam comprometer o registro.\n\n*A segurança jurídica depende da observância rigorosa destes princípios.*"
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      // Remover mensagem de loading e adicionar resposta real
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        return [...withoutLoading, {
          id: Date.now() + 2,
          content: randomResponse,
          sender: 'bot',
          timestamp: new Date(),
        }];
      });
      
      setIsLoading(false);
      
      // Scroll para mostrar a resposta completa
      setTimeout(scrollToBottom, 300);
    }, totalLoadingTime + Math.random() * 1000 + 1500); // Tempo da sequência + 1.5-2.5s adicional
  };


  return (
    <div className="flex-1 flex flex-col bg-white" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Header do Chat */}
      <ChatMsgHeader />

      {/* Messages */}
      <ChatMsgList messages={messages} messagesEndRef={messagesEndRef} />

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}