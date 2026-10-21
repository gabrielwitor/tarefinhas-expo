export type Prioridade = 'baixa' | 'media' | 'alta';

/** Estado da tarefa no banco local em relação ao Firestore. */
export type SyncStatus = 'sincronizada' | 'pendente' | 'excluida';

/** Documento salvo na coleção `tarefas` do Firestore. */
export interface Tarefa {
  id: string;
  userId: string;
  titulo: string;
  descricao: string;
  concluida: boolean;
  prioridade: Prioridade;
  /** Data no formato AAAA-MM-DD, ou null se não houver prazo. */
  dataLimite: string | null;
  criadoEm: number;
  atualizadoEm: number;
}

/** Linha da tabela `tarefas` no SQLite: a tarefa + controle de sincronização. */
export interface TarefaLocal extends Tarefa {
  syncStatus: SyncStatus;
}

/** Campos que o usuário preenche no formulário. */
export type DadosTarefa = Pick<Tarefa, 'titulo' | 'descricao' | 'prioridade' | 'dataLimite'>;
