-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veiculo" (
    "id" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "intervaloTrocaOleo" INTEGER NOT NULL DEFAULT 10000,
    "ultimoKmTrocaOleo" INTEGER NOT NULL DEFAULT 0,
    "modelo" TEXT NOT NULL,

    CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motorista" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Motorista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cidade" TEXT,

    CONSTRAINT "Posto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Abastecimento" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hodometro" DOUBLE PRECISION NOT NULL,
    "quantidadeLitros" DOUBLE PRECISION NOT NULL,
    "precoPorLitro" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "veiculoId" TEXT NOT NULL,
    "motoristaId" TEXT NOT NULL,
    "postoId" TEXT NOT NULL,

    CONSTRAINT "Abastecimento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_username_key" ON "Usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_resetToken_key" ON "Usuario"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_placa_key" ON "Veiculo"("placa");

-- AddForeignKey
ALTER TABLE "Abastecimento" ADD CONSTRAINT "Abastecimento_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abastecimento" ADD CONSTRAINT "Abastecimento_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abastecimento" ADD CONSTRAINT "Abastecimento_postoId_fkey" FOREIGN KEY ("postoId") REFERENCES "Posto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
