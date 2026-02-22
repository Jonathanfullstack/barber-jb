# Deploy no Railway (Next.js + PostgreSQL)

## Se o build falhar com "Next.js build worker exited with code: 1"

1. **Usar o Dockerfile (recomendado):** no serviço do app → **Settings** → **Build** → em **Builder** escolha **Dockerfile**. O Railway passará a usar o `Dockerfile` do repositório e o build fica estável.
2. **Ou** confira se as alterações mais recentes foram enviadas ao GitHub (arquivos `nixpacks.toml` e `next.config.js` com `eslint.ignoreDuringBuilds`), dê **Redeploy** e veja os logs completos do build para identificar o erro exato.
3. **Start Command:** em **Settings** → **Deploy** → **Start Command** defina:  
   `npx prisma db push && npm run start`  
   (assim o schema do Postgres é aplicado antes de subir o app.)

---

## 1. Criar o projeto no Railway

1. Acesse [railway.app](https://railway.app) e faça login (GitHub).
2. **New Project** → **Deploy from GitHub repo** e escolha o repositório `barber-jb` (ou o nome do seu repo).
3. Railway vai detectar o **Dockerfile** e usar ele para o build.

## 2. Adicionar o PostgreSQL

1. No mesmo projeto, clique em **+ New** → **Database** → **PostgreSQL**.
2. Aguarde o provisionamento. Railway cria o banco e gera a variável **DATABASE_URL**.

## 3. Ligar o Postgres ao app

1. Clique no **serviço do seu app** (Next.js).
2. Aba **Variables** → **Add Variable** ou **Reference**.
3. Adicione a variável **DATABASE_URL**:
   - Opção A: **Add Variable** e cole a URL que aparece no serviço do Postgres (em **Connect** ou **Variables**).
   - Opção B: **Reference** e selecione a variável `DATABASE_URL` do serviço PostgreSQL (recomendado).
4. Salve. O app será redeployado.

## 4. Build e start

- **Build:** o Dockerfile roda `prisma generate` e `next build`.
- **Start:** ao subir o container, roda `prisma db push` (sincroniza o schema no Postgres) e em seguida `next start`.

Não é necessário configurar **Build Command** ou **Start Command** no Railway se estiver usando o Dockerfile.

## 5. Domínio

No serviço do app, aba **Settings** → **Networking** → **Generate Domain** para obter a URL pública (ex: `xxx.up.railway.app`).

---

## Variáveis de ambiente

| Variável        | Obrigatória | Descrição                          |
|-----------------|------------|------------------------------------|
| `DATABASE_URL`  | Sim        | URL do PostgreSQL (fornecida pelo add-on). |

Exemplo (Railway preenche automaticamente ao referenciar o Postgres):

```
postgresql://postgres:senha@containers-us-west-xxx.railway.app:5432/railway
```

---

## Observação sobre o app

O front atual continua usando **localStorage** para barbeiros, serviços e agendamentos. O Postgres está conectado e o schema é criado no deploy (`prisma db push`), pronto para você migrar depois para API + Prisma quando quiser persistir no servidor.
