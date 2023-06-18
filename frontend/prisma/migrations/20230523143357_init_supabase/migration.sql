/*
  Warnings:

  - The primary key for the `Beneficiary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Validator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Verifier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `deployedContractAddress` on the `WillContract` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[icNumber]` on the table `Owner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `icNumber` to the `Owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Beneficiary" DROP CONSTRAINT "Beneficiary_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Owner" ADD COLUMN     "icNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Validator" DROP CONSTRAINT "Validator_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Validator_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Verifier" DROP CONSTRAINT "Verifier_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Verifier_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "WillContract" DROP COLUMN "deployedContractAddress",
ADD COLUMN     "deployedAddress" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Owner_icNumber_key" ON "Owner"("icNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
