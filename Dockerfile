# Railway + Next.js + PostgreSQL (Prisma)
FROM node:20-alpine

WORKDIR /app

# OpenSSL para Prisma no Alpine (evita "failed to detect libssl" e geração do client)
RUN apk add --no-cache openssl

# Dependências
COPY package.json package-lock.json* ./
RUN npm ci

# Código e build
COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"

# Railway injeta PORT e DATABASE_URL. migrate deploy em banco novo;
# db push cobre o Postgres já existente deste projeto (schema sem histórico de migration).
CMD ["sh", "-c", "npx prisma migrate deploy || npx prisma db push --accept-data-loss; npx next start --hostname 0.0.0.0 --port ${PORT:-3000}"]
