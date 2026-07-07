# Núcleo — Funil de autoconhecimento

Funil completo (não apenas um site) para um relatório personalizado a partir de
**nome completo + data de nascimento**. Landing elegante → prévia gratuita com 3
padrões → captura de contato (LGPD) → relatório completo em PDF por e-mail → painel
administrativo para acompanhamento.

Stack: **Next.js 14** (App Router, TypeScript), **Tailwind**, **Prisma + SQLite**,
**@react-pdf/renderer**, **nodemailer**. Sem dependência de serviços pagos para rodar.

---

## Como rodar (local)

Pré-requisitos: Node 18+ (testado no 22) e npm.

```bash
npm install                 # instala deps e gera o Prisma Client
cp .env.example .env        # configure as variáveis (veja abaixo)
npm run db:push             # cria o banco SQLite (dev.db)
npm run dev                 # http://localhost:3000
```

O painel fica em **`/admin`** (senha = `ADMIN_PASSWORD` do `.env`).

Para build de produção: `npm run build && npm run start`.

---

## Variáveis de ambiente

Só três são obrigatórias para funcionar; o resto é opcional e o app **degrada com
elegância** quando a chave não existe (nada quebra, a integração apenas não dispara).

| Variável | Obrigatória | Para quê |
|---|---|---|
| `DATABASE_URL` | ✅ | Banco. Padrão `file:./dev.db` |
| `ADMIN_PASSWORD` | ✅ | Senha do painel `/admin` |
| `ADMIN_SESSION_SECRET` | ✅ | Assina o cookie de sessão do admin |
| `NEXT_PUBLIC_SITE_URL` | recomendada | URL pública (SEO, OpenGraph, sitemap) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | opcional | Envio do PDF por e-mail. **Sem elas, a captura funciona mas o e-mail não é enviado** (`emailSent:false`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | opcional | Botão de WhatsApp na página de obrigado |
| `NEXT_PUBLIC_GTM_ID` / `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_META_PIXEL_ID` | opcional | Só carregam **após consentimento** (LGPD) |
| `META_CAPI_PIXEL_ID` / `META_CAPI_TOKEN` | opcional | Conversion API server-side |
| `TURNSTILE_*` | opcional | Captcha (Cloudflare Turnstile) |

---

## O que está incluído

- **Landing** (`/`): hero com formulário, como funciona, perguntas que o relatório
  responde, depoimentos ilustrativos, FAQ, disclaimer, dark mode.
- **Prévia** (`/resultado`): 3 padrões com descrição + pergunta reflexiva e gancho de
  curiosidade, seguidos do formulário de captura.
- **Obrigado** (`/obrigado`) e **Privacidade** (`/privacidade`).
- **Painel** (`/admin`): métricas (conversão, taxa de captura, relatórios enviados),
  série de 14 dias, busca/filtro, editar, marcar como contatado, reenviar relatório,
  baixar PDF, excluir, exportar CSV/Excel.
- **PDF** (`src/lib/pdf.tsx`): capa, nome, data, sumário, dimensões, potenciais,
  desafios, perguntas de reflexão, conclusão.
- **API**: `analyze`, `lead`, e rotas de admin — todas com `runtime = "nodejs"`.
- **SEO**: metadata + OpenGraph, JSON-LD, `sitemap.ts`, `robots.ts`
  (admin/resultado/obrigado/api fora do índice).
- **LGPD**: banner de consentimento; tags só disparam após o aceite.
- **Anti-spam**: honeypot + trap de tempo nos formulários.

Verificado neste ambiente: `npm run build` passa (17 rotas, ~87–96 kB de First Load
JS) e o fluxo completo (analyze → captura → PDF de 4 páginas → métricas → CSV) roda
de ponta a ponta.

---

## Antes de publicar — dois pontos honestos

1. **Depoimentos.** Os depoimentos são **exemplos ilustrativos** (marcados como tal na
   página). Troque por depoimentos reais e autorizados antes de anunciar — depoimento
   fictício apresentado como real é publicidade enganosa (CDC/CONAR).
2. **Enquadramento.** Todo o conteúdo se posiciona como reflexão e autoconhecimento, e
   **nunca** como diagnóstico psicológico, previsão ou promessa de resultado. Mantenha
   esse tom em qualquer texto novo (anúncios, e-mails, redes). É o que sustenta o
   produto de forma responsável.

Personalização de marca (nome, domínio, e-mail, textos): tudo em
**`src/config/brand.ts`**.

---

## Para produção

- Troque **SQLite por Postgres** (ajuste `provider` no `schema.prisma` e a
  `DATABASE_URL`). SQLite é ótimo para desenvolvimento e um operador só.
- Configure SMTP real para o envio do PDF.
- Meta de **Lighthouse 95+** é o alvo do design (fontes locais, JS enxuto, imagens
  controladas), mas confirme com um teste real no seu domínio antes de afirmar o número.
- O painel usa autenticação simples de um operador (cookie HMAC). Para múltiplos
  administradores, troque por um provedor de sessão dedicado.

Esta é uma **v1 sólida e funcional** — pronta para rodar localmente e evoluir, não um
produto já publicado. Bom lançamento.
