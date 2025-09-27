import React, { useState } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';

export default function PayloadTest() {
  const [inputMessage, setInputMessage] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [flowId, setFlowId] = useState('');
  const [payloadMessage, setPayloadMessage] = useState('');
  const [payloadResponse, setPayloadResponse] = useState('');
  const [treatedResponse, setTreatedResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputMessage.trim() || !endpointUrl.trim() || !flowId.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    
    // Criar o payload específico para Langflow
    const payload = {
      "input_value": inputMessage,
      "output_type": "chat",
      "input_type": "chat",
      "session_id": "user_1"
    };

    // Mostrar o payload no campo correspondente
    setPayloadMessage(JSON.stringify(payload, null, 2));

    try {
      // Construir a URL completa com o Flow ID
      const fullUrl = endpointUrl.endsWith('/') ? `${endpointUrl}api/v1/run/${flowId}` : `${endpointUrl}/api/v1/run/${flowId}`;
      
      // Fazer a requisição HTTP para Langflow
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // Obter a resposta
      const responseData = await response.json();
      
      // Mostrar o payload de resposta bruto
      setPayloadResponse(JSON.stringify(responseData, null, 2));

      // Tratar a resposta específica do Langflow
      let treated = '';
      
      // Langflow geralmente retorna a resposta em outputs > 0 > outputs > message > message > text
      if (responseData.outputs && responseData.outputs[0] && responseData.outputs[0].outputs) {
        const outputs = responseData.outputs[0].outputs;
        if (outputs.message && outputs.message.message && outputs.message.message.text) {
          treated = outputs.message.message.text;
        } else if (outputs.text) {
          treated = outputs.text;
        } else {
          treated = 'Resposta do Langflow recebida, mas estrutura não reconhecida para extração automática.';
        }
      } else if (responseData.result) {
        treated = responseData.result;
      } else if (responseData.message) {
        treated = responseData.message;
      } else {
        treated = 'Resposta do Langflow recebida, mas formato não reconhecido para tratamento automático.';
      }
      
      setTreatedResponse(treated);

    } catch (error) {
      const errorMessage = `Erro na requisição: ${error.message}`;
      setPayloadResponse(errorMessage);
      setTreatedResponse(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      <Header />
      
      <div className="pt-14 pb-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Título */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              Langflow | Payload Test
            </h1>
          </div>

          {/* Formulário */}
          <div className="space-y-6">
            {/* Input Message */}
            <div>
              <label htmlFor="inputMessage" className="block text-sm font-medium text-neutral-700 mb-2">
                Input Message
              </label>
              <div className="flex gap-2">
                <Input
                  id="inputMessage"
                  type="text"
                  placeholder="Digite sua mensagem aqui..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !inputMessage.trim() || !endpointUrl.trim() || !flowId.trim()}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Endpoint URL */}
            <div>
              <label htmlFor="endpointUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                Endpoint URL
              </label>
              <Input
                id="endpointUrl"
                type="url"
                placeholder="https://lf142.prompt-master.org"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Flow ID */}
            <div>
              <label htmlFor="flowId" className="block text-sm font-medium text-neutral-700 mb-2">
                Flow ID
              </label>
              <Input
                id="flowId"
                type="text"
                placeholder="1060b727-10e5-4597-aa26-4662f5bccd46"
                value={flowId}
                onChange={(e) => setFlowId(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Payload Message */}
            <div>
              <label htmlFor="payloadMessage" className="block text-sm font-medium text-neutral-700 mb-2">
                Payload Message (será enviado)
              </label>
              <textarea
                id="payloadMessage"
                value={payloadMessage}
                readOnly
                className="w-full h-32 p-3 border border-neutral-300 rounded-md bg-neutral-50 font-mono text-sm resize-none"
                placeholder="O payload aparecerá aqui quando você clicar em Enviar..."
              />
            </div>

            {/* Payload Response */}
            <div>
              <label htmlFor="payloadResponse" className="block text-sm font-medium text-neutral-700 mb-2">
                Payload Response (resposta bruta)
              </label>
              <textarea
                id="payloadResponse"
                value={payloadResponse}
                readOnly
                className="w-full h-32 p-3 border border-neutral-300 rounded-md bg-neutral-50 font-mono text-sm resize-none"
                placeholder="A resposta bruta aparecerá aqui..."
              />
            </div>

            {/* Treated Response */}
            <div>
              <label htmlFor="treatedResponse" className="block text-sm font-medium text-neutral-700 mb-2">
                Resposta Tratada
              </label>
              <textarea
                id="treatedResponse"
                value={treatedResponse}
                readOnly
                className="w-full h-32 p-3 border border-neutral-300 rounded-md bg-green-50 text-sm resize-none"
                placeholder="A resposta tratada aparecerá aqui..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}