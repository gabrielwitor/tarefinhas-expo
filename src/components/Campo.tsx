import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { useTema } from '@/hooks/useTema';
import { espaco, fonte, raio } from '@/theme';

interface Props extends TextInputProps {
  rotulo: string;
  erro?: string | null;
  /** Texto de apoio abaixo do campo (quando não há erro). */
  dica?: string | null;
}

export function Campo({ rotulo, erro, dica, style, ...props }: Props) {
  const cores = useTema();
  return (
    <View style={styles.container}>
      <Text style={[styles.rotulo, { color: cores.textoSecundario }]}>{rotulo}</Text>
      <TextInput
        accessibilityLabel={rotulo}
        placeholderTextColor={cores.textoSecundario}
        style={[
          styles.input,
          {
            color: cores.texto,
            backgroundColor: cores.superficie,
            borderColor: erro ? cores.perigo : cores.borda,
          },
          style,
        ]}
        {...props}
      />
      {erro ? (
        <Text style={[styles.ajuda, { color: cores.perigo }]}>{erro}</Text>
      ) : dica ? (
        <Text style={[styles.ajuda, { color: cores.aviso }]}>{dica}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: espaco.xs },
  rotulo: { fontSize: fonte.pequena, fontWeight: '600' },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: raio,
    paddingHorizontal: espaco.md,
    paddingVertical: espaco.sm,
    fontSize: fonte.normal,
  },
  ajuda: { fontSize: fonte.pequena },
});
