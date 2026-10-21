import type { Feriado } from '@/models/Feriado';

const URL_BASE = 'https://brasilapi.com.br/api/feriados/v1';
const cache = new Map<number, Feriado[]>();

/** GET na API pública da BrasilAPI. Guarda em memória para não repetir a chamada. */
export async function buscarFeriados(ano: number): Promise<Feriado[]> {
  const emCache = cache.get(ano);
  if (emCache) return emCache;

  const resposta = await fetch(`${URL_BASE}/${ano}`);
  if (!resposta.ok) throw new Error(`BrasilAPI respondeu ${resposta.status}`);

  const feriados: Feriado[] = await resposta.json();
  cache.set(ano, feriados);
  return feriados;
}
