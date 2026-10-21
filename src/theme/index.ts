export interface Cores {
  escuro: boolean;
  fundo: string;
  superficie: string;
  borda: string;
  texto: string;
  textoSecundario: string;
  primaria: string;
  textoSobrePrimaria: string;
  perigo: string;
  aviso: string;
  sucesso: string;
}

export const coresClaras: Cores = {
  escuro: false,
  fundo: '#F5F6FA',
  superficie: '#FFFFFF',
  borda: '#DADDE5',
  texto: '#1B1D24',
  textoSecundario: '#5F6573',
  primaria: '#3D5AFE',
  textoSobrePrimaria: '#FFFFFF',
  perigo: '#D32F2F',
  aviso: '#B26A00',
  sucesso: '#2E7D32',
};

export const coresEscuras: Cores = {
  escuro: true,
  fundo: '#121318',
  superficie: '#1E2028',
  borda: '#343846',
  texto: '#ECEDF2',
  textoSecundario: '#A3A8B8',
  primaria: '#8C9EFF',
  textoSobrePrimaria: '#0D1240',
  perigo: '#EF9A9A',
  aviso: '#FFCC80',
  sucesso: '#A5D6A7',
};

export const espaco = { xs: 4, sm: 8, md: 16, lg: 24 } as const;

export const fonte = { pequena: 13, normal: 16, titulo: 22 } as const;

export const raio = 10;

/** Opções de cabeçalho comuns a todos os Stacks, seguindo o tema atual. */
export const opcoesDoStack = (cores: Cores) => ({
  headerStyle: { backgroundColor: cores.superficie },
  headerTintColor: cores.texto,
  contentStyle: { backgroundColor: cores.fundo },
});
