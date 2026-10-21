import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Aviso } from '@/components/Aviso';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { TelaFormulario } from '@/components/TelaFormulario';
import { useAuth } from '@/contexts/AuthContext';
import { usePreferencias } from '@/contexts/PreferenciasContext';
import { useTema } from '@/hooks/useTema';
import { fonte } from '@/theme';
import { mensagemDeErro } from '@/utils/firebaseErros';
import { validarEmail } from '@/utils/validacao';

export default function Login() {
  const { entrar } = useAuth();
  const { preferencias, definir } = usePreferencias();
  const cores = useTema();
  const [email, setEmail] = useState(preferencias.ultimoEmail);
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleEntrar() {
    const invalido = validarEmail(email) ?? (senha ? null : 'Informe a senha.');
    if (invalido) return setErro(invalido);

    setErro(null);
    setEnviando(true);
    try {
      await entrar(email, senha);
      definir('ultimoEmail', email.trim()); // o guard de rotas leva para a lista
    } catch (e) {
      setErro(mensagemDeErro(e));
      setEnviando(false);
    }
  }

  return (
    <TelaFormulario>
      <Text style={[styles.titulo, { color: cores.texto }]}>Tarefinhas</Text>
      <Campo
        rotulo="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
      />
      <Campo
        rotulo="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoComplete="password"
        onSubmitEditing={handleEntrar}
      />
      {erro && <Aviso tipo="erro" texto={erro} />}
      <Botao titulo="Entrar" onPress={handleEntrar} carregando={enviando} />
      <Botao
        titulo="Criar uma conta"
        variante="secundario"
        onPress={() => router.push('/cadastro')}
      />
      <Botao
        titulo="Esqueci minha senha"
        variante="link"
        onPress={() => router.push('/recuperar-senha')}
      />
    </TelaFormulario>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: fonte.titulo, fontWeight: '700', textAlign: 'center', marginVertical: 24 },
});
