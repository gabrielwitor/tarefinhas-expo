import { describe, expect, it } from '@jest/globals';

import type { Tarefa } from '@/models/Tarefa';
import { filtrarEOrdenar, hojeIso, proximoFeriado } from '@/utils/tarefas';

const t = (id: string, extra: Partial<Tarefa>): Tarefa => ({
  id,
  userId: 'u1',
  titulo: id,
  descricao: '',
  concluida: false,
  prioridade: 'media',
  dataLimite: null,
  criadoEm: 0,
  atualizadoEm: 0,
  ...extra,
});

const lista = [
  t('a', { prioridade: 'baixa', criadoEm: 1, dataLimite: '2026-12-01' }),
  t('b', { prioridade: 'alta', criadoEm: 2, concluida: true }),
  t('c', { prioridade: 'media', criadoEm: 3, dataLimite: '2026-11-01' }),
];

const ids = (ts: Tarefa[]) => ts.map((x) => x.id);

describe('filtrarEOrdenar', () => {
  it('filtra por status', () => {
    expect(ids(filtrarEOrdenar(lista, 'concluidas', 'criadoEm'))).toEqual(['b']);
    expect(ids(filtrarEOrdenar(lista, 'pendentes', 'criadoEm'))).toEqual(['c', 'a']);
  });

  it('ordena por prioridade e por prazo (sem prazo no fim)', () => {
    expect(ids(filtrarEOrdenar(lista, 'todas', 'prioridade'))).toEqual(['b', 'c', 'a']);
    expect(ids(filtrarEOrdenar(lista, 'todas', 'dataLimite'))).toEqual(['c', 'a', 'b']);
  });
});

describe('feriados', () => {
  it('encontra o próximo feriado a partir de hoje', () => {
    const feriados = [
      { date: '2026-12-25', name: 'Natal', type: 'national' },
      { date: '2026-11-02', name: 'Finados', type: 'national' },
      { date: '2026-10-12', name: 'Nossa Senhora Aparecida', type: 'national' },
    ];
    expect(hojeIso(new Date(2026, 9, 20))).toBe('2026-10-20');
    expect(proximoFeriado(feriados, '2026-10-20')?.name).toBe('Finados');
  });
});
