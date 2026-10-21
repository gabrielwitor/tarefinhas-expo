import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTema } from '@/hooks/useTema';
import type { TarefaLocal } from '@/models/Tarefa';
import { espaco, fonte, raio } from '@/theme';
import { paraDataBr } from '@/utils/validacao';

const ROTULO_PRIORIDADE = { baixa: 'Baixa', media: 'Média', alta: 'Alta' } as const;

interface Props {
  tarefa: TarefaLocal;
  onPress: () => void;
  onAlternar: () => void;
}

export function TarefaItem({ tarefa, onPress, onAlternar }: Props) {
  const cores = useTema();
  const corPrioridade = {
    baixa: cores.textoSecundario,
    media: cores.aviso,
    alta: cores.perigo,
  }[tarefa.prioridade];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Editar ${tarefa.titulo}`}
      style={[styles.container, { backgroundColor: cores.superficie, borderColor: cores.borda }]}
    >
      <Pressable
        onPress={onAlternar}
        hitSlop={10}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: tarefa.concluida }}
        accessibilityLabel={tarefa.concluida ? 'Marcar como pendente' : 'Marcar como concluída'}
        style={[
          styles.check,
          { borderColor: cores.primaria },
          tarefa.concluida && { backgroundColor: cores.primaria },
        ]}
      >
        {tarefa.concluida && <Text style={{ color: cores.textoSobrePrimaria }}>✓</Text>}
      </Pressable>

      <View style={styles.textos}>
        <Text
          numberOfLines={1}
          style={[styles.titulo, { color: cores.texto }, tarefa.concluida && styles.riscado]}
        >
          {tarefa.titulo}
        </Text>
        <Text style={[styles.detalhe, { color: cores.textoSecundario }]}>
          <Text style={{ color: corPrioridade }}>● {ROTULO_PRIORIDADE[tarefa.prioridade]}</Text>
          {tarefa.dataLimite ? `  ·  até ${paraDataBr(tarefa.dataLimite)}` : ''}
          {tarefa.syncStatus === 'pendente' ? '  ·  não sincronizada' : ''}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.md,
    padding: espaco.md,
    borderWidth: 1,
    borderRadius: raio,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: { flex: 1, gap: 2 },
  titulo: { fontSize: fonte.normal, fontWeight: '600' },
  riscado: { textDecorationLine: 'line-through', opacity: 0.6 },
  detalhe: { fontSize: fonte.pequena },
});
