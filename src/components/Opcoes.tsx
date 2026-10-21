import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTema } from '@/hooks/useTema';
import { espaco, fonte, raio } from '@/theme';

interface Props<T extends string> {
  rotulo?: string;
  opcoes: { valor: T; rotulo: string }[];
  valor: T;
  onChange: (valor: T) => void;
}

/** Botões de escolha única (segmented control). */
export function Opcoes<T extends string>({ rotulo, opcoes, valor, onChange }: Props<T>) {
  const cores = useTema();
  return (
    <View style={styles.container}>
      {rotulo && <Text style={[styles.rotulo, { color: cores.textoSecundario }]}>{rotulo}</Text>}
      <View accessibilityRole="radiogroup" style={[styles.grupo, { borderColor: cores.borda }]}>
        {opcoes.map((opcao) => {
          const ativa = opcao.valor === valor;
          return (
            <Pressable
              key={opcao.valor}
              accessibilityRole="radio"
              accessibilityState={{ selected: ativa }}
              onPress={() => onChange(opcao.valor)}
              style={[styles.opcao, ativa && { backgroundColor: cores.primaria }]}
            >
              <Text
                style={[styles.texto, { color: ativa ? cores.textoSobrePrimaria : cores.texto }]}
              >
                {opcao.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: espaco.xs },
  rotulo: { fontSize: fonte.pequena, fontWeight: '600' },
  grupo: { flexDirection: 'row', borderWidth: 1, borderRadius: raio, overflow: 'hidden' },
  opcao: { flex: 1, paddingVertical: espaco.sm, alignItems: 'center' },
  texto: { fontSize: fonte.pequena, fontWeight: '600' },
});
