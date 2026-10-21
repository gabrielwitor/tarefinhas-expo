import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { espaco } from '@/theme';

/** Container das telas com formulário: rola e não fica escondido atrás do teclado. */
export function TelaFormulario({ children }: PropsWithChildren) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.flex}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  conteudo: { padding: espaco.md, gap: espaco.md },
});
