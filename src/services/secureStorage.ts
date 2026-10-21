import * as SecureStore from 'expo-secure-store';

// O SecureStore só aceita chaves com letras, números, ".", "-" e "_".
// O Firebase usa chaves como "firebase:authUser:KEY:[DEFAULT]", então trocamos o resto por "_".
const chaveValida = (chave: string) => chave.replace(/[^\w.-]/g, '_');

/** Adaptador com a interface que a persistência do Firebase Auth espera. */
export const secureStorage = {
  getItem: (chave: string) => SecureStore.getItemAsync(chaveValida(chave)),
  setItem: (chave: string, valor: string) => SecureStore.setItemAsync(chaveValida(chave), valor),
  removeItem: (chave: string) => SecureStore.deleteItemAsync(chaveValida(chave)),
};
