import { Alert, StyleSheet, Text, View } from 'react-native';

import { Botao } from '@/components/Botao';
import { Opcoes } from '@/components/Opcoes';
import { TelaFormulario } from '@/components/TelaFormulario';
import { useAuth } from '@/contexts/AuthContext';
import { usePreferencias } from '@/contexts/PreferenciasContext';
import { useTarefas } from '@/contexts/TarefasContext';
import { useTema } from '@/hooks/useTema';
import type { Tema } from '@/models/Preferencias';
import { espaco, fonte } from '@/theme';

const TEMAS: { valor: Tema; rotulo: string }[] = [
  { valor: 'sistema', rotulo: 'Sistema' },
  { valor: 'claro', rotulo: 'Claro' },
  { valor: 'escuro', rotulo: 'Escuro' },
];

export default function Configuracoes() {
  const cores = useTema();
  const { usuario, sair } = useAuth();
  const { preferencias, definir } = usePreferencias();
  const { pendentes, online, sincronizando, sincronizar } = useTarefas();

  function handleSair() {
    if (pendentes === 0) return sair();
    Alert.alert(
      'Alterações não sincronizadas',
      `${pendentes} tarefa(s) ainda não foram enviadas para a nuvem. Elas continuam salvas neste aparelho e sobem no próximo login. Sair mesmo assim?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => sair() },
      ],
    );
  }

  const texto = [styles.texto, { color: cores.texto }];

  return (
    <TelaFormulario>
      <Opcoes
        rotulo="Tema"
        opcoes={TEMAS}
        valor={preferencias.tema}
        onChange={(v) => definir('tema', v)}
      />

      <View style={styles.bloco}>
        <Text style={texto}>Conta: {usuario?.email}</Text>
        <Text style={texto}>Conexão: {online ? 'online' : 'offline'}</Text>
        <Text style={texto}>
          {pendentes === 0
            ? 'Tudo sincronizado com a nuvem.'
            : `${pendentes} tarefa(s) aguardando sincronização.`}
        </Text>
      </View>

      <Botao
        titulo="Sincronizar agora"
        variante="secundario"
        onPress={sincronizar}
        carregando={sincronizando}
        desabilitado={!online}
      />
      <Botao titulo="Sair" variante="perigo" onPress={handleSair} />
    </TelaFormulario>
  );
}

const styles = StyleSheet.create({
  bloco: { gap: espaco.xs },
  texto: { fontSize: fonte.normal },
});
