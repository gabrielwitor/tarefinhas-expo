import { describe, expect, it } from '@jest/globals';

import {
  dataParaIso,
  isoParaData,
  paraDataBr,
  validarEmail,
  validarSenha,
  validarTitulo,
} from '@/utils/validacao';

describe('validacao', () => {
  it('valida e-mail', () => {
    expect(validarEmail('')).toBe('Informe o e-mail.');
    expect(validarEmail('abc')).toBe('E-mail inválido.');
    expect(validarEmail(' ana@exemplo.com ')).toBeNull();
  });

  it('exige senha com 6+ caracteres e título preenchido', () => {
    expect(validarSenha('12345')).not.toBeNull();
    expect(validarSenha('123456')).toBeNull();
    expect(validarTitulo('   ')).not.toBeNull();
    expect(validarTitulo('Estudar')).toBeNull();
  });

  it('converte datas entre Date, AAAA-MM-DD e DD/MM/AAAA', () => {
    expect(dataParaIso(new Date(2026, 10, 5, 23, 59))).toBe('2026-11-05');
    expect(dataParaIso(new Date(2026, 0, 1, 0, 0))).toBe('2026-01-01');
    expect(dataParaIso(isoParaData('2026-02-28'))).toBe('2026-02-28');
    expect(paraDataBr('2026-11-05')).toBe('05/11/2026');
    expect(paraDataBr(null)).toBe('');
  });
});
