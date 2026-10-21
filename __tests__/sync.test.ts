import { describe, expect, it } from '@jest/globals';

import type { Tarefa, TarefaLocal } from '@/models/Tarefa';
import { comTimeout, deveUsarRemota } from '@/utils/sync';

const base: Tarefa = {
  id: '1',
  userId: 'u1',
  titulo: 'Tarefa',
  descricao: '',
  concluida: false,
  prioridade: 'media',
  dataLimite: null,
  criadoEm: 100,
  atualizadoEm: 100,
};

describe('deveUsarRemota', () => {
  it('usa a nuvem quando não há cópia local ou ela já está sincronizada', () => {
    expect(deveUsarRemota(undefined, base)).toBe(true);
    const local: TarefaLocal = { ...base, atualizadoEm: 999, syncStatus: 'sincronizada' };
    expect(deveUsarRemota(local, base)).toBe(true);
  });

  it('com edição pendente, vence a versão mais recente', () => {
    const local: TarefaLocal = { ...base, atualizadoEm: 200, syncStatus: 'pendente' };
    expect(deveUsarRemota(local, { ...base, atualizadoEm: 150 })).toBe(false);
    expect(deveUsarRemota(local, { ...base, atualizadoEm: 300 })).toBe(true);
  });
});

describe('comTimeout', () => {
  it('resolve normalmente e rejeita quando estoura o tempo', async () => {
    await expect(comTimeout(Promise.resolve(1), 50)).resolves.toBe(1);
    await expect(comTimeout(new Promise(() => {}), 10)).rejects.toThrow('timeout');
  });
});
