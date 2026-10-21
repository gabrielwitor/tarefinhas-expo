import { Stack } from 'expo-router';

import { TarefasProvider } from '@/contexts/TarefasContext';
import { useTema } from '@/hooks/useTema';
import { opcoesDoStack } from '@/theme';

export default function AppLayout() {
  const cores = useTema();
  return (
    <TarefasProvider>
      <Stack screenOptions={opcoesDoStack(cores)}>
        <Stack.Screen name="index" options={{ title: 'Minhas tarefas' }} />
        <Stack.Screen name="tarefa/[id]" options={{ title: 'Tarefa' }} />
        <Stack.Screen name="configuracoes" options={{ title: 'Configurações' }} />
      </Stack>
    </TarefasProvider>
  );
}
