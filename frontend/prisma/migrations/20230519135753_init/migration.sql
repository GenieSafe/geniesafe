-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "walletAddress" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletRecoveryConfig" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL,

    CONSTRAINT "WalletRecoveryConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verifier" (
    "userId" INTEGER NOT NULL,
    "walletRecoveryConfigId" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL,

    CONSTRAINT "Verifier_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "WillContract" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "deployedContractAddress" TEXT,
    "activated" BOOLEAN NOT NULL,

    CONSTRAINT "WillContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficiary" (
    "userId" INTEGER NOT NULL,
    "willContractId" INTEGER NOT NULL,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Validator" (
    "userId" INTEGER NOT NULL,
    "willContractId" INTEGER NOT NULL,
    "validated" BOOLEAN NOT NULL,

    CONSTRAINT "Validator_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Owner_userId_key" ON "Owner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WalletRecoveryConfig_ownerId_key" ON "WalletRecoveryConfig"("ownerId");

-- AddForeignKey
ALTER TABLE "Owner" ADD CONSTRAINT "Owner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletRecoveryConfig" ADD CONSTRAINT "WalletRecoveryConfig_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verifier" ADD CONSTRAINT "Verifier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verifier" ADD CONSTRAINT "Verifier_walletRecoveryConfigId_fkey" FOREIGN KEY ("walletRecoveryConfigId") REFERENCES "WalletRecoveryConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WillContract" ADD CONSTRAINT "WillContract_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_willContractId_fkey" FOREIGN KEY ("willContractId") REFERENCES "WillContract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Validator" ADD CONSTRAINT "Validator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Validator" ADD CONSTRAINT "Validator_willContractId_fkey" FOREIGN KEY ("willContractId") REFERENCES "WillContract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
