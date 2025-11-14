/**
 * ========================================
 * LANGFLOW API INTEGRATION
 * ========================================
 * Este arquivo centraliza TODAS as funções de integração com Langflow
 * Separação clara: supabase.ts = Supabase | langflow.ts = Langflow
 */

import type { AgentType } from '../src/config/agentConfigs';

interface LangflowResponse {
    outputs?: Array<{
        outputs?: Array<{
            outputs?: {
                message?: {
                    message?: string;
                };
            };
            artifacts?: {
                message?: string;
            };
            results?: {
                message?: {
                    text?: string;
                };
            };
            messages?: Array<{
                message?: string;
            }>;
        }>;
    }>;
    result?: string;
    message?: string;
}



/**
 * Função de teste para verificar conectividade com Langflow
 */
// Função global para teste rápido no console
(window as any).testLangflow = async () => {
  const result = await fun_test_langflow_connection();
  console.log('🧪 Resultado do teste:', result);
  return result;
};

export async function fun_test_langflow_connection(): Promise<{ success: boolean; message: string }> {
  try {
    const langflowUrl = import.meta.env.VITE_LANGFLOW_URL;
    const langflowFlowId = import.meta.env.VITE_LANGFLOW_FLOW_ID_RI; // ✅ Usar Flow ID do agente RI
    const langflowApiKey = import.meta.env.VITE_LANGFLOW_API_KEY;

    console.log('🧪 Testando conexão com Langflow...');
    console.log('🔗 URL:', langflowUrl);
    console.log('🆔 Flow ID:', langflowFlowId);
    console.log('🔑 API Key (primeiros 10 chars):', langflowApiKey?.substring(0, 10) + '...');

    if (!langflowUrl || !langflowFlowId || !langflowApiKey) {
      return {
        success: false,
        message: 'Variáveis de ambiente não configuradas corretamente'
      };
    }

    // Teste simples com payload mínimo
    const testPayload = {
      "input_value": "teste de conexão",
      "output_type": "chat",
      "input_type": "chat",
      "session_id": "test_session"
    };

    const fullUrl = langflowUrl.endsWith('/')
      ? `${langflowUrl}api/v1/run/${langflowFlowId}`
      : `${langflowUrl}/api/v1/run/${langflowFlowId}`;

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': langflowApiKey,
      },
      body: JSON.stringify(testPayload),
    });

    if (response.ok) {
      return {
        success: true,
        message: `Conexão OK - Status: ${response.status}`
      };
    } else {
      const errorBody = await response.text();
      return {
        success: false,
        message: `Erro ${response.status}: ${response.statusText} - ${errorBody}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
}

/**
 * Função centralizada para chamar APENAS o Langflow (sem salvamento automático)
 * Usada quando você quer apenas a resposta do Langflow
 * Suporta múltiplos agentes através do parâmetro agent_type
 */
export async function fun_call_langflow(params: {
  input_value: string;
  session_id: string;
  agent_type?: AgentType; // ✅ Tipo importado de agentConfigs
}): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    // ✅ NOVO: Determinar qual agente usar (fallback para 'dante-ri')
    const agentType = params.agent_type || 'dante-ri';
    console.log(`🤖 Usando agente: ${agentType}`);
    
    console.log('🚀 Enviando mensagem para Langflow...', {
      session_id: params.session_id,
      input: params.input_value,
      agent: agentType
    });

    // Obter variáveis de ambiente do Langflow
    const langflowUrl = import.meta.env.VITE_LANGFLOW_URL;
    
    // ✅ NOVO: Selecionar Flow ID baseado no agente
    const langflowFlowId = agentType === 'dante-notas' 
      ? import.meta.env.VITE_LANGFLOW_FLOW_ID_NOTAS
      : import.meta.env.VITE_LANGFLOW_FLOW_ID_RI;
    
    const langflowApiKey = import.meta.env.VITE_LANGFLOW_API_KEY;
    
    console.log(`📡 Flow ID selecionado (${agentType}): ${langflowFlowId?.slice(0, 8)}...`);

    if (!langflowUrl || !langflowFlowId) {
      throw new Error(`Variáveis de ambiente do Langflow (${agentType}) não configuradas`);
    }

    // API Key é opcional - apenas avisa se não estiver presente
    if (!langflowApiKey) {
      console.warn('⚠️ VITE_LANGFLOW_API_KEY não encontrada - continuando sem autenticação');
    }

    // Criar payload para Langflow (formato exato do exemplo fornecido)
    const payload = {
      "input_value": params.input_value,
      "output_type": "chat",
      "input_type": "chat",
      "session_id": params.session_id
    };

    // Construir URL completa
    const fullUrl = langflowUrl.endsWith('/')
      ? `${langflowUrl}api/v1/run/${langflowFlowId}`
      : `${langflowUrl}/api/v1/run/${langflowFlowId}`;

    console.log('📡 Chamando Langflow:', fullUrl);
    console.log('📦 Payload enviado:', JSON.stringify(payload, null, 2));
    if (langflowApiKey) {
      console.log('🔑 API Key (primeiros 10 chars):', langflowApiKey.substring(0, 10) + '...');
    }
    console.log('🔍 Verificações:');
    console.log('  - URL válida:', /^https?:\/\/.+/.test(fullUrl));
    console.log('  - Flow ID válido:', /^[a-f0-9-]{36}$/.test(langflowFlowId));
    if (langflowApiKey) {
      console.log('  - API Key válida:', /^sk-.+/.test(langflowApiKey));
    }

    // Fazer requisição para Langflow (com autenticação se disponível)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (langflowApiKey) {
      headers['x-api-key'] = langflowApiKey;
    }

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Tentar obter detalhes do erro do corpo da resposta
      let errorDetails = '';
      try {
        const errorBody = await response.text();
        errorDetails = errorBody ? ` - Detalhes: ${errorBody}` : '';
      } catch (e) {
        errorDetails = ' - Não foi possível obter detalhes do erro';
      }
      throw new Error(`Erro na requisição Langflow: ${response.status} - ${response.statusText}${errorDetails}`);
    }

    // Obter resposta do Langflow
    const responseData: LangflowResponse = await response.json();
    console.log('📥 Resposta bruta do Langflow recebida');

    // Tratamento unificado da resposta
    let treatedResponse = '';

    if (responseData.outputs?.[0]?.outputs?.[0]) {
      const output = responseData.outputs[0].outputs[0];

      treatedResponse =
        output.outputs?.message?.message ||
        output.artifacts?.message ||
        output.results?.message?.text ||
        output.messages?.[0]?.message ||
        'Resposta do Langflow recebida, mas estrutura não reconhecida.';
    } else {
      treatedResponse =
        responseData.result ||
        responseData.message ||
        'Resposta do Langflow recebida, mas formato não reconhecido.';
    }

    console.log('✅ Resposta tratada do Langflow');

    return {
      success: true,
      response: treatedResponse,
    };
  } catch (error: any) {
    console.error('❌ Erro ao chamar Langflow:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}


