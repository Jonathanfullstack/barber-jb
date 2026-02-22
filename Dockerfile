# Railway + Next.js + PostgreSQL (Prisma)
FROM node:20-alpine

WORKDIR /app

# Dependências
COPY package.json package-lock.json* ./
RUN npm ci

# Código e build
COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Railway injeta DATABASE_URL; sincroniza o schema no Postgres e sobe o app
CMD ["sh", "-c", "npx prisma db push && npm run start"]
