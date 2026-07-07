# Publicar na Netlify (passo a passo)

O projeto já vem configurado para **Postgres** (obrigatório em qualquer host
serverless, incluindo a Netlify — lá o sistema de arquivos é efêmero, então o
antigo SQLite não serve). O caminho abaixo usa o **Neon** como banco (tier grátis).

## 1. Crie o banco no Neon

1. Entre em https://neon.tech e crie um projeto (região mais perto do Brasil, ex.
   AWS `us-east-1` ou `sa-east-1` se disponível).
2. Copie a **connection string** que ele mostra. Vai parecer com:
   `postgresql://usuario:senha@ep-xxx.neon.tech/neondb?sslmode=require`
   Guarde — é o seu `DATABASE_URL`.

## 2. Crie as tabelas (uma vez, do seu computador)

No projeto local, com o Node instalado:

```bash
npm install
# cole a URL do Neon no .env:
echo 'DATABASE_URL="postgresql://...sua-url-do-neon...?sslmode=require"' > .env
npx prisma db push        # cria as tabelas no Neon
```

(Isso roda do seu micro porque a Netlify não te dá um terminal persistente. Depois
de criado, você não precisa repetir — só se mudar o schema.)

## 3. Suba o código para o GitHub

```bash
git init && git add . && git commit -m "deploy inicial"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/nucleo.git
git push -u origin main
```

## 4. Conecte na Netlify

1. Netlify → **Add new site → Import an existing project** → GitHub → escolha o repo.
2. A Netlify detecta o Next.js sozinho. O comando de build (`npm run build`) já vem
   do `netlify.toml`. Pode deixar como está.
3. Antes de clicar em Deploy, abra **Site configuration → Environment variables** e
   adicione (mínimo obrigatório):
   - `DATABASE_URL` = a URL do Neon (com `?sslmode=require`)
   - `ADMIN_PASSWORD` = a senha do seu painel `/admin`
   - `ADMIN_SESSION_SECRET` = uma frase aleatória longa
   - `NEXT_PUBLIC_SITE_URL` = a URL final do site (ex. `https://seu-site.netlify.app`
     ou seu domínio próprio)
   - Opcionais, se for usar: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`,
     `SMTP_FROM` (envio do PDF por e-mail), `NEXT_PUBLIC_WHATSAPP_NUMBER`, e as tags
     `NEXT_PUBLIC_GTM_ID` / `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_META_PIXEL_ID`.
4. Clique em **Deploy**. Em 2–4 minutos você tem a URL no ar.

## 5. Depois de publicado

- Ajuste `NEXT_PUBLIC_SITE_URL` para o domínio definitivo e redeploy (variáveis só
  valem a partir do build seguinte).
- Domínio próprio: **Domain settings → Add a custom domain** (SSL é automático).
- Toda vez que você der `git push` na branch `main`, a Netlify republica sozinha.

## Limites do plano grátis (para não te pegar de surpresa)

- **Timeout de função: 10 s** (26 s no pago). A geração do PDF roda bem abaixo disso;
  se algum dia der timeout, é aqui que se resolve (upgrade ou otimização).
- 100 GB de banda, 300 min de build e 125 mil execuções de função por mês. Estourou,
  o site **pausa até o próximo ciclo** — com tráfego inicial de funil, sobra folga.
- Uso comercial é permitido no grátis (diferente da Vercel), então pode vender por ele.

## Observações

- Marca e textos: `src/config/brand.ts`.
- Antes de anunciar: troque os depoimentos ilustrativos por reais/autorizados e
  mantenha o enquadramento de autoconhecimento (sem diagnóstico/previsão).
- Se um dia quiser um servidor Node sempre-ligado (sem timeout de função, sem cold
  start), Railway ou Render são alternativas — mas para começar, a Netlify entrega.
