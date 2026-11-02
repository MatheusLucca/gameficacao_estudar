# Passo

Plataforma web de estudos com aulas guiadas, exercícios, revisões e gamificação. O projeto começou com uma trilha de backend Java/Spring e tem espaços para Odontologia, concursos e outros temas.

Site: https://passo-estudos-matheus.mathluckgo.chatgpt.site/

## O que já funciona

- Entrada com ChatGPT e rotas protegidas.
- Progresso online por conta, com dois perfis de estudo dentro de cada conta.
- Seis aulas de Internet, HTTP e redes; a primeira tem oito partes e seis questões.
- Retomada da posição de leitura, XP, metas, sequência de dias e conquistas.
- Revisões, exportação/importação de progresso e migração da primeira versão local.
- Controle de versão do progresso para evitar sobrescrever alterações de outro aparelho.

As outras etapas do roadmap estão planejadas. Odontologia e concursos ainda aguardam conteúdo. Vincular uma dupla entre contas diferentes ainda não foi implementado.

## Tecnologias

- React 19 e Vinext, com rotas compatíveis com o App Router.
- TypeScript no servidor; JavaScript, HTML e CSS na interface de estudos.
- Cloudflare Workers e banco D1 (SQLite), com migrações Drizzle.
- Autenticação e publicação pelo Sites.

Não há backend Java/Spring nesta versão. A autenticação hospedada depende da integração do Sites; hospedar em outro provedor exige adaptar essa integração.

## Executar localmente

Requisitos: Node.js 22.13 ou superior, npm e Git.

```sh
npm run install:ci
npm run db:generate
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_careless_grandmaster.sql
npm run dev
```

Aplique a migração inicial somente uma vez em cada banco local novo. Para mudanças futuras de esquema, gere e aplique as novas migrações na ordem; não modifique migrações já aplicadas.

Abra a URL exibida no terminal, normalmente `http://127.0.0.1:5173/`. No modo local portátil, o botão de entrada usa uma identidade de desenvolvimento. Esse comportamento não é incluído na publicação de produção. O banco local é separado do banco online.

## Verificação

```sh
node scripts/check-study.cjs
npx tsc --noEmit
npm run build
```

## Estrutura

| Pasta | Conteúdo |
| --- | --- |
| `app/` | Tela de entrada, área autenticada e API de progresso |
| `public/lesson-content.js` | Conteúdo ampliado das aulas |
| `public/passo-data.js` | Roadmap e questões iniciais |
| `public/passo-app.js` | Interface e sincronização do progresso |
| `public/reader-ui.js` | Leitor de aulas e configurações de conta |
| `public/passo.css`, `public/reader.css` | Estilos responsivos |
| `db/`, `drizzle/` | Esquema e migrações do banco |
| `lib/progress-validation.ts` | Validação dos dados recebidos pela API |
| `worker/`, `scripts/`, `.openai/` | Integração de execução e publicação |

As regras do Git excluem dependências, builds, bancos locais, arquivos de ambiente e estado temporário. Não adicione senhas ou tokens ao código. Consulte `docs/SITES-RUNTIME.md` para os detalhes do ambiente original.
