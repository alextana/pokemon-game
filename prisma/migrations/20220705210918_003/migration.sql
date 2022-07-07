/*
  Warnings:

  - The primary key for the `Pokemon` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Pokemon` table. All the data in the column will be lost.
  - Added the required column `id` to the `Pokemon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pokemon" DROP CONSTRAINT "Pokemon_userId_fkey";

-- AlterTable
ALTER TABLE "Pokemon" DROP CONSTRAINT "Pokemon_pkey",
DROP COLUMN "userId",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "capturedPokemons" TEXT[];
