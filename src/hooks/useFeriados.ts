import { useEffect, useState } from 'react';

import type { Feriado } from '@/models/Feriado';
import { buscarFeriados } from '@/services/feriadosApi';

/** Feriados nacionais deste ano e do próximo (BrasilAPI). Lista vazia se a API falhar. */
export function useFeriados(): Feriado[] {
  const [feriados, setFeriados] = useState<Feriado[]>([]);

  useEffect(() => {
    const ano = new Date().getFullYear();
    Promise.all([buscarFeriados(ano), buscarFeriados(ano + 1)])
      .then((listas) => setFeriados(listas.flat()))
      .catch(() => {}); // recurso opcional: o app funciona sem ele
  }, []);

  return feriados;
}
