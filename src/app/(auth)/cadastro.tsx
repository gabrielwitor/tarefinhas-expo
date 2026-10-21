import { useState } from 'react';

import { Aviso } from '@/components/Aviso';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { TelaFormulario } from '@/components/TelaFormulario';
import { useAuth } from '@/contexts/AuthContext';
import { usePreferencias } from '@/contexts/PreferenciasContext';
import { mensagemDeErro } from '@/utils/firebaseErros';
import { validarEmail, validarSenha } from '@/utils/validacao';

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const { definir } = usePreferencias();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleCadastrar() {
    const invalido =
      validarEmail(email) ??
      validarSenha(senha) ??
      (senha === confirmacao ? null : 'As senhas não conferem.');
    if (invalido) return setErro(invalido);

    setErro(null);
    setEnviando(true);
    try {
      await cadastrar(email, senha); // o Firebase já deixa o usuário logado
      definir('ultimoEmail', email.trim());
    } catch (e) {
      setErro(mensagemDeErro(e));
      setEnviando(false);
    }
  }

  return (
    <TelaFormulario>
      <Campo
        rotulo="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
      />
      <Campo
        rotulo="Senha (mínimo 6 caracteres)"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoComplete="new-password"
      />
      <Campo
        rotulo="Confirmar senha"
        value={confirmacao}
        onChangeText={setConfirmacao}
        secureTextEntry
        onSubmitEditing={handleCadastrar}
      />
      {erro && <Aviso tipo="erro" texto={erro} />}
      <Botao titulo="Cadastrar" onPress={handleCadastrar} carregando={enviando} />
    </TelaFormulario>
  );
}
