import { Toast } from 'primereact/toast';
import 'primeicons/primeicons.css';
import './toast.css';
import type { RefObject } from 'react';

interface ToastMessage {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail: string;
}

export const showToast = (toastRef: RefObject<Toast | null>, message: ToastMessage) => {
  toastRef.current?.show({
    severity: message.severity,
    summary: message.summary,
    detail: message.detail,
    life: 3000,
    closable: false
  });
};

export const ToastMessages = {
  generic: {
    error: {
      severity: 'error' as const,
      summary: 'Erro',
      detail: 'Ocorreu um erro inesperado. Tente novamente.',
    },
  },
  justificativa: {
    saved: {
      severity: 'success' as const,
      summary: 'Sucesso',
      detail: 'Justificativa salva com sucesso.',
    },
    required: {
      severity: 'warn' as const,
      summary: 'Atenção',
      detail: 'A justificativa é obrigatória para máquinas inativas.',
    },
    cancelled: {
      severity: 'info' as const,
      summary: 'Cancelado',
      detail: 'Alteração de status cancelada.',
    },
    missing: {
      severity: 'error' as const,
      summary: 'Erro',
      detail: 'É necessário informar a justificativa para máquinas inativas.',
    },
  },
  maquina: {
    updated: {
      severity: 'success' as const,
      summary: 'Máquina atualizada',
      detail: 'Alterações salvas.',
    },
    created: {
      severity: 'success' as const,
      summary: 'Máquina adicionada',
      detail: 'Registro criado com sucesso.',
    },
  },
  manutencao: {
    updated: {
      severity: 'success' as const,
      summary: 'Manutenção atualizada',
      detail: 'Alterações salvas.',
    },
    created: {
      severity: 'success' as const,
      summary: 'Manutenção criada',
      detail: 'Registro criado com sucesso.',
    },
  },
  validation: {
    requiredFields: {
      severity: 'warn' as const,
      summary: 'Campos obrigatórios',
      detail: 'Preencha os campos obrigatórios.',
    },
  },
};

export { Toast };
