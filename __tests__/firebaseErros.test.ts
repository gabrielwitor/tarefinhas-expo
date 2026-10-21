import { describe, expect, it } from '@jest/globals';

import { mensagemDeErro } from '@/utils/firebaseErros';

describe('mensagemDeErro', () => {
  it('traduz códigos conhecidos do Firebase', () => {
    expect(mensagemDeErro({ code: 'auth/email-already-in-use' })).toBe(
      'Este e-mail já está cadastrado.',
    );
    expect(mensagemDeErro({ code: 'auth/network-request-failed' })).toBe(
      'Sem conexão com a internet.',
    );
  });

  it('tem mensagem para timeout e para erros desconhecidos', () => {
    expect(mensagemDeErro(new Error('timeout'))).toMatch(/demorou/);
    expect(mensagemDeErro({ code: 'xyz' })).toBe('Algo deu errado. Tente novamente.');
    expect(mensagemDeErro(undefined)).toBe('Algo deu errado. Tente novamente.');
  });
});
