import { useState } from 'react';

import { Aviso } from '@/components/Aviso';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { TelaFormulario } from '@/components/TelaFormulario';
import { useAuth } from '@/contexts/AuthContext';
import { usePreferencias } from '@/contexts/PreferenciasContext';
import { mensagemDeErro } from '@/utils/firebaseErros';
import { validarEmail } from '@/utils/validacao';

export default function RecuperarSenha() {
  const { recuperarSenha } = useAuth();
  const { preferencias } = usePreferencias();
  const [email, setEmail] = useState(preferencias.ultimoEmail);
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(
    null,
  );
  const [enviando, setEnviando] = useState(false);

  async function handleEnviar() {
    const invalido = validarEmail(email);
    if (invalido) return setMensagem({ tipo: 'erro', texto: invalido });

    setEnviando(true);
    try {
      await recuperarSenha(email);
      setMensagem({
        tipo: 'sucesso',
        texto: 'Se houver uma conta com este e-mail, você receberá um link para criar nova senha.',
      });
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: mensagemDeErro(e) });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <TelaFormulario>
      <Campo
        rotulo="E-mail da conta"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        onSubmitEditing={handleEnviar}
      />
      {mensagem && <Aviso tipo={mensagem.tipo} texto={mensagem.texto} />}
      <Botao titulo="Enviar link" onPress={handleEnviar} carregando={enviando} />
    </TelaFormulario>
  );
}
