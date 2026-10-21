import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Carregando } from '@/components/Carregando';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { PreferenciasProvider, usePreferencias } from '@/contexts/PreferenciasContext';
import { useTema } from '@/hooks/useTema';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PreferenciasProvider>
        <AuthProvider>
          <Navegacao />
        </AuthProvider>
      </PreferenciasProvider>
    </SafeAreaProvider>
  );
}

/** Telas internas só existem com usuário logado (autorização no lado do app). */
function Navegacao() {
  const { usuario, carregando } = useAuth();
  const prefs = usePreferencias();
  const cores = useTema();

  if (carregando || prefs.carregando) return <Carregando />;

  return (
    <>
      <StatusBar style={cores.escuro ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: cores.fundo } }}>
        <Stack.Protected guard={!!usuario}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!usuario}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
