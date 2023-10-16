/*
  Warnings:

  - You are about to drop the column `walletRecoveryConfigId` on the `verifier` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `wallet_recovery_config` table. All the data in the column will be lost.
  - Added the required column `configId` to the `verifier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerUserId` to the `wallet_recovery_config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."verifier" DROP COLUMN "walletRecoveryConfigId",
ADD COLUMN     "configId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."wallet_recovery_config" DROP COLUMN "ownerId",
ADD COLUMN     "ownerUserId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."will" ADD CONSTRAINT "will_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."beneficiary" ADD CONSTRAINT "beneficiary_beneficiaryUserId_fkey" FOREIGN KEY ("beneficiaryUserId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."beneficiary" ADD CONSTRAINT "beneficiary_willId_fkey" FOREIGN KEY ("willId") REFERENCES "public"."will"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."validator" ADD CONSTRAINT "validator_validatorUserId_fkey" FOREIGN KEY ("validatorUserId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."validator" ADD CONSTRAINT "validator_willId_fkey" FOREIGN KEY ("willId") REFERENCES "public"."will"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."verifier" ADD CONSTRAINT "verifier_verifierUserId_fkey" FOREIGN KEY ("verifierUserId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."verifier" ADD CONSTRAINT "verifier_configId_fkey" FOREIGN KEY ("configId") REFERENCES "public"."wallet_recovery_config"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wallet_recovery_config" ADD CONSTRAINT "wallet_recovery_config_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
