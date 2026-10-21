import * as SQLite from 'expo-sqlite';

import type { SyncStatus, Tarefa, TarefaLocal } from '@/models/Tarefa';

// Banco SQLite do aparelho: cópia das tarefas para uso offline e fila de sincronização
// (coluna sync_status). As telas leem sempre daqui; o syncService conversa com o Firestore.

interface Linha {
  id: string;
  user_id: string;
  titulo: string;
  descricao: string;
  concluida: number; // SQLite não tem booleano: 0 ou 1
  prioridade: Tarefa['prioridade'];
  data_limite: string | null;
  criado_em: number;
  atualizado_em: number;
  sync_status: SyncStatus;
}

const VERSAO_SCHEMA = 1;
let conexao: Promise<SQLite.SQLiteDatabase> | null = null;

function abrir() {
  conexao ??= SQLite.openDatabaseAsync('tarefinhas.db').then(async (db) => {
    const { user_version } = (await db.getFirstAsync<{ user_version: number }>(
      'PRAGMA user_version',
    ))!;
    if (user_version < 1) {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS tarefas (
          id            TEXT PRIMARY KEY NOT NULL,
          user_id       TEXT NOT NULL,
          titulo        TEXT NOT NULL,
          descricao     TEXT NOT NULL DEFAULT '',
          concluida     INTEGER NOT NULL DEFAULT 0,
          prioridade    TEXT NOT NULL DEFAULT 'media',
          data_limite   TEXT,
          criado_em     INTEGER NOT NULL,
          atualizado_em INTEGER NOT NULL,
          sync_status   TEXT NOT NULL DEFAULT 'pendente'
        );
        CREATE INDEX IF NOT EXISTS idx_tarefas_user ON tarefas (user_id);
      `);
    }
    await db.execAsync(`PRAGMA user_version = ${VERSAO_SCHEMA}`);
    return db;
  });
  return conexao;
}

const paraTarefa = (l: Linha): TarefaLocal => ({
  id: l.id,
  userId: l.user_id,
  titulo: l.titulo,
  descricao: l.descricao,
  concluida: l.concluida === 1,
  prioridade: l.prioridade,
  dataLimite: l.data_limite,
  criadoEm: l.criado_em,
  atualizadoEm: l.atualizado_em,
  syncStatus: l.sync_status,
});

const paraParametros = (t: TarefaLocal) => [
  t.id,
  t.userId,
  t.titulo,
  t.descricao,
  t.concluida ? 1 : 0,
  t.prioridade,
  t.dataLimite,
  t.criadoEm,
  t.atualizadoEm,
  t.syncStatus,
];

// ---- Create ----
export async function inserir(tarefa: TarefaLocal) {
  const db = await abrir();
  await db.runAsync(
    `INSERT INTO tarefas (id, user_id, titulo, descricao, concluida, prioridade,
       data_limite, criado_em, atualizado_em, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    paraParametros(tarefa),
  );
}

/** Insere ou substitui (usado ao baixar dados da nuvem). */
export async function salvar(tarefa: TarefaLocal) {
  const db = await abrir();
  await db.runAsync(
    `INSERT OR REPLACE INTO tarefas (id, user_id, titulo, descricao, concluida, prioridade,
       data_limite, criado_em, atualizado_em, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    paraParametros(tarefa),
  );
}

// ---- Read ----
/** Tarefas visíveis do usuário (as marcadas para exclusão ficam de fora). */
export async function listar(userId: string): Promise<TarefaLocal[]> {
  const db = await abrir();
  const linhas = await db.getAllAsync<Linha>(
    `SELECT * FROM tarefas WHERE user_id = ? AND sync_status != 'excluida'`,
    userId,
  );
  return linhas.map(paraTarefa);
}

/** Todas as linhas do usuário, inclusive as marcadas para exclusão (usado no sync). */
export async function listarTodas(userId: string): Promise<TarefaLocal[]> {
  const db = await abrir();
  const linhas = await db.getAllAsync<Linha>('SELECT * FROM tarefas WHERE user_id = ?', userId);
  return linhas.map(paraTarefa);
}

/** Tarefas que ainda precisam ser enviadas ao Firestore. */
export async function listarPendentes(userId: string): Promise<TarefaLocal[]> {
  const db = await abrir();
  const linhas = await db.getAllAsync<Linha>(
    `SELECT * FROM tarefas WHERE user_id = ? AND sync_status != 'sincronizada'`,
    userId,
  );
  return linhas.map(paraTarefa);
}

// ---- Update ----
export async function atualizar(tarefa: TarefaLocal) {
  const db = await abrir();
  await db.runAsync(
    `UPDATE tarefas SET titulo = ?, descricao = ?, concluida = ?, prioridade = ?,
       data_limite = ?, atualizado_em = ?, sync_status = ?
     WHERE id = ?`,
    tarefa.titulo,
    tarefa.descricao,
    tarefa.concluida ? 1 : 0,
    tarefa.prioridade,
    tarefa.dataLimite,
    tarefa.atualizadoEm,
    tarefa.syncStatus,
    tarefa.id,
  );
}

/**
 * Marca como sincronizada só se a tarefa não mudou durante o envio
 * (se o usuário editou nesse meio-tempo, ela continua pendente).
 */
export async function marcarSincronizada(id: string, atualizadoEm: number) {
  const db = await abrir();
  await db.runAsync(
    `UPDATE tarefas SET sync_status = 'sincronizada' WHERE id = ? AND atualizado_em = ?`,
    id,
    atualizadoEm,
  );
}

// ---- Delete ----
export async function apagar(id: string) {
  const db = await abrir();
  await db.runAsync('DELETE FROM tarefas WHERE id = ?', id);
}
