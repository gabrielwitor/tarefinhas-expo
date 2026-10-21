import NetInfo from '@react-native-community/netinfo';

import type { TarefaLocal } from '@/models/Tarefa';
import * as local from '@/services/tarefasLocal';
import * as remoto from '@/services/tarefasRemote';
import { comTimeout, deveUsarRemota } from '@/utils/sync';

// Sincronização entre o SQLite (aparelho) e o Firestore (nuvem):
// 1. envia o que ficou pendente offline; 2. baixa a versão atual da nuvem.

const TEMPO_LIMITE_MS = 15_000;

export async function estaOnline(): Promise<boolean> {
  const estado = await NetInfo.fetch();
  return estado.isConnected === true && estado.isInternetReachable !== false;
}

/** Observa a conexão; o callback recebe true/false a cada mudança. */
export function observarConexao(callback: (online: boolean) => void) {
  return NetInfo.addEventListener((estado) =>
    callback(estado.isConnected === true && estado.isInternetReachable !== false),
  );
}

const semControle = ({ syncStatus: _, ...tarefa }: TarefaLocal) => tarefa;

async function enviarPendentes(userId: string) {
  for (const tarefa of await local.listarPendentes(userId)) {
    if (tarefa.syncStatus === 'excluida') {
      await comTimeout(remoto.excluir(tarefa.id), TEMPO_LIMITE_MS);
      await local.apagar(tarefa.id);
    } else {
      await comTimeout(remoto.salvar(semControle(tarefa)), TEMPO_LIMITE_MS);
      await local.marcarSincronizada(tarefa.id, tarefa.atualizadoEm);
    }
  }
}

async function baixarDaNuvem(userId: string) {
  const remotas = await comTimeout(remoto.listar(userId), TEMPO_LIMITE_MS);
  const locais = new Map((await local.listarTodas(userId)).map((t) => [t.id, t]));

  for (const remota of remotas) {
    if (deveUsarRemota(locais.get(remota.id), remota)) {
      await local.salvar({ ...remota, syncStatus: 'sincronizada' });
    }
  }

  // Excluída na nuvem (por outro aparelho): some também daqui, se não houver edição local.
  const idsRemotos = new Set(remotas.map((t) => t.id));
  for (const tarefa of locais.values()) {
    if (tarefa.syncStatus === 'sincronizada' && !idsRemotos.has(tarefa.id)) {
      await local.apagar(tarefa.id);
    }
  }
}

/** Retorna false se estiver offline (nada foi feito). Lança erro se a nuvem falhar. */
export async function sincronizar(userId: string): Promise<boolean> {
  if (!(await estaOnline())) return false;
  await enviarPendentes(userId);
  await baixarDaNuvem(userId);
  return true;
}
