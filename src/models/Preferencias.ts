export type Tema = 'sistema' | 'claro' | 'escuro';
export type Filtro = 'todas' | 'pendentes' | 'concluidas';
export type Ordenacao = 'criadoEm' | 'dataLimite' | 'prioridade';

export interface Preferencias {
  ultimoEmail: string;
  tema: Tema;
  filtro: Filtro;
  ordenacao: Ordenacao;
}

export const PREFERENCIAS_PADRAO: Preferencias = {
  ultimoEmail: '',
  tema: 'sistema',
  filtro: 'todas',
  ordenacao: 'criadoEm',
};
