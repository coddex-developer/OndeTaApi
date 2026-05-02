/*
  Warnings:

  - You are about to drop the column `descricao` on the `Rastreamento` table. All the data in the column will be lost.
  - Added the required column `senha` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rastreamento" DROP COLUMN "descricao",
ADD COLUMN     "categoria" TEXT,
ADD COLUMN     "favorito" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nome" TEXT,
ADD COLUMN     "previsaoEntrega" TIMESTAMP(3),
ADD COLUMN     "statusAtual" TEXT;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "senha" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Notificacao" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notificacao" ADD CONSTRAINT "Notificacao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
