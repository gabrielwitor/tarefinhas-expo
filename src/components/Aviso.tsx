import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTema } from '@/hooks/useTema';
import { espaco, fonte, raio } from '@/theme';

interface Props {
  texto: string;
  tipo?: 'info' | 'erro' | 'sucesso';
  /** Mostra um botão "Tentar de novo". */
  onTentarNovamente?: () => void;
}

/** Faixa de mensagem: erros, modo offline, confirmações. */
export function Aviso({ texto, tipo = 'info', onTentarNovamente }: Props) {
  const cores = useTema();
  const cor = { info: cores.aviso, erro: cores.perigo, sucesso: cores.sucesso }[tipo];
  return (
    <View
      accessibilityRole={tipo === 'erro' ? 'alert' : 'text'}
      style={[styles.container, { borderColor: cor }]}
    >
      <Text style={[styles.texto, { color: cor }]}>{texto}</Text>
      {onTentarNovamente && (
        <Pressable accessibilityRole="button" onPress={onTentarNovamente} hitSlop={8}>
          <Text style={[styles.acao, { color: cor }]}>Tentar de novo</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    borderWidth: 1,
    borderRadius: raio,
    padding: espaco.sm,
  },
  texto: { flex: 1, fontSize: fonte.pequena },
  acao: { fontSize: fonte.pequena, fontWeight: '700' },
});
