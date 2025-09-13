import React from 'react';
import { useState } from 'react';
import { useRef, useEffect } from 'react';
import { MessageCircle, Send, Scale, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
  loadingText?: string;
}

export default function ChatArea() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "# Olá! 👋\n\nComo posso ajudá-lo com questões de **Registro de Imóveis** hoje?\n\nEstou aqui para esclarecer dúvidas sobre:\n- Procedimentos registrais\n- Qualificação de títulos\n- Legislação vigente\n- Normas do CNJ",
      sender: 'bot',
      timestamp: new Date(),
    },
    {
      id: 2,
      content: "Preciso saber sobre os procedimentos para registro de uma escritura de compra e venda.",
      sender: 'user',
      timestamp: new Date(),
    },
    {
      id: 3,
      content: "## Registro de Escritura de Compra e Venda\n\nPara o registro de uma **escritura de compra e venda**, é necessário verificar:\n\n### 1. Qualificação Registral\n- Análise da cadeia dominial\n- Verificação de continuidade\n- Conferência de dados\n\n### 2. Documentação Exigida\n- Certidões negativas atualizadas\n- Comprovante de quitação do ITBI\n- Certidão de ônus reais\n\n### 3. Aspectos Formais\n- **Escritura pública** lavrada em cartório\n- Assinatura das partes\n- Reconhecimento de firmas\n\n> **Base Legal**: Todos os documentos devem estar em conformidade com a **Lei 6.015/73** e as normas do **CNJ**.\n\n*Precisa de esclarecimentos sobre algum item específico?*",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático para o final quando novas mensagens são adicionadas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Scroll imediato após enviar mensagem do usuário
    setTimeout(scrollToBottom, 100);

    // Iniciar sequência de loading
    setLoadingText('Consultando Base Legal vigente...');
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
      { text: 'Processando sua resposta, por favor aguarde...', delay: 0 }
    ];

    let currentDelay = 0;
    loadingSequence.forEach((step, index) => {
      currentDelay += step.delay;
      setTimeout(() => {
        setLoadingText(step.text);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Header do Chat */}
      <div className="flex flex-row items-center justify-between p-4 border-b border-neutral-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
            <Scale className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Dante AI - Registro de Imóveis
            </h3>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-neutral-500">Especialista Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-3 max-w-[85%] ${
                message.sender === 'user'
                  ? 'flex-row-reverse space-x-reverse'
                  : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 ${
                  message.sender === 'user'
                    ? 'bg-neutral-900'
                    : 'bg-gradient-to-br from-orange-500 to-orange-600'
                }`}
              >
                {message.sender === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Scale className="h-4 w-4 text-white" />
                )}
              </div>

              {/* Conteúdo da mensagem */}
              <div
                className={`rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-900'
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">{message.loadingText || 'Processando...'}</span>
                  </div>
                ) : (
                  <>
                    {message.sender === 'bot' ? (
                      <div className="prose prose-sm max-w-none prose-headings:text-neutral-900 prose-headings:font-semibold prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-p:text-sm prose-p:leading-relaxed prose-strong:text-neutral-900 prose-strong:font-semibold prose-ul:text-sm prose-ol:text-sm prose-li:text-sm prose-blockquote:text-sm prose-blockquote:border-orange-300 prose-blockquote:bg-orange-50 prose-blockquote:px-3 prose-blockquote:py-2 prose-blockquote:rounded prose-code:text-xs prose-code:bg-neutral-200 prose-code:px-1 prose-code:rounded">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`text-xs ${
                          message.sender === 'user'
                            ? 'text-neutral-300'
                            : 'text-neutral-500'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {/* Elemento invisível para scroll automático */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-neutral-200 bg-white">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta sobre Registro de Imóveis..."
            disabled={isLoading}
            className="flex-1 bg-white border-neutral-200 focus:border-orange-400 focus:ring-orange-400"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-neutral-500 mt-2 text-center">
          Dante AI pode cometer erros. Verifique informações importantes com a legislação oficial.
        </p>
      </div>
    </div>
  );
}