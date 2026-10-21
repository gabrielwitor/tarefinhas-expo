import type { Tarefa, TarefaLocal } from '@/models/Tarefa';

/**
 * Decide se a versão da nuvem deve substituir a local ao baixar dados.
 * - Sem cópia local, ou cópia já sincronizada: a nuvem é a fonte da verdade.
 * - Cópia local com alterações pendentes: vence a edição mais recente.
 */
export function deveUsarRemota(local: TarefaLocal | undefined, remota: Tarefa): boolean {
  if (!local || local.syncStatus === 'sincronizada') return true;
  return remota.atualizadoEm > local.atualizadoEm;
}

/** Rejeita a promessa se ela demorar demais (o Firestore espera a rede indefinidamente). */
export function comTimeout<T>(promessa: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promessa.then(
      (valor) => {
        clearTimeout(timer);
        resolve(valor);
      },
      (erro) => {
        clearTimeout(timer);
        reject(erro);
      },
    );
  });
}
