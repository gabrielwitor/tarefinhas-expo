# Tarefinhas

Aplicativo de tarefas com login e armazenamento na nuvem, que continua funcionando sem internet.
Trabalho da Avaliação 02 de Programação de Aplicativos para Dispositivos Móveis, feito com **React Native + Expo (SDK 57)** e **Firebase**.

## Funcionalidades

- Cadastro, login, logout e recuperação de senha por e-mail (Firebase Authentication).
- CRUD de tarefas (título, descrição, prioridade e prazo), com cada usuário vendo só as próprias tarefas (Cloud Firestore).
- Uso offline: as tarefas ficam no SQLite do aparelho e são enviadas à nuvem quando a conexão volta.
- Preferências salvas no aparelho: último e-mail usado, tema (claro, escuro ou sistema), filtro e ordenação da lista.
- Próximo feriado nacional e aviso quando o prazo cai num feriado (API externa BrasilAPI).

## Onde cada dado fica

```
┌──────────────────────── APARELHO ────────────────────────┐        ┌──────── NUVEM (Firebase) ────────┐
│ AsyncStorage (≈ SharedPreferences)                       │        │ Authentication                   │
│   ultimoEmail, tema, filtro, ordenacao                   │        │   contas (e-mail/senha)          │
│ SecureStore (Android Keystore, criptografado)            │◄──────►│                                  │
│   sessão do Firebase Auth (tokens)                       │        │ Cloud Firestore                  │
│ SQLite (expo-sqlite) — tarefinhas.db                     │  sync  │   coleção `tarefas`              │
│   tabela `tarefas` + coluna sync_status (fila offline)   │◄──────►│   { userId, titulo, ... }        │
└──────────────────────────────────────────────────────────┘        └──────────────────────────────────┘
```

| Tecnologia | Uso no app | Código |
|---|---|---|
| Firebase Authentication | cadastro, login, logout, recuperar senha, proteção das telas | `src/services/authService.ts`, `src/contexts/AuthContext.tsx`, `src/app/_layout.tsx` |
| Cloud Firestore | coleção `tarefas`, filtrada por `userId` | `src/services/tarefasRemote.ts`, `firestore.rules` |
| SQLite (`expo-sqlite`) | cópia local e fila de sincronização (CRUD local) | `src/services/tarefasLocal.ts`, `src/services/syncService.ts` |
| AsyncStorage (equivalente ao SharedPreferences) | 4 preferências carregadas ao abrir o app | `src/services/preferencesService.ts`, `src/contexts/PreferenciasContext.tsx` |
| SecureStore | sessão do login, para que nenhum token fique no AsyncStorage | `src/services/secureStorage.ts`, `src/config/firebase.ts` |
| BrasilAPI | `GET /api/feriados/v1/{ano}` | `src/services/feriadosApi.ts` |

## Decisões

- **SQLite em vez de Hive:** o Hive existe só para Dart/Flutter, enquanto o SQLite é o banco local padrão do Expo. Com tabelas e SQL fica simples filtrar por usuário e controlar a fila de sincronização (`sync_status`).
- **Offline-first:** as telas leem e gravam sempre no SQLite. O `syncService` envia as pendências (`setDoc`/`deleteDoc`) e depois baixa a versão da nuvem. Em caso de conflito, vence a edição com o `atualizadoEm` mais recente (`src/utils/sync.ts`). O SDK JS do Firestore não tem cache offline persistente no React Native, e é por isso que o SQLite é necessário.
- **IDs gerados no aparelho** (`doc(colecao).id`): funcionam offline e são os mesmos no SQLite e no Firestore.
- **Exclusão em duas etapas:** a tarefa é marcada como `excluida` no SQLite, e a linha só é removida depois que o Firestore confirma.
- **Segurança:** as regras do Firestore (`firestore.rules`) impedem ler ou alterar tarefas de outra pessoa, e o filtro por `userId` no app não basta sozinho. A config do Firebase no `.env` é pública por natureza, e não há nenhuma chave de conta de serviço no projeto.

## Estrutura

```
src/
  app/                    # telas (expo-router: cada arquivo é uma rota)
    _layout.tsx           # providers + Stack.Protected (login obrigatório)
    (auth)/               # login, cadastro, recuperar-senha
    (app)/                # index (lista), tarefa/[id] (formulário), configuracoes
  components/             # componentes visuais reutilizáveis
  contexts/               # estado global: Auth, Preferências, Tarefas
  hooks/                  # useTema, useFeriados
  services/               # acesso a dados: Firebase, SQLite, AsyncStorage, API
  models/                 # tipos de domínio
  utils/                  # funções puras (validação, erros, sync, ordenação)
  theme/                  # cores claro/escuro, espaçamentos
  config/firebase.ts      # inicialização do Firebase
__tests__/                # testes das funções puras
firestore.rules           # regras de segurança do Firestore
```

As camadas dependem num único sentido: **telas → contexts/hooks → services → config**. As telas não acessam o Firebase nem o SQLite diretamente.

## Como rodar

1. **Firebase** ([console](https://console.firebase.google.com)):
   1. Crie um projeto e registre um app **Web**.
   2. Em *Authentication*, ative o provedor **E-mail/senha**.
   3. Em *Firestore Database*, crie o banco e cole o conteúdo de `firestore.rules` na aba *Regras*.
2. **Variáveis de ambiente:** `cp .env.example .env` e preencha com a config do app Web.
3. **Instalar e iniciar:**
   ```sh
   npm install
   npx expo start          # no WSL com emulador no Windows: npx expo start --tunnel
   ```
   Abra no **Expo Go** do emulador Android (tecla `a`). Não é preciso fazer build nativo.

## Scripts

| Comando | O que faz |
|---|---|
| `npm start` | servidor de desenvolvimento |
| `npm run check` | TypeScript + ESLint |
| `npm test` | testes unitários (Jest) |
| `npm run format` | formata o código (Prettier) |

## Roteiro de demonstração

1. Cadastro com e-mail já usado ou senha fraca mostra a mensagem de erro. Depois, um cadastro válido.
2. Sair, errar a senha (aparece a mensagem) e entrar. O e-mail já vem preenchido.
3. Criar, editar, concluir e excluir tarefas, conferindo cada mudança no console do Firestore.
4. Ativar o **modo avião**, criar e editar tarefas (aparece "não sincronizada"), desativar e ver as tarefas subirem.
5. Trocar o tema, o filtro e a ordenação, fechar e reabrir o app: as preferências continuam.
6. Entrar com outro usuário: ele não vê as tarefas do primeiro.
7. Recuperar a senha pelo e-mail.

## Referências

- Expo: <https://docs.expo.dev> (Router, SQLite, SecureStore, Firebase guide)
- Firebase: <https://firebase.google.com/docs> (Auth, Firestore, Security Rules)
- AsyncStorage: <https://react-native-async-storage.github.io/async-storage/>
- BrasilAPI: <https://brasilapi.com.br/docs>
