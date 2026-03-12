-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SYSTEM', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ABIERTO', 'EN_PROCESO', 'RESUELTO', 'CERRADO');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('BAJO', 'MEDIO', 'ALTO', 'URGENTE');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('HARDWARE', 'SOFTWARE', 'NETWORK', 'PRINTER', 'SYSTEM_ERROR', 'OTHER');

-- CreateEnum
CREATE TYPE "Area" AS ENUM ('TELEFONOS', 'RECEPCION_TA', 'RECEPCION_TB', 'CONTABILIDAD', 'COSTOS', 'RECURSOS_HUMANOS', 'MANTENIMIENTO', 'CAPITANES', 'NOMINAS', 'AMA_DE_LLAVES', 'RESERVAS', 'BANQUETES', 'ATENCION_A_SOCIOS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SYSTEM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "ticketNumber" SERIAL NOT NULL,
    "reporterName" TEXT NOT NULL,
    "area" "Area" NOT NULL,
    "category" "Category" NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ABIERTO',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIO',
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_ticketNumber_key" ON "Ticket"("ticketNumber");
