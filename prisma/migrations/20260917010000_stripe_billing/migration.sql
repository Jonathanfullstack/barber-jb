ALTER TABLE "Barbearia" ADD COLUMN "stripeCustomerId" TEXT;
ALTER TABLE "Barbearia" ADD COLUMN "stripeSubscriptionId" TEXT;
CREATE UNIQUE INDEX "Barbearia_stripeCustomerId_key" ON "Barbearia"("stripeCustomerId");
CREATE UNIQUE INDEX "Barbearia_stripeSubscriptionId_key" ON "Barbearia"("stripeSubscriptionId");
