/** Formato retornado pela BrasilAPI (/api/feriados/v1/{ano}). */
export interface Feriado {
  date: string; // AAAA-MM-DD
  name: string;
  type: string;
}
