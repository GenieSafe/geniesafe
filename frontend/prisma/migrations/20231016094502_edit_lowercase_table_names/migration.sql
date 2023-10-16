/*
  Warnings:

  - You are about to drop the `Beneficiary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Owner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Validator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Verifier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WalletRecoveryConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WillContract` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Beneficiary" DROP CONSTRAINT "Beneficiary_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Beneficiary" DROP CONSTRAINT "Beneficiary_willContractId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Owner" DROP CONSTRAINT "Owner_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Validator" DROP CONSTRAINT "Validator_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Validator" DROP CONSTRAINT "Validator_willContractId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Verifier" DROP CONSTRAINT "Verifier_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Verifier" DROP CONSTRAINT "Verifier_walletRecoveryConfigId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WalletRecoveryConfig" DROP CONSTRAINT "WalletRecoveryConfig_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WillContract" DROP CONSTRAINT "WillContract_ownerId_fkey";

-- DropTable
DROP TABLE "public"."Beneficiary";

-- DropTable
DROP TABLE "public"."Owner";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."Validator";

-- DropTable
DROP TABLE "public"."Verifier";

-- DropTable
DROP TABLE "public"."WalletRecoveryConfig";

-- DropTable
DROP TABLE "public"."WillContract";

-- CreateTable
CREATE TABLE "public"."user" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "identityNumber" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."will" (
    "id" SERIAL NOT NULL,
    "ownerUserId" UUID NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isValidated" BOOLEAN NOT NULL DEFAULT false,
    "deployedAt" TIMESTAMP(3),
    "deployedAtBlock" TEXT,

    CONSTRAINT "will_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."beneficiary" (
    "id" SERIAL NOT NULL,
    "willId" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "beneficiaryUserId" UUID,

    CONSTRAINT "beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."validator" (
    "id" SERIAL NOT NULL,
    "willId" INTEGER NOT NULL,
    "isValidated" BOOLEAN NOT NULL DEFAULT false,
    "validatorUserId" UUID,

    CONSTRAINT "validator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verifier" (
    "id" SERIAL NOT NULL,
    "verifierUserId" UUID NOT NULL,
    "walletRecoveryConfigId" INTEGER NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "verifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."relationship" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "relationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wallet_recovery_config" (
    "id" SERIAL NOT NULL,
    "ownerId" UUID NOT NULL,
    "privateKey" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "wallet_recovery_config_pkey" PRIMARY KEY ("id")
);
