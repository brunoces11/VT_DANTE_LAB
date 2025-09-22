import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { testSupabaseConnection, getEdgeFunctionCode } from '@/utils/supabase-admin';
import { Loader2, Database, Code, CheckCircle, XCircle } from 'lucide-react';

export default function SupabaseTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [functionCodes, setFunctionCodes] = useState<any[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    setResult(null);
    setFunctionCodes([]);

    try {
      console.log('🚀 Iniciando teste de conexão...');
      const testResult = await testSupabaseConnection();
      setResult(testResult);

      if (testResult.success && testResult.functions) {
        setLoadingCodes(true);
        
        // Tentar obter código das funções encontradas
        const codes = [];
        const functionNames = testResult.functions.map((f: any) => f.name || f);
        
        for (const funcName of functionNames) {
          if (typeof funcName === 'string') {
            console.log(`📄 Obtendo código de: ${funcName}`);
            const codeResult = await getEdgeFunctionCode(funcName);
            codes.push(codeResult);
          }
        }
        
        setFunctionCodes(codes);
        setLoadingCodes(false);
      }

    } catch (error) {
      console.error('Erro no teste:', error);
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          Teste de Conexão Supabase Admin
        </h1>
        <p className="text-neutral-600 mb-6">
          Testando conexão com Service Role Key e listando Edge Functions
        </p>
        
        <Button 
          onClick={handleTest}
          disabled={testing || loadingCodes}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testando conexão...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Testar Conexão
            </>
          )}
        </Button>
      </div>

      {/* Resultado do teste */}
      {result && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <h3 className="text-lg font-semibold">
                {result.success ? 'Conexão Bem-sucedida' : 'Falha na Conexão'}
              </h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <p><strong>Status:</strong> {result.connection || 'Erro'}</p>
              <p><strong>Mensagem:</strong> {result.message}</p>
              
              {result.error && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mt-3">
                  <p className="text-red-600"><strong>Erro:</strong> {result.error}</p>
                </div>
              )}

              {result.functions && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Edge Functions Encontradas:</h4>
                  <div className="space-y-2">
                    {result.functions.map((func: any, index: number) => (
                      <div key={index} className="bg-neutral-50 rounded p-2">
                        <p><strong>Nome:</strong> {func.name || func}</p>
                        {func.exists !== undefined && (
                          <p><strong>Existe:</strong> {func.exists ? '✅ Sim' : '❌ Não'}</p>
                        )}
                        {func.status && (
                          <p><strong>Status HTTP:</strong> {func.status}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading de códigos */}
      {loadingCodes && (
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p>Obtendo código das Edge Functions...</p>
          </CardContent>
        </Card>
      )}

      {/* Códigos das funções */}
      {functionCodes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 flex items-center">
            <Code className="mr-2 h-5 w-5" />
            Códigos das Edge Functions
          </h2>
          
          {functionCodes.map((funcCode, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  {funcCode.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <h3 className="text-lg font-semibold">{funcCode.functionName}</h3>
                </div>

                {funcCode.success ? (
                  <div>
                    <p className="text-sm text-neutral-600 mb-2">
                      <strong>Endpoint usado:</strong> {funcCode.endpoint}
                    </p>
                    <div className="bg-neutral-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm whitespace-pre-wrap">
                        {funcCode.code}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-red-600">
                      <strong>Erro:</strong> {funcCode.error}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}