CREATE TYPE "PapelMembro" AS ENUM ('PROPRIETARIO', 'ADMIN', 'BARBEIRO');
CREATE TYPE "StatusAgendamento" AS ENUM ('PENDENTE', 'CONFIRMADO', 'FINALIZADO', 'CANCELADO');
CREATE TYPE "StatusAssinatura" AS ENUM ('TRIAL', 'ATIVA', 'ATRASADA', 'CANCELADA');

CREATE TABLE "User" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "passwordHash" TEXT NOT NULL, "phone" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "User_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Barbearia" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "slug" TEXT NOT NULL, "address" TEXT, "imageUrl" TEXT, "about" TEXT, "phone" TEXT, "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo', "statusAssinatura" "StatusAssinatura" NOT NULL DEFAULT 'TRIAL', "trialEndsAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Barbearia_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Membro" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "barbeariaId" TEXT NOT NULL, "papel" "PapelMembro" NOT NULL DEFAULT 'BARBEIRO', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Membro_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Barbeiro" ("id" TEXT NOT NULL, "barbeariaId" TEXT NOT NULL, "userId" TEXT, "name" TEXT NOT NULL, "avatar" TEXT, "ativo" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Barbeiro_pkey" PRIMARY KEY ("id"));
CREATE TABLE "HorarioFuncionamento" ("id" TEXT NOT NULL, "barbeariaId" TEXT NOT NULL, "diaSemana" INTEGER NOT NULL, "abre" TEXT, "fecha" TEXT, "fechado" BOOLEAN NOT NULL DEFAULT false, CONSTRAINT "HorarioFuncionamento_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Servico" ("id" TEXT NOT NULL, "barbeariaId" TEXT NOT NULL, "nome" TEXT NOT NULL, "descricao" TEXT, "preco" DECIMAL(10,2) NOT NULL, "duracao" INTEGER NOT NULL, "imageUrl" TEXT, "ativo" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Servico_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Agendamento" ("id" TEXT NOT NULL, "clienteId" TEXT, "clienteNome" TEXT NOT NULL, "clienteEmail" TEXT, "clienteTelefone" TEXT NOT NULL, "barbeariaId" TEXT NOT NULL, "barbeiroId" TEXT NOT NULL, "servicoId" TEXT NOT NULL, "inicio" TIMESTAMP(3) NOT NULL, "fim" TIMESTAMP(3) NOT NULL, "status" "StatusAgendamento" NOT NULL DEFAULT 'CONFIRMADO', "observacoes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id"));

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Barbearia_slug_key" ON "Barbearia"("slug");
CREATE INDEX "Membro_barbeariaId_idx" ON "Membro"("barbeariaId");
CREATE UNIQUE INDEX "Membro_userId_barbeariaId_key" ON "Membro"("userId", "barbeariaId");
CREATE UNIQUE INDEX "Barbeiro_userId_key" ON "Barbeiro"("userId");
CREATE INDEX "Barbeiro_barbeariaId_idx" ON "Barbeiro"("barbeariaId");
CREATE UNIQUE INDEX "HorarioFuncionamento_barbeariaId_diaSemana_key" ON "HorarioFuncionamento"("barbeariaId", "diaSemana");
CREATE INDEX "Servico_barbeariaId_idx" ON "Servico"("barbeariaId");
CREATE INDEX "Agendamento_barbeariaId_inicio_idx" ON "Agendamento"("barbeariaId", "inicio");
CREATE INDEX "Agendamento_barbeiroId_inicio_fim_idx" ON "Agendamento"("barbeiroId", "inicio", "fim");
CREATE INDEX "Agendamento_clienteId_idx" ON "Agendamento"("clienteId");

ALTER TABLE "Membro" ADD CONSTRAINT "Membro_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Membro" ADD CONSTRAINT "Membro_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Barbeiro" ADD CONSTRAINT "Barbeiro_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Barbeiro" ADD CONSTRAINT "Barbeiro_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "HorarioFuncionamento" ADD CONSTRAINT "HorarioFuncionamento_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_barbeariaId_fkey" FOREIGN KEY ("barbeariaId") REFERENCES "Barbearia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_barbeiroId_fkey" FOREIGN KEY ("barbeiroId") REFERENCES "Barbeiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
