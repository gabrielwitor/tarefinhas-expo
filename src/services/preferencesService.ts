import AsyncStorage from '@react-native-async-storage/async-storage';

import { PREFERENCIAS_PADRAO, type Preferencias } from '@/models/Preferencias';

// AsyncStorage é o equivalente do SharedPreferences: pares chave/valor em texto, sem criptografia.
// Por isso guardamos aqui só preferências pequenas — nunca senha ou token.
const PREFIXO = '@pref/';
const CHAVES = Object.keys(PREFERENCIAS_PADRAO) as (keyof Preferencias)[];

export async function carregarPreferencias(): Promise<Preferencias> {
  const pares = await AsyncStorage.multiGet(CHAVES.map((c) => PREFIXO + c));
  const salvas = Object.fromEntries(
    pares
      .filter(([, valor]) => valor !== null)
      .map(([chave, valor]) => [chave.slice(PREFIXO.length), valor]),
  );
  return { ...PREFERENCIAS_PADRAO, ...salvas };
}

export async function salvarPreferencia<K extends keyof Preferencias>(
  chave: K,
  valor: Preferencias[K],
) {
  await AsyncStorage.setItem(PREFIXO + chave, valor);
}
