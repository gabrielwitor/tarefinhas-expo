// Validações puras dos formulários: retornam a mensagem de erro, ou null se estiver tudo certo.

export function validarEmail(email: string): string | null {
  if (!email.trim()) return 'Informe o e-mail.';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? null : 'E-mail inválido.';
}

export function validarSenha(senha: string): string | null {
  return senha.length >= 6 ? null : 'A senha precisa ter pelo menos 6 caracteres.';
}

export function validarTitulo(titulo: string): string | null {
  return titulo.trim() ? null : 'Informe o título.';
}

/** Converte um Date em "AAAA-MM-DD" usando o fuso local (o dia que o usuário escolheu). */
export function dataParaIso(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}

/** Converte "AAAA-MM-DD" em Date ao meio-dia local, longe da virada do dia em qualquer fuso. */
export function isoParaData(iso: string): Date {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return new Date(ano, mes - 1, dia, 12);
}

/** Converte "AAAA-MM-DD" em "DD/MM/AAAA" para exibir. */
export function paraDataBr(iso: string | null): string {
  if (!iso) return '';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}
