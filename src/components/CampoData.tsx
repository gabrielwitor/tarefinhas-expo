import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Botao } from '@/components/Botao';
import { useTema } from '@/hooks/useTema';
import { espaco, fonte, raio } from '@/theme';
import { dataParaIso, isoParaData, paraDataBr } from '@/utils/validacao';

interface Props {
  rotulo: string;
  /** Data no formato AAAA-MM-DD, ou null sem data. */
  valor: string | null;
  onChange: (valor: string | null) => void;
  /** Texto de apoio abaixo do campo. */
  dica?: string | null;
}

/** Data opcional escolhida no seletor nativo (compacto no iOS, diálogo no Android). */
export function CampoData({ rotulo, valor, onChange, dica }: Props) {
  const cores = useTema();

  function abrirNoAndroid() {
    DateTimePickerAndroid.open({
      value: valor ? isoParaData(valor) : new Date(),
      mode: 'date',
      onValueChange: (_evento, data) => onChange(dataParaIso(data)),
    });
  }

  function definir() {
    if (Platform.OS === 'android') abrirNoAndroid();
    else onChange(dataParaIso(new Date()));
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.rotulo, { color: cores.textoSecundario }]}>{rotulo}</Text>
      {valor === null ? (
        <Botao titulo="Definir prazo" variante="secundario" onPress={definir} />
      ) : (
        <View style={styles.linha}>
          {Platform.OS === 'ios' ? (
            <DateTimePicker
              value={isoParaData(valor)}
              mode="date"
              display="compact"
              locale="pt-BR"
              accentColor={cores.primaria}
              themeVariant={cores.escuro ? 'dark' : 'light'}
              onValueChange={(_evento, data) => onChange(dataParaIso(data))}
            />
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${rotulo}: ${paraDataBr(valor)}. Toque para alterar.`}
              onPress={abrirNoAndroid}
              style={[styles.data, { backgroundColor: cores.superficie, borderColor: cores.borda }]}
            >
              <Text style={[styles.textoData, { color: cores.texto }]}>{paraDataBr(valor)}</Text>
            </Pressable>
          )}
          <Botao titulo="Remover prazo" variante="link" onPress={() => onChange(null)} />
        </View>
      )}
      {dica ? <Text style={[styles.ajuda, { color: cores.aviso }]}>{dica}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: espaco.xs },
  rotulo: { fontSize: fonte.pequena, fontWeight: '600' },
  linha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  data: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: raio,
    paddingHorizontal: espaco.md,
    justifyContent: 'center',
  },
  textoData: { fontSize: fonte.normal },
  ajuda: { fontSize: fonte.pequena },
});
