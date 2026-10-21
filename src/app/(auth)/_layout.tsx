import { Stack } from 'expo-router';

import { useTema } from '@/hooks/useTema';
import { opcoesDoStack } from '@/theme';

export default function AuthLayout() {
  const cores = useTema();
  return (
    <Stack screenOptions={opcoesDoStack(cores)}>
      <Stack.Screen name="login" options={{ title: 'Entrar' }} />
      <Stack.Screen name="cadastro" options={{ title: 'Criar conta' }} />
      <Stack.Screen name="recuperar-senha" options={{ title: 'Recuperar senha' }} />
    </Stack>
  );
}
