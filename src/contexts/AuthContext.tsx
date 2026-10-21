import { onAuthStateChanged, type User } from 'firebase/auth';
import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';

import { auth } from '@/config/firebase';
import * as authService from '@/services/authService';

interface ValorAuth {
  usuario: User | null;
  /** true até o Firebase dizer se há sessão salva. */
  carregando: boolean;
  entrar: typeof authService.entrar;
  cadastrar: typeof authService.cadastrar;
  sair: typeof authService.sair;
  recuperarSenha: typeof authService.recuperarSenha;
}

const AuthContext = createContext<ValorAuth | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUsuario(u);
        setCarregando(false);
      }),
    [],
  );

  return <AuthContext value={{ usuario, carregando, ...authService }}>{children}</AuthContext>;
}

export function useAuth() {
  const valor = use(AuthContext);
  if (!valor) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return valor;
}
