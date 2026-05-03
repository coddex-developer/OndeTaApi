/*
  Warnings:

  - The `statusAtual` column on the `Rastreamento` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `atualizadoEm` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('SAIU_PARA_ENTREGA', 'EM_TRANSITO', 'ENTREGUE', 'ATRASADO');

-- AlterTable
ALTER TABLE "Rastreamento" DROP COLUMN "statusAtual",
ADD COLUMN     "statusAtual" "STATUS";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "atualizadoEm" TIMESTAMP(3) NOT NULL;
