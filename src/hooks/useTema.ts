import { useColorScheme } from 'react-native';

import { usePreferencias } from '@/contexts/PreferenciasContext';
import { coresClaras, coresEscuras, type Cores } from '@/theme';

/** Cores do tema escolhido nas preferências ("sistema" segue o aparelho). */
export function useTema(): Cores {
  const { tema } = usePreferencias().preferencias;
  const doSistema = useColorScheme();
  const escuro = tema === 'escuro' || (tema === 'sistema' && doSistema === 'dark');
  return escuro ? coresEscuras : coresClaras;
}
