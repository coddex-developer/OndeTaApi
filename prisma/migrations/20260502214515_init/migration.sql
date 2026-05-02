-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "email" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rastreamento" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Rastreamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventoRastreamento" (
    "id" TEXT NOT NULL,
    "rastreamentoId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "local" TEXT,
    "data" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventoRastreamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Rastreamento_usuarioId_codigo_key" ON "Rastreamento"("usuarioId", "codigo");

-- CreateIndex
CREATE INDEX "EventoRastreamento_rastreamentoId_idx" ON "EventoRastreamento"("rastreamentoId");

-- CreateIndex
CREATE UNIQUE INDEX "EventoRastreamento_rastreamentoId_status_data_key" ON "EventoRastreamento"("rastreamentoId", "status", "data");

-- AddForeignKey
ALTER TABLE "Rastreamento" ADD CONSTRAINT "Rastreamento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoRastreamento" ADD CONSTRAINT "EventoRastreamento_rastreamentoId_fkey" FOREIGN KEY ("rastreamentoId") REFERENCES "Rastreamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
