/*
  Warnings:

  - A unique constraint covering the columns `[walletAddress]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerUserId]` on the table `wallet_recovery_config` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_walletAddress_key" ON "public"."user"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_recovery_config_ownerUserId_key" ON "public"."wallet_recovery_config"("ownerUserId");
