import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';

import { db } from '@/config/firebase';
import type { Tarefa } from '@/models/Tarefa';

// Acesso à coleção principal do Firestore. Cada documento tem o campo `userId`,
// e as consultas sempre filtram por ele (as regras do Firestore garantem isso no servidor).
const colecao = collection(db, 'tarefas');

/** Gera um ID de documento sem acessar a rede (funciona offline). */
export const novoId = () => doc(colecao).id;

export async function listar(userId: string): Promise<Tarefa[]> {
  const resultado = await getDocs(query(colecao, where('userId', '==', userId)));
  return resultado.docs.map((d) => ({ ...(d.data() as Omit<Tarefa, 'id'>), id: d.id }));
}

/** Cria ou atualiza (setDoc é um "upsert"). */
export async function salvar({ id, ...dados }: Tarefa) {
  await setDoc(doc(colecao, id), dados);
}

export async function excluir(id: string) {
  await deleteDoc(doc(colecao, id));
}
