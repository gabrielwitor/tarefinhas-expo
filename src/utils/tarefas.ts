import type { Feriado } from '@/models/Feriado';
import type { Filtro, Ordenacao } from '@/models/Preferencias';
import type { Prioridade, Tarefa } from '@/models/Tarefa';

const PESO: Record<Prioridade, number> = { alta: 0, media: 1, baixa: 2 };

/** Aplica o filtro e a ordenação escolhidos (preferências salvas no AsyncStorage). */
export function filtrarEOrdenar<T extends Tarefa>(
  tarefas: T[],
  filtro: Filtro,
  ordem: Ordenacao,
): T[] {
  const filtradas = tarefas.filter((t) =>
    filtro === 'todas' ? true : filtro === 'concluidas' ? t.concluida : !t.concluida,
  );
  return filtradas.sort((a, b) => {
    if (ordem === 'prioridade') return PESO[a.prioridade] - PESO[b.prioridade];
    if (ordem === 'dataLimite') {
      // Sem prazo vai para o fim.
      return (a.dataLimite ?? '9999').localeCompare(b.dataLimite ?? '9999');
    }
    return b.criadoEm - a.criadoEm; // mais recentes primeiro
  });
}

/** Data de hoje em AAAA-MM-DD, no fuso do aparelho. */
export function hojeIso(agora = new Date()): string {
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

export function proximoFeriado(feriados: Feriado[], hoje: string): Feriado | undefined {
  return feriados.filter((f) => f.date >= hoje).sort((a, b) => a.date.localeCompare(b.date))[0];
}
