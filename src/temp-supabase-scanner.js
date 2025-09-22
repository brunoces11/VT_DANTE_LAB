// ARQUIVO TEMPORÁRIO - DELETAR APÓS USO
// Execute este código no console do navegador (F12) na página do seu app

(async function quickSupabaseScanner() {
  console.log('🔍 Iniciando scanner rápido do Supabase...');
  
  // Pegar variáveis do .env (assumindo que estão disponíveis)
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('❌ Variáveis de ambiente não encontradas');
    return;
  }
  
  console.log('✅ Credenciais encontradas');
  
  try {
    // 1. Testar conexão básica
    console.log('🔗 Testando conexão...');
    const testResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY
      }
    });
    
    console.log('✅ Conexão OK:', testResponse.status);
    
    // 2. Listar Edge Functions conhecidas
    console.log('📋 Verificando Edge Functions...');
    const knownFunctions = ['DT_LOGIN_NEW_SESSION', 'single_session'];
    const results = [];
    
    for (const funcName of knownFunctions) {
      try {
        const funcResponse = await fetch(`${SUPABASE_URL}/functions/v1/${funcName}`, {
          method: 'OPTIONS',
          headers: {
            'Authorization': `Bearer ${SERVICE_KEY}`
          }
        });
        
        results.push({
          name: funcName,
          exists: funcResponse.status !== 404,
          status: funcResponse.status
        });
        
        console.log(`📄 ${funcName}: ${funcResponse.status !== 404 ? '✅ Existe' : '❌ Não existe'}`);
        
      } catch (error) {
        results.push({
          name: funcName,
          exists: false,
          error: error.message
        });
      }
    }
    
    // 3. Tentar obter código das funções
    console.log('📝 Tentando obter códigos...');
    for (const func of results.filter(f => f.exists)) {
      try {
        // Tentar diferentes endpoints
        const endpoints = [
          `/functions/v1/${func.name}/source`,
          `/functions/v1/${func.name}`,
        ];
        
        for (const endpoint of endpoints) {
          try {
            const codeResponse = await fetch(`${SUPABASE_URL}${endpoint}`, {
              headers: {
                'Authorization': `Bearer ${SERVICE_KEY}`
              }
            });
            
            if (codeResponse.ok) {
              const code = await codeResponse.text();
              console.log(`\n📄 CÓDIGO DA FUNÇÃO: ${func.name}`);
              console.log('=' .repeat(50));
              console.log(code);
              console.log('=' .repeat(50));
              break;
            }
          } catch (e) {
            console.log(`⚠️ Endpoint ${endpoint} falhou para ${func.name}`);
          }
        }
      } catch (error) {
        console.log(`❌ Erro ao obter código de ${func.name}:`, error.message);
      }
    }
    
    // 4. Resumo final
    console.log('\n📊 RESUMO FINAL:');
    console.log('================');
    results.forEach(func => {
      console.log(`${func.name}: ${func.exists ? '✅ Disponível' : '❌ Não encontrada'}`);
    });
    
    return results;
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
})();