import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';

import { PREFERENCIAS_PADRAO, type Preferencias } from '@/models/Preferencias';
import { carregarPreferencias, salvarPreferencia } from '@/services/preferencesService';

interface ValorPreferencias {
  preferencias: Preferencias;
  carregando: boolean;
  definir: <K extends keyof Preferencias>(chave: K, valor: Preferencias[K]) => void;
}

const PreferenciasContext = createContext<ValorPreferencias | null>(null);

/** Carrega as preferências do AsyncStorage ao abrir o app e as mantém em memória. */
export function PreferenciasProvider({ children }: PropsWithChildren) {
  const [preferencias, setPreferencias] = useState(PREFERENCIAS_PADRAO);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPreferencias()
      .then(setPreferencias)
      .catch(() => {}) // se falhar, seguimos com os valores padrão
      .finally(() => setCarregando(false));
  }, []);

  const definir: ValorPreferencias['definir'] = (chave, valor) => {
    setPreferencias((atual) => ({ ...atual, [chave]: valor }));
    salvarPreferencia(chave, valor).catch(() => {});
  };

  return (
    <PreferenciasContext value={{ preferencias, carregando, definir }}>
      {children}
    </PreferenciasContext>
  );
}

export function usePreferencias() {
  const valor = use(PreferenciasContext);
  if (!valor) throw new Error('usePreferencias precisa estar dentro de <PreferenciasProvider>');
  return valor;
}
