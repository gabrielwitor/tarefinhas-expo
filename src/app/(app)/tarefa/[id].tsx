import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Text } from 'react-native';

import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { CampoData } from '@/components/CampoData';
import { Opcoes } from '@/components/Opcoes';
import { TelaFormulario } from '@/components/TelaFormulario';
import { useTarefas } from '@/contexts/TarefasContext';
import { useFeriados } from '@/hooks/useFeriados';
import { useTema } from '@/hooks/useTema';
import type { Prioridade } from '@/models/Tarefa';
import { paraDataBr, validarTitulo } from '@/utils/validacao';

const PRIORIDADES: { valor: Prioridade; rotulo: string }[] = [
  { valor: 'baixa', rotulo: 'Baixa' },
  { valor: 'media', rotulo: 'Média' },
  { valor: 'alta', rotulo: 'Alta' },
];

/** Criar (id = "nova") ou editar/excluir uma tarefa. */
export default function FormularioTarefa() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tarefas, criar, editar, excluir } = useTarefas();
  const cores = useTema();
  const feriados = useFeriados();
  const existente = tarefas.find((t) => t.id === id);
  const nova = id === 'nova';

  const [titulo, setTitulo] = useState(existente?.titulo ?? '');
  const [descricao, setDescricao] = useState(existente?.descricao ?? '');
  const [prioridade, setPrioridade] = useState<Prioridade>(existente?.prioridade ?? 'media');
  const [dataLimite, setDataLimite] = useState(existente?.dataLimite ?? null);
  const [erroTitulo, setErroTitulo] = useState<string | null>(null);

  if (!nova && !existente) {
    return <Text style={{ color: cores.texto, padding: 16 }}>Tarefa não encontrada.</Text>;
  }

  const feriado = dataLimite ? feriados.find((f) => f.date === dataLimite) : undefined;

  async function handleSalvar() {
    const erro = validarTitulo(titulo);
    setErroTitulo(erro);
    if (erro) return;

    const dados = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      prioridade,
      dataLimite,
    };
    if (nova) await criar(dados);
    else await editar(id, dados);
    router.back();
  }

  function handleExcluir() {
    Alert.alert('Excluir tarefa', `Excluir "${existente?.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await excluir(id);
          router.back();
        },
      },
    ]);
  }

  return (
    <TelaFormulario>
      <Stack.Screen options={{ title: nova ? 'Nova tarefa' : 'Editar tarefa' }} />
      <Campo rotulo="Título" value={titulo} onChangeText={setTitulo} erro={erroTitulo} />
      <Campo
        rotulo="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        style={{ minHeight: 96, textAlignVertical: 'top' }}
      />
      <Opcoes
        rotulo="Prioridade"
        opcoes={PRIORIDADES}
        valor={prioridade}
        onChange={setPrioridade}
      />
      <CampoData
        rotulo="Prazo (opcional)"
        valor={dataLimite}
        onChange={setDataLimite}
        dica={feriado && `Atenção: ${paraDataBr(feriado.date)} é feriado (${feriado.name}).`}
      />
      <Botao titulo="Salvar" onPress={handleSalvar} />
      {!nova && <Botao titulo="Excluir" variante="perigo" onPress={handleExcluir} />}
    </TelaFormulario>
  );
}
