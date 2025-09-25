import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Brain, CheckCircle } from 'lucide-react';

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

export default function EmailConfirmationModal({ isOpen, onClose, onOpenLogin }: EmailConfirmationModalProps) {
  const handleLoginClick = () => {
    onClose();
    onOpenLogin();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-500 rounded-xl">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-neutral-900">
            ✅ Email Verificado!
          </DialogTitle>
          <p className="text-sm text-neutral-600 mt-2">
            Sua conta foi ativada com sucesso
          </p>
        </DialogHeader>

        <div className="text-center space-y-4 mt-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium mb-2">
              🎉 Seja bem-vindo ao Dante AI!
            </p>
            <p className="text-green-700 text-sm">
              Sua conta foi ativada com sucesso. Agora você pode fazer login 
              usando suas credenciais para acessar o Dante AI.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Brain className="h-6 w-6 text-orange-600" />
            </div>
          </div>

          <Button
            onClick={handleLoginClick}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Fazer Login Agora
          </Button>

          <p className="text-xs text-neutral-500">
            Você já pode começar a usar o Dante AI - IA especializada em Registro de Imóveis
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}