import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import { useAuth } from '@/contexts/AuthContext';
import type { DadosTarefa, TarefaLocal } from '@/models/Tarefa';
import * as sync from '@/services/syncService';
import * as local from '@/services/tarefasLocal';
import { novoId } from '@/services/tarefasRemote';
import { mensagemDeErro } from '@/utils/firebaseErros';

type Alteracoes = Partial<DadosTarefa & { concluida: boolean }>;

interface ValorTarefas {
  tarefas: TarefaLocal[];
  /** Primeira leitura do banco local. */
  carregando: boolean;
  /** Conversando com o Firestore. */
  sincronizando: boolean;
  online: boolean;
  erro: string | null;
  pendentes: number;
  criar: (dados: DadosTarefa) => Promise<void>;
  editar: (id: string, alteracoes: Alteracoes) => Promise<void>;
  excluir: (id: string) => Promise<void>;
  sincronizar: () => Promise<void>;
}

const TarefasContext = createContext<ValorTarefas | null>(null);

/**
 * Offline-first: toda escrita vai primeiro para o SQLite (marcada como pendente),
 * a tela atualiza na hora, e depois tentamos enviar ao Firestore.
 */
export function TarefasProvider({ children }: PropsWithChildren) {
  // Vazio só no instante do logout, antes de o guard desmontar estas telas.
  const userId = useAuth().usuario?.uid ?? '';
  const [tarefas, setTarefas] = useState<TarefaLocal[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);
  const [online, setOnline] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const emAndamento = useRef(false);
  const repetir = useRef(false);

  const recarregar = useCallback(async () => {
    setTarefas(await local.listar(userId));
  }, [userId]);

  const sincronizar = useCallback(async () => {
    // Evita duas sincronizações ao mesmo tempo; se pedirem outra, roda de novo no final.
    if (emAndamento.current) {
      repetir.current = true;
      return;
    }
    emAndamento.current = true;
    setSincronizando(true);
    try {
      do {
        repetir.current = false;
        if (await sync.sincronizar(userId)) setErro(null);
        await recarregar();
      } while (repetir.current);
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      emAndamento.current = false;
      setSincronizando(false);
    }
  }, [userId, recarregar]);

  useEffect(() => {
    if (!userId) return;
    local
      .listar(userId)
      .then(setTarefas)
      .catch((e) => setErro(mensagemDeErro(e)))
      .finally(() => setCarregando(false));
    // O NetInfo avisa o estado atual logo ao assinar, e de novo a cada mudança.
    return sync.observarConexao((estaOnline) => {
      setOnline(estaOnline);
      if (estaOnline) sincronizar();
    });
  }, [userId, sincronizar]);

  const gravar = async (operacao: Promise<void>) => {
    await operacao;
    await recarregar();
    sincronizar();
  };

  const criar = (dados: DadosTarefa) => {
    const agora = Date.now();
    return gravar(
      local.inserir({
        ...dados,
        id: novoId(),
        userId,
        concluida: false,
        criadoEm: agora,
        atualizadoEm: agora,
        syncStatus: 'pendente',
      }),
    );
  };

  const alterar = (id: string, alteracoes: Partial<TarefaLocal>) => {
    const atual = tarefas.find((t) => t.id === id);
    if (!atual) return Promise.resolve();
    return gravar(local.atualizar({ ...atual, ...alteracoes, atualizadoEm: Date.now() }));
  };

  const valor: ValorTarefas = {
    tarefas,
    carregando,
    sincronizando,
    online,
    erro,
    pendentes: tarefas.filter((t) => t.syncStatus !== 'sincronizada').length,
    criar,
    editar: (id, alteracoes) => alterar(id, { ...alteracoes, syncStatus: 'pendente' }),
    // Não apaga na hora: marca para o sync excluir no Firestore e depois remover a linha.
    excluir: (id) => alterar(id, { syncStatus: 'excluida' }),
    sincronizar,
  };

  return <TarefasContext value={valor}>{children}</TarefasContext>;
}

export function useTarefas() {
  const valor = use(TarefasContext);
  if (!valor) throw new Error('useTarefas precisa estar dentro de <TarefasProvider>');
  return valor;
}
