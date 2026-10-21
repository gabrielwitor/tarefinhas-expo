import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTema } from '@/hooks/useTema';

export function Carregando() {
  const cores = useTema();
  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <ActivityIndicator size="large" color={cores.primaria} accessibilityLabel="Carregando" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
