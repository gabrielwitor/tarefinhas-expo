import { router, Stack } from 'expo-router';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Aviso } from '@/components/Aviso';
import { Carregando } from '@/components/Carregando';
import { Opcoes } from '@/components/Opcoes';
import { TarefaItem } from '@/components/TarefaItem';
import { usePreferencias } from '@/contexts/PreferenciasContext';
import { useTarefas } from '@/contexts/TarefasContext';
import { useFeriados } from '@/hooks/useFeriados';
import { useTema } from '@/hooks/useTema';
import type { Filtro, Ordenacao } from '@/models/Preferencias';
import { espaco, fonte } from '@/theme';
import { filtrarEOrdenar, hojeIso, proximoFeriado } from '@/utils/tarefas';
import { paraDataBr } from '@/utils/validacao';

const FILTROS: { valor: Filtro; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'pendentes', rotulo: 'Pendentes' },
  { valor: 'concluidas', rotulo: 'Concluídas' },
];

const ORDENACOES: { valor: Ordenacao; rotulo: string }[] = [
  { valor: 'criadoEm', rotulo: 'Recentes' },
  { valor: 'dataLimite', rotulo: 'Prazo' },
  { valor: 'prioridade', rotulo: 'Prioridade' },
];

export default function ListaTarefas() {
  const cores = useTema();
  const { preferencias, definir } = usePreferencias();
  const { tarefas, carregando, sincronizando, online, erro, editar, sincronizar } = useTarefas();
  const feriado = proximoFeriado(useFeriados(), hojeIso());

  if (carregando) return <Carregando />;

  const visiveis = filtrarEOrdenar(tarefas, preferencias.filtro, preferencias.ordenacao);

  return (
    <SafeAreaView edges={['bottom']} style={styles.flex}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/configuracoes')}
              accessibilityRole="button"
              hitSlop={10}
            >
              <Text style={[styles.acaoCabecalho, { color: cores.primaria }]}>Ajustes</Text>
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={visiveis}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={sincronizando}
            onRefresh={sincronizar}
            colors={[cores.primaria]}
            tintColor={cores.primaria}
          />
        }
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            {!online && (
              <Aviso texto="Você está offline. As alterações ficam salvas no aparelho e sobem quando a internet voltar." />
            )}
            {erro && online && <Aviso tipo="erro" texto={erro} onTentarNovamente={sincronizar} />}
            {feriado && (
              <Text style={[styles.feriado, { color: cores.textoSecundario }]}>
                Próximo feriado: {feriado.name} ({paraDataBr(feriado.date)})
              </Text>
            )}
            <Opcoes
              opcoes={FILTROS}
              valor={preferencias.filtro}
              onChange={(v) => definir('filtro', v)}
            />
            <Opcoes
              rotulo="Ordenar por"
              opcoes={ORDENACOES}
              valor={preferencias.ordenacao}
              onChange={(v) => definir('ordenacao', v)}
            />
          </View>
        }
        ListEmptyComponent={
          <Text style={[styles.vazio, { color: cores.textoSecundario }]}>
            {tarefas.length
              ? 'Nenhuma tarefa neste filtro.'
              : 'Nenhuma tarefa ainda. Toque em + para criar.'}
          </Text>
        }
        renderItem={({ item }) => (
          <TarefaItem
            tarefa={item}
            onPress={() => router.push({ pathname: '/tarefa/[id]', params: { id: item.id } })}
            onAlternar={() => editar(item.id, { concluida: !item.concluida })}
          />
        )}
      />

      <Pressable
        onPress={() => router.push({ pathname: '/tarefa/[id]', params: { id: 'nova' } })}
        accessibilityRole="button"
        accessibilityLabel="Nova tarefa"
        style={[styles.fab, { backgroundColor: cores.primaria }]}
      >
        <Text style={[styles.fabTexto, { color: cores.textoSobrePrimaria }]}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  lista: { padding: espaco.md, gap: espaco.sm, paddingBottom: 96 },
  cabecalho: { gap: espaco.md, marginBottom: espaco.sm },
  acaoCabecalho: { fontSize: fonte.normal, fontWeight: '600' },
  feriado: { fontSize: fonte.pequena },
  vazio: { textAlign: 'center', marginTop: espaco.lg, fontSize: fonte.normal },
  fab: {
    position: 'absolute',
    right: espaco.lg,
    bottom: espaco.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabTexto: { fontSize: 30, lineHeight: 32 },
});
