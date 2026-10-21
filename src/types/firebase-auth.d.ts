// No React Native, o Metro carrega a versão RN do @firebase/auth, que exporta
// getReactNativePersistence. Os tipos de "firebase/auth" só descrevem a versão web,
// então declaramos a função aqui para o TypeScript.
import type { Persistence, ReactNativeAsyncStorage } from 'firebase/auth';

declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: ReactNativeAsyncStorage): Persistence;
}
