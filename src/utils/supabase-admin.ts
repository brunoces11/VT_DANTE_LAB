import { createClient } from '@supabase/supabase-js';

// Função para testar conexão e listar Edge Functions
export async function testSupabaseConnection() {
  try {
    // Verificar se as variáveis de ambiente estão disponíveis
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    console.log('🔍 Verificando variáveis de ambiente...');
    console.log('SUPABASE_URL:', supabaseUrl ? '✅ Definida' : '❌ Não encontrada');
    console.log('SERVICE_ROLE_KEY:', serviceRoleKey ? '✅ Definida' : '❌ Não encontrada');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Variáveis de ambiente não encontradas no .env');
    }

    // Criar cliente com Service Role Key
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('🚀 Cliente Supabase Admin criado com sucesso');

    // Testar conexão básica
    console.log('🔗 Testando conexão básica...');
    const { data: healthCheck, error: healthError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);

    if (healthError) {
      console.error('❌ Erro na conexão básica:', healthError);
      throw healthError;
    }

    console.log('✅ Conexão básica estabelecida com sucesso');

    // Tentar listar Edge Functions via API REST
    console.log('📋 Listando Edge Functions...');
    
    const functionsResponse = await fetch(`${supabaseUrl}/functions/v1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Status da resposta:', functionsResponse.status);
    
    if (!functionsResponse.ok) {
      console.log('⚠️ Método direto falhou, tentando abordagem alternativa...');
      
      // Abordagem alternativa: verificar funções conhecidas
      const knownFunctions = ['DT_LOGIN_NEW_SESSION', 'single_session'];
      const functionResults = [];

      for (const funcName of knownFunctions) {
        try {
          console.log(`🔍 Verificando função: ${funcName}`);
          
          const testResponse = await fetch(`${supabaseUrl}/functions/v1/${funcName}`, {
            method: 'OPTIONS', // Usar OPTIONS para não executar a função
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
            },
          });

          functionResults.push({
            name: funcName,
            exists: testResponse.status !== 404,
            status: testResponse.status,
            statusText: testResponse.statusText
          });

        } catch (error) {
          functionResults.push({
            name: funcName,
            exists: false,
            error: error.message
          });
        }
      }

      return {
        success: true,
        connection: 'OK',
        functions: functionResults,
        message: 'Conexão estabelecida. Funções verificadas individualmente.'
      };
    }

    const functionsData = await functionsResponse.json();
    
    return {
      success: true,
      connection: 'OK',
      functions: functionsData,
      message: 'Conexão e listagem de funções bem-sucedidas'
    };

  } catch (error) {
    console.error('❌ Erro no teste de conexão:', error);
    return {
      success: false,
      error: error.message,
      message: 'Falha na conexão ou listagem'
    };
  }
}

// Função para obter o código de uma Edge Function específica
export async function getEdgeFunctionCode(functionName: string) {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Credenciais não encontradas');
    }

    console.log(`📄 Tentando obter código da função: ${functionName}`);

    // Tentar diferentes endpoints para obter o código
    const endpoints = [
      `/functions/v1/${functionName}/source`,
      `/functions/v1/${functionName}/code`,
      `/functions/v1/${functionName}`,
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${supabaseUrl}${endpoint}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.text();
          return {
            success: true,
            functionName,
            code: data,
            endpoint: endpoint
          };
        }
      } catch (error) {
        console.log(`Endpoint ${endpoint} falhou:`, error.message);
      }
    }

    return {
      success: false,
      functionName,
      error: 'Não foi possível obter o código da função através da API'
    };

  } catch (error) {
    return {
      success: false,
      functionName,
      error: error.message
    };
  }
}