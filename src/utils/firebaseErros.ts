const MENSAGENS: Record<string, string> = {
  // Authentication
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/user-not-found': 'Não existe conta com este e-mail.',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/missing-password': 'Informe a senha.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente de novo.',
  'auth/network-request-failed': 'Sem conexão com a internet.',
  // Firestore
  'permission-denied': 'Você não tem permissão para acessar estes dados.',
  unavailable: 'Servidor indisponível. Verifique sua conexão.',
};

/** Converte um erro do Firebase (ou qualquer outro) em mensagem amigável em português. */
export function mensagemDeErro(erro: unknown): string {
  const codigo = (erro as { code?: string })?.code;
  if (codigo && MENSAGENS[codigo]) return MENSAGENS[codigo];
  if ((erro as Error)?.message === 'timeout') return 'A conexão demorou demais. Tente de novo.';
  return 'Algo deu errado. Tente novamente.';
}
