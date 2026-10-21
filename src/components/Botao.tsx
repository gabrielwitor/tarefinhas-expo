import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { useTema } from '@/hooks/useTema';
import { espaco, fonte, raio } from '@/theme';

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'perigo' | 'link';
  carregando?: boolean;
  desabilitado?: boolean;
}

export function Botao({ titulo, onPress, variante = 'primario', carregando, desabilitado }: Props) {
  const cores = useTema();
  const inativo = desabilitado || carregando;
  const corTexto = {
    primario: cores.textoSobrePrimaria,
    secundario: cores.primaria,
    perigo: cores.perigo,
    link: cores.primaria,
  }[variante];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inativo, busy: carregando }}
      onPress={onPress}
      disabled={inativo}
      style={({ pressed }) => [
        styles.base,
        variante === 'primario' && { backgroundColor: cores.primaria },
        (variante === 'secundario' || variante === 'perigo') && {
          borderWidth: 1,
          borderColor: corTexto,
        },
        variante === 'link' && styles.link,
        (pressed || inativo) && styles.apagado,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <Text style={[styles.texto, { color: corTexto }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: raio,
    paddingHorizontal: espaco.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: { minHeight: 40 },
  apagado: { opacity: 0.6 },
  texto: { fontSize: fonte.normal, fontWeight: '600' },
});
